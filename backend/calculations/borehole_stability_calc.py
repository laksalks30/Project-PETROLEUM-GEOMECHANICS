"""
Borehole Stability Engine Calculations — API Field Units
Implements Kirsch stress transformation + Mohr-Coulomb failure criterion
for vertical/inclined wells.
"""
import math


def calc_borehole_stability(
    Pp_psi: float = 5076,
    Sv_psi: float = 10157,
    Shmin_psi: float = 6962,
    SHmax_psi: float = 8412,
    UCS_psi: float = 4351,
    T0_psi: float = 435,
    friction_angle_deg: float = 30,
    Biot: float = 1.0,
    TVD_ft: float = 9843,
    # Hydraulics inputs
    MW_selected_ppg: float = None,
    DeltaP_ann_psi: float = 305,
    DeltaP_surge_psi: float = 363,
    DeltaP_swab_psi: float = 290,
    margin_collapse_ppg: float = 0.65,
    margin_breakdown_ppg: float = 0.85,
) -> dict:
    """
    Compute borehole stability limits and operating mud-weight window.

    Assumptions:
    - Vertical circular well (Kirsch, isotropic linear-elastic rock)
    - Mohr-Coulomb compressive failure
    - Tensile failure when min hoop stress = -T0
    - Effective-stress formulation with Biot coefficient
    """
    tvd = max(TVD_ft, 1)

    # ── 1. Effective stresses ──────────────────────────────────────────────
    Sv_eff    = Sv_psi    - Biot * Pp_psi
    Shmin_eff = Shmin_psi - Biot * Pp_psi
    SHmax_eff = SHmax_psi - Biot * Pp_psi

    # ── 2. Mohr-Coulomb coefficient ───────────────────────────────────────
    phi_rad = math.radians(friction_angle_deg)
    q = (1 + math.sin(phi_rad)) / (1 - math.sin(phi_rad))

    # ── 3. Collapse pressure ──────────────────────────────────────────────
    # sigma_theta_max = 3*SHmax_eff - Shmin_eff
    # At collapse: sigma_theta_max - DeltaP = UCS + q * DeltaP
    # DeltaP_collapse = (sigma_theta_max - UCS) / (1 + q)
    sigma_theta_max = 3 * SHmax_eff - Shmin_eff
    DeltaP_collapse = (sigma_theta_max - UCS_psi) / (1 + q)
    Pw_collapse = Pp_psi + DeltaP_collapse
    MW_collapse = Pw_collapse / (0.052 * tvd)
    MW_min_op  = MW_collapse + margin_collapse_ppg

    # ── 4. Breakdown pressure ─────────────────────────────────────────────
    # sigma_theta_min = 3*Shmin_eff - SHmax_eff
    # At breakdown: sigma_theta_min - DeltaP = -T0
    sigma_theta_min = 3 * Shmin_eff - SHmax_eff
    DeltaP_breakdown = sigma_theta_min + T0_psi
    Pbd = Pp_psi + DeltaP_breakdown
    MW_breakdown = Pbd / (0.052 * tvd)
    MW_max_op = MW_breakdown - margin_breakdown_ppg

    # ── 5. Selected mud weight ────────────────────────────────────────────
    if MW_selected_ppg is None:
        # Position at ~35% up from min operating to max operating window
        MW_selected_ppg = round(MW_min_op + (MW_max_op - MW_min_op) * 0.35, 2)

    # ── 6. Hydrostatic pressure ───────────────────────────────────────────
    Ph = 0.052 * MW_selected_ppg * tvd
    overbalance = Ph - Pp_psi

    # ── 7. Circulating ECD ────────────────────────────────────────────────
    ECD = (Ph + DeltaP_ann_psi) / (0.052 * tvd)
    PBHC = Ph + DeltaP_ann_psi

    # ── 8. Surge / Swab ───────────────────────────────────────────────────
    EMW_surge = (Ph + DeltaP_surge_psi) / (0.052 * tvd)
    EMW_swab  = (Ph - DeltaP_swab_psi)  / (0.052 * tvd)
    Ph_surge  = Ph + DeltaP_surge_psi
    Ph_swab   = Ph - DeltaP_swab_psi

    # ── 9. Stability assessment ───────────────────────────────────────────
    pore_emw = Pp_psi / (0.052 * tvd)
    sv_emw   = Sv_psi  / (0.052 * tvd)

    status = "CONDITIONALLY ACCEPTABLE"
    main_risk = None
    if EMW_swab < MW_min_op:
        main_risk = "Swab-Induced Instability"
    if ECD > MW_max_op:
        main_risk = (main_risk or "") + " | Fracture/Loss Risk"
    if not main_risk:
        if MW_selected_ppg < MW_min_op:
            status = "AT RISK"
            main_risk = "Underbalanced Condition"
        else:
            main_risk = "Swab ECD Marginal"

    # ── 10. Risk levels (illustrative) ───────────────────────────────────
    breakout_risk_pct = max(0, min(100, int((EMW_swab / MW_min_op - 1) * -500 + 50)))
    packoff_risk_pct  = max(0, min(100, int((ECD / MW_max_op) * 44)))
    cavings_trend     = "INCREASING" if EMW_swab < MW_min_op else "STABLE"
    tight_hole_pct    = 28
    diff_sticking_pct = max(0, min(100, int(overbalance / 500 * 55)))
    losses_pct        = max(0, min(100, int((ECD / MW_max_op - 0.9) * 220)))

    return {
        # Effective stresses
        "Sv_eff_psi":    round(Sv_eff, 0),
        "Shmin_eff_psi": round(Shmin_eff, 0),
        "SHmax_eff_psi": round(SHmax_eff, 0),

        # Mohr-Coulomb
        "q_MC":          round(q, 2),
        "sigma_theta_max_psi": round(sigma_theta_max, 0),
        "sigma_theta_min_psi": round(sigma_theta_min, 0),

        # Collapse
        "DeltaP_collapse_psi": round(DeltaP_collapse, 0),
        "Pw_collapse_psi":     round(Pw_collapse, 0),
        "MW_collapse_ppg":     round(MW_collapse, 2),
        "MW_min_op_ppg":       round(MW_min_op, 2),

        # Breakdown
        "DeltaP_breakdown_psi": round(DeltaP_breakdown, 0),
        "Pbd_psi":              round(Pbd, 0),
        "MW_breakdown_ppg":     round(MW_breakdown, 2),
        "MW_max_op_ppg":        round(MW_max_op, 2),

        # Operating window
        "MW_selected_ppg":  round(MW_selected_ppg, 2),
        "window_ppg":       round(MW_max_op - MW_min_op, 2),

        # Hydraulics
        "Ph_psi":          round(Ph, 0),
        "overbalance_psi": round(overbalance, 0),
        "PBHC_psi":        round(PBHC, 0),
        "ECD_ppg":         round(ECD, 2),
        "EMW_surge_ppg":   round(EMW_surge, 2),
        "EMW_swab_ppg":    round(EMW_swab, 2),
        "Ph_surge_psi":    round(Ph_surge, 0),
        "Ph_swab_psi":     round(Ph_swab, 0),
        "pore_emw_ppg":    round(pore_emw, 2),
        "sv_emw_ppg":      round(sv_emw, 2),
        "DeltaP_ann_psi":  DeltaP_ann_psi,

        # Status
        "status":          status,
        "main_risk":       main_risk,

        # Borehole condition indicators
        "breakout_risk_pct":  breakout_risk_pct,
        "packoff_risk_pct":   packoff_risk_pct,
        "cavings_trend":      cavings_trend,
        "tight_hole_pct":     tight_hole_pct,
        "diff_sticking_pct":  diff_sticking_pct,
        "losses_pct":         losses_pct,
    }


if __name__ == "__main__":
    import json
    result = calc_borehole_stability()
    print(json.dumps(result, indent=2))
