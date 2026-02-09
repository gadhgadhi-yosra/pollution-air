from __future__ import annotations

import asyncio
from pathlib import Path
from datetime import datetime, UTC
import os

import pandas as pd
from pandas import json_normalize
from dotenv import load_dotenv

from .openaq_client import fetch_latest

RAW_PATH = Path("data/raw")

# load .env so OPENAQ_API_KEY is available when running as module
load_dotenv()


def save_latest(
    city: str | None = None,
    country: str | None = None,
    parameter: str = "pm25",
    limit: int = 200,
) -> Path:
    """Download latest measurements and persist to parquet."""
    if not os.getenv("OPENAQ_API_KEY"):
        raise RuntimeError("OPENAQ_API_KEY not set; create one at https://platform.openaq.org/ and add to .env")

    RAW_PATH.mkdir(parents=True, exist_ok=True)
    results = asyncio.run(fetch_latest(city=city, country=country, parameter=parameter, limit=limit))
    if not results:
        raise RuntimeError("No data fetched from OpenAQ (check filters or API key)")

    # flatten nested datetime/parameter/coordinates into columns
    df = json_normalize(results)
    ts = datetime.now(UTC).strftime("%Y%m%d%H%M%S")
    out_path = RAW_PATH / f"openaq_{parameter}_{ts}.parquet"
    df.to_parquet(out_path, index=False)
    return out_path


if __name__ == "__main__":
    path = save_latest(city=os.getenv("DEFAULT_CITY"), country=os.getenv("DEFAULT_COUNTRY", "FR"))
    print(f"Saved to {path}")
