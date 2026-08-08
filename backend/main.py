"""
Hydraulic Fracturing Design Engine – FastAPI Backend
Well GM-01 | MEM-GM01-V1.1
"""
import io
import json
import os
import sys
import logging
import tempfile
import time
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Resolve paths & setup logging FIRST (before any other import) ───────────────
if getattr(sys, 'frozen', False):
    # Running inside PyInstaller bundle
    BUNDLE_DATA_FILE = Path(sys._MEIPASS) / "data" / "mem_default.json"
    _appdata = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
    USER_DATA_DIR  = _appdata / "HF Design Engine"
    USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
    USER_DATA_FILE = USER_DATA_DIR / "mem_default.json"
    DATA_FILE       = USER_DATA_FILE if USER_DATA_FILE.exists() else BUNDLE_DATA_FILE
    WRITE_DATA_FILE = USER_DATA_FILE

    # Write log to AppData so we can diagnose errors on any machine
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(message)s',
        handlers=[logging.FileHandler(USER_DATA_DIR / "backend.log", encoding="utf-8")]
    )
else:
    DATA_FILE       = Path(__file__).parent / "data" / "mem_default.json"
    WRITE_DATA_FILE = DATA_FILE
    logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)
logger.info(f"Backend starting. DATA_FILE={DATA_FILE}")

# ── Import file parser at MODULE LEVEL so PyInstaller bundles it ─────────────────
# IMPORTANT: must NOT be a lazy/inline import inside a function
from file_parser import parse_uploaded_file   # noqa: E402

from calculations.elastic_properties import calc_elastic_properties
from calculations.dfit_calibration import calc_dfit_calibration
from calculations.pressure_calc import calc_treating_pressures
from calculations.fracture_geometry import calc_fracture_geometry
from calculations.proppant_placement import calc_proppant_placement
from calculations.containment_fault import calc_containment_fault
from calculations.uncertainty_ml import monte_carlo_uncertainty, calc_sensitivity_tornado
from calculations.borehole_stability_calc import calc_borehole_stability

logger.info("All modules imported OK")

# ── App setup ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Hydraulic Fracturing Design Engine API",
    description="Backend for GM-01 MEM Dashboard",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load default data ──────────────────────────────────────────────────────────
try:
    with open(DATA_FILE, encoding="utf-8") as f:
        DEFAULT_DATA: Dict[str, Any] = json.load(f)
    logger.info("Default data loaded OK")
except Exception as e:
    logger.error(f"Failed to load default data: {e}")
    raise

# ── Helper ─────────────────────────────────────────────────────────────────────
def get_well() -> dict:
    return DEFAULT_DATA["well"]

def get_design() -> dict:
    return DEFAULT_DATA["design"]

def get_mem() -> dict:
    return DEFAULT_DATA["mem"]

def get_dfit() -> dict:
    return DEFAULT_DATA["dfit"]

def _get_shmin_at_tvd(target_tvd_ft: float) -> float:
    """
    Ambil Shmin_psi representatif dari log Stress vs Depth.
    
    Strategi 2-tahap:
    1. Cari dalam window ±200 ft dari target_tvd_ft → ambil nilai Shmin tertinggi di sana
       (titik terbesar = zona reservoir aktual, bukan anomali ujung log)
    2. Jika window kosong, gunakan Shmin tertinggi secara keseluruhan dari log
    3. Jika log kosong → fallback ke DFIT closure → MEM Shmin
    
    Ini memastikan Pressure Components konsisten dengan puncak kurva
    yang terlihat di visualisasi Stress vs Depth.
    """
    svd = DEFAULT_DATA.get("stress_vs_depth", [])

    if svd and len(svd) > 0:
        # Stage 1: Cari titik dalam window ±200 ft dari target TVD
        window = [p for p in svd if abs(p.get("tvd_ft", 0) - target_tvd_ft) <= 200]
        if not window:
            window = svd  # Fallback ke seluruh log jika window kosong

        # Ambil titik dengan Shmin TERTINGGI di window (zona reservoir representatif)
        best = max(window, key=lambda p: p.get("Shmin_psi", 0))
        shmin_from_log = best.get("Shmin_psi")
        if shmin_from_log and shmin_from_log > 0:
            return round(shmin_from_log, 0)

    # Fallback: DFIT calibrated closure → MEM Shmin statis
    dfit = get_dfit()
    mem  = get_mem()
    return dfit.get("closure_psi", mem["Shmin_psi"])





