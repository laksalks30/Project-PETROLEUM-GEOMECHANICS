"""
Fracture Geometry Calculations
PKN model-based fracture geometry estimation.
"""
import math


def calc_fracture_geometry(
    E_static_MMpsi: float = 2.67,
    nu_static: float = 0.286,
    Pnet_psi: float = 1450,
    hf_ft: float = 98,
    efficiency: float = 0.70,
    V_injected_bbl: float = 3270,
    k_res_md: float = 0.1,          # Reservoir permeability (md) - from MEM
    kf_md: float = 50000.0,         # Proppant pack permeability (md) - 20/40 sand standard
) -> dict:
    """
    Calculate fracture geometry using PKN model.

    Args:
        E_static_MMpsi:   Static Young's Modulus (MMpsi)
        nu_static:        Static Poisson's ratio
        Pnet_psi:         Net fracture pressure (psi)
        hf_ft:            Fracture height (ft)
        efficiency:       Fluid efficiency (fraction)
        V_injected_bbl:   Total injected volume (bbl)

    Returns:
        dict with Eprime, wmax, wavg, Vfrac, xf, total_length, Af, Cd, wprop related params
    """
    E_psi = E_static_MMpsi * 1e6       # Convert to psi
    Eprime = E_psi / (1 - nu_static**2)  # Plane-strain modulus (psi)
    Eprime_MMpsi = Eprime / 1e6

    # Width (PKN): wmax = 2*Pnet*hf / Eprime
    hf_in = hf_ft * 12                 # ft -> inches
    wmax_in = (2 * Pnet_psi * hf_in) / Eprime
    wavg_in = (math.pi / 4) * wmax_in

    # Fracture volume (bbl)
    Vfrac_bbl = efficiency * V_injected_bbl
    Leakoff_bbl = V_injected_bbl - Vfrac_bbl

    # Half-length (ft)
    bbl_to_ft3 = 5.615
    Vfrac_ft3 = Vfrac_bbl * bbl_to_ft3
    wavg_ft = wavg_in / 12
    xf_ft = Vfrac_ft3 / (2 * hf_ft * wavg_ft)
    total_length_ft = 2 * xf_ft

    # Fracture area
    Af_ft2 = 2 * xf_ft * hf_ft

    # Proppant pack permeability and propped width proxy for conductivity
    wprop_ft_approx = wavg_ft   # Use avg fracture width as propped width proxy

    # Fracture Conductivity (md-ft) = kf * propped_width_ft
    fracture_conductivity_md_ft = round(kf_md * wprop_ft_approx, 0)

    # Dimensionless Fracture Conductivity: FCD = (kf * wf) / (k_reservoir * xf)
    # k_reservoir default placeholder = 0.1 md if not provided
    k_res_md = 0.1  # md (default; should come from MEM permeability data)
    if xf_ft > 0 and k_res_md > 0:
        FCD = (kf_md * wprop_ft_approx) / (k_res_md * xf_ft)
    else:
        FCD = 0.0

    # Leakoff ratio (for reference only)
    leakoff_ratio = round(efficiency / (1 - efficiency), 2) if efficiency < 1 else 0

    return {
        "Eprime_MMpsi": round(Eprime_MMpsi, 3),
        "wmax_in": round(wmax_in, 3),
        "wavg_in": round(wavg_in, 3),
        "Vfrac_bbl": round(Vfrac_bbl, 0),
        "Leakoff_bbl": round(Leakoff_bbl, 0),
        "xf_ft": round(xf_ft, 0),
        "total_length_ft": round(total_length_ft, 0),
        "hf_ft": hf_ft,
        "Af_ft2": round(Af_ft2, 0),
        "efficiency": efficiency,
        "Cd": round(FCD, 2),              # True Dimensionless Fracture Conductivity (FCD)
        "leakoff_ratio": leakoff_ratio,   # Separate field, not misused as Cd
        "fracture_conductivity_md_ft": fracture_conductivity_md_ft,
        "geometry_model": "PKN",
    }


if __name__ == "__main__":
    result = calc_fracture_geometry()
    print(result)
