import sys
import numpy as np
import os
from tensorflow.keras.models import load_model
from PIL import Image


def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((36, 36))

    img_array = np.asarray(img)
    img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def load_malaria_model():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "aimodels", "malaria.h5")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}")

    model = load_model(model_path)
    return model


def predict_malaria(image_path):

    model = load_malaria_model()

    img_array = preprocess_image(image_path)

    prediction = model.predict(img_array)[0]

    # Handle both types of model outputs
    if len(prediction) == 1:
        prob = prediction[0]

        if prob > 0.5:
            result = "Infected"
        else:
            result = "Not Infected"

    else:
        infected_prob = prediction[0]
        uninfected_prob = prediction[1]

        if infected_prob > uninfected_prob:
            result = "Infected"
        else:
            result = "Not Infected"

    return result, prediction


if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("Usage: python malaria.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        result, prediction = predict_malaria(image_path)

        print("Prediction:", prediction.tolist())
        print("Result:", result)

    except Exception as e:
        print("Error:", str(e))
        sys.exit(1)