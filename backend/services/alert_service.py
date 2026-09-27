from sqlalchemy.orm import Session
from database.models import Alert
import json

def generate_alert(db: Session, event_id: int, source_ip: str, attack_type: str, severity: str, confidence: float, message: str):
    new_alert = Alert(
        event_id=event_id,
        source_ip=source_ip,
        attack_type=attack_type,
        severity=severity,
        confidence=confidence,
        message=message
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

def get_recent_alerts(db: Session, limit: int = 10):
    return db.query(Alert).order_by(Alert.timestamp.desc()).limit(limit).all()
