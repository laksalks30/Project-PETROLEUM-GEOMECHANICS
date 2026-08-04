import json
import pandas as pd
from typing import Dict, Any
from fastapi import HTTPException

def parse_uploaded_file(file_path: str, filename: str) -> Dict[str, Any]:
    """Parse JSON, XLSX, or TXT file into the required dictionary format."""
    ext = filename.lower().split('.')[-1]
    
    if ext == 'json':
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
            
    elif ext == 'xlsx':
        try:
            with pd.ExcelFile(file_path) as xls:
                data = {}
                # Flat dicts
                for key in ["well", "logs", "mem", "dfit", "design", "sensitivity"]:
                    sheet = key.upper()
                    if sheet in xls.sheet_names:
                        df = pd.read_excel(xls, sheet_name=sheet)
                        data[key] = dict(zip(df["Parameter"], df["Value"]))
                        
                # Special uncertainty handling
                if "UNCERTAINTY" in xls.sheet_names:
                    df = pd.read_excel(xls, sheet_name="UNCERTAINTY")
                    unc_dict = {}
                    for _, row in df.iterrows():
                        unc_dict[row["Parameter"]] = {
                            "P10": row["P10"],
                            "P50": row["P50"],
                            "P90": row["P90"],
                            "unit": row["unit"] if pd.notna(row["unit"]) else ""
                        }
                    data["uncertainty"] = unc_dict
                    
                # List of dicts
                for key in ["pumping_schedule", "stress_profile", "dfit_pressure_curve", "stress_vs_depth"]:
                    sheet = key.upper()
                    if sheet in xls.sheet_names:
                        df = pd.read_excel(xls, sheet_name=sheet)
                        data[key] = df.to_dict('records')
                
                return data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse Excel file: {str(e)}")

    elif ext == 'txt':
        try:
            data = {}
            current_section = None
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            list_headers = []
            
            for line in lines:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                    
                if line.startswith('[') and line.endswith(']'):
                    current_section = line[1:-1].lower()
                    if current_section not in ["well", "logs", "mem", "dfit", "design", "sensitivity", "uncertainty"]:
                        data[current_section] = []
                        list_headers = [] # Reset headers for list section
                    else:
                        data[current_section] = {}
                    continue
                    
                if current_section in ["well", "logs", "mem", "dfit", "design", "sensitivity"]:
                    if '=' in line:
                        k, v = line.split('=', 1)
                        # Try to cast to float if possible
                        v = v.strip()
                        if current_section == "well" and k.strip() in ["name", "field", "date", "mem_version", "status", "formation"]:
                            pass # Keep as string
                        else:
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
                    # List of dicts
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
            
    raise HTTPException(status_code=400, detail="Unsupported file format.")
