"""
Containment & Fault Interaction Analysis
Evaluates fracture containment and proximity to known faults.
"""


RISK_THRESHOLDS = {
    "low":      {"stress_contrast_psi": 800, "fault_remaining_ft": 300},
    "moderate": {"stress_contrast_psi": 500, "fault_remaining_ft": 150},
    "high":     {"stress_contrast_psi": 0,   "fault_remaining_ft": 0},
}


def classify_risk(value: float, low_thresh: float, high_thresh: float, higher_is_bad: bool = False) -> str:
    """Generic risk classifier."""
    if higher_is_bad:
        if value <= low_thresh:
            return "Low"
        elif value <= high_thresh:
            return "Moderate"
        else:
            return "High"
    else:
        if value >= low_thresh:
            return "Low"
        elif value >= high_thresh:
            return "Moderate"
        else:
            return "High"


def calc_containment_fault(
    Shmin_psi: float = 7107,
    upper_barrier_Shmin_psi: float = 8267,
    lower_barrier_Shmin_psi: float = 7977,
    Pnet_psi: float = 1450,
    xf_ft: float = 855,
    fault_distance_ft: float = 984,
    xf_P90_factor: float = 1.20,
) -> dict:
    """
    Analyze fracture containment and fault interaction risk.

    Args:
        Shmin_psi:                  Reservoir minimum stress (psi)
        upper_barrier_Shmin_psi:    Upper barrier stress (psi)
        lower_barrier_Shmin_psi:    Lower barrier stress (psi)
        Pnet_psi:                   Net fracture pressure (psi)
        xf_ft:                      Fracture half-length base case (ft)
        fault_distance_ft:          Distance to nearest fault (ft)
        xf_P90_factor:              P90 half-length multiplier

    Returns:
        dict with containment analysis and fault interaction risk
    """
    upper_contrast_psi = upper_barrier_Shmin_psi - Shmin_psi
    lower_contrast_psi = lower_barrier_Shmin_psi - Shmin_psi

    # Net pressure exceeds barrier contrast?
    upper_breach = Pnet_psi > upper_contrast_psi
    lower_breach = Pnet_psi > lower_contrast_psi
    height_growth_risk = upper_breach or lower_breach

    # Fault interaction
    xf_P90_ft = xf_P90_factor * xf_ft
    remaining_ft = fault_distance_ft - xf_ft
    P90_intersects_fault = xf_P90_ft >= fault_distance_ft

    # Risk classification
    if height_growth_risk:
        containment_risk = "High"
    elif min(upper_contrast_psi, lower_contrast_psi) < 600:
        containment_risk = "Moderate"
    else:
        containment_risk = "Low"

    if P90_intersects_fault:
        fault_risk = "High"
    elif remaining_ft < 150:
        fault_risk = "Moderate"
    else:
        fault_risk = "Low"

    return {
        "upper_stress_contrast_psi": upper_contrast_psi,
        "lower_stress_contrast_psi": lower_contrast_psi,
        "Pnet_psi": Pnet_psi,
        "upper_breach": upper_breach,
        "lower_breach": lower_breach,
        "height_growth_risk": height_growth_risk,
        "containment_risk": containment_risk,
        "fault_distance_ft": fault_distance_ft,
        "xf_base_ft": xf_ft,
        "xf_P90_ft": round(xf_P90_ft, 0),
        "remaining_ft": round(remaining_ft, 0),
        "P90_intersects_fault": P90_intersects_fault,
        "fault_risk": fault_risk,
        "overall_risk": "High" if (containment_risk == "High" or fault_risk == "High") else
                        ("Moderate" if (containment_risk == "Moderate" or fault_risk == "Moderate") else "Low"),
    }


if __name__ == "__main__":
    result = calc_containment_fault()
    print(result)
