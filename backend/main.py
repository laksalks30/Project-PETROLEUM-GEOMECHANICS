"""
Hydraulic Fracturing Design Engine – FastAPI Backend
Well GM-01 | MEM-GM01-V1.1
"""
import json
import os
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from calculations.elastic_properties import calc_elastic_properties
from calculations.dfit_calibration import calc_dfit_calibration
from calculations.pressure_calc import calc_treating_pressures
from calculations.fracture_geometry import calc_fracture_geometry
from calculations.proppant_placement import calc_proppant_placement
from calculations.containment_fault import calc_containment_fault
from calculations.uncertainty_ml import monte_carlo_uncertainty, calc_sensitivity_tornado

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
DATA_FILE = Path(__file__).parent / "data" / "mem_default.json"
with open(DATA_FILE, encoding="utf-8") as f:
    DEFAULT_DATA: Dict[str, Any] = json.load(f)


# ── Helper ─────────────────────────────────────────────────────────────────────
def get_well() -> dict:
    return DEFAULT_DATA["well"]

def get_design() -> dict:
    return DEFAULT_DATA["design"]

def get_mem() -> dict:
    return DEFAULT_DATA["mem"]

def get_dfit() -> dict:
    return DEFAULT_DATA["dfit"]


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "service": "Hydraulic Fracturing Design Engine API", "version": "1.1.0"}


@app.post("/api/upload")
async def api_upload(file: UploadFile = File(...)):
    """Upload a new well JSON file to update the dashboard."""
    global DEFAULT_DATA
    try:
        content = await file.read()
        new_data = json.loads(content)
        
        # Basic validation
        if "well" not in new_data or "mem" not in new_data:
            raise HTTPException(status_code=400, detail="Invalid JSON structure. Missing 'well' or 'mem'.")
            
        # Overwrite the physical file so changes persist
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(new_data, f, indent=2)
            
        # Update in-memory data
        DEFAULT_DATA = new_data
        
        return {"status": "success", "message": f"File {file.filename} uploaded successfully."}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file format.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/api/well")
def api_well():
    """Return well metadata."""
    return DEFAULT_DATA["well"]


@app.get("/api/mem")
def api_mem():
    """Return Common MEM properties."""
    mem = get_mem()
    design = get_design()
    well = get_well()

    # Plane-strain modulus
    E = mem["E_static_MMpsi"]
    nu = mem["nu_static"]
    Eprime = E / (1 - nu ** 2)

    return {
        **mem,
        "Eprime_MMpsi": round(Eprime, 3),
        "target_tvd_ft": well["tvd_ft"],
        "net_pay_ft": well["net_pay_ft"],
        "fracture_height_ft": design["fracture_height_ft"],
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
        Shmin_initial_psi=6962,
        Shmin_dfit_psi=dfit["closure_psi"],
        SHmax_psi=mem["SHmax_psi"],
        Pp_psi=mem["Pp_psi"],
        T0_psi=mem["T0_psi"],
    )

    return {
        **dfit,
        **calibration,
        "pressure_curve": DEFAULT_DATA["dfit_pressure_curve"],
    }


