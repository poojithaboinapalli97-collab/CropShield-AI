import requests
import glob

url = "http://127.0.0.1:8001/predict"
sample_img = glob.glob("datasets/crop_classification/test/*/*.jpg")[0]

print("Testing with Cotton crop context:")
with open(sample_img, "rb") as f:
    files = {"file": ("cotton_leaf.jpg", f, "image/jpeg")}
    data = {"crop": "Cotton"}
    r = requests.post(url, files=files, data=data)
    print("Status:", r.status_code)
    print("Response:", r.json())

print("\nTesting with Corn sample (auto vision detection):")
corn_img = glob.glob("datasets/crop_classification/test/Corn*/*.jpg")[0]
with open(corn_img, "rb") as f:
    files = {"file": ("leaf.jpg", f, "image/jpeg")}
    data = {}
    r = requests.post(url, files=files, data=data)
    print("Status:", r.status_code)
    print("Response:", r.json())
