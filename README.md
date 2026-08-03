# Hydraulic Fracturing Design Engine Dashboard

**Well GM-01 | MEM-GM01-V1.1 | Common Calibrated MEM Database**

A professional desktop engineering dashboard for hydraulic fracturing well design, built with **Electron + React** (frontend) and **Python FastAPI** (backend sidecar).

---

## ✨ Features

- 📊 **Real-time calculations** — elastic properties, DFIT calibration, treating pressures, fracture geometry (PKN model), proppant placement
- 🔬 **Uncertainty analysis** — Monte Carlo P10/P50/P90 distributions
- 🌪️ **Sensitivity tornado chart** — impact analysis on fracture half-length
- ⚠️ **Risk classification** — automatic containment & fault interaction risk
- 📈 **Interactive charts** — DFIT pressure decline, stress vs depth, sensitivity
- 🖥️ **Desktop app** — Electron wrapper, auto-starts Python backend as sidecar

---

## 📋 Requirements

| Dependency      | Version  |
|----------------|----------|
| Node.js         | ≥ 18.x   |
| Python          | ≥ 3.9    |
| pip             | latest   |

---

## 🚀 Installation & Setup

### Step 1 — Clone / Extract project

```
cd "d:\SEMESTER 7\PERMINYAKAN\SoftwareAppPetro"
```

### Step 2 — Install Python backend dependencies

```powershell
# Create virtual environment (recommended)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Step 3 — Install Node.js frontend dependencies

```
npm install
```

---

## ▶️ RunningTo start the application, run:
```bash
npm run dev
```
*(Note: If you run into port issues, use `taskkill /PID <PID> /F` to stop the old process.)*

## How to Use This Application

**DISCLAIMER:** This application is a screening tool and a Proof of Concept (MVP) for visualization and educational purposes. It is **not** an execution-ready design software. Final field execution requires approved local data, calibrated models, and independent verification.

### Application Flow (8-Step Engine Workflow)
1. **Load MEM**: The dashboard reads a snapshot of the Common Calibrated MEM (data for pore pressure, stress, and mechanical properties) as a baseline. The default well is GM-01.
2. **Review Target/Barrier Layers**: The "Common MEM / Target Interval Summary" panel displays the properties of the reservoir and the surrounding barrier layers.
3. **Analyze DFIT**: Check the "DFIT Analysis" panel to see the pressure test interpretation (breakdown, ISIP, closure) used to calibrate Shmin.
4. **Setup Completion & Fluid Design**: In the "Design Summary" and "Pumping Schedule" panels, you can observe the operational parameters. Editable parameters (marked with a pencil icon ✎) include fluid volume, proppant, and rate.
5. **Predict Geometry**: The "Fracture Geometry" panel calculates and displays the expected fracture dimensions (half-length, width, height) based on your design inputs.
6. **Risk Assessment**: Observe the "Containment Analysis" and "Fault Interaction" panels. Pay attention to the warning badges (Green = Safe, Yellow = Warning, Red = High Risk) and the Risk Matrix.
7. **Optimization**: If a risk is flagged as "High" or the assessment says "REQUIRES DESIGN OPTIMIZATION", adjust your parameters (e.g., lower the pump rate or fluid volume in the input file) and refresh to see if the risk is mitigated.
8. **Review & Export**: Review the "Recommendations" panel and ensure the "Validation Checklist" steps are completed before accepting the design.

### Dashboard Navigation
- **Navigation Menu (Left)**: Switch between the main Hydraulic Fracturing dashboard, Data Requirements, Workflow guide, Validation Checklist, and a Glossary of terms.
- **Header**: Shows the well context and the data snapshot date. Click **Refresh** to reload the dashboard after changing the backend JSON data.

### Option A — Development mode (separate terminals)

**Terminal 1 — Start Python backend:**
```powershell
.\.venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Start Electron + React dev server:**
```powershell
npm run electron:dev
```

### Option B — Web-only mode (no Electron)

**Terminal 1 — Backend:**
```powershell
.\.venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```powershell
npm run dev
# Open http://localhost:5173 in your browser
```

---

## 🔌 API Endpoints

The FastAPI backend exposes these endpoints at `http://127.0.0.1:8000`:

| Endpoint                     | Description                          |
|-----------------------------|--------------------------------------|
| `GET /`                      | Health check                         |
| `GET /api/dashboard`         | All data in one call (used by UI)    |
| `GET /api/well`              | Well metadata                        |
| `GET /api/mem`               | Common MEM properties                |
| `GET /api/elastic`           | Elastic properties from sonic logs   |
| `GET /api/dfit`              | DFIT calibration results             |
| `GET /api/pressure`          | Treating pressure components         |
| `GET /api/fracture-geometry` | Fracture geometry (PKN)              |
| `GET /api/design-summary`    | Complete design summary              |
| `GET /api/pumping-schedule`  | Pumping schedule stages              |
| `GET /api/stress-profile`    | Stress profile vs depth              |
| `GET /api/containment`       | Containment & fault analysis         |
| `GET /api/uncertainty`       | P10/P50/P90 table (static)           |
| `GET /api/uncertainty/montecarlo` | Monte Carlo simulation          |
| `GET /api/sensitivity`       | Tornado chart sensitivity data       |
| `GET /api/risk`              | Risk classification & recommendations|

Swagger UI: `http://127.0.0.1:8000/docs`

---

## 📁 Project Structure

```
SoftwareAppPetro/
├── backend/
│   ├── main.py                  # FastAPI app + all endpoints
│   ├── calculations/
│   │   ├── elastic_properties.py
│   │   ├── dfit_calibration.py
│   │   ├── pressure_calc.py
│   │   ├── fracture_geometry.py
│   │   ├── proppant_placement.py
│   │   ├── containment_fault.py
│   │   └── uncertainty_ml.py
│   └── data/
│       └── mem_default.json     # Well GM-01 default data
├── electron/
│   └── main.js                  # Electron entry (auto-starts backend)
├── src/
│   ├── App.jsx                  # Main layout & routing
│   ├── api.js                   # Axios API client
│   ├── index.css                # Global styles (dark theme)
│   ├── main.jsx                 # React entry point
│   └── components/
│       ├── Sidebar.jsx
│       ├── KPIStrip.jsx
│       ├── MEMSummary.jsx
│       ├── DFITAnalysis.jsx
│       ├── StressProfile.jsx
│       ├── FractureGeometry.jsx
│       ├── DesignSummary.jsx
│       ├── PumpingSchedule.jsx
│       ├── PressureComponents.jsx
│       ├── PerforationCluster.jsx
│       ├── ContainmentAnalysis.jsx
│       ├── FaultInteraction.jsx
│       ├── UncertaintySummary.jsx
│       ├── SensitivityTornado.jsx
│       └── RiskSection.jsx
├── requirements.txt
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔢 Calculations Implemented

1. **Elastic Properties** — Vp, Vs, dynamic Poisson's ratio, dynamic/static Young's Modulus
2. **DFIT Calibration** — Updated Shmin from closure pressure, recalculated breakdown pressure
3. **Treating Pressures** — Fracture pressure, BHTP, hydrostatic, surface treating pressure
4. **Fracture Geometry (PKN)** — Plane-strain modulus, max/avg width, fracture volume, half-length, area
5. **Proppant Placement** — Proppant volume, propped fracture area, average propped width
6. **Containment Analysis** — Barrier stress contrasts vs net pressure, height growth risk
7. **Fault Interaction** — Remaining distance, P90 half-length, intersection risk
8. **Monte Carlo Uncertainty** — P10/P50/P90 using triangular distributions (no scipy needed)
9. **Sensitivity Analysis** — ±20% parameter variation impact on half-length

---

## 🏗️ Build Desktop Installer

```powershell
npm run electron:build
# Output in /release/
```

---

## 🎨 Design

- **Theme**: Dark navy (`#0a1428`) with blue accents
- **Status colors**: Green (good), Yellow (warning), Red (high risk), Purple (fracture geometry)
- **Charts**: Recharts (interactive, hover tooltips)
- **Font**: Inter (Google Fonts)