def _build_geom() -> dict:
    """Central helper: compute fracture geometry from current DEFAULT_DATA."""
    mem    = get_mem()
    design = get_design()
    return calc_fracture_geometry(
        E_static_MMpsi=mem["E_static_MMpsi"],
        nu_static=mem["nu_static"],
        Pnet_psi=design["Pnet_psi"],
        hf_ft=design["fracture_height_ft"],
        efficiency=design["efficiency"],
        V_injected_bbl=design["total_fluid_bbl"],
        k_res_md=float(mem.get("permeability_md", 0.1)),   # From uploaded MEM data
    )


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "service": "Hydraulic Fracturing Design Engine API", "version": "1.1.0"}


@app.post("/api/upload")
async def api_upload(file: UploadFile = File(...)):
    """Upload a new well JSON/XLSX/TXT file to update the dashboard."""
    global DEFAULT_DATA
    tmp_path = None
    try:
        # Read entire file content into memory FIRST
        content = await file.read()
        suffix = f".{file.filename.split('.')[-1]}" if '.' in file.filename else ".json"

        # Write to temp file (closed immediately after write so Windows releases lock)
        fd, tmp_path = tempfile.mkstemp(suffix=suffix)
        try:
            with os.fdopen(fd, 'wb') as tmp:
                tmp.write(content)
        except Exception:
            os.close(fd)
            raise

        # Parse the temp file (pandas reads it fully into memory)
        new_data = parse_uploaded_file(tmp_path, file.filename)

        # Basic validation
        if not isinstance(new_data, dict) or "well" not in new_data or "mem" not in new_data:
            keys = list(new_data.keys()) if isinstance(new_data, dict) else type(new_data).__name__
            raise HTTPException(
                status_code=400,
                detail=f"Struktur file tidak valid. Sheet ditemukan: {keys}. Dibutuhkan: 'well' dan 'mem'."
            )

        # Update in-memory data
        DEFAULT_DATA = new_data

        # Persist to AppData (writable on all machines)
        try:
            with open(WRITE_DATA_FILE, "w", encoding="utf-8") as wf:
                json.dump(new_data, wf, indent=2)
            logger.info(f"Data saved to {WRITE_DATA_FILE}")
        except Exception as e:
            logger.warning(f"Could not save to disk: {e}")

        return {"status": "success", "message": f"File '{file.filename}' berhasil di-upload."}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error for '{file.filename}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Retry deletion to handle Windows file-locking (antivirus/Defender delay)
        if tmp_path and os.path.exists(tmp_path):
            for attempt in range(5):
                try:
                    os.unlink(tmp_path)
                    break
                except PermissionError:
                    if attempt < 4:
                        time.sleep(0.15)
                    else:
                        logger.warning(f"Could not delete temp file after 5 attempts: {tmp_path}")
                except Exception as e:
                    logger.warning(f"Could not delete temp file {tmp_path}: {e}")
                    break


@app.get("/api/well")
def api_well():
    """Return well metadata."""
    return DEFAULT_DATA["well"]


