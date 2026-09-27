from sqlalchemy import Boolean, Column, Float, Integer, String, DateTime
from .database import Base
from datetime import datetime

class TrafficEvent(Base):
    __tablename__ = "traffic_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source_ip = Column(String, index=True)
    destination_ip = Column(String, index=True)
    source_port = Column(Integer)
    destination_port = Column(Integer)
    protocol = Column(String)
    duration = Column(Float)
    packet_count = Column(Integer)
    bytes = Column(Integer)
    
    # ML Prediction fields
    predicted_class = Column(String, index=True)
    confidence = Column(Float)
    is_attack = Column(Boolean, default=False)
    severity = Column(String)  # LOW, MEDIUM, HIGH
    status = Column(String) # INTRUSION_DETECTED, NORMAL_TRAFFIC

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    attack_type = Column(String)
    severity = Column(String)
    confidence = Column(Float)
    source_ip = Column(String)
    message = Column(String)
    acknowledged = Column(Boolean, default=False)

class ModelMetadata(Base):
    __tablename__ = "model_metadata"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String)
    dataset_name = Column(String)
    trained_at = Column(DateTime, default=datetime.utcnow)
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    feature_count = Column(Integer)
