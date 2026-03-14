"""
Test all ML models for compatibility issues
"""
import pickle
import os

script_dir = os.path.dirname(os.path.abspath(__file__))

models_to_test = [
    'heart.pkl',
    'kidney.pkl',
    'liver.pkl',
    'breast_cancer.pkl',
    'svc.pkl'  # Symptoms model
]

print("Testing all ML models for compatibility...\n")

for model_name in models_to_test:
    model_path = os.path.join(script_dir, 'aimodels', model_name)
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print(f"[OK] {model_name}: Loaded successfully")
        print(f"     Type: {type(model)}")
    except Exception as e:
        print(f"[FAIL] {model_name}: Error loading")
        print(f"       Error: {str(e)}")
        print(f"       Error type: {type(e).__name__}")
    print()

print("Testing complete!")