@app.get("/api/mem")
def api_mem():
    """Return Common MEM properties and calculated profiles."""
    mem = get_mem()
    design = get_design()
    well = get_well()

    # Plane-strain modulus
    E = mem.get("E_static_MMpsi", 0)
    nu = mem.get("nu_static", 0)
    Eprime = E / (1 - nu ** 2) if nu < 1 else E
    
    tvd = well.get("tvd_ft", 1)
    if tvd <= 0: tvd = 1
    
    biot = mem.get("Biot", 1.0)
    
    Pp = mem.get("Pp_psi", 0)
    Sv = mem.get("Sv_psi", 0)
    Shmin = mem.get("Shmin_psi", 0)
    SHmax = mem.get("SHmax_psi", 0)
    
    # Gradients (psi/ft)
    grad_Pp = Pp / tvd
    grad_Sv = Sv / tvd
    grad_Shmin = Shmin / tvd
    grad_SHmax = SHmax / tvd
    
    # Equivalent Mud Weight (ppg)
    emw_Pp = Pp / (0.052 * tvd)
    emw_Sv = Sv / (0.052 * tvd)
    emw_Shmin = Shmin / (0.052 * tvd)
    emw_SHmax = SHmax / (0.052 * tvd)
    
    # Effective Stresses
    Pp_eff = biot * Pp
    eff_Sv = Sv - Pp_eff
    eff_Shmin = Shmin - Pp_eff
    eff_SHmax = SHmax - Pp_eff
    
    # Stress Regime determination
    if Sv > SHmax and SHmax > Shmin:
        regime = "NORMAL"
        regime_desc = "Sv > Shmax > Shmin"
    elif SHmax > Sv and Sv > Shmin:
        regime = "STRIKE-SLIP"
        regime_desc = "Shmax > Sv > Shmin"
    elif SHmax > Shmin and Shmin > Sv:
        regime = "REVERSE"
        regime_desc = "Shmax > Shmin > Sv"
    else:
        regime = "COMPLEX"
        regime_desc = "Undefined"

    return {
        **mem,
        "Eprime_MMpsi": round(Eprime, 3),
        "target_tvd_ft": well.get("tvd_ft", 0),
        "net_pay_ft": well.get("net_pay_ft", 0),
        "fracture_height_ft": design.get("fracture_height_ft", 0),
        "gradients": {
            "Pp": round(grad_Pp, 3),
            "Sv": round(grad_Sv, 3),
            "Shmin": round(grad_Shmin, 3),
            "SHmax": round(grad_SHmax, 3)
        },
        "emw": {
            "Pp": round(emw_Pp, 2),
            "Sv": round(emw_Sv, 2),
            "Shmin": round(emw_Shmin, 2),
            "SHmax": round(emw_SHmax, 2)
        },
        "effective": {
            "Sv": round(eff_Sv, 0),
            "Shmin": round(eff_Shmin, 0),
            "SHmax": round(eff_SHmax, 0)
        },
        "stress_regime_calc": regime,
        "stress_regime_desc": regime_desc
    }


@app.get("/api/elastic")
def api_elastic():
    """Return computed elastic properties from sonic logs."""
    logs = DEFAULT_DATA["logs"]
    return calc_elastic_properties(
        Dtp=logs["Dtp"],
        Dts=logs["Dts"],
        rho=logs["rho"],
    )


@app.get("/api/dfit")
def api_dfit():
    """Return DFIT calibration results + raw pressure curve."""
    mem = get_mem()
    dfit = get_dfit()

    calibration = calc_dfit_calibration(
        Shmin_initial_psi=mem["Shmin_psi"],        # Use actual MEM Shmin (not hardcoded)
        Shmin_dfit_psi=dfit["closure_psi"],
        SHmax_psi=mem["SHmax_psi"],
        Pp_psi=mem["Pp_psi"],
        T0_psi=mem["T0_psi"],
    )

    return {
        **dfit,
        **calibration,
        "pressure_curve": DEFAULT_DATA.get("dfit_pressure_curve", []),
    }


