"""
Universal Excel Parser — Hydraulic Fracturing Design Engine
============================================================
Arsitektur 3 Lapisan:
  Layer 1 : Fuzzy Sheet Detection   → temukan sheet via keyword (case-insensitive)
  Layer 2 : Dynamic Column Mapping  → temukan kolom via scan header + sinonim
  Layer 3 : Graceful Fallback       → jika tidak ditemukan, pakai mem_default.json
"""

import json
import os
import re
import pandas as pd
from typing import Dict, Any, Optional, List, Tuple
from fastapi import HTTPException

# ---------------------------------------------------------------------------
# Konstanta
# ---------------------------------------------------------------------------
NULL_VALUE = -999.25  # Standar null indicator di software well logging

# ── Keyword maps untuk Sheet detection ─────────────────────────────────────
SHEET_KEYWORDS = {
    # Stress sheet must contain BOTH shmin AND shmax to avoid FG/SFG collision
    "stress":       ["shmin shmax", "shmin & shmax", "stress profile", "min horizontal"],
    # OBG: avoid picking up 'pore pressure' sheets
    "pore_pressure":["pore pressure", "formation pressure"],
    "obg":          ["overburden gradient", "overburden gradien", "obg"],
    "pumping":      ["pumping schedule", "pumping_schedule", "treatment schedule", "injection schedule"],
    "well_profile": ["well profile", "trajectory", "deviation"],
}

# ── Keyword maps untuk Column detection ─────────────────────────────────────
COL_KEYWORDS = {
    "depth_m":      ["depth", "tvd", "md", "kedalaman", "depth (m)", "tvd (m)", "m"],
    "depth_ft":     ["depth (ft)", "tvd (ft)", "tvd ft", "depth ft"],
    "shmin_ppg":    ["shmin", "sh min", "minimum stress", "frac grad", "fracture gradient", "shmin ppg"],
    "shmax_ppg":    ["shmax", "sh max", "maximum stress", "shmax ppg"],
    "obg_ppg":      ["obg", "overburden gradient", "sv ppg", "ogb ppg", "obg (ppg)", "obg ppg"],
    "obg_psi":      ["obg (psi)", "overburden (psi)", "sv (psi)", "sv psi"],
    "pp_ppg":       ["pp", "pp_dt", "pore pressure", "formation pressure", "pore press", "pp (ppg)", "pp ppg"],
    "pp_psi":       ["pp (psi)", "pore pressure (psi)", "formation pressure (psi)"],
    # Pumping schedule fields
    "stage":        ["stage", "tahap", "step", "stages"],
    "fluid_bbl":    ["fluid", "volume", "bbl", "fluida", "fluid (bbl)", "fluid_bbl"],
    "rate_bpm":     ["rate", "laju", "bpm", "pump rate", "rate (bpm)", "rate_bpm"],
    "prop_conc":    ["lb/gal", "ppg", "proppant conc", "prop conc", "proppant_lb_gal", "lb per gal"],
    "prop_lb":      ["proppant (lb)", "proppant_lb", "prop lb", "sand lb", "proppant lb", "lb proppant"],
}


# ===========================================================================
# LAYER 1 — SHEET FINDER
# ===========================================================================

def _sheet_score(sheet_name: str, keywords: List[str]) -> int:
    """Hitung skor kecocokan nama sheet dengan daftar keyword."""
    name = sheet_name.strip().lower()
    score = 0
    for kw in keywords:
        if kw in name:
            # Exact match lebih tinggi skornya
            score += 10 if kw == name else 5
    return score


def find_sheet(xls: pd.ExcelFile, keywords: List[str], min_score: int = 5) -> Optional[str]:
    """
    Temukan sheet terbaik berdasarkan daftar keyword.
    Jika ada banyak kandidat, pilih yang punya skor tertinggi.
    """
    best_sheet, best_score = None, 0
    for s in xls.sheet_names:
        score = _sheet_score(s, keywords)
        if score > best_score:
            best_sheet, best_score = s, score
    return best_sheet if best_score >= min_score else None


