import sys
import numpy as np
import pickle
import json
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'aimodels', 'liver.pkl')

with open(model_path, 'rb') as model_fileL:
    model = pickle.load(model_fileL)

payload = json.loads(sys.argv[3])

feature_aliases = [
    ("age", ["age", "Age"]),
    ("gender", ["Gender", "gender", "Gender(Male: 1, Female: 0)"]),
    ("total_bilirubin", ["Total_Bilirubin", "Total Bilirubin"]),
    ("direct_bilirubin", ["Direct_Bilirubin", "Direct Bilirubin"]),
    ("alkaline_phosphotase", ["Alkaline_Phosphotase", "Alkaline Phosphotase"]),
    ("alamine_aminotransferase", ["Alamine_Aminotransferase", "Alamine Aminotransferase"]),
    ("aspartate_aminotransferase", ["Aspartate_Aminotransferase", "Aspartate Aminotransferase"]),
    ("total_proteins", ["Total_Proteins", "Total Protiens", "Total Proteins"]),
    ("albumin", ["Albumin", "albumin"]),
    ("albumin_globulin_ratio", ["Albumin_and_Globulin_Ratio", "Albumin and Globulin Ratio"]),
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