@app.get("/api/pressure")
def api_pressure():
    """Return treating pressure components.
    
    Shmin diambil dari log Stress vs Depth pada kedalaman TVD sumur,
    sehingga Pressure Components selalu konsisten dengan visualisasi grafik.
    Jika log tidak ada (belum upload Excel), fallback ke DFIT closure → MEM Shmin.
    """
    design = get_design()
    well   = get_well()

    # ── Shmin dari log Stress vs Depth di kedalaman TVD aktual ──────────────
    Shmin_at_tvd = _get_shmin_at_tvd(well["tvd_ft"])

    return calc_treating_pressures(
        Shmin_psi=Shmin_at_tvd,
        Pnet_psi=design["Pnet_psi"],
        DeltaPperf_psi=design["DeltaPperf_psi"],
        DeltaPNWB_psi=design["DeltaPNWB_psi"],
        MWf=design["MWf"],
        TVD_ft=well["tvd_ft"],
        DeltaPtubing_psi=design["DeltaPtubing_psi"],
    )



@app.get("/api/fracture-geometry")
def api_fracture_geometry():
    """Return fracture geometry calculations."""
    design = get_design()
    geom = _build_geom()

    prop = calc_proppant_placement(
        Mp_lb=design["total_proppant_lb"],
        xf_ft=geom["xf_ft"],
        hf_ft=design["fracture_height_ft"],
    )

    # Refine fracture conductivity with actual propped width
    geom["fracture_conductivity_md_ft"] = round(
        geom.get("fracture_conductivity_md_ft", 0) or
        (50000.0 * prop["wprop_ft"]), 0
    )

    return {**geom, **prop}


@app.get("/api/design-summary")
def api_design_summary():
    """Return complete design summary."""
    mem = get_mem()
    design = get_design()
    geom = _build_geom()
    prop = calc_proppant_placement(
        Mp_lb=design["total_proppant_lb"],
        xf_ft=geom["xf_ft"],
        hf_ft=design["fracture_height_ft"],
    )

    # Height containment: calculate from actual stress contrast vs net pressure
    stress_layers = DEFAULT_DATA.get("stress_profile", [])
    try:
        upper = next((l for l in stress_layers if l.get("layer") == "Upper Barrier"), None)
        lower = next((l for l in stress_layers if l.get("layer") == "Lower Barrier"), None)
        if upper and lower:
            upper_contrast = upper["Shmin_psi"] - mem["Shmin_psi"]
            lower_contrast = lower["Shmin_psi"] - mem["Shmin_psi"]
            min_contrast = min(upper_contrast, lower_contrast)
            # If net pressure < min barrier contrast → 98% contained, else scale down
            if design["Pnet_psi"] < min_contrast:
                height_containment_pct = 98
            else:
                height_containment_pct = round(max(50, 98 - (design["Pnet_psi"] - min_contrast) / min_contrast * 30), 0)
        else:
            height_containment_pct = 98
    except Exception:
        height_containment_pct = 98

    # avg_pump_rate_bpm: prefer live calculation from pumping_schedule
    schedule_obj = DEFAULT_DATA.get("pumping_schedule", {})
    schedule = schedule_obj.get("stages", []) if isinstance(schedule_obj, dict) else []
    total_fluid_sched = sum(float(s.get("fluid_bbl", 0) or 0) for s in schedule if isinstance(s, dict))
    if total_fluid_sched > 0:
        weighted = sum(float(s.get("fluid_bbl",0) or 0) * float(s.get("rate_bpm",0) or 0) for s in schedule if isinstance(s, dict))
        avg_pump_rate = round(weighted / total_fluid_sched, 1)
    else:
        avg_pump_rate = design.get("avg_pump_rate_bpm", 0)

    return {
        "total_fluid_bbl": design["total_fluid_bbl"],
        "effective_fracture_volume_bbl": geom["Vfrac_bbl"],
        "leakoff_bbl": geom["Leakoff_bbl"],
        "avg_pump_rate_bpm": avg_pump_rate,
        "total_proppant_lb": design["total_proppant_lb"],
        "proppant_volume_bbl": prop["Vp_bbl"],
        "avg_conc_lb_gal": design["avg_conc_lb_gal"],
        "clusters": design["clusters"],
        "shots_per_cluster": design["shots_per_cluster"],
        "total_perforations": design["total_perforations"],
        "flow_per_cluster_bpm": design["flow_per_cluster_bpm"],
        "flow_per_perforation_bpm": design["flow_per_perforation_bpm"],
        "perf_diameter_in": design["perf_diameter_in"],
        "phasing_deg": design["phasing_deg"],
        "duration_min_low": design["duration_min_low"],
        "duration_min_high": design["duration_min_high"],
        "fracture_height_ft": design["fracture_height_ft"],
        "half_length_ft": geom["xf_ft"],
        "total_length_ft": geom["total_length_ft"],
        "avg_fracture_width_in": geom["wavg_in"],
        "fracture_area_ft2": geom["Af_ft2"],
        "height_containment_pct": int(height_containment_pct),
        "geometry_model": geom["geometry_model"],
        "dimensionless_conductivity": geom["Cd"],
        "efficiency": design["efficiency"],
    }