def find_stress_sheet(xls: pd.ExcelFile) -> Optional[str]:
    """
    Cari sheet stress dengan logika khusus:
    Sheet harus mengandung KEDUA kata 'shmin' DAN 'shmax' di namanya.
    Fallback: cari sheet apapun yang namanya mengandung 'stress'.
    """
    # Priority 1: sheet name mengandung shmin DAN shmax
    for s in xls.sheet_names:
        name = s.strip().lower()
        if "shmin" in name and "shmax" in name:
            return s
    # Priority 2: keyword scoring biasa
    return find_sheet(xls, ["stress profile", "stress gradient", "horizontal stress"])


def find_best_pp_sheet(xls: pd.ExcelFile) -> Optional[str]:
    """
    Khusus untuk Pore Pressure: ambil kandidat 'pore' + 'pressure',
    lalu pilih yang punya kolom TERBANYAK (menghindari sheet stub/pelengkap).
    """
    candidates = [
        s for s in xls.sheet_names
        if "pore" in s.strip().lower() and "pressure" in s.strip().lower()
    ]
    if not candidates:
        return None
    return max(candidates, key=lambda s: pd.read_excel(xls, sheet_name=s, header=None, nrows=1).shape[1])


# ===========================================================================
# LAYER 2 — COLUMN MAPPER
# ===========================================================================

def _col_score(col_name: str, keywords: List[str]) -> int:
    """Hitung skor kecocokan nama kolom dengan keyword."""
    name = str(col_name).strip().lower()
    if name in ("nan", "", "none"):
        return 0
    score = 0
    for kw in keywords:
        if kw == name:
            return 100  # Exact match → stop
        if kw in name:
            score = max(score, 10)
        elif name in kw:
            score = max(score, 5)
    return score


def find_header_row(df: pd.DataFrame, max_scan: int = 15) -> int:
    """
    Scan maksimal `max_scan` baris pertama untuk menemukan baris header.
    Pilih baris yang memiliki jumlah kolom string (teks) TERBANYAK, 
    yang mengindikasikan itu adalah baris nama kolom.
    """
    best_row = 0
    max_str_count = 0
    
    for row_idx in range(min(max_scan, len(df))):
        row = df.iloc[row_idx]
        str_count = sum(1 for v in row if isinstance(v, str) and len(v.strip()) > 1)
        numeric_count = sum(1 for v in row if pd.notna(v) and isinstance(v, (int, float)))
        
        # Header sejati biasanya punya banyak string dan sedikit angka
        if str_count >= 2 and str_count > numeric_count:
            if str_count > max_str_count:
                max_str_count = str_count
                best_row = row_idx
                
    return best_row


def map_columns(df: pd.DataFrame, header_row: int, field_map: Dict[str, str]) -> Dict[str, Optional[int]]:
    """
    Petakan field yang dibutuhkan ke indeks kolom DataFrame.
    field_map = {"field_name": "keyword_key"} → merujuk ke COL_KEYWORDS
    Kembalikan dict {"field_name": col_idx} atau None jika tidak ditemukan.
    """
    header = df.iloc[header_row]
    result = {}
    for field, kw_key in field_map.items():
        keywords = COL_KEYWORDS.get(kw_key, [kw_key])
        best_col, best_score = None, 0
        for col_idx, col_val in enumerate(header):
            score = _col_score(col_val, keywords)
            # Use >= to prefer the rightmost column (often the final computed/working data column)
            if score >= best_score and score > 0:
                best_col, best_score = col_idx, score
        result[field] = best_col
    return result


# ===========================================================================
# LAYER 3 — EXTRACTOR FUNCTIONS
# ===========================================================================

def _is_null(val) -> bool:
    """Cek apakah nilai adalah null value (NaN atau sentinel -999.25)."""
    if pd.isna(val):
        return True
    try:
        return abs(float(val) - NULL_VALUE) < 1
    except (TypeError, ValueError):
        return False


def _to_float(val) -> Optional[float]:
    """Konversi ke float, kembalikan None jika tidak valid atau null."""
    if _is_null(val):
        return None
    try:
        return float(val)
    except (TypeError, ValueError):
        return None


# Known column positions for R-010 format (used as fallback)
R010_STRESS_COLS = {"depth_m": 1, "shmin_ppg": 18, "shmax_ppg": 21}


