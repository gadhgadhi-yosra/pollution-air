"""
Build features from the external dataset air_quality_clean.csv.

Assumptions:
- Uses PM2.5 as target (`value`)
- Date column is daily; hour is set to 0
- Lags are computed within each City (1, 3, 7 steps)

Usage:
    python -m src.features.build_features_air_quality
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd

RAW_CSV = Path("data/raw/air_quality_clean.csv")
FEATURES_PATH = Path("data/features")


def build_features(output_file: str = "features_air_quality.parquet") -> Path:
    df = pd.read_csv(RAW_CSV)
    if "Date" not in df.columns or "PM2.5" not in df.columns:
        raise ValueError("Expected columns 'Date' and 'PM2.5' in air_quality_clean.csv")

    df = df.copy()
    df["datetime"] = pd.to_datetime(df["Date"])
    df["hour"] = 0
    df["dayofweek"] = df["datetime"].dt.dayofweek
    df["month"] = df["datetime"].dt.month
    df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
    df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
    df["value"] = df["PM2.5"]

    # Compute lags per city
    df = df.sort_values(["City", "datetime"]).reset_index(drop=True)
    for lag in [1, 3, 7]:
        df[f"value_lag_{lag}"] = df.groupby("City")["value"].shift(lag)

    # Keep relevant columns + weather covariates
    keep_cols = [
        "value",
        "datetime",
        "hour",
        "dayofweek",
        "month",
        "hour_sin",
        "hour_cos",
        "value_lag_1",
        "value_lag_3",
        "value_lag_7",
        # weather / gases as potential features
        "PM10",
        "NO2",
        "SO2",
        "CO",
        "O3",
        "Temperature",
        "Humidity",
        "Wind Speed",
        "City",
        "Country",
    ]
    df = df[keep_cols]
    df = df.dropna().reset_index(drop=True)

    FEATURES_PATH.mkdir(parents=True, exist_ok=True)
    out_path = FEATURES_PATH / output_file
    df.to_parquet(out_path, index=False)
    return out_path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="features_air_quality.parquet")
    args = parser.parse_args()
    out = build_features(args.output)
    print(f"Features saved to {out}")


if __name__ == "__main__":
    main()