@app.get("/api/pumping-schedule")
def api_pumping_schedule():
    """Return pumping schedule table."""
    schedule_obj = DEFAULT_DATA.get("pumping_schedule", {})
    
    # Support both formats: {stages: [...]} dict (from Excel parser) or plain list (from JSON template)
    if isinstance(schedule_obj, dict):
        schedule = schedule_obj.get("stages", [])
        # Use pre-computed totals from parser if available
        total_fluid    = schedule_obj.get("total_fluid_bbl", None)
        total_proppant = schedule_obj.get("total_proppant_lb", None)
        avg_rate       = schedule_obj.get("avg_rate_bpm", None)
    else:
        schedule = schedule_obj if isinstance(schedule_obj, list) else []
        total_fluid = total_proppant = avg_rate = None

    # Ensure items are dicts before computing
    schedule = [s for s in schedule if isinstance(s, dict)]

    # Recompute totals if not pre-computed
    if total_fluid is None:
        total_fluid    = sum(float(s.get("fluid_bbl", 0) or 0)     for s in schedule)
    if total_proppant is None:
        total_proppant = sum(float(s.get("proppant_lb", 0) or 0)   for s in schedule)

    # Weighted average rate: sum(fluid_bbl * rate_bpm) / total_fluid
    if avg_rate is None:
        if total_fluid > 0:
            weighted_rate  = sum(
                float(s.get("fluid_bbl", 0) or 0) * float(s.get("rate_bpm", 0) or 0)
                for s in schedule
            )
            avg_rate = round(weighted_rate / total_fluid, 1)
        elif schedule:
            rates = [float(s.get("rate_bpm", 0) or 0) for s in schedule]
            avg_rate = round(sum(rates) / len(rates), 1) if rates else 0
        else:
            avg_rate = 0

    return {
        "stages":            schedule,
        "total_fluid_bbl":   round(total_fluid, 1),
        "total_proppant_lb": round(total_proppant, 0),
        "avg_rate_bpm":      avg_rate,
    }


@app.get("/api/stress-profile")
def api_stress_profile():
    """Return stress profile vs depth for plotting."""
    return {
        "layers": DEFAULT_DATA["stress_profile"],
        "vs_depth": DEFAULT_DATA["stress_vs_depth"],
        "reservoir_top_ft": get_well()["reservoir_top_ft"],
        "reservoir_base_ft": get_well()["reservoir_base_ft"],
    }


@app.get("/api/containment")
def api_containment():
    """Return containment and fault interaction analysis."""
    mem = get_mem()
    design = get_design()
    dfit = get_dfit()
    geom = _build_geom()

    # Use DFIT calibrated Shmin if available
    Shmin_calibrated = dfit.get("closure_psi", mem["Shmin_psi"])

    stress_layers = DEFAULT_DATA.get("stress_profile", [])
    # Fallback barrier: gunakan formula fisika (Shmin * 1.17) bukan angka hardcoded
    # sehingga hasil kalkulasi selalu konsisten dengan data sumur yang di-upload.
    fallback_upper_psi = round(Shmin_calibrated * 1.17)
    fallback_lower_psi = round(Shmin_calibrated * 1.13)
    upper = next((l for l in stress_layers if l.get("layer") == "Upper Barrier"), {"Shmin_psi": fallback_upper_psi})
    lower = next((l for l in stress_layers if l.get("layer") == "Lower Barrier"), {"Shmin_psi": fallback_lower_psi})

    return calc_containment_fault(
        Shmin_psi=Shmin_calibrated,
        upper_barrier_Shmin_psi=upper["Shmin_psi"],
        lower_barrier_Shmin_psi=lower["Shmin_psi"],
        Pnet_psi=design["Pnet_psi"],
        xf_ft=geom["xf_ft"],
        fault_distance_ft=design["fault_distance_ft"],
    )