def extract_stress_profile(xls: pd.ExcelFile):
    """
    Ekstrak data Stress vs Depth dari sheet stress (Shmin, SHmax, Depth).
    Mendeteksi kolom secara dinamis via keyword.
    Fallback ke posisi kolom R-010 jika deteksi gagal.
    """
    stress_sheet = find_stress_sheet(xls)
    if not stress_sheet:
        return None

    df_raw = pd.read_excel(xls, sheet_name=stress_sheet, header=None)
    header_row = find_header_row(df_raw)

    col_map = map_columns(df_raw, header_row, {
        "depth_m":   "depth_m",
        "shmin_ppg": "shmin_ppg",
        "shmax_ppg": "shmax_ppg",
    })

    # Fallback ke posisi kolom R-010 yang diketahui jika keyword detection gagal
    if col_map["depth_m"] is None:
        col_map["depth_m"] = R010_STRESS_COLS["depth_m"]
    if col_map["shmin_ppg"] is None:
        col_map["shmin_ppg"] = R010_STRESS_COLS["shmin_ppg"]
    if col_map["shmax_ppg"] is None:
        col_map["shmax_ppg"] = R010_STRESS_COLS["shmax_ppg"]

    # Cari baris data pertama yang valid (skip baris header/unit)
    start_row = header_row + 1
    df_data = df_raw.iloc[start_row:].reset_index(drop=True)

    # Skip baris 'unit' jika ada (baris pertama berisi text seperti 'M', 'ppg')
    if len(df_data) > 0:
        first_val = df_data.iloc[0, col_map["depth_m"]]
        if isinstance(first_val, str) or pd.isna(pd.to_numeric(first_val, errors='coerce')):
            df_data = df_data.iloc[1:].reset_index(drop=True)

    depth_ser = pd.to_numeric(df_data[col_map["depth_m"]],  errors='coerce')
    shmin_ser = pd.to_numeric(df_data[col_map["shmin_ppg"]], errors='coerce')
    shmax_ser = pd.to_numeric(df_data[col_map["shmax_ppg"]], errors='coerce') if col_map["shmax_ppg"] is not None else pd.Series([None]*len(depth_ser))

    return depth_ser, shmin_ser, shmax_ser


def extract_pp_lookup(xls: pd.ExcelFile) -> Dict[float, float]:
    """
    Bangun lookup dict {depth_m → pp_ppg} dari sheet Pore Pressure.
    Mendukung marker 'Sedang Digunakan' untuk multi-method sheet.
    """
    pp_sheet = find_best_pp_sheet(xls)
    if not pp_sheet:
        # Fallback: cari sheet biasa via keyword
        pp_sheet = find_sheet(xls, SHEET_KEYWORDS["pore_pressure"])
    if not pp_sheet:
        return {}

    df_raw = pd.read_excel(xls, sheet_name=pp_sheet, header=None)

    # Cari marker 'Sedang Digunakan' untuk multi-method sheet (format R-010)
    active_depth_col = None
    active_pp_col = None
    for row_idx in range(min(10, len(df_raw))):
        row = df_raw.iloc[row_idx]
        for col_idx, val in enumerate(row):
            if "sedang" in str(val).lower() or "digunakan" in str(val).lower() or "active" in str(val).lower():
                active_depth_col = col_idx
                active_pp_col = col_idx + 1
                break
        if active_depth_col is not None:
            break

    # Jika tidak ada marker, gunakan column detection biasa
    if active_depth_col is None:
        header_row = find_header_row(df_raw)
        col_map = map_columns(df_raw, header_row, {
            "depth_m": "depth_m",
            "pp_ppg":  "pp_ppg",
        })
        active_depth_col = col_map["depth_m"]
        active_pp_col    = col_map["pp_ppg"]

    if active_depth_col is None or active_pp_col is None:
        return {}

    # Data mulai dari baris setelah header area
    start_row = next(
        (i for i in range(min(10, len(df_raw)))
         if _to_float(df_raw.iloc[i, active_depth_col]) is not None),
        0
    )
    df_data = df_raw.iloc[start_row:].reset_index(drop=True)

    if active_pp_col >= df_data.shape[1]:
        return {}

    depth_ser = pd.to_numeric(df_data[active_depth_col], errors='coerce')
    pp_ser    = pd.to_numeric(df_data[active_pp_col],    errors='coerce')

    lookup = {}
    for j in range(len(depth_ser)):
        d = _to_float(depth_ser[j])
        v = _to_float(pp_ser[j])
        if d is not None and v is not None and d > 0:
            lookup[round(d, 2)] = v
    return lookup


