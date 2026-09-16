import os
from pathlib import Path

pv_raw = Path(r"D:\CropShield-AI\datasets\PlantVillage\PlantVillage-Dataset-master\raw\color")
print("=== PlantVillage Raw Color Classes ===")
total_imgs = 0
classes_by_crop = {}

for folder in sorted(pv_raw.iterdir()):
    if folder.is_dir():
        imgs = [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in {".jpg", ".jpeg", ".png"}]
        count = len(imgs)
        total_imgs += count
        crop_prefix = folder.name.split("___")[0]
        classes_by_crop.setdefault(crop_prefix, []).append((folder.name, count))
        print(f"{folder.name}: {count}")

print(f"\nTotal Classes in PlantVillage: {sum(len(v) for v in classes_by_crop.values())}")
print(f"Total Images in PlantVillage: {total_imgs}")
print("\n=== Crops Summary ===")
for crop, cls_list in sorted(classes_by_crop.items()):
    crop_total = sum(c for _, c in cls_list)
    print(f"Crop: {crop} | Classes: {len(cls_list)} | Total images: {crop_total}")
