from fastapi.testclient import TestClient
from main import app
import os
import pytest

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "IDS ML Backend is running"}

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    
def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_analyzed" in data
    assert "total_attacks" in data

def test_predict_normal():
    # Make sure we don't crash and we get a valid prediction schema
    payload = {
        "features": {
            "srcip": "192.168.1.100",
            "dstip": "8.8.8.8",
            "sport": "49152",
            "dsport": "443",
            "proto": "tcp",
            "dur": "0.05",
            "Spkts": "15",
            "Dpkts": "12",
            "sbytes": "1800",
            "dbytes": "5400",
            "sttl": "64",
            "dttl": "64"
        }
    }
    
    response = client.post("/api/detect", json=payload)
    if response.status_code == 200:
        data = response.json()
        assert "prediction" in data
        assert "confidence" in data
        assert "severity" in data
        assert "status" in data
    elif response.status_code == 503:
        # Expected if model isn't trained yet during the test run in some environments
        pytest.skip("Model not trained yet")
    else:
        assert False, f"Unexpected status code {response.status_code}"
