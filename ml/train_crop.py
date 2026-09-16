import os
import sys
import shutil
from pathlib import Path
from ultralytics import YOLO

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

DATA_DIR = r"D:\CropShield-AI\datasets\crop_classification"
BASE_MODEL = r"D:\CropShield-AI\ml\yolo11n-cls.pt"
PROJECT_RUNS = r"D:\CropShield-AI\ml\runs"
RUN_NAME = "crop_disease_classifier"

def train():
    print("=" * 60)
    print("CropShield AI: Training Multi-Crop Classification Model")
    print(f"Data Dir:    {DATA_DIR}")
    print(f"Base Model:  {BASE_MODEL}")
    print(f"Output Run:  {os.path.join(PROJECT_RUNS, RUN_NAME)}")
    print("=" * 60)

    if not os.path.exists(BASE_MODEL):
        print(f"Base model {BASE_MODEL} not found locally, will download yolo11n-cls.pt automatically...")
        model_name = "yolo11n-cls.pt"
    else:
        model_name = BASE_MODEL

    model = YOLO(model_name)

    # Train model using transfer learning
    results = model.train(
        data=DATA_DIR,
        epochs=8,
        imgsz=224,
        batch=32,
        workers=2,
        project=PROJECT_RUNS,
        name=RUN_NAME,
        exist_ok=True,
        device="cpu",
        optimizer="AdamW",
        lr0=0.001,
        patience=4,
        verbose=True
    )

    best_weights_src = Path(PROJECT_RUNS) / RUN_NAME / "weights" / "best.pt"
    backend_model_dest = Path(r"D:\CropShield-AI\backend\models\best.pt")

    if best_weights_src.exists():
        print("=" * 60)
        print(f"[SUCCESS] Best model weights saved at: {best_weights_src}")
        backend_model_dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(best_weights_src, backend_model_dest)
        print(f"[SUCCESS] Copied best model to FastAPI backend: {backend_model_dest}")
        print("=" * 60)
    else:
        print(f"[WARNING] Could not find best.pt at {best_weights_src}")

if __name__ == "__main__":
    train()
