import sys
import numpy as np
import pickle
import json
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'aimodels', 'breast_cancer.pkl')

with open(model_path, 'rb') as model_fileL:
    model = pickle.load(model_fileL)

payload = json.loads(sys.argv[3])

feature_aliases = [
    ("mean radius", ["mean radius", "radius_mean"]),
    ("mean texture", ["mean texture", "texture_mean"]),
    ("mean perimeter", ["mean perimeter", "perimeter_mean"]),
    ("mean area", ["mean area", "area_mean"]),
    ("mean smoothness", ["mean smoothness", "smoothness_mean"]),
    ("mean compactness", ["mean compactness", "compactness_mean"]),
    ("mean concavity", ["mean concavity", "concavity_mean"]),
    ("mean concave points", ["mean concave points", "concave_points_mean"]),
    ("mean symmetry", ["mean symmetry", "symmetry_mean"]),
    ("mean fractal dimension", ["mean fractal dimension", "fractal_dimension_mean"]),
    ("radius error", ["radius error", "radius_se"]),
    ("texture error", ["texture error", "texture_se"]),
    ("perimeter error", ["perimeter error", "perimeter_se"]),
    ("area error", ["area error", "area_se"]),
    ("smoothness error", ["smoothness error", "smoothness_se"]),
    ("compactness error", ["compactness error", "compactness_se"]),
    ("concavity error", ["concavity error", "concavity_se"]),
    ("concave points error", ["concave points error", "concave_points_se"]),
    ("symmetry error", ["symmetry error", "symmetry_se"]),
    ("fractal dimension error", ["fractal dimension error", "fractal_dimension_se"]),
    ("worst radius", ["worst radius", "radius_worst"]),
    ("worst texture", ["worst texture", "texture_worst"]),
    ("worst perimeter", ["worst perimeter", "perimeter_worst"]),
    ("worst area", ["worst area", "area_worst"]),
    ("worst smoothness", ["worst smoothness", "smoothness_worst"]),
    ("worst compactness", ["worst compactness", "compactness_worst"]),
    ("worst concavity", ["worst concavity", "concavity_worst"]),
    ("worst concave points", ["worst concave points", "concave_points_worst"]),
    ("worst symmetry", ["worst symmetry", "symmetry_worst"]),
    ("worst fractal dimension", ["worst fractal dimension", "fractal_dimension_worst"]),
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