def extract_obg_lookup(xls: pd.ExcelFile) -> Dict[int, float]:
    """
    Bangun lookup dict {depth_m_int → obg_ppg} dari sheet OBG/Overburden.
    Key dibulatkan ke integer untuk pencocokan terdekat.
    """
    obg_sheet = find_sheet(xls, SHEET_KEYWORDS["obg"])
    if not obg_sheet:
        return {}

    df_raw = pd.read_excel(xls, sheet_name=obg_sheet, header=None)
    header_row = find_header_row(df_raw)
    col_map = map_columns(df_raw, header_row, {
        "depth_m":  "depth_m",
        "obg_ppg":  "obg_ppg",
    })

    # Fallback: coba obg_psi jika ppg tidak ketemu
    if col_map["obg_ppg"] is None:
        col_map = map_columns(df_raw, header_row, {"depth_m": "depth_m", "obg_ppg": "obg_psi"})

    if col_map["depth_m"] is None or col_map["obg_ppg"] is None:
        return {}

    df_data = df_raw.iloc[header_row + 1:].reset_index(drop=True)
    depth_ser = pd.to_numeric(df_data[col_map["depth_m"]], errors='coerce')
    obg_ser   = pd.to_numeric(df_data[col_map["obg_ppg"]], errors='coerce')

    lookup = {}
    for j in range(len(depth_ser)):
        d = _to_float(depth_ser[j])
        v = _to_float(obg_ser[j])
        if d is not None and v is not None and d > 0:
            lookup[int(round(d))] = v
    return lookup


def build_stress_vs_depth(xls: pd.ExcelFile) -> List[Dict]:
    """
    Gabungkan data Shmin/SHmax (dari stress sheet) + PP (dari pore pressure sheet)
    + OBG/Sv (dari OBG sheet) menjadi list titik data untuk grafik.
    """
    result = extract_stress_profile(xls)
    if not result:
        return []

    depth_ser, shmin_ser, shmax_ser = result
    pp_lookup  = extract_pp_lookup(xls)
    obg_lookup = extract_obg_lookup(xls)

    stress_vs_depth = []
    last_pp = last_obg = None

    for i in range(len(depth_ser)):
        depth_val = _to_float(depth_ser[i])
        shmin_val = _to_float(shmin_ser[i])

        if depth_val is None or shmin_val is None:
            continue
        if depth_val <= 0 or abs(shmin_val - NULL_VALUE) < 1:
            continue

        tvd_ft = depth_val * 3.28084
        shmax_val = _to_float(shmax_ser[i]) if i < len(shmax_ser) else None

        # PP lookup dengan forward fill
        pp_ppg = pp_lookup.get(round(depth_val, 2))
        if pp_ppg is not None:
            last_pp = pp_ppg
        else:
            pp_ppg = last_pp

        # OBG lookup dengan forward fill (nearest integer depth)
        obg_ppg = obg_lookup.get(int(round(depth_val)))
        if obg_ppg is not None:
            last_obg = obg_ppg
        else:
            obg_ppg = last_obg

        # Butuh minimal PP dan OBG untuk titik data yang valid
        if pp_ppg is None or obg_ppg is None:
            continue

        shmin_psi = shmin_val * 0.052 * tvd_ft
        shmax_psi = (shmax_val * 0.052 * tvd_ft) if shmax_val else (shmin_psi * 1.15)
        sv_psi    = obg_ppg * 0.052 * tvd_ft
        pp_psi    = pp_ppg  * 0.052 * tvd_ft

        stress_vs_depth.append({
            "tvd_ft":    round(tvd_ft, 2),
            "Shmin_psi": round(shmin_psi, 2),
            "SHmax_psi": round(shmax_psi, 2),
            "Sv_psi":    round(sv_psi, 2),
            "Pp_psi":    round(pp_psi, 2),
        })

    return stress_vs_depth


