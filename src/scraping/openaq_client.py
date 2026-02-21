"""Simple OpenAQ v3 client for pulling air quality measurements.

Notes
-----
- OpenAQ v1/v2 were turned off on 31 Jan 2025 and now return HTTP 410.
- v3 requires an API key (free). Set `OPENAQ_API_KEY` in your `.env`.
"""
from __future__ import annotations

import os
import asyncio
import logging
from typing import Dict, Any, List

import httpx
from dotenv import load_dotenv

load_dotenv()

OPENAQ_BASE_URL = os.getenv("OPENAQ_BASE_URL", "https://api.openaq.org/v3")
DEFAULT_TIMEOUT = 10.0

PARAMETER_IDS = {
    "pm25": 2,
    "pm10": 3,
    "co": 4,
    "no2": 5,
    "so2": 6,
    "o3": 8,
}


def _headers() -> Dict[str, str]:
    headers = {"Accept": "application/json"}
    api_key = os.getenv("OPENAQ_API_KEY")
    if api_key:
        headers["X-API-Key"] = api_key
    else:
        logging.warning("OPENAQ_API_KEY missing in environment")
    return headers


async def _fetch(client: httpx.AsyncClient, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
    resp = await client.get(
        f"{OPENAQ_BASE_URL}/{endpoint}", params=params, timeout=DEFAULT_TIMEOUT, headers=_headers()
    )
    if resp.status_code == 401:
        # Provide a more actionable error message
        masked = os.getenv("OPENAQ_API_KEY", "")
        masked = masked[:4] + "..." + masked[-4:] if masked else "<absent>"
        raise RuntimeError(
            "Unauthorized (401) from OpenAQ. Check that your OPENAQ_API_KEY is valid and active. "
            f"Key loaded: {masked}. Response: {resp.text}"
        )
    resp.raise_for_status()
    return resp.json()


ASYNC_PARAMS_BASE = {
    "limit": 200,
    "page": 1,
    "sort": "desc",
}


def _parameter_id(parameter: str) -> int:
    try:
        return PARAMETER_IDS[parameter.lower()]
    except KeyError as exc:
        raise ValueError(f"Unsupported parameter '{parameter}'. Use one of {list(PARAMETER_IDS)}") from exc


async def _find_locations(client: httpx.AsyncClient, city: str | None, country: str | None, parameter: str) -> List[Dict[str, Any]]:
    params = {**ASYNC_PARAMS_BASE, "parameters_id": _parameter_id(parameter)}
    if city:
        params["city"] = city
    if country:
        params["country"] = country
    payload = await _fetch(client, "locations", params)
    return payload.get("results", [])


async def fetch_latest(
    city: str | None = None,
    country: str | None = None,
    parameter: str = "pm25",
    limit: int = 200,
) -> List[Dict[str, Any]]:
    """Fetch latest measurements by first locating sensors then pulling their measurements.

    OpenAQ v3 no longer supports a global `/measurements` list; data must be fetched per sensor.
    Strategy: find sensors matching city/country/parameter, then fetch measurements for the first one
    (or several until limit is reached).
    """
    async with httpx.AsyncClient() as client:
        locations = await _find_locations(client, city, country, parameter)
        if not locations:
            raise RuntimeError(f"No locations found for parameter={parameter}, city={city}, country={country}")

        results: List[Dict[str, Any]] = []
        remaining = limit

        for loc in locations:
            if remaining <= 0:
                break
            sensors = loc.get("sensors", [])
            # If sensors not embedded, fallback to locations/{id}/sensors
            if not sensors and (loc_id := loc.get("id")):
                payload = await _fetch(client, f"locations/{loc_id}/sensors", {"limit": 50})
                sensors = payload.get("results", [])

            for sensor in sensors:
                if remaining <= 0:
                    break
                if sensor.get("parameter", {}).get("id") != _parameter_id(parameter):
                    continue
                sensor_id = sensor.get("id")
                if sensor_id is None:
                    continue
                per_sensor_limit = min(remaining, 200)
                payload = await _fetch(
                    client,
                    f"sensors/{sensor_id}/measurements",
                    {**ASYNC_PARAMS_BASE, "limit": per_sensor_limit},
                )
                sensor_results = payload.get("results", [])
                results.extend(sensor_results)
                remaining -= len(sensor_results)
        if not results:
            raise RuntimeError("No measurements returned; try another city/country/parameter or check API key limits.")
        return results


async def fetch_sensor_measurements(sensor_id: int, limit: int = 500) -> List[Dict[str, Any]]:
    """Fetch raw measurements for a specific sensor id (v3 `sensors/{id}/measurements`)."""

    params = {"limit": limit}
    async with httpx.AsyncClient() as client:
        payload = await _fetch(client, f"sensors/{sensor_id}/measurements", params)
    return payload.get("results", [])


def fetch_sync(city: str | None = None, country: str | None = None, parameter: str = "pm25", limit: int = 200) -> List[Dict[str, Any]]:
    return asyncio.run(fetch_latest(city=city, country=country, parameter=parameter, limit=limit))


if __name__ == "__main__":
    import json

    data = fetch_sync(city=os.getenv("DEFAULT_CITY", "Paris"), country=os.getenv("DEFAULT_COUNTRY", "FR"))
    print(json.dumps(data[:3], indent=2))
