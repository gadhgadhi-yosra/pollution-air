from __future__ import annotations

import os
from functools import lru_cache
import math
from typing import Optional

import mlflow.pyfunc
from fastapi import FastAPI
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
    df = pd.DataFrame(
        [
            {
                "hour": hour,
                "dayofweek": req.dayofweek % 7,
                "month": req.month,
                "hour_sin": math.sin(hour_rad),
                "hour_cos": math.cos(hour_rad),
                "value_lag_1": req.value_lag_1,
                "value_lag_3": req.value_lag_3,
                "value_lag_24": req.value_lag_24,
            }
        ]
    )
    pred = model.predict(df)[0]
    return PredictionResponse(prediction=float(pred))
