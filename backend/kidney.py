import sys
import numpy as np
import pickle
import json
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'aimodels', 'kidney.pkl')

with open(model_path, 'rb') as model_fileL:
    model = pickle.load(model_fileL)

payload = json.loads(sys.argv[3])

# Canonical feature order for the kidney model.
feature_aliases = [
    ("age", ["age", "Age"]),
    ("bp", ["bp", "BP"]),
    ("sg", ["sg", "SG"]),
    ("al", ["al", "AL"]),
    ("su", ["su", "SU"]),
    ("rbc", ["rbc", "RBC"]),
    ("pc", ["pc", "PC"]),
    ("pcc", ["pcc", "PCC"]),
    ("ba", ["ba", "BA"]),
    ("bgr", ["bgr", "BGR"]),
    ("bu", ["bu", "BU"]),
    ("sc", ["sc", "SC"]),
    ("sod", ["sod", "SOD"]),
    ("pot", ["pot", "POT"]),
    ("hemo", ["hemo", "HEMO"]),
    ("pcv", ["pcv", "PCV"]),
    ("wc", ["wc", "WC"]),
    ("rc", ["rc", "RC"]),
    ("htn", ["htn", "HTN"]),
    ("dm", ["dm", "DM"]),
    ("cad", ["cad", "CAD"]),
    ("appet", ["appet", "APPET"]),
    ("pe", ["pe", "PE"]),
    ("ane", ["ane", "ANE"]),
]

def to_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0

values = []
for _, aliases in feature_aliases:
    resolved = None
    for key in aliases:
        if key in payload:
            resolved = payload[key]
            break
    values.append(to_float(resolved))

expected_features = getattr(model, "n_features_in_", len(values))
if len(values) < expected_features:
    values.extend([0.0] * (expected_features - len(values)))
elif len(values) > expected_features:
    values = values[:expected_features]

data_array = np.array(values, dtype=float).reshape(1, -1)
prediction = model.predict(data_array)
print(json.dumps(prediction.tolist()))
