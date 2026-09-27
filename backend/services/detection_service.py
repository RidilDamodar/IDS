from sqlalchemy.orm import Session
from database.models import TrafficEvent
from ml.prediction import predict_traffic, predict_batch
from services.alert_service import generate_alert
import json

def process_single_traffic_event(db: Session, traffic_data: dict):
    # ML Prediction
    result = predict_traffic(traffic_data)
    
    # Store the event
    db_event = TrafficEvent(
        source_ip=traffic_data.get("srcip", "0.0.0.0"),
        destination_ip=traffic_data.get("dstip", "0.0.0.0"),
        source_port=int(traffic_data.get("sport", 0)),
        destination_port=int(traffic_data.get("dsport", 0)),
        protocol=str(traffic_data.get("proto", "unknown")),
        duration=float(traffic_data.get("dur", 0.0)),
        packet_count=int(traffic_data.get("Spkts", 0)) + int(traffic_data.get("Dpkts", 0)),
        bytes=int(traffic_data.get("sbytes", 0)) + int(traffic_data.get("dbytes", 0)),
        predicted_class=result["prediction"],
        confidence=result["confidence"],
        is_attack=result["is_attack"],
        severity=result["severity"],
        status=result["status"]
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Generate Alert if it's an attack
    if result["is_attack"]:
        generate_alert(
            db=db,
            event_id=db_event.id,
            source_ip=db_event.source_ip,
            attack_type=result["prediction"],
            severity=result["severity"],
            confidence=result["confidence"],
            message=f"Intrusion detected: {result['prediction']} attack from {db_event.source_ip}"
        )
        
    # Return enriched result
    return {
        "event_id": db_event.id,
        "prediction": result["prediction"],
        "is_attack": result["is_attack"],
        "confidence": result["confidence"],
        "severity": result["severity"],
        "status": result["status"],
        "timestamp": db_event.timestamp.isoformat(),
        "relevant_features": result["relevant_features"]
    }
