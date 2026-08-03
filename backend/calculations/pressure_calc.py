"""
Treating Pressure Calculations
Computes fracture pressure, BHTP, hydrostatic, and surface treating pressure.
"""


def calc_treating_pressures(
    Shmin_psi: float = 7107,
    Pnet_psi: float = 1450,
    DeltaPperf_psi: float = 435,
    DeltaPNWB_psi: float = 290,
    MWf: float = 8.76,
    TVD_ft: float = 9843,
    DeltaPtubing_psi: float = 1160,
) -> dict:
    """
    Compute all treating pressure components.

    Args:
        Shmin_psi:          Minimum horizontal stress (psi)
        Pnet_psi:           Net fracture pressure (psi)
        DeltaPperf_psi:     Perforation friction (psi)
        DeltaPNWB_psi:      Near-wellbore tortuosity (psi)
        MWf:                Fracturing fluid density (ppg)
        TVD_ft:             True vertical depth (ft)
        DeltaPtubing_psi:   Tubing friction loss (psi)

    Returns:
        dict with Pf, BHTP, Phyd, Psurface
    """
    Pf = Shmin_psi + Pnet_psi
    BHTP = Pf + DeltaPperf_psi + DeltaPNWB_psi
    Phyd = 0.052 * MWf * TVD_ft
    Psurface = BHTP - Phyd + DeltaPtubing_psi

    return {
        "Pf_psi": round(Pf, 0),
        "DeltaPperf_psi": DeltaPperf_psi,
        "DeltaPNWB_psi": DeltaPNWB_psi,
        "BHTP_psi": round(BHTP, 0),
        "Phyd_psi": round(Phyd, 0),
        "DeltaPtubing_psi": DeltaPtubing_psi,
        "Psurface_psi": round(Psurface, 0),
        "Shmin_psi": Shmin_psi,
        "Pnet_psi": Pnet_psi,
    }


if __name__ == "__main__":
    result = calc_treating_pressures()
    print(result)
