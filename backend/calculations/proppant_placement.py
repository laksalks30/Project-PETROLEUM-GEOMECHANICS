"""
Proppant Placement Calculations
Computes proppant volume, fracture area, and average propped width.
"""


def calc_proppant_placement(
    Mp_lb: float = 396800,
    rho_bulk_lb_ft3: float = 100,
    xf_ft: float = 855,
    hf_ft: float = 98,
) -> dict:
    """
    Calculate proppant placement parameters.

    Args:
        Mp_lb:              Total proppant mass (lb)
        rho_bulk_lb_ft3:    Proppant bulk density (lb/ft3)
        xf_ft:              Fracture half-length (ft)
        hf_ft:              Fracture height (ft)

    Returns:
        dict with proppant volume, fracture area, avg propped width
    """
    bbl_per_ft3 = 1 / 5.615

    # Proppant volume
    Vp_ft3 = Mp_lb / rho_bulk_lb_ft3
    Vp_bbl = Vp_ft3 * bbl_per_ft3

    # Fracture area (both wings)
    Af_ft2 = 2 * xf_ft * hf_ft

    # Average propped width (ft -> in)
    wprop_ft = Vp_ft3 / Af_ft2
    wprop_in = wprop_ft * 12

    return {
        "Mp_lb": Mp_lb,
        "rho_bulk_lb_ft3": rho_bulk_lb_ft3,
        "Vp_ft3": round(Vp_ft3, 0),
        "Vp_bbl": round(Vp_bbl, 0),
        "Af_ft2": round(Af_ft2, 0),
        "wprop_in": round(wprop_in, 3),
        "wprop_ft": round(wprop_ft, 4),
    }


if __name__ == "__main__":
    result = calc_proppant_placement()
    print(result)
