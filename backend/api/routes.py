from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import database, models
from pydantic import BaseModel
from typing import Dict, Any, List
import json
import os
import pandas as pd
from services.detection_service import process_single_traffic_event

router = APIRouter()

class TrafficPayload(BaseModel):
    features: Dict[str, Any]

@router.get("/health")
def health_check():
    # Check if ML model is trained by looking for the file
    ml_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')
    model_trained = os.path.exists(os.path.join(ml_dir, 'model.pkl'))
    return {"status": "healthy", "model_trained": model_trained}

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    total_analyzed = db.query(models.TrafficEvent).count()
    total_attacks = db.query(models.TrafficEvent).filter(models.TrafficEvent.is_attack == True).count()
    total_normal = total_analyzed - total_attacks
    active_alerts = db.query(models.Alert).filter(models.Alert.acknowledged == False).count()
    
    # Model accuracy from metadata
    ml_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')
    metadata_path = os.path.join(ml_dir, 'metadata.json')
    accuracy = 0.0
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
            accuracy = metadata.get("accuracy", 0.0)

    return {
        "total_analyzed": total_analyzed,
        "total_normal": total_normal,
        "total_attacks": total_attacks,
        "active_alerts": active_alerts,
        "model_accuracy": accuracy
    }

@router.post("/detect")
def detect_traffic(payload: TrafficPayload, db: Session = Depends(database.get_db)):
    try:
        result = process_single_traffic_event(db, payload.features)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing traffic: {str(e)}")

@router.get("/model/metrics")
def get_model_metrics():
    ml_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')
    metadata_path = os.path.join(ml_dir, 'metadata.json')
    if not os.path.exists(metadata_path):
        raise HTTPException(status_code=404, detail="Model metadata not found. Train the model first.")
    with open(metadata_path, 'r') as f:
        return json.load(f)

@router.get("/model/features")
def get_model_features():
    ml_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')
    metadata_path = os.path.join(ml_dir, 'metadata.json')
    if not os.path.exists(metadata_path):
        raise HTTPException(status_code=404, detail="Model metadata not found. Train the model first.")
    with open(metadata_path, 'r') as f:
        data = json.load(f)
        return {"feature_importance": data.get("feature_importance", [])}

@router.get("/alerts/recent")
def get_recent_alerts(db: Session = Depends(database.get_db)):
    alerts = db.query(models.Alert).order_by(models.Alert.timestamp.desc()).limit(10).all()
    return alerts

@router.get("/events/recent")
def get_recent_events(db: Session = Depends(database.get_db)):
    events = db.query(models.TrafficEvent).order_by(models.TrafficEvent.timestamp.desc()).limit(10).all()
    return events

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(database.get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.acknowledged = True
    db.commit()
    return {"status": "Acknowledged"}

@router.get("/traffic/overview")
def get_traffic_overview(db: Session = Depends(database.get_db)):
    # Group by predicted class for a pie chart
    class_distribution = db.query(
        models.TrafficEvent.predicted_class, 
        func.count(models.TrafficEvent.id)
    ).group_by(models.TrafficEvent.predicted_class).all()
    
    distribution_list = [{"name": cls, "value": count} for cls, count in class_distribution]
    
    return {
        "distribution": distribution_list
    }
