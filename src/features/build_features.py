# """Feature building pipeline for air quality risk prediction."""
# from __future__ import annotations

# import argparse
# from pathlib import Path

# import numpy as np
# import pandas as pd

# RAW_PATH = Path("data/raw")
# PROCESSED_PATH = Path("data/processed")
# FEATURES_PATH = Path("data/features")


# def load_raw(file_name: str) -> pd.DataFrame:
#     path = RAW_PATH / file_name
#     df = pd.read_parquet(path) if path.suffix == ".parquet" else pd.read_csv(path)
#     return df


# def pick_datetime(df: pd.DataFrame) -> pd.Series:
#     """Return a UTC datetime series from normalized OpenAQ fields."""
#     candidates = [
#         "datetime",
#         "datetime.utc",
#         "date.utc",
#         "period.datetimeFrom.utc",
#         "period.datetimeTo.utc",
#         "timestamp",
#     ]
#     for col in candidates:
#         if col in df.columns:
#             return pd.to_datetime(df[col], errors="coerce")
#     # handle nested dict column named 'datetime'
#     if "datetime" in df.columns and df["datetime"].dtype == object:
#         return pd.to_datetime(
#             df["datetime"].apply(lambda x: x.get("utc") if isinstance(x, dict) else x), errors="coerce"
#         )
#     if "period" in df.columns and df["period"].dtype == object:
#         return pd.to_datetime(
#             df["period"].apply(
#                 lambda x: (x.get("datetimeTo") or x.get("datetimeFrom") or {}).get("utc")
#                 if isinstance(x, dict)
#                 else None
#             ),
#             errors="coerce",
#         )
#     # broader heuristic: any column containing 'utc'
#     utc_cols = [c for c in df.columns if "utc" in c.lower()]
#     if utc_cols:
#         return pd.to_datetime(df[utc_cols[0]], errors="coerce")
#     # as last resort, look for columns containing 'date' or 'time'
#     dt_cols = [c for c in df.columns if "date" in c.lower() or "time" in c.lower()]
#     if dt_cols:
#         return pd.to_datetime(df[dt_cols[0]], errors="coerce")
#     raise KeyError(f"No datetime-like column found; columns available: {list(df.columns)}")


# def clean(df: pd.DataFrame) -> pd.DataFrame:
#     df = df.copy()
#     df["datetime"] = pick_datetime(df)
#     df = df.dropna(subset=["datetime", "value"])
#     df = df[df["value"] >= 0]
#     return df


# def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
#     df = df.copy()
#     df["hour"] = df["datetime"].dt.hour
#     df["dayofweek"] = df["datetime"].dt.dayofweek
#     df["month"] = df["datetime"].dt.month
#     # cyclic encoding for hour
#     df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
#     df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
#     return df


# def add_lags(df: pd.DataFrame, lags: list[int] = [1, 3, 24]) -> pd.DataFrame:
#     df = df.sort_values("datetime").copy()
#     for lag in lags:
#         df[f"value_lag_{lag}"] = df["value"].shift(lag)
#     df = df.dropna()
#     return df


# def build_features(input_file: str, output_file: str = "features.parquet") -> Path:
#     df = load_raw(input_file)
#     df = clean(df)
#     df = add_time_features(df)
#     df = add_lags(df)
#     FEATURES_PATH.mkdir(parents=True, exist_ok=True)
#     out_path = FEATURES_PATH / output_file
#     df.to_parquet(out_path, index=False)
#     return out_path


# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description="Build feature set from raw OpenAQ data")
#     parser.add_argument("input_file", help="File name inside data/raw (e.g., openaq_pm25_YYYYMMDDHHMMSS.parquet)")
#     parser.add_argument(
#         "--output",
#         default="features.parquet",
#         help="Output feature file name (saved to data/features/)",
#     )
#     args = parser.parse_args()

#     out = build_features(args.input_file, args.output)
#     print(f"Features saved to {out}")

"""Feature building pipeline for air quality risk prediction (OpenAQ v3 compatible)."""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd

RAW_PATH = Path("data/raw")
FEATURES_PATH = Path("data/features")


def load_raw(file_name: str) -> pd.DataFrame:
    """Load a raw file located inside data/raw/ by filename."""
    path = RAW_PATH / file_name
    if not path.exists():
        raise FileNotFoundError(f"Raw file not found: {path}")
    if path.suffix.lower() == ".parquet":
        return pd.read_parquet(path)
    return pd.read_csv(path)


