import json
import pandas as pd
from pathlib import Path

# Load default JSON
data_file = Path("backend/data/mem_default.json")
with open(data_file, "r") as f:
    data = json.load(f)

# 1. Create Excel Template
excel_path = Path("Template_HF_Input.xlsx")
with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    # Convert flat dictionaries to simple two-column sheets
    for key in ["well", "logs", "mem", "dfit", "design", "uncertainty", "sensitivity"]:
        if key in data:
            if key == "uncertainty":
                # Special handling for uncertainty which has nested dicts
                rows = []
                for param, vals in data[key].items():
                    rows.append({"Parameter": param, "P10": vals["P10"], "P50": vals["P50"], "P90": vals["P90"], "unit": vals.get("unit", "")})
                df = pd.DataFrame(rows)
                df.to_excel(writer, sheet_name=key.upper(), index=False)
            else:
                df = pd.DataFrame(list(data[key].items()), columns=["Parameter", "Value"])
                df.to_excel(writer, sheet_name=key.upper(), index=False)
    
    # Convert lists of dictionaries to multi-column sheets
    for key in ["pumping_schedule", "stress_profile", "dfit_pressure_curve", "stress_vs_depth"]:
        if key in data:
            df = pd.DataFrame(data[key])
            df.to_excel(writer, sheet_name=key.upper(), index=False)

print(f"Generated {excel_path}")

# 2. Create TXT Template (INI-like format for easy parsing)
txt_path = Path("Template_HF_Input.txt")
with open(txt_path, "w") as f:
    f.write("# HF Design Engine Input Template\n")
    f.write("# Modify the values below, keeping the exact parameter names.\n\n")
    
    for key in ["well", "logs", "mem", "dfit", "design", "sensitivity"]:
        if key in data:
            f.write(f"[{key.upper()}]\n")
            for k, v in data[key].items():
                f.write(f"{k} = {v}\n")
            f.write("\n")
            
    f.write("[UNCERTAINTY]\n")
    for param, vals in data["uncertainty"].items():
        f.write(f"{param} = {vals['P10']}, {vals['P50']}, {vals['P90']}, {vals.get('unit', '')}\n")
    f.write("\n")
    
    for list_key in ["pumping_schedule", "stress_profile", "dfit_pressure_curve", "stress_vs_depth"]:
        f.write(f"[{list_key.upper()}]\n")
        if data[list_key]:
            headers = list(data[list_key][0].keys())
            f.write(",".join(headers) + "\n")
            for item in data[list_key]:
                f.write(",".join(str(item[h]) for h in headers) + "\n")
        f.write("\n")

print(f"Generated {txt_path}")