@app.get("/api/uncertainty")
def api_uncertainty():
    """Return P10/P50/P90 uncertainty table."""
    return DEFAULT_DATA.get("uncertainty", {})


@app.get("/api/uncertainty/montecarlo")
def api_uncertainty_montecarlo():
    """Run Monte Carlo simulation using actual uploaded data parameters."""
    mem    = get_mem()
    design = get_design()
    well   = get_well()

    base_params = {
        **mem,
        **design,
        "tvd_ft":    well.get("tvd_ft", 10500),
        "fracture_height_ft": design.get("fracture_height_ft", 98),
    }
    return monte_carlo_uncertainty(n_samples=2000, base_params=base_params)


@app.get("/api/sensitivity")
def api_sensitivity():
    """Return tornado chart sensitivity data — computed from actual uploaded data."""
    mem = get_mem()
    design = get_design()

    # Plane-strain modulus from actual data
    E_psi = mem["E_static_MMpsi"] * 1e6
    Eprime_MMpsi = (E_psi / (1 - mem["nu_static"]**2)) / 1e6

    base_params = {
        "Pnet_psi":        design["Pnet_psi"],
        "hf_ft":           design["fracture_height_ft"],
        "Eprime_MMpsi":    round(Eprime_MMpsi, 3),
        "efficiency":      design["efficiency"],
        "V_injected_bbl":  design["total_fluid_bbl"],
        "leakoff_coeff":   design.get("leakoff_coeff", 0.005),
    }

    # Base xf from centralized geometry helper
    base_xf = _build_geom()["xf_ft"]

    result = calc_sensitivity_tornado(base_xf_ft=base_xf, base_params=base_params)
    return {"sensitivity": result}