def pick_datetime(df: pd.DataFrame) -> pd.Series:
    """
    Return a timezone-aware UTC datetime Series.

    OpenAQ v3 stores timestamps inside the 'period' object:
      period = {'label': 'hour', 'interval': ['2026-02-06T10:00:00Z', '2026-02-06T11:00:00Z']}
    We take interval[0] as the event time.
    """
    # 1) Direct flattened columns containing time keywords
    time_like_cols = [c for c in df.columns if any(k in c.lower() for k in ["utc", "date", "time", "local"])]
    for col in time_like_cols:
        dt = pd.to_datetime(df[col], utc=True, errors="coerce")
        if dt.notna().any():
            return dt

    # 2) period column (dict or list)
    if "period" in df.columns:
        def _period_start(p):
            if isinstance(p, dict):
                if "interval" in p and p["interval"]:
                    iv = p["interval"]
                    if isinstance(iv, (list, tuple)) and iv:
                        return iv[0]
                for k in ("datetimeFrom", "from", "start"):
                    v = p.get(k)
                    if isinstance(v, dict) and "utc" in v:
                        return v["utc"]
                    if v:
                        return v
            if isinstance(p, (list, tuple)) and p:
                return p[0]
            return None

        dt = pd.to_datetime(df["period"].apply(_period_start), utc=True, errors="coerce")
        if dt.notna().any():
            return dt

    # 3) period.interval* flattened columns
    for col in ("period.interval", "period.interval.0"):
        if col in df.columns:
            dt = pd.to_datetime(
                df[col].apply(lambda v: v[0] if isinstance(v, (list, tuple)) and v else v),
                utc=True,
                errors="coerce",
            )
            if dt.notna().any():
                return dt

    # 4) Nested datetime dicts
    if "datetime" in df.columns and df["datetime"].dtype == object:
        dt = pd.to_datetime(
            df["datetime"].apply(lambda x: x.get("utc") if isinstance(x, dict) else x),
            utc=True,
            errors="coerce",
        )
        if dt.notna().any():
            return dt

    # 5) Generic scan of object columns: try to parse strings directly
    obj_cols = df.select_dtypes(include=["object"]).columns
    for col in obj_cols:
        dt = pd.to_datetime(df[col], utc=True, errors="coerce")
        if dt.notna().any():
            return dt

    raise KeyError(f"No datetime-like column found; columns available: {list(df.columns)}")


def clean(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning: datetime + value required, remove negatives."""
    df = df.copy()
    df["datetime"] = pick_datetime(df)

    # keep only valid rows
    df = df.dropna(subset=["datetime", "value"]).copy()
    df = df[df["value"] >= 0].copy()

    # ensure sorting for time series steps
    df = df.sort_values("datetime").reset_index(drop=True)
    return df


def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add simple calendar + cyclic hour encoding."""
    df = df.copy()
    df["hour"] = df["datetime"].dt.hour
    df["dayofweek"] = df["datetime"].dt.dayofweek
    df["month"] = df["datetime"].dt.month

    # cyclic encoding
    df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
    df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
    return df


def add_lags(df: pd.DataFrame, lags: list[int] | None = None) -> pd.DataFrame:
    """Add lag features on the value column."""
    if lags is None:
        lags = [1, 3, 24]

    # keep only lags that make sense for dataset length; if none, fall back to no lags
    lags = [lag for lag in lags if lag < len(df)] or []
    if not lags:
        return df.reset_index(drop=True)

    df = df.sort_values("datetime").copy()
    for lag in lags:
        df[f"value_lag_{lag}"] = df["value"].shift(lag)

    # avoid empty outputs on tiny datasets: forward/back fill remaining NaN lag values
    lag_cols = [f"value_lag_{lag}" for lag in lags]
    df[lag_cols] = df[lag_cols].ffill().bfill()
    df = df.reset_index(drop=True)
    return df


def build_features(input_file: str, output_file: str = "features.parquet") -> Path:
    """
    Build features from a raw OpenAQ file name that is located inside data/raw/.
    Usage:
      python -m src.features.build_features openaq_pm25_YYYYMMDDHHMMSS.parquet
    """
    df_raw = load_raw(input_file)
    print(f"[build] raw rows: {len(df_raw)}")
    df = clean(df_raw)
    print(f"[build] after clean: {len(df)}")
    df = add_time_features(df)
    df = add_lags(df)
    print(f"[build] after lags/features: {len(df)}")

    FEATURES_PATH.mkdir(parents=True, exist_ok=True)
    out_path = FEATURES_PATH / output_file
    df.to_parquet(out_path, index=False)
    return out_path


def main():
    parser = argparse.ArgumentParser(description="Build feature set from raw OpenAQ data")
    parser.add_argument(
        "input_file",
        help="File name inside data/raw (e.g., openaq_pm25_YYYYMMDDHHMMSS.parquet)",
    )
    parser.add_argument(
        "--output",
        default="features.parquet",
        help="Output feature file name (saved to data/features/)",
    )
    args = parser.parse_args()

    out = build_features(args.input_file, args.output)
    print(f"Features saved to {out}")


if __name__ == "__main__":
    main()
