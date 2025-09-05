# server/utils/preprocess.py

import os
import pandas as pd
import joblib

# -----------------------------
# Paths
# -----------------------------
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../models/scaler.pkl')
ENCODERS_PATH = os.path.join(os.path.dirname(__file__), '../models/encoders.pkl')
FEATURES_PATH = os.path.join(os.path.dirname(__file__), '../models/features.pkl')

# -----------------------------
# Preprocess user-uploaded CSV
# -----------------------------
def preprocess_user_csv(df_user: pd.DataFrame):
    """
    Preprocess user-uploaded CSV to match training preprocessing.
    - Drops TransactionID if present
    - Applies label encoders for categorical cols
    - Fills NaNs for numeric
    - Scales features using saved StandardScaler
    - Aligns strictly to training feature order
    """
    # Load artifacts
    scaler = joblib.load(SCALER_PATH)
    encoders = joblib.load(ENCODERS_PATH)
    feature_order = joblib.load(FEATURES_PATH)

    df_input = df_user.copy()

    # Drop TransactionID if present
    if "TransactionID" in df_input.columns:
        df_input = df_input.drop("TransactionID", axis=1)

    # Apply label encoders to categorical columns
    for col, le in encoders.items():
        if col in df_input.columns:
            df_input[col] = df_input[col].fillna("missing")
            try:
                df_input[col] = le.transform(df_input[col])
            except:
                # Handle unseen labels gracefully
                df_input[col] = -1
        else:
            # If column missing, add placeholder
            df_input[col] = -1

    # Fill NaNs for numeric columns
    df_input = df_input.fillna(-999)

    # Align to training feature order
    for col in feature_order:
        if col not in df_input.columns:
            df_input[col] = -999
    df_input = df_input[feature_order]

    # Scale features
    X_scaled = scaler.transform(df_input)

    return X_scaled


# -----------------------------
# Preprocess single transaction (dict input, optional for API JSON)
# -----------------------------
def preprocess_new_transaction(transaction_dict: dict):
    """
    Preprocess a single transaction (from JSON/dict) for prediction.
    """
    scaler = joblib.load(SCALER_PATH)
    encoders = joblib.load(ENCODERS_PATH)
    feature_order = joblib.load(FEATURES_PATH)

    df_input = pd.DataFrame([transaction_dict])

    # Apply label encoders
    for col, le in encoders.items():
        if col in df_input.columns:
            df_input[col] = df_input[col].fillna("missing")
            try:
                df_input[col] = le.transform(df_input[col])
            except:
                df_input[col] = -1
        else:
            df_input[col] = -1

    # Fill NaNs
    df_input = df_input.fillna(-999)

    # Align to training feature order
    for col in feature_order:
        if col not in df_input.columns:
            df_input[col] = -999
    df_input = df_input[feature_order]

    return scaler.transform(df_input)
