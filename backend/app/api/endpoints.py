from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.analysis.statistics import compute_ols_regression, compute_mann_kendall
from app.data_sources.nasa_clients import query_nasa_power_point, search_nasa_cmr_collections

router = APIRouter()

class TimeSeriesInput(BaseModel):
    dates: List[str]
    values: List[float]
    variable_name: str
    unit: str
    region_name: str

class AnalysisOutput(BaseModel):
    variable_name: str
    region_name: str
    sample_count: int
    mean_value: float
    start_value: float
    end_value: float
    absolute_change: float
    percentage_change: float
    ols_slope: float
    r_squared: float
    standard_error: float
    ols_p_value: float
    mann_kendall_s: int
    mann_kendall_tau: float
    mann_kendall_p_value: float
    sens_slope: float
    verdict: str
    interpretive_note: str

@router.post("/analyze", response_model=AnalysisOutput)
async def analyze_time_series(payload: TimeSeriesInput):
    n = len(payload.values)
    if n < 4:
        raise HTTPException(status_code=400, detail="At least 4 observational data points are required.")

    x = list(range(n))
    y = payload.values

    ols = compute_ols_regression(x, y)
    mk = compute_mann_kendall(y)

    mean_val = float(sum(y) / n)
    start_val = float(y[0])
    end_val = float(y[-1])
    abs_change = float(end_val - start_val)
    pct_change = float((abs_change / abs(start_val) * 100) if start_val != 0 else 0)

    # Contextual note adhering to non-causal requirements
    if mk["verdict"] == "significant_increase":
        note = (
            f"Observed upward trajectory (p = {mk['p_value']}) is statistically significant at 95% confidence. "
            "This pattern is consistent with persistent regional environmental forcing; "
            "further multi-variate modeling is required to evaluate specific physical drivers."
        )
    elif mk["verdict"] == "significant_decrease":
        note = (
            f"Observed downward trajectory (p = {mk['p_value']}) is statistically significant at 95% confidence. "
            "A possible contributing factor is long-term atmospheric circulation changes; "
            "never present correlation as proof of direct causation."
        )
    elif mk["verdict"] == "emerging_trend":
        note = f"An emerging directional pattern is observed (p = {mk['p_value']}), though continued observation is needed."
    else:
        note = f"Record is consistent with natural variability (p = {mk['p_value']}). No secular trend detected."

    return AnalysisOutput(
        variable_name=payload.variable_name,
        region_name=payload.region_name,
        sample_count=n,
        mean_value=round(mean_val, 3),
        start_value=round(start_val, 3),
        end_value=round(end_val, 3),
        absolute_change=round(abs_change, 3),
        percentage_change=round(pct_change, 2),
        ols_slope=round(ols["slope"], 5),
        r_squared=round(ols["r_squared"], 3),
        standard_error=round(ols["std_err"], 5),
        ols_p_value=round(ols["p_value"], 4),
        mann_kendall_s=mk["S"],
        mann_kendall_tau=mk["tau"],
        mann_kendall_p_value=mk["p_value"],
        sens_slope=round(mk["sens_slope"], 5),
        verdict=mk["verdict"],
        interpretive_note=note
    )

@router.get("/nasa/power")
async def get_nasa_power_data(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    parameter: str = Query("T2M"),
    start_year: int = Query(1995, ge=1981, le=2024),
    end_year: int = Query(2024, ge=1981, le=2024)
):
    try:
        data = await query_nasa_power_point(lat, lon, parameter, start_year, end_year)
        return data
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"NASA POWER API request failed: {str(e)}")

@router.get("/nasa/cmr")
async def get_nasa_cmr_search(query: str = Query(..., min_length=2)):
    try:
        results = await search_nasa_cmr_collections(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"NASA CMR search failed: {str(e)}")
