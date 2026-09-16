import os
import random
import shutil
from pathlib import Path

import sys
# Set utf-8 stdout if needed
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

SOURCE = Path(r"D:\CropShield-AI\datasets\PlantVillage\PlantVillage-Dataset-master\raw\color")
DEST = Path(r"D:\CropShield-AI\datasets\crop_classification")

TRAIN_RATIO = 0.70
VAL_RATIO = 0.20
TEST_RATIO = 0.10
MAX_PER_CLASS = 250  # Balanced subset cap for fast, high-quality transfer learning

random.seed(42)

def prepare_dataset():
    print("=" * 60)
    print("CropShield AI: Multi-Crop Dataset Preparation")
    print(f"Source: {SOURCE}")
    print(f"Destination: {DEST}")
    print("=" * 60)

    if not SOURCE.exists():
        raise FileNotFoundError(f"Source path {SOURCE} does not exist!")

    # Clean destination if exists
    if DEST.exists():
        print("Cleaning previous dataset directory...")
        shutil.rmtree(DEST)

    all_class_dirs = sorted([d for d in SOURCE.iterdir() if d.is_dir()])
    print(f"Found {len(all_class_dirs)} class directories in source.")

    total_train, total_val, total_test = 0, 0, 0
    class_stats = []

    for class_dir in all_class_dirs:
        class_name = class_dir.name
        images = [
            f for f in class_dir.iterdir()
            if f.is_file() and f.suffix.lower() in {".jpg", ".jpeg", ".png"}
        ]

        if not images:
            print(f"Warning: No valid images found in {class_name}")
            continue

        random.shuffle(images)

        # Cap max images per class to prevent heavy class imbalance while ensuring fast transfer learning
        if MAX_PER_CLASS and len(images) > MAX_PER_CLASS:
            images = images[:MAX_PER_CLASS]

        n = len(images)
        train_end = int(n * TRAIN_RATIO)
        val_end = train_end + int(n * VAL_RATIO)

        splits = {
            "train": images[:train_end],
            "val": images[train_end:val_end],
            "test": images[val_end:]
        }

        for split_name, split_files in splits.items():
            out_dir = DEST / split_name / class_name
            out_dir.mkdir(parents=True, exist_ok=True)
            for img in split_files:
                shutil.copy2(img, out_dir / img.name)

        n_train = len(splits["train"])
        n_val = len(splits["val"])
        n_test = len(splits["test"])

        total_train += n_train
        total_val += n_val
        total_test += n_test

        class_stats.append((class_name, n_train, n_val, n_test, n))
        print(f"[OK] {class_name:<48} | Train: {n_train:>3} | Val: {n_val:>2} | Test: {n_test:>2} | Total: {n:>3}")

    print("=" * 60)
    print("Dataset preparation complete!")
    print(f"Total Classes: {len(class_stats)}")
    print(f"Total Train  : {total_train} images")
    print(f"Total Val    : {total_val} images")
    print(f"Total Test   : {total_test} images")
    print(f"Grand Total  : {total_train + total_val + total_test} images")
    print("=" * 60)

if __name__ == "__main__":
    prepare_dataset()
