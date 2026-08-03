"""
Uncertainty & ML Analysis
Monte Carlo simulation and sensitivity (tornado chart) analysis.
"""
import math
import random
from typing import Dict, List


def monte_carlo_uncertainty(
    n_samples: int = 2000,
    seed: int = 42,
    base_params: dict = None,
) -> dict:
    """
    Run Monte Carlo uncertainty analysis using triangular distributions.

    Returns P10/P50/P90 for key outputs.
    """
    random.seed(seed)
    if base_params is None:
        base_params = {
            "Shmin_psi": 7107,
            "E_static_MMpsi": 2.67,
            "hf_ft": 98,
            "efficiency": 0.70,
            "Pnet_psi": 1450,
        }

    samples_xf = []
    samples_surface_p = []
    samples_efficiency = []
    samples_hf = []
    samples_Shmin = []
    samples_breakdown = []

    for _ in range(n_samples):
        # Sample inputs (triangular distributions)
        Shmin = _triangular(6500, 7107, 7750)
        E = _triangular(2.40, 2.67, 3.00)
        hf = _triangular(80, 98, 130)
        eff = _triangular(0.55, 0.70, 0.80)
        Pnet = _triangular(1200, 1450, 1700)
        nu = _triangular(0.25, 0.286, 0.32)

        # Fracture geometry
        Eprime = (E * 1e6) / (1 - nu**2)
        hf_in = hf * 12
        wmax_in = (2 * Pnet * hf_in) / Eprime
        wavg_in = (math.pi / 4) * wmax_in
        Vfrac_ft3 = eff * 3270 * 5.615
        wavg_ft = wavg_in / 12
        xf = Vfrac_ft3 / (2 * hf * wavg_ft) if wavg_ft > 0 else 0

        # Surface pressure
        surf_p = (Shmin + Pnet + 435 + 290) - (0.052 * 8.76 * 9843) + 1160

        # Breakdown
        breakdown = 3 * Shmin - 8412 - 5076 + 435

        samples_xf.append(xf)
        samples_surface_p.append(surf_p)
        samples_efficiency.append(eff)
        samples_hf.append(hf)
        samples_Shmin.append(Shmin)
        samples_breakdown.append(breakdown)

    return {
        "Half_length":      _percentiles(samples_xf),
        "Surface_pressure": _percentiles(samples_surface_p),
        "Fluid_efficiency": _percentiles(samples_efficiency),
        "Fracture_height":  _percentiles(samples_hf),
        "Shmin":            _percentiles(samples_Shmin),
        "Breakdown":        _percentiles(samples_breakdown),
        "n_samples": n_samples,
    }


def calc_sensitivity_tornado(
    base_xf_ft: float = 855,
    variation_pct: float = 20.0,
    base_params: dict = None,
) -> List[dict]:
    """
    Calculate sensitivity of fracture half-length to each input parameter.

    Returns tornado chart data sorted by impact magnitude.
    """
    if base_params is None:
        base_params = {
            "Pnet_psi": 1450,
            "hf_ft": 98,
            "Eprime_MMpsi": 2.91,
            "efficiency": 0.70,
            "V_injected_bbl": 3270,
            "leakoff_coeff": 0.005,
        }

    sensitivities = []
    for param, base_val in base_params.items():
        low_val = base_val * (1 - variation_pct / 100)
        high_val = base_val * (1 + variation_pct / 100)

        xf_low = _compute_xf({**base_params, param: low_val})
        xf_high = _compute_xf({**base_params, param: high_val})

        impact_pct = ((xf_high - xf_low) / (2 * base_xf_ft)) * 100

        sensitivities.append({
            "parameter": _param_label(param),
            "impact_pct": round(abs(impact_pct), 1),
            "xf_low": round(xf_low, 0),
            "xf_high": round(xf_high, 0),
            "direction": "positive" if xf_high >= xf_low else "negative",
        })

    sensitivities.sort(key=lambda x: x["impact_pct"], reverse=True)
    return sensitivities


def _compute_xf(params: dict) -> float:
    """Simplified xf computation for sensitivity analysis."""
    import math
    Pnet = params.get("Pnet_psi", 1450)
    hf = params.get("hf_ft", 98)
    Eprime = params.get("Eprime_MMpsi", 2.91) * 1e6
    eff = params.get("efficiency", 0.70)
    V = params.get("V_injected_bbl", 3270)

    hf_in = hf * 12
    wmax_in = (2 * Pnet * hf_in) / Eprime
    wavg_in = (math.pi / 4) * wmax_in
    Vfrac_ft3 = eff * V * 5.615
    wavg_ft = wavg_in / 12
    if wavg_ft <= 0:
        return 0
    return Vfrac_ft3 / (2 * hf * wavg_ft)


def _param_label(param: str) -> str:
    labels = {
        "Pnet_psi": "Net Pressure",
        "hf_ft": "Fracture Height",
        "Eprime_MMpsi": "Plane-Strain Modulus",
        "efficiency": "Fluid Efficiency",
        "V_injected_bbl": "Fluid Volume",
        "leakoff_coeff": "Leakoff",
    }
    return labels.get(param, param)


def _triangular(low: float, mid: float, high: float) -> float:
    """Sample from triangular distribution (simplified via uniform)."""
    u = random.random()
    fc = (mid - low) / (high - low) if (high - low) != 0 else 0.5
    if u < fc:
        return low + math.sqrt(u * (high - low) * (mid - low))
    else:
        return high - math.sqrt((1 - u) * (high - low) * (high - mid))


def _percentiles(data: list) -> dict:
    sorted_data = sorted(data)
    n = len(sorted_data)
    return {
        "P10": round(sorted_data[int(0.10 * n)], 2),
        "P50": round(sorted_data[int(0.50 * n)], 2),
        "P90": round(sorted_data[int(0.90 * n)], 2),
    }


if __name__ == "__main__":
    print(monte_carlo_uncertainty(500))
    print(calc_sensitivity_tornado())
