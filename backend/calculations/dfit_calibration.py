"""
DFIT Calibration Calculations
Updates MEM stresses from DFIT closure pressure.
"""


def calc_dfit_calibration(
    Shmin_initial_psi: float = 6962,
    Shmin_dfit_psi: float = 7107,
    SHmax_psi: float = 8412,
    Pp_psi: float = 5076,
    T0_psi: float = 435,
) -> dict:
    """
    Calibrate minimum horizontal stress from DFIT and compute updated breakdown pressure.

    Args:
        Shmin_initial_psi: Pre-DFIT Shmin estimate (psi)
        Shmin_dfit_psi:    DFIT closure pressure (psi)
        SHmax_psi:         Maximum horizontal stress (psi)
        Pp_psi:            Pore pressure (psi)
        T0_psi:            Tensile strength (psi)

    Returns:
        dict with delta_Shmin, Pbd_new, calibration details
    """
    delta_Shmin = Shmin_dfit_psi - Shmin_initial_psi

    # Updated breakdown pressure from Hubbert-Willis
    Pbd_new = 3 * Shmin_dfit_psi - SHmax_psi - Pp_psi + T0_psi

    return {
        "Shmin_initial_psi": Shmin_initial_psi,
        "Shmin_calibrated_psi": Shmin_dfit_psi,
        "delta_Shmin_psi": delta_Shmin,
        "SHmax_psi": SHmax_psi,
        "Pp_psi": Pp_psi,
        "T0_psi": T0_psi,
        "Pbd_new_psi": Pbd_new,
    }


if __name__ == "__main__":
    result = calc_dfit_calibration()
    print(result)
