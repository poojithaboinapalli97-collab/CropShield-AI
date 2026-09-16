import random
import shutil
from pathlib import Path

SOURCE = Path(r"D:\CropShield-AI\datasets\PlantVillage\PlantVillage-Dataset-master\raw\color")
DEST = Path(r"D:\CropShield-AI\datasets\tomato_classification")

TRAIN_RATIO = 0.70
VAL_RATIO = 0.20
TEST_RATIO = 0.10

random.seed(42)

tomato_classes = sorted(
    folder for folder in SOURCE.iterdir()
    if folder.is_dir() and folder.name.startswith("Tomato___")
)

if not tomato_classes:
    raise RuntimeError("No Tomato classes found.")

for class_dir in tomato_classes:
    images = [
        f for f in class_dir.iterdir()
        if f.is_file() and f.suffix.lower() in {".jpg", ".jpeg", ".png", ".JPG".lower()}
    ]

    random.shuffle(images)

    n = len(images)
    train_end = int(n * TRAIN_RATIO)
    val_end = train_end + int(n * VAL_RATIO)

    splits = {
        "train": images[:train_end],
        "val": images[train_end:val_end],
        "test": images[val_end:]
    }

    class_name = class_dir.name

    for split, split_images in splits.items():
        output_dir = DEST / split / class_name
        output_dir.mkdir(parents=True, exist_ok=True)

        for image in split_images:
            shutil.copy2(image, output_dir / image.name)

    print(
        f"{class_name}: "
        f"{len(splits['train'])} train, "
        f"{len(splits['val'])} val, "
        f"{len(splits['test'])} test"
    )

print("\nDataset preparation completed!")