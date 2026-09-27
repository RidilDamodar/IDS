import os
import joblib
import pandas as pd
import numpy as np

ml_dir = os.path.dirname(os.path.abspath(__file__))

# Load models lazily to avoid loading during every import if not needed
model = None
encoders = None
scaler = None
label_encoder = None
feature_cols = None

def load_ml_artifacts():
    global model, encoders, scaler, label_encoder, feature_cols
    try:
        model = joblib.load(os.path.join(ml_dir, 'model.pkl'))
        encoders = joblib.load(os.path.join(ml_dir, 'encoders.pkl'))
        scaler = joblib.load(os.path.join(ml_dir, 'scaler.pkl'))
        label_encoder = joblib.load(os.path.join(ml_dir, 'label_encoder.pkl'))
        feature_cols = joblib.load(os.path.join(ml_dir, 'feature_cols.pkl'))
        return True
    except FileNotFoundError:
        return False

def calculate_severity(prediction_class, confidence):
    if prediction_class == 'Normal':
        return 'LOW'
    elif confidence >= 0.8:
        return 'HIGH'
    elif confidence >= 0.5:
        return 'MEDIUM'
    else:
        return 'LOW'

def predict_traffic(traffic_dict):
    """
    Takes a dictionary of features and returns the prediction result.
    """
    if model is None:
        if not load_ml_artifacts():
            raise FileNotFoundError("ML model has not been trained. Run the training pipeline first.")

    # Create DataFrame from single dict to handle missing features gracefully
    df = pd.DataFrame([traffic_dict])
    
    # Ensure all expected feature columns are present
    for col in feature_cols:
        if col not in df.columns:
            # fill with 0 or a placeholder for missing features
            df[col] = 0

    # Sort columns in exactly the same order as training
    df = df[feature_cols]

    # Preprocess categorical features
    for col, le in encoders.items():
        if col in df.columns:
            df[col] = df[col].astype(str)
            # Handle unknown categories safely
            known_classes = set(le.classes_)
            df[col] = df[col].apply(lambda x: x if x in known_classes else 'UNKNOWN')
            df[col] = le.transform(df[col])

    # Scale numerical features
    numerical_cols = [col for col in feature_cols if col not in encoders.keys()]
    if numerical_cols and scaler is not None:
        df[numerical_cols] = scaler.transform(df[numerical_cols])

    # Make prediction
    pred_idx = model.predict(df)[0]
    pred_class = label_encoder.inverse_transform([pred_idx])[0]
    
    # Get probability/confidence
    probas = model.predict_proba(df)[0]
    confidence = float(np.max(probas))
    
    is_attack = pred_class != 'Normal'
    severity = calculate_severity(pred_class, confidence)
    
    status = "INTRUSION_DETECTED" if is_attack else "NORMAL_TRAFFIC"
    if is_attack and confidence < 0.6:
        status = "SUSPICIOUS_LOW_CONFIDENCE"
        
    return {
        "prediction": pred_class,
        "is_attack": is_attack,
        "confidence": confidence,
        "severity": severity,
        "status": status,
        "relevant_features": traffic_dict # Include input features for the event log
    }

def predict_batch(df_input):
    """
    Takes a DataFrame and returns predictions for all rows.
    """
    if model is None:
        if not load_ml_artifacts():
            raise FileNotFoundError("ML model has not been trained. Run the training pipeline first.")

    df = df_input.copy()
    
    # Ensure all expected feature columns are present
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0

    df_features = df[feature_cols].copy()

    # Preprocess categorical features
    for col, le in encoders.items():
        if col in df_features.columns:
            df_features[col] = df_features[col].astype(str)
            known_classes = set(le.classes_)
            df_features[col] = df_features[col].apply(lambda x: x if x in known_classes else 'UNKNOWN')
            df_features[col] = le.transform(df_features[col])

    # Scale numerical features
    numerical_cols = [col for col in feature_cols if col not in encoders.keys()]
    if numerical_cols and scaler is not None:
        df_features[numerical_cols] = scaler.transform(df_features[numerical_cols])

    # Make predictions
    pred_indices = model.predict(df_features)
    pred_classes = label_encoder.inverse_transform(pred_indices)
    probas = np.max(model.predict_proba(df_features), axis=1)
    
    results = []
    for i in range(len(df)):
        pred_class = pred_classes[i]
        confidence = float(probas[i])
        is_attack = pred_class != 'Normal'
        severity = calculate_severity(pred_class, confidence)
        status = "INTRUSION_DETECTED" if is_attack else "NORMAL_TRAFFIC"
        
        results.append({
            "prediction": pred_class,
            "is_attack": bool(is_attack),
            "confidence": confidence,
            "severity": severity,
            "status": status
        })
        
    return results
