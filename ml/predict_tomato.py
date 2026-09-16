from ultralytics import YOLO

MODEL_PATH = r"D:\CropShield-AI\ml\runs\tomato_disease_classifier\weights\best.pt"

model = YOLO(MODEL_PATH)

image_path = input("Enter the full path of the tomato leaf image: ").strip()

results = model.predict(
    source=image_path,
    device="cpu"
)

result = results[0]

class_id = result.probs.top1
confidence = result.probs.top1conf.item()
class_name = result.names[class_id]

print("\n========== CropShield AI ==========")
print(f"Disease   : {class_name}")
print(f"Confidence: {confidence * 100:.2f}%")
print("===================================")