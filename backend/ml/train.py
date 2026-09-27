import os
import json
import joblib
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix
from .preprocessing import load_and_preprocess_data
import numpy as np

def train_model():
    print("Starting ML pipeline...")
    
    # 1. Load and preprocess data
    X, y_class, y_binary, label_encoder, feature_cols = load_and_preprocess_data()
    
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y_class, test_size=0.2, random_state=42, stratify=y_class)
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Testing set: {X_test.shape[0]} samples")
    
    # 2. Train Model
    print("Training Random Forest Classifier... (This may take a minute)")
    model = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1, max_depth=15)
    model.fit(X_train, y_train)
    
    # 3. Evaluate Model
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    # Use weighted or macro avg for multiclass
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    
    class_names = label_encoder.classes_.tolist()
    
    # Feature importance
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    feature_importance_list = []
    for f in range(min(20, X.shape[1])):
        feature_importance_list.append({
            "feature": feature_cols[indices[f]],
            "importance": float(importances[indices[f]])
        })
    
    # Generate confusion matrix
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    # 4. Save model and metadata
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(ml_dir, "model.pkl")
    joblib.dump(model, model_path)
    
    metadata = {
        "model_name": "RandomForestClassifier",
        "dataset_name": "UNSW-NB15",
        "trained_at": datetime.utcnow().isoformat(),
        "training_samples": int(X_train.shape[0]),
        "testing_samples": int(X_test.shape[0]),
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "feature_count": int(X.shape[1]),
        "classes": class_names,
        "feature_importance": feature_importance_list,
        "confusion_matrix": cm
    }
    
    metadata_path = os.path.join(ml_dir, "metadata.json")
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=4)
        
    print(f"Model saved to {model_path}")
    print(f"Metadata saved to {metadata_path}")
    return True

if __name__ == "__main__":
    train_model()
