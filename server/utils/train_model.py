# server/utils/train_model.py

import os
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.utils import class_weight
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler

# -----------------------------
# Paths
# -----------------------------
DATA_PATH_TRANS = os.path.join(os.path.dirname(__file__), '../data/train_transaction.csv')
DATA_PATH_ID = os.path.join(os.path.dirname(__file__), '../data/train_identity.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/fraud_model.keras')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../models/scaler.pkl')
ENCODERS_PATH = os.path.join(os.path.dirname(__file__), '../models/encoders.pkl')

# -----------------------------
# Load dataset
# -----------------------------
df_trans = pd.read_csv(DATA_PATH_TRANS)
df_id = pd.read_csv(DATA_PATH_ID)
df = df_trans.merge(df_id, on="TransactionID", how="left")

y = df["isFraud"]
X = df.drop(["isFraud", "TransactionID"], axis=1)

# -----------------------------
# Encode categorical features
# -----------------------------
cat_cols = X.select_dtypes(include=['object']).columns
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    X[col] = X[col].fillna("missing")
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# Save encoders
os.makedirs(os.path.dirname(ENCODERS_PATH), exist_ok=True)
joblib.dump(encoders, ENCODERS_PATH)

# -----------------------------
# Fill NaNs and scale
# -----------------------------
X = X.fillna(-999)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

joblib.dump(scaler, SCALER_PATH)

# -----------------------------
# Save feature order
# -----------------------------
FEATURES_PATH = os.path.join(os.path.dirname(__file__), '../models/features.pkl')
joblib.dump(X.columns.tolist(), FEATURES_PATH)
print(f"✅ Features saved to {FEATURES_PATH}")

# -----------------------------
# Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# -----------------------------
# Handle class imbalance
# -----------------------------
class_weights = class_weight.compute_class_weight(
    class_weight="balanced",
    classes=np.unique(y_train),
    y=y_train
)
class_weights_dict = dict(enumerate(class_weights))

# -----------------------------
# Build model
# -----------------------------
model = Sequential([
    Dense(128, input_dim=X_train.shape[1], activation='relu'),
    Dropout(0.4),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy', tf.keras.metrics.AUC(name='auc')]
)

# -----------------------------
# Train model
# -----------------------------
early_stop = EarlyStopping(
    monitor="val_loss", patience=5, restore_best_weights=True
)

history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=2048,
    validation_split=0.2,
    class_weight=class_weights_dict,
    callbacks=[early_stop],
    verbose=2
)

# -----------------------------
# Evaluate
# -----------------------------
loss, acc, auc = model.evaluate(X_test, y_test, verbose=0)
print(f"✅ Test Accuracy: {acc:.4f}, Test AUC: {auc:.4f}")

# -----------------------------
# Save model
# -----------------------------
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
model.save(MODEL_PATH)
print(f"✅ Model saved to {MODEL_PATH}")
print(f"✅ Scaler saved to {SCALER_PATH}")
print(f"✅ Encoders saved to {ENCODERS_PATH}")
