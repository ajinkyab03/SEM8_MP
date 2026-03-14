"""
Test all prediction API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:5000/api/v1"

print("Testing all prediction APIs...\n")

# Test Diabetes
print("1. Testing Diabetes API...")
try:
    response = requests.post(
        f"{BASE_URL}/diabetes",
        json={
            "data": {
                "Number of Pregnancies eg. 0": 2,
                "Glucose (mg/dL) eg. 80": 150,
                "Blood Pressure (mmHg) eg. 80": 70,
                "Skin Thickness (mm) eg. 20": 30,
                "Insulin Level (IU/mL) eg. 80": 100,
                "Body Mass Index (kg/m²) eg. 23.1": 30,
                "Diabetes Pedigree Function eg. 0.52": 0.6,
                "Age (years) eg. 34": 50
            }
        }
    )
    if response.status_code == 200:
        print(f"   [OK] Response: {response.json()}")
    else:
        print(f"   [FAIL] Status: {response.status_code}")
except Exception as e:
    print(f"   [ERROR] {e}")
print()

# Test Heart (needs actual parameters)
print("2. Testing Heart API...")
try:
    response = requests.post(
        f"{BASE_URL}/heart",
        json={
            "data": {
                "age": 63,
                "sex": 1,
                "cp": 3,
                "trestbps": 145,
                "chol": 233,
                "fbs": 1,
                "restecg": 0,
                "thalach": 150,
                "exang": 0,
                "oldpeak": 2.3,
                "slope": 0,
                "ca": 0,
                "thal": 1
            }
        }
    )
    if response.status_code == 200:
        print(f"   [OK] Response: {response.json()}")
    else:
        print(f"   [FAIL] Status: {response.status_code}")
except Exception as e:
    print(f"   [ERROR] {e}")
print()

# Test Kidney
print("3. Testing Kidney API...")
try:
    response = requests.post(
        f"{BASE_URL}/kidney",
        json={
            "data": {
                "age": 48,
                "bp": 80,
                "sg": 1.02,
                "al": 1,
                "su": 0,
                "rbc": 1,
                "pc": 0,
                "pcc": 0,
                "ba": 0,
                "bgr": 121,
                "bu": 36,
                "sc": 1.2,
                "sod": 142,
                "pot": 4.5,
                "hemo": 15.4,
                "pcv": 44,
                "wc": 7800,
                "rc": 5.2,
                "htn": 1,
                "dm": 0,
                "cad": 0,
                "appet": 1,
                "pe": 0,
                "ane": 0
            }
        }
    )
    if response.status_code == 200:
        print(f"   [OK] Response: {response.json()}")
    else:
        print(f"   [FAIL] Status: {response.status_code}")
except Exception as e:
    print(f"   [ERROR] {e}")
print()

# Test Liver
print("4. Testing Liver API...")
try:
    response = requests.post(
        f"{BASE_URL}/liver",
        json={
            "data": {
                "Age": 65,
                "Gender": 1,
                "Total_Bilirubin": 0.7,
                "Direct_Bilirubin": 0.1,
                "Alkaline_Phosphotase": 187,
                "Alamine_Aminotransferase": 16,
                "Aspartate_Aminotransferase": 18,
                "Total_Proteins": 6.8,
                "Albumin": 3.3,
                "Albumin_and_Globulin_Ratio": 0.9
            }
        }
    )
    if response.status_code == 200:
        print(f"   [OK] Response: {response.json()}")
    else:
        print(f"   [FAIL] Status: {response.status_code}")
except Exception as e:
    print(f"   [ERROR] {e}")
print()

# Test Breast Cancer
print("5. Testing Breast Cancer API...")
try:
    response = requests.post(
        f"{BASE_URL}/breast-cancer",
        json={
            "data": {
                "mean radius": 17.99,
                "mean texture": 10.38,
                "mean perimeter": 122.8,
                "mean area": 1001,
                "mean smoothness": 0.1184,
                "mean compactness": 0.2776,
                "mean concavity": 0.3001,
                "mean concave points": 0.1471,
                "mean symmetry": 0.2419,
                "mean fractal dimension": 0.07871,
                "radius error": 1.095,
                "texture error": 0.9053,
                "perimeter error": 8.589,
                "area error": 153.4,
                "smoothness error": 0.006399,
                "compactness error": 0.04904,
                "concavity error": 0.05373,
                "concave points error": 0.01587,
                "symmetry error": 0.03003,
                "fractal dimension error": 0.006193,
                "worst radius": 25.38,
                "worst texture": 17.33,
                "worst perimeter": 184.6,
                "worst area": 2019,
                "worst smoothness": 0.1622,
                "worst compactness": 0.6656,
                "worst concavity": 0.7119,
                "worst concave points": 0.2654,
                "worst symmetry": 0.4601,
                "worst fractal dimension": 0.1189
            }
        }
    )
    if response.status_code == 200:
        print(f"   [OK] Response: {response.json()}")
    else:
        print(f"   [FAIL] Status: {response.status_code}")
except Exception as e:
    print(f"   [ERROR] {e}")
print()

print("API testing complete!")

