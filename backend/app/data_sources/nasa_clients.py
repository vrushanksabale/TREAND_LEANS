import os
import httpx
from typing import Dict, Any, Optional

NASA_POWER_BASE = "https://power.larc.nasa.gov/api/temporal/monthly/point"
NASA_CMR_BASE = "https://cmr.earthdata.nasa.gov/search"

async def query_nasa_power_point(
    lat: float,
    lon: float,
    parameter: str,
    start_year: int,
    end_year: int
) -> Dict[str, Any]:
    """
    Query NASA POWER API for monthly time series at a single lat/lon point.
    No API key required.
    """
    url = (
        f"{NASA_POWER_BASE}?parameters={parameter}&community=RE"
        f"&longitude={lon:.4f}&latitude={lat:.4f}"
        f"&start={start_year}&end={end_year}&format=JSON"
    )

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

async def search_nasa_cmr_collections(query: str, page_size: int = 10) -> Dict[str, Any]:
    """
    Search NASA Common Metadata Repository (CMR) for Earth science collections.
    """
    url = f"{NASA_CMR_BASE}/collections.json"
    params = {"keyword": query, "page_size": page_size}

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()
