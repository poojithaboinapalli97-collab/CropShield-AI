import glob
from pathlib import Path
from predict_crop import CropDiseaseClassifier

classifier = CropDiseaseClassifier()
test_root = Path(r"D:\CropShield-AI\datasets\crop_classification\test")
folders = [
    "Corn_(maize)___Common_rust_",
    "Grape___Black_rot",
    "Potato___Early_blight",
    "Pepper,_bell___Bacterial_spot",
    "Apple___Apple_scab",
    "Peach___Bacterial_spot",
    "Strawberry___Leaf_scorch"
]

print("=" * 70)
print("CropShield AI: Multi-Crop Test Verification")
print("=" * 70)

for folder in folders:
    target_dir = test_root / folder
    images = list(target_dir.glob("*.jpg")) + list(target_dir.glob("*.JPG")) + list(target_dir.glob("*.png"))
    if images:
        img_path = str(images[0])
        res = classifier.predict_image(img_path, top_k=1)
        print(f"Ground Truth : {folder}")
        print(f"Predicted    : {res['full_diagnosis']} ({res['confidence_pct']}%)")
        print(f"Crop / Label : {res['crop']} | Condition: {res['disease']}")
        print("-" * 70)