@app.get("/api/risk")
def api_risk():
    """Return risk assessment summary."""
    mem = get_mem()
    design = get_design()
    dfit = get_dfit()
    geom = _build_geom()

    # Use DFIT calibrated Shmin if available
    Shmin_calibrated = dfit.get("closure_psi", mem["Shmin_psi"])

    # Gunakan data barrier dari stress_profile jika ada, jika tidak pakai formula fisika
    stress_layers = DEFAULT_DATA.get("stress_profile", [])
    fallback_upper_psi = round(Shmin_calibrated * 1.17)
    fallback_lower_psi = round(Shmin_calibrated * 1.13)
    upper = next((l for l in stress_layers if l.get("layer") == "Upper Barrier"), {"Shmin_psi": fallback_upper_psi})
    lower = next((l for l in stress_layers if l.get("layer") == "Lower Barrier"), {"Shmin_psi": fallback_lower_psi})

    containment = calc_containment_fault(
        Shmin_psi=Shmin_calibrated,
        upper_barrier_Shmin_psi=upper["Shmin_psi"],
        lower_barrier_Shmin_psi=lower["Shmin_psi"],
        Pnet_psi=design["Pnet_psi"],
        xf_ft=geom["xf_ft"],
        fault_distance_ft=design["fault_distance_ft"],
    )

    # Dynamic risk description logic
    if containment["upper_breach"] and containment["lower_breach"]:
        containment_desc = "Net pressure exceeds both upper and lower barrier stress contrasts"
    elif containment["upper_breach"]:
        containment_desc = "Net pressure exceeds upper barrier stress contrast"
    elif containment["lower_breach"]:
        containment_desc = "Net pressure exceeds lower barrier stress contrast"
    else:
        min_contrast = min(containment["upper_stress_contrast_psi"], containment["lower_stress_contrast_psi"])
        containment_desc = f"Minimum barrier stress contrast ({min_contrast} psi) vs Net pressure ({containment['Pnet_psi']} psi)"

    risks = [
        {
            "name": "Height Growth & Containment Risk",
            "level": containment["containment_risk"],
            "likelihood": 4 if containment["containment_risk"] == "High" else (3 if containment["containment_risk"] == "Moderate" else 1),
            "consequence": 5,
            "description": containment_desc,
        },
        {
            "name": "Fault Interaction Risk",
            "level": containment["fault_risk"],
            "likelihood": 4 if containment["fault_risk"] == "High" else (3 if containment["fault_risk"] == "Moderate" else 1),
            "consequence": 4,
            "description": f"P90 half-length ({containment['xf_P90_ft']} ft) vs fault at {containment['fault_distance_ft']} ft. Remaining: {containment['remaining_ft']} ft",
        },
    ]

    # Dynamically build recommendations based on risk
    recs = []
    if containment["containment_risk"] in ["High", "Moderate"]:
        recs.append("Reduce net pressure to improve height containment")
        recs.append("Optimize stage spacing and cluster efficiency")
        recs.append("Evaluate P3D / 3D geomechanical model for fracture complexity")
    if containment["fault_risk"] in ["High", "Moderate"]:
        recs.append("Re-evaluate fault risk with updated offsets and geomechanical model")
        recs.append("Monitor microseismic / DFIT during treatment to validate model")

    if not recs:
        recs.append("Design is within safe operational limits.")
        recs.append("Proceed with planned execution and monitor real-time treating pressures.")

    highlighted = [{"name": r["name"], "level": r["level"]} for r in risks if r["level"] in ["High", "Moderate"]]

    overall = "REQUIRES DESIGN OPTIMIZATION" if containment["overall_risk"] == "High" else ("MONITOR CLOSELY" if containment["overall_risk"] == "Moderate" else "OPTIMAL DESIGN")

    return {
        "risks": risks,
        "overall_assessment": overall,
        "overall_risk": containment["overall_risk"],
        "recommendations": recs,
        "highlighted_risks": highlighted,
    }


@app.get("/api/borehole-stability")
def api_borehole_stability():
    """Return Borehole Stability Engine results (Kirsch + Mohr-Coulomb)."""
    mem  = get_mem()
    well = get_well()

    return calc_borehole_stability(
        Pp_psi              = mem.get("Pp_psi", 5076),
        Sv_psi              = mem.get("Sv_psi", 10157),
        Shmin_psi           = mem.get("Shmin_psi", 6962),
        SHmax_psi           = mem.get("SHmax_psi", 8412),
        UCS_psi             = mem.get("UCS_psi", 4351),
        T0_psi              = mem.get("T0_psi", 435),
        friction_angle_deg  = mem.get("friction_angle_deg", 30),
        Biot                = mem.get("Biot", 1.0),
        TVD_ft              = well.get("tvd_ft", 9843),
    )


@app.get("/api/dashboard")
def api_dashboard():
    """Consolidated endpoint — returns all dashboard data in one call."""
    return {
        "well": api_well(),
        "mem": api_mem(),
        "elastic": api_elastic(),
        "dfit": api_dfit(),
        "pressure": api_pressure(),
        "fracture_geometry": api_fracture_geometry(),
        "design_summary": api_design_summary(),
        "pumping_schedule": api_pumping_schedule(),
        "stress_profile": api_stress_profile(),
        "containment": api_containment(),
        "uncertainty": api_uncertainty(),
        "sensitivity": api_sensitivity(),
        "risk": api_risk(),
        "bhs": api_borehole_stability(),
    }


# ── Entrypoint (for dev & prod) ───────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    if getattr(sys, 'frozen', False):
        # In PyInstaller, we cannot use string import or reload
        uvicorn.run(app, host="127.0.0.1", port=8000)
    else:
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
