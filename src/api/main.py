from __future__ import annotations

import os
from functools import lru_cache
import math
from typing import Optional

import mlflow.pyfunc
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd

app = FastAPI(title="Air Quality Risk API", version="0.1.0")

MODEL_URI = os.getenv("MODEL_URI", "")


class PredictionRequest(BaseModel):
    hour: int
    dayofweek: int
    month: int
    value_lag_1: float
    value_lag_3: float
    value_lag_24: float


class PredictionResponse(BaseModel):
    prediction: float


@lru_cache()
def load_model():
    if not MODEL_URI:
        raise RuntimeError("MODEL_URI env var not set; train a model first")
    return mlflow.pyfunc.load_model(MODEL_URI)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    model = load_model()
    hour = req.hour % 24
    hour_rad = 2 * math.pi * hour / 24
    # base features from request
    base_row = {
        "hour": hour,
        "dayofweek": req.dayofweek % 7,
        "month": req.month,
        "hour_sin": math.sin(hour_rad),
        "hour_cos": math.cos(hour_rad),
        "value_lag_1": req.value_lag_1,
        "value_lag_3": req.value_lag_3,
        "value_lag_24": req.value_lag_24,
    }

    df = pd.DataFrame([base_row])

    # Some trained models include extra features (météo/gaz, lags supplémentaires).
    # To avoid 500 errors, we auto-augment the row with any required columns missing,
    # filling with 0 by default. Then we reorder columns to match the model schema.
    try:
        input_schema = model.metadata.get_input_schema()
        expected_cols = [field.name for field in input_schema.inputs]
        for col in expected_cols:
            if col not in df.columns:
                df[col] = 0.0
        # reorder to expected order
        df = df[expected_cols]
    except Exception:
        # if schema unavailable, proceed with current df
        pass

    try:
        pred = model.predict(df)[0]
        return PredictionResponse(prediction=float(pred))
    except Exception as e:
        # Handle missing-column errors gracefully by auto-adding them then retrying once
        msg = str(e)
        if "columns are missing" in msg:
            try:
                missing_part = msg.split("{", 1)[1].split("}", 1)[0]
                missing_cols = [c.strip(" '") for c in missing_part.split(",")]
                for col in missing_cols:
                    if col and col not in df.columns:
                        df[col] = 0.0
                # retry
                pred = model.predict(df)[0]
                return PredictionResponse(prediction=float(pred))
            except Exception:
                pass
        # surface error to client with 500
        raise HTTPException(status_code=500, detail=msg)
