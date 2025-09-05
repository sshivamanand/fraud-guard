import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import tensorflow as tf
import numpy as np
from utils.preprocess import preprocess_user_csv

app = Flask(__name__)
CORS(app)  

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models/fraud_model.keras')
model = tf.keras.models.load_model(MODEL_PATH)

@app.route('/')
def home():
    return "Fraud Prediction API is running."

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]
    df_user = pd.read_csv(file)

    print(f"✅ Uploaded CSV shape: {df_user.shape}")
    print(f"✅ Uploaded CSV columns: {list(df_user.columns)}")

    X_input = preprocess_user_csv(df_user)
    print(f"✅ Preprocessed input shape: {X_input.shape}")

    preds = model.predict(X_input).flatten()
    print(f"✅ Raw predictions: {preds}")

    preds_list = preds.tolist()

    #Apply threshold (0.5 by default)
    fraud_flags = (preds > 0.5).astype(int).tolist()

    total_txns = len(preds_list)
    high_risk = int(sum(fraud_flags))
    low_risk = total_txns - high_risk
    
    return jsonify({
        "predictions": preds_list,
        "fraud_flags": fraud_flags,
        "summary": {
            "total_transactions": total_txns,
            "high_risk": high_risk,
            "low_risk": low_risk
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
