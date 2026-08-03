"""
Elastic Properties Calculations
Derives dynamic and static elastic parameters from sonic log data.
"""
import math


def calc_elastic_properties(Dtp: float = 80, Dts: float = 150, rho: float = 2.45) -> dict:
    """
    Calculate elastic properties from sonic logs and density.

    Args:
        Dtp: P-wave travel time (us/ft)
        Dts: S-wave travel time (us/ft)
        rho: Bulk density (g/cc)

    Returns:
        dict with Vp, Vs, nu_dyn, E_dyn, E_static, nu_static
    """
    Vp = 1_000_000 / Dtp          # ft/s
    Vs = 1_000_000 / Dts          # ft/s

    Vp2 = Vp ** 2
    Vs2 = Vs ** 2

    # Dynamic Poisson's ratio
    nu_dyn = (Vp2 - 2 * Vs2) / (2 * (Vp2 - Vs2))

    # Dynamic Young's Modulus (MMpsi)
    E_dyn = 1.3487e-2 * rho * Vs2 * ((3 * Vp2 - 4 * Vs2) / (Vp2 - Vs2)) / 1e6

    # Static corrections
    E_static = 0.70 * E_dyn        # MMpsi
    nu_static = 0.95 * nu_dyn

    return {
        "Vp_ft_s": round(Vp, 1),
        "Vs_ft_s": round(Vs, 1),
        "nu_dyn": round(nu_dyn, 3),
        "E_dyn_MMpsi": round(E_dyn, 3),
        "E_static_MMpsi": round(E_static, 3),
        "nu_static": round(nu_static, 3),
    }


if __name__ == "__main__":
    result = calc_elastic_properties()
    print(result)