def extract_pumping_schedule(xls: pd.ExcelFile) -> Optional[Dict]:
    """
    Ekstrak Pumping Schedule dari sheet apapun yang mengandung keyword 'pumping'/'schedule'.
    Mendeteksi kolom (stage, fluid, rate, prop) secara dinamis.
    """
    pump_sheet = find_sheet(xls, SHEET_KEYWORDS["pumping"])
    if not pump_sheet:
        return None

    df_raw = pd.read_excel(xls, sheet_name=pump_sheet, header=None)

    # Coba baca dengan header otomatis pandas dulu
    df_named = pd.read_excel(xls, sheet_name=pump_sheet)
    if len(df_named.columns) >= 4:
        df_raw = pd.read_excel(xls, sheet_name=pump_sheet, header=None)

    header_row = find_header_row(df_raw)
    col_map = map_columns(df_raw, header_row, {
        "stage":    "stage",
        "fluid":    "fluid_bbl",
        "rate":     "rate_bpm",
        "prop_conc":"prop_conc",
        "prop_lb":  "prop_lb",
    })

    df_data = df_raw.iloc[header_row + 1:].reset_index(drop=True)

    stages = []
    total_fluid = 0
    total_prop = 0
    weighted_rate = 0

    for _, row in df_data.iterrows():
        try:
            stage_col  = col_map.get("stage", 0) or 0
            fluid_col  = col_map.get("fluid")
            rate_col   = col_map.get("rate")
            pconc_col  = col_map.get("prop_conc")
            plb_col    = col_map.get("prop_lb")

            stage_name = str(row.iloc[stage_col]).strip()
            if not stage_name or stage_name.lower() in ("nan", "none", "total"):
                continue

            fluid = _to_float(row.iloc[fluid_col]) if fluid_col is not None else 0
            rate  = _to_float(row.iloc[rate_col])  if rate_col  is not None else 0
            pconc = _to_float(row.iloc[pconc_col]) if pconc_col is not None else 0
            plb   = _to_float(row.iloc[plb_col])   if plb_col   is not None else 0

            fluid = fluid or 0
            rate  = rate  or 0
            pconc = pconc or 0
            plb   = plb   or 0

            stages.append({
                "stage": stage_name,
                "fluid_bbl": fluid,
                "rate_bpm": rate,
                "proppant_lb_gal": pconc,
                "proppant_lb": plb,
            })
            total_fluid   += fluid
            total_prop    += plb
            weighted_rate += fluid * rate
        except Exception:
            continue

    if not stages:
        return None

    avg_rate = round(weighted_rate / total_fluid, 1) if total_fluid > 0 else 0
    return {
        "stages": stages,
        "total_fluid_bbl": round(total_fluid, 1),
        "total_proppant_lb": round(total_prop, 1),
        "avg_rate_bpm": avg_rate,
    }


# ===========================================================================
# MAIN ENTRY POINT
# ===========================================================================

