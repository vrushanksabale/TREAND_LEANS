import math
import numpy as np
from typing import List, Dict, Any, Tuple

def compute_ols_regression(x: List[float], y: List[float]) -> Dict[str, float]:
    """
    Ordinary Least Squares linear regression.
    Returns slope, intercept, R-squared, standard error, t-stat, and p-value.
    """
    n = len(x)
    if n < 3:
        return {"slope": 0.0, "intercept": 0.0, "r_squared": 0.0, "std_err": 0.0, "p_value": 1.0}

    x_arr = np.array(x, dtype=float)
    y_arr = np.array(y, dtype=float)

    x_mean = np.mean(x_arr)
    y_mean = np.mean(y_arr)

    dx = x_arr - x_mean
    dy = y_arr - y_mean

    ss_xx = np.sum(dx ** 2)
    ss_xy = np.sum(dx * dy)
    ss_yy = np.sum(dy ** 2)

    if ss_xx == 0:
        return {"slope": 0.0, "intercept": y_mean, "r_squared": 0.0, "std_err": 0.0, "p_value": 1.0}

    slope = float(ss_xy / ss_xx)
    intercept = float(y_mean - slope * x_mean)

    y_pred = intercept + slope * x_arr
    ss_res = np.sum((y_arr - y_pred) ** 2)
    ss_tot = ss_yy

    r_squared = float(1.0 - (ss_res / ss_tot)) if ss_tot > 0 else 0.0
    r_squared = max(0.0, min(1.0, r_squared))

    # Standard error of the slope
    s_err = math.sqrt(ss_res / (n - 2)) if n > 2 else 0.0
    std_err_slope = s_err / math.sqrt(ss_xx) if ss_xx > 0 else 0.0

    # Approximate two-tailed p-value via t-distribution
    t_stat = abs(slope / std_err_slope) if std_err_slope > 0 else 0.0
    # Normal approximation for large n
    p_value = 2.0 * (1.0 - 0.5 * (1.0 + math.erf(t_stat / math.sqrt(2))))
    p_value = max(0.0001, min(1.0, p_value))

    return {
        "slope": slope,
        "intercept": intercept,
        "r_squared": r_squared,
        "std_err": std_err_slope,
        "p_value": p_value
    }


def compute_mann_kendall(y: List[float]) -> Dict[str, Any]:
    """
    Non-parametric Mann-Kendall trend test with tie correction and Sen's slope.
    """
    n = len(y)
    if n < 4:
        return {
            "S": 0,
            "tau": 0.0,
            "p_value": 1.0,
            "sens_slope": 0.0,
            "verdict": "insufficient_data"
        }

    # S statistic
    S = 0
    for k in range(n - 1):
        for j in range(k + 1, n):
            diff = y[j] - y[k]
            if diff > 0:
                S += 1
            elif diff < 0:
                S -= 1

    # Kendall's tau
    tau = (2.0 * S) / (n * (n - 1))

    # Tie corrections
    unique_vals, counts = np.unique(np.round(y, decimals=2), return_counts=True)
    tie_sum = sum(t * (t - 1) * (2 * t + 5) for t in counts if t > 1)

    var_s = (n * (n - 1) * (2 * n + 5) - tie_sum) / 18.0
    std_s = math.sqrt(var_s) if var_s > 0 else 1.0

    # Standardized test statistic Z
    if S > 0:
        Z = (S - 1) / std_s
    elif S < 0:
        Z = (S + 1) / std_s
    else:
        Z = 0.0

    # Two-tailed p-value
    p_value = 2.0 * (1.0 - 0.5 * (1.0 + math.erf(abs(Z) / math.sqrt(2))))
    p_value = max(0.0001, min(1.0, p_value))

    # Pairwise Sen's slope
    pairwise_slopes = []
    # Subsample if n is large
    step = max(1, n // 100)
    for i in range(0, n - 1, step):
        for j in range(i + 1, n, step):
            dt = j - i
            if dt != 0:
                pairwise_slopes.append((y[j] - y[i]) / dt)

    sens_slope = float(np.median(pairwise_slopes)) if pairwise_slopes else 0.0

    verdict = "no_significant_trend"
    if p_value < 0.05:
        verdict = "significant_increase" if S > 0 else "significant_decrease"
    elif p_value < 0.10:
        verdict = "emerging_trend"

    return {
        "S": int(S),
        "Z": float(Z),
        "tau": float(round(tau, 4)),
        "p_value": float(round(p_value, 4)),
        "sens_slope": float(round(sens_slope, 5)),
        "verdict": verdict
    }
