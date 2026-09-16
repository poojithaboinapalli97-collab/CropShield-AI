import os
import sys
import argparse
from pathlib import Path
from PIL import Image
from ultralytics import YOLO

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

MODEL_PATH = r"D:\CropShield-AI\ml\runs\crop_disease_classifier\weights\best.pt"
BACKEND_MODEL_PATH = r"D:\CropShield-AI\backend\models\best.pt"

class CropDiseaseClassifier:
    def __init__(self, model_path: str = None):
        if model_path is None:
            if os.path.exists(MODEL_PATH):
                model_path = MODEL_PATH
            elif os.path.exists(BACKEND_MODEL_PATH):
                model_path = BACKEND_MODEL_PATH
            else:
                raise FileNotFoundError(f"Trained model not found at {MODEL_PATH} or {BACKEND_MODEL_PATH}")

        self.model_path = model_path
        self.model = YOLO(self.model_path)
        self.classes = self.model.names

    @staticmethod
    def format_name(raw_name: str) -> tuple[str, str, str]:
        """
        Extracts clean crop, disease, and combined name from raw label (e.g. 'Corn_(maize)___Common_rust_')
        """
        if "___" in raw_name:
            crop_part, disease_part = raw_name.split("___", 1)
        else:
            crop_part, disease_part = "General", raw_name

        # Clean crop name
        crop = crop_part.replace("_", " ").replace("(", " (").replace(")", ")").strip()
        if "Corn" in crop or "maize" in crop.lower():
            crop = "Corn / Maize"
        elif "Pepper" in crop or "bell" in crop.lower():
            crop = "Chilli / Bell Pepper"
        elif "Cherry" in crop:
            crop = "Cherry"
        elif "Orange" in crop:
            crop = "Citrus / Orange"

        # Clean disease name
        disease = disease_part.replace("_", " ").strip()
        disease_words = disease.split()
        disease = " ".join(w.capitalize() if not w.isupper() else w for w in disease_words)
        if disease.lower() == "healthy":
            disease = "Healthy Plant Foliage"

        combined = f"{crop} - {disease}"
        return crop, disease, combined

    def predict_image(self, image_path: str, top_k: int = 5) -> dict:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at: {image_path}")

        results = self.model.predict(
            source=image_path,
            imgsz=224,
            device="cpu",
            verbose=False
        )

        res = results[0]
        if res.probs is None:
            raise RuntimeError("Model did not return classification probabilities.")

        top1_idx = int(res.probs.top1)
        top1_conf = float(res.probs.top1conf.item())
        raw_name = self.classes[top1_idx]
        crop, disease, formatted_name = self.format_name(raw_name)

        # Get top-k predictions
        probs_data = res.probs.data.cpu().numpy()
        top_indices = probs_data.argsort()[::-1][:top_k]

        top_k_list = []
        for idx in top_indices:
            idx = int(idx)
            c, d, f_name = self.format_name(self.classes[idx])
            top_k_list.append({
                "class_id": idx,
                "raw_name": self.classes[idx],
                "crop": c,
                "disease": d,
                "formatted_name": f_name,
                "confidence_pct": round(float(probs_data[idx]) * 100, 2)
            })

        return {
            "success": True,
            "image_path": str(image_path),
            "raw_class": raw_name,
            "crop": crop,
            "disease": disease,
            "full_diagnosis": formatted_name,
            "confidence_pct": round(top1_conf * 100, 2),
            "top_predictions": top_k_list
        }

def main():
    parser = argparse.ArgumentParser(description="CropShield AI: Multi-Crop Disease Classifier CLI")
    parser.add_argument("--image", "-i", type=str, help="Path to input image")
    parser.add_argument("--test-sample", action="store_true", help="Test with a sample from test dataset")
    args = parser.parse_args()

    classifier = CropDiseaseClassifier()
    print("=" * 60)
    print("🌾 CropShield AI: Crop Leaf Disease Prediction Service")
    print(f"Loaded Model: {classifier.model_path}")
    print(f"Supported Classes: {len(classifier.classes)}")
    print("=" * 60)

    target_img = None
    if args.test_sample:
        test_dir = Path(r"D:\CropShield-AI\datasets\crop_classification\test")
        sample_images = list(test_dir.glob("*/*.jpg")) + list(test_dir.glob("*/*.JPG"))
        if sample_images:
            import random
            target_img = str(random.choice(sample_images))
            print(f"[TEST MODE] Selected random sample: {target_img}")
        else:
            print("No test sample found in test dataset.")
            return
    elif args.image:
        target_img = args.image
    else:
        target_img = input("\nEnter crop leaf image path: ").strip().strip('"').strip("'")

    if not target_img:
        print("No image provided. Exiting.")
        return

    result = classifier.predict_image(target_img)

    print("\n" + "=" * 60)
    print("🌿 DIAGNOSIS REPORT")
    print("=" * 60)
    print(f"Crop Identified : {result['crop']}")
    print(f"Condition/Disease: {result['disease']}")
    print(f"Confidence Score: {result['confidence_pct']}%")
    print(f"Full Label      : {result['full_diagnosis']}")
    print("-" * 60)
    print("Top Alternative Probabilities:")
    for rank, p in enumerate(result["top_predictions"], 1):
        print(f" {rank}. {p['formatted_name']:<42} -> {p['confidence_pct']:>6.2f}%")
    print("=" * 60)

if __name__ == "__main__":
    main()