def parse_uploaded_file(file_path: str, filename: str) -> Dict[str, Any]:
    """
    Parse JSON, XLSX, atau TXT file ke dalam format dictionary yang dibutuhkan.
    Mendukung format bebas — kolom dan sheet dideteksi secara otomatis.
    """
    ext = filename.lower().split('.')[-1]

    # ── JSON: langsung parse ──────────────────────────────────────────────
    if ext == 'json':
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    # ── XLSX: Universal Parser ────────────────────────────────────────────
    elif ext == 'xlsx':
        try:
            with pd.ExcelFile(file_path) as xls:
                # Muat default data sebagai base (fallback untuk semua field)
                default_path = os.path.join(os.path.dirname(__file__), 'data', 'mem_default.json')
                with open(default_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Hapus data array bawaan (dummy) dari template JSON agar tidak menipu UI.
                # Jika Excel punya datanya, array ini akan diisi ulang di bawah.
                # Jika tidak ada di Excel, maka di UI akan benar-benar kosong.
                data["stress_vs_depth"] = []
                data["pumping_schedule"] = {"stages": [], "total_fluid_bbl": 0, "total_proppant_lb": 0, "avg_rate_bpm": 0}
                data["stress_profile"] = []
                data["dfit_pressure_curve"] = []

                # Set info dasar sumur dari nama file
                data["well"]["name"]   = filename.replace('.xlsx', '').replace('.XLSX', '')
                data["well"]["status"] = "Imported (Log Data)"

                # ── Stress vs Depth (grafik utama) ────────────────────────
                svd = build_stress_vs_depth(xls)
                if svd:
                    data["stress_vs_depth"] = svd

                # ── Pumping Schedule ──────────────────────────────────────
                ps = extract_pumping_schedule(xls)
                if ps:
                    data["pumping_schedule"] = ps

                # ── Standard Template Parsing (WELL, MEM, DFIT, dll) ──────
                # Jika ada sheet bernama persis "WELL", "MEM", dst → baca sebagai key-value
                for key in ["well", "logs", "mem", "dfit", "design", "sensitivity"]:
                    sheet = key.upper()
                    if sheet in xls.sheet_names:
                        df = pd.read_excel(xls, sheet_name=sheet)
                        if "Parameter" in df.columns and "Value" in df.columns:
                            loaded = dict(zip(df["Parameter"], df["Value"]))
                            if key in data and isinstance(data[key], dict):
                                data[key].update(loaded)  # Merge, jangan ganti total
                            else:
                                data[key] = loaded

                # ── Uncertainty ───────────────────────────────────────────
                if "UNCERTAINTY" in xls.sheet_names:
                    df_unc = pd.read_excel(xls, sheet_name="UNCERTAINTY")
                    if all(c in df_unc.columns for c in ["Parameter", "P10", "P50", "P90"]):
                        unc_dict = {}
                        for _, row in df_unc.iterrows():
                            unc_dict[row["Parameter"]] = {
                                "P10": row["P10"],
                                "P50": row["P50"],
                                "P90": row["P90"],
                                "unit": row["unit"] if "unit" in row and pd.notna(row["unit"]) else ""
                            }
                        data["uncertainty"] = unc_dict

                # ── Stress Profile Layers (Upper/Reservoir/Lower Barrier) ─
                if "STRESS_PROFILE" in xls.sheet_names:
                    df_sp = pd.read_excel(xls, sheet_name="STRESS_PROFILE")
                    data["stress_profile"] = df_sp.to_dict('records')

                # ── DFIT Pressure Curve ───────────────────────────────────
                if "DFIT_PRESSURE_CURVE" in xls.sheet_names:
                    df_dfit = pd.read_excel(xls, sheet_name="DFIT_PRESSURE_CURVE")
                    data["dfit_pressure_curve"] = df_dfit.to_dict('records')

                return data

        except HTTPException:
            raise
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=400, detail=f"Failed to parse Excel file: {str(e)}")

    # ── TXT: Format key=value per section ────────────────────────────────
    elif ext == 'txt':
        try:
            data = {}
            current_section = None
            list_headers: List[str] = []

            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            for line in lines:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue

                if line.startswith('[') and line.endswith(']'):
                    current_section = line[1:-1].lower()
                    flat_sections = ["well", "logs", "mem", "dfit", "design", "sensitivity", "uncertainty"]
                    data[current_section] = {} if current_section in flat_sections else []
                    list_headers = []
                    continue

                if current_section in ["well", "logs", "mem", "dfit", "design", "sensitivity"]:
                    if '=' in line:
                        k, v = line.split('=', 1)
                        v = v.strip()
                        str_fields = ["name", "field", "date", "mem_version", "status", "formation"]
                        if current_section != "well" or k.strip() not in str_fields:
                            try:
                                v = float(v)
                            except ValueError:
                                pass
                        data[current_section][k.strip()] = v

                elif current_section == "uncertainty":
                    if '=' in line:
                        k, v_str = line.split('=', 1)
                        parts = [p.strip() for p in v_str.split(',')]
                        if len(parts) >= 3:
                            data["uncertainty"][k.strip()] = {
                                "P10": float(parts[0]),
                                "P50": float(parts[1]),
                                "P90": float(parts[2]),
                                "unit": parts[3] if len(parts) > 3 else ""
                            }
                else:
                    if not list_headers:
                        list_headers = [h.strip() for h in line.split(',')]
                    else:
                        parts = [p.strip() for p in line.split(',')]
                        row = {}
                        for i, h in enumerate(list_headers):
                            if i < len(parts):
                                val = parts[i]
                                try:
                                    val = float(val) if '.' in val else int(val)
                                except ValueError:
                                    pass
                                row[h] = val
                        data[current_section].append(row)

            return data

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse TXT file: {str(e)}")

    raise HTTPException(status_code=400, detail="Unsupported file format. Use .xlsx, .json, or .txt")