@app.get("/api/pressure")
def api_pressure():
    """Return treating pressure components."""
    mem = get_mem()
    design = get_design()
    well = get_well()

    return calc_treating_pressures(
        Shmin_psi=mem["Shmin_psi"],
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
    mem = get_mem()
    design = get_design()

    geom = calc_fracture_geometry(
        E_static_MMpsi=mem["E_static_MMpsi"],
        nu_static=mem["nu_static"],
        Pnet_psi=design["Pnet_psi"],
        hf_ft=design["fracture_height_ft"],
        efficiency=design["efficiency"],
        V_injected_bbl=design["total_fluid_bbl"],
    )

    prop = calc_proppant_placement(
        Mp_lb=design["total_proppant_lb"],
        xf_ft=geom["xf_ft"],
        hf_ft=design["fracture_height_ft"],
    )

    return {**geom, **prop}


@app.get("/api/design-summary")
def api_design_summary():
    """Return complete design summary."""
    design = get_design()
    geom = calc_fracture_geometry(
        E_static_MMpsi=get_mem()["E_static_MMpsi"],
        nu_static=get_mem()["nu_static"],
        Pnet_psi=design["Pnet_psi"],
        hf_ft=design["fracture_height_ft"],
        efficiency=design["efficiency"],
        V_injected_bbl=design["total_fluid_bbl"],
    )
    prop = calc_proppant_placement(
        Mp_lb=design["total_proppant_lb"],
        xf_ft=geom["xf_ft"],
        hf_ft=design["fracture_height_ft"],
    )
    return {
        "total_fluid_bbl": design["total_fluid_bbl"],
        "effective_fracture_volume_bbl": geom["Vfrac_bbl"],
        "leakoff_bbl": geom["Leakoff_bbl"],
        "avg_pump_rate_bpm": design["avg_pump_rate_bpm"],
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
        "height_containment_pct": 98,
        "geometry_model": geom["geometry_model"],
        "dimensionless_conductivity": geom["Cd"],
        "efficiency": design["efficiency"],
    }


@app.get("/api/pumping-schedule")
def api_pumping_schedule():
    """Return pumping schedule table."""
    schedule = DEFAULT_DATA["pumping_schedule"]
    total_fluid = sum(s["fluid_bbl"] for s in schedule)
    total_proppant = sum(s["proppant_lb"] for s in schedule)
    return {
        "stages": schedule,
        "total_fluid_bbl": total_fluid,
        "total_proppant_lb": total_proppant,
        "avg_rate_bpm": 25.2,
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
    geom = calc_fracture_geometry(
        E_static_MMpsi=mem["E_static_MMpsi"],
        nu_static=mem["nu_static"],
        Pnet_psi=design["Pnet_psi"],
        hf_ft=design["fracture_height_ft"],
        efficiency=design["efficiency"],
        V_injected_bbl=design["total_fluid_bbl"],
    )
    stress_layers = DEFAULT_DATA["stress_profile"]
    upper = next(l for l in stress_layers if l["layer"] == "Upper Barrier")
    lower = next(l for l in stress_layers if l["layer"] == "Lower Barrier")

    return calc_containment_fault(
        Shmin_psi=mem["Shmin_psi"],
        upper_barrier_Shmin_psi=upper["Shmin_psi"],
        lower_barrier_Shmin_psi=lower["Shmin_psi"],
        Pnet_psi=design["Pnet_psi"],
        xf_ft=geom["xf_ft"],
        fault_distance_ft=design["fault_distance_ft"],
    )


@app.get("/api/uncertainty")
def api_uncertainty():
    """Return P10/P50/P90 uncertainty table (static reference data)."""
    return DEFAULT_DATA["uncertainty"]


@app.get("/api/uncertainty/montecarlo")
def api_uncertainty_montecarlo():
    """Run Monte Carlo simulation and return P10/P50/P90."""
    return monte_carlo_uncertainty(n_samples=2000)


@app.get("/api/sensitivity")
def api_sensitivity():
    """Return tornado chart sensitivity data."""
    raw = DEFAULT_DATA["sensitivity"]
    result = [{"parameter": k, "impact_pct": v} for k, v in raw.items()]
    result.sort(key=lambda x: x["impact_pct"], reverse=True)
    return {"sensitivity": result}


@app.get("/api/risk")
def api_risk():
    """Return risk assessment summary."""
    containment = calc_containment_fault(
        Shmin_psi=get_mem()["Shmin_psi"],
        upper_barrier_Shmin_psi=8267,
        lower_barrier_Shmin_psi=7977,
        Pnet_psi=get_design()["Pnet_psi"],
        xf_ft=855,
        fault_distance_ft=get_design()["fault_distance_ft"],
    )

    risks = [
        {
            "name": "Height Growth Risk",
            "level": containment["containment_risk"],
            "likelihood": 4,
            "consequence": 5,
            "description": "Net pressure exceeds both upper and lower barrier stress contrasts",
        },
        {
            "name": "Fault Interaction Risk",
            "level": containment["fault_risk"],
            "likelihood": 4,
            "consequence": 4,
            "description": f"P90 half-length ({containment['xf_P90_ft']} ft) may intersect fault at {containment['fault_distance_ft']} ft",
        },
        {
            "name": "Containment Risk",
            "level": "Moderate",
            "likelihood": 3,
            "consequence": 2,
            "description": "Lower barrier stress contrast (870 psi) is borderline with net pressure",
        },
    ]

    return {
        "risks": risks,
        "overall_assessment": "REQUIRES DESIGN OPTIMIZATION",
        "overall_risk": containment["overall_risk"],
        "recommendations": [
            "Reduce net pressure to improve height containment",
            "Optimize stage spacing and cluster efficiency",
            "Evaluate P3D / 3D geomechanical model for fracture complexity",
            "Monitor microseismic / DFIT during treatment to validate model",
            "Re-evaluate fault risk with updated offsets and geomechanical model",
        ],
        "highlighted_risks": [
            {"name": "Height Growth Risk", "level": "High"},
            {"name": "Fault Interaction Risk", "level": "High"},
            {"name": "Containment Risk", "level": "Moderate"},
        ],
    }


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
    }


# ── Entrypoint (for dev) ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
