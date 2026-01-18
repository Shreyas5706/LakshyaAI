import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

def load_bundle(filename):
    path = os.path.join(ARTIFACTS_DIR, filename)
    return joblib.load(path)
