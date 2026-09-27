import os
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

def load_and_preprocess_data():
    dataset_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(dataset_dir, "datasets", "UNSW_NB15_training-set.csv")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}. Run download_dataset.py first.")
        
    print(f"Loading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)
    
    print(f"Original shape: {df.shape}")
    
    # 1. Drop unnecessary columns
    columns_to_drop = ['id'] if 'id' in df.columns else []
    df = df.drop(columns=columns_to_drop, errors='ignore')
    
    # 2. Handle missing values
    # For UNSW-NB15, attack_cat is often NaN for Normal traffic
    if 'attack_cat' in df.columns:
        df['attack_cat'] = df['attack_cat'].fillna('Normal')
        df['attack_cat'] = df['attack_cat'].replace('-', 'Normal')
    
    df = df.dropna()
    print(f"Shape after dropping missing values: {df.shape}")
    
    # 3. Identify categorical and numerical columns
    categorical_cols = ['proto', 'service', 'state']
    
    # Target columns
    target_col_class = 'attack_cat'
    target_col_binary = 'label'
    
    # Identify feature columns
    feature_cols = [col for col in df.columns if col not in [target_col_class, target_col_binary]]
    numerical_cols = [col for col in feature_cols if col not in categorical_cols]
    
    print("Encoding categorical features...")
    encoders = {}
    for col in categorical_cols:
        if col in df.columns:
            # We'll map unknown categories in prediction to a default value, so let's add 'UNKNOWN'
            le = LabelEncoder()
            # Convert to string and fillna just in case
            df[col] = df[col].astype(str).fillna('UNKNOWN')
            le.fit(df[col].unique().tolist() + ['UNKNOWN'])
            df[col] = le.transform(df[col])
            encoders[col] = le
            
    print("Scaling numerical features...")
    scaler = StandardScaler()
    if numerical_cols:
        df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
        
    # We will train the model to predict attack_cat
    print("Encoding target labels...")
    label_encoder = LabelEncoder()
    y_class = label_encoder.fit_transform(df[target_col_class])
    
    X = df[feature_cols]
    
    # Save the encoders and scaler
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(encoders, os.path.join(ml_dir, 'encoders.pkl'))
    joblib.dump(scaler, os.path.join(ml_dir, 'scaler.pkl'))
    joblib.dump(label_encoder, os.path.join(ml_dir, 'label_encoder.pkl'))
    joblib.dump(feature_cols, os.path.join(ml_dir, 'feature_cols.pkl'))
    
    print("Preprocessing completed. Artifacts saved.")
    
    return X, y_class, df[target_col_binary], label_encoder, feature_cols

if __name__ == "__main__":
    load_and_preprocess_data()
