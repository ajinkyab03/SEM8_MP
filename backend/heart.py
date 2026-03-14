import sys
import numpy as np
import pickle
import json
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'aimodels', 'heart.pkl')

with open(model_path, 'rb') as model_fileL:
    model = pickle.load(model_fileL)

data = list(json.loads(sys.argv[3]).values())
data_array = np.array(data).reshape(1, -1)
prediction = model.predict(data_array)
values = np.asarray(data)
model.predict(values.reshape(1, -1))[0]
print(json.dumps(prediction.tolist()))