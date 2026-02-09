"""Minimal AirNow API client (US-focused)."""
from __future__ import annotations

import os
from typing import Dict, Any, List

import httpx

AIRNOW_BASE_URL = "https://www.airnowapi.org/aq/observation/latLong/current/"
DEFAULT_TIMEOUT = 10.0


def fetch_current(lat: float, lon: float, distance: int = 25) -> List[Dict[str, Any]]:
    api_key = os.getenv("AIRNOW_API_KEY")
    if not api_key:
        raise RuntimeError("AIRNOW_API_KEY not set in environment")

    params = {
        "format": "application/json",
        "latitude": lat,
        "longitude": lon,
        "distance": distance,
        "API_KEY": api_key,
    }
    with httpx.Client() as client:
        resp = client.get(AIRNOW_BASE_URL, params=params, timeout=DEFAULT_TIMEOUT)
        resp.raise_for_status()
        return resp.json()


if __name__ == "__main__":
    # Example: coordinates for Los Angeles
    print(fetch_current(34.0522, -118.2437)[:2])
