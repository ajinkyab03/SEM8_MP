"""
Train a new diabetes model compatible with Python 3.12 and scikit-learn 1.7.2
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# Download the diabetes dataset
diabetes_url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.csv"
column_names = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']

print("Downloading diabetes dataset...")
try:
    df = pd.read_csv(diabetes_url, names=column_names)
    print(f"Dataset downloaded successfully. Shape: {df.shape}")
except Exception as e:
    print(f"Error downloading dataset: {e}")
    print("Please download the dataset manually from:", diabetes_url)
    exit(1)

# Prepare the data
X = df.drop('Outcome', axis=1)
y = df['Outcome']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("Training Random Forest Classifier...")
# Train the model - convert to numpy arrays to avoid feature name warnings
model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train.values, y_train.values)

# Make predictions
y_pred = model.predict(X_test.values)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save the model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'aimodels', 'diabetes.pkl')

with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"\nModel saved to: {model_path}")
print("Diabetes model training completed successfully!")

