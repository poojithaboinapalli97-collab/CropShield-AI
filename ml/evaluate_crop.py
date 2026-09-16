import os
import sys
import json
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path
from PIL import Image
from sklearn.metrics import (
    accuracy_score,
    top_k_accuracy_score,
    precision_recall_fscore_support,
    classification_report,
    confusion_matrix
)
from ultralytics import YOLO

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

TEST_DIR = Path(r"D:\CropShield-AI\datasets\crop_classification\test")
MODEL_PATH = Path(r"D:\CropShield-AI\ml\runs\crop_disease_classifier\weights\best.pt")
OUTPUT_DIR = Path(r"D:\CropShield-AI\ml\runs\crop_disease_classifier")

def evaluate_model():
    print("=" * 70)
    print("🔬 CropShield AI: Multi-Crop Model Comprehensive Evaluation")
    print(f"Model Path: {MODEL_PATH}")
    print(f"Test Set:   {TEST_DIR}")
    print("=" * 70)

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file {MODEL_PATH} not found!")

    if not TEST_DIR.exists():
        raise FileNotFoundError(f"Test dataset directory {TEST_DIR} not found!")

    model = YOLO(str(MODEL_PATH))
    class_names = model.names
    num_classes = len(class_names)
    print(f"Model loaded with {num_classes} classes.")

    # Invert class_names to map string name to index
    name_to_idx = {v: k for k, v in class_names.items()}

    y_true = []
    y_pred = []
    y_scores = []
    sample_paths = []

    print("\n[INFO] Running inference on unseen test set...")
    class_folders = sorted([d for d in TEST_DIR.iterdir() if d.is_dir()])
    
    total_processed = 0
    for folder in class_folders:
        folder_name = folder.name
        if folder_name not in name_to_idx:
            print(f"Warning: Unknown test class folder {folder_name}")
            continue

        true_label_idx = name_to_idx[folder_name]
        image_files = [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in {".jpg", ".jpeg", ".png"}]

        for img_path in image_files:
            results = model.predict(source=str(img_path), imgsz=224, device="cpu", verbose=False)
            res = results[0]

            if res.probs is not None:
                probs = res.probs.data.cpu().numpy()
                pred_label_idx = int(res.probs.top1)
                
                y_true.append(true_label_idx)
                y_pred.append(pred_label_idx)
                y_scores.append(probs)
                sample_paths.append(str(img_path))
                total_processed += 1

    print(f"[SUCCESS] Processed {total_processed} test images.")

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    y_scores = np.array(y_scores)

    # Compute Metrics
    acc = accuracy_score(y_true, y_pred)
    
    # Top-5 accuracy
    if y_scores.shape[1] >= 5:
        top5_acc = top_k_accuracy_score(y_true, y_scores, k=5, labels=np.arange(num_classes))
    else:
        top5_acc = acc

    prec_macro, rec_macro, f1_macro, _ = precision_recall_fscore_support(y_true, y_pred, average="macro", zero_division=0)
    prec_weighted, rec_weighted, f1_weighted, _ = precision_recall_fscore_support(y_true, y_pred, average="weighted", zero_division=0)

    target_names = [class_names[i] for i in range(num_classes)]
    cls_report = classification_report(y_true, y_pred, target_names=target_names, zero_division=0, output_dict=True)

    print("\n" + "=" * 70)
    print("📊 OVERALL EVALUATION METRICS ON UNSEEN TEST SET")
    print("=" * 70)
    print(f"Top-1 Accuracy:       {acc * 100:.2f}%")
    print(f"Top-5 Accuracy:       {top5_acc * 100:.2f}%")
    print(f"Precision (Macro):    {prec_macro * 100:.2f}%")
    print(f"Recall (Macro):       {rec_macro * 100:.2f}%")
    print(f"F1-Score (Macro):     {f1_macro * 100:.2f}%")
    print(f"Precision (Weighted): {prec_weighted * 100:.2f}%")
    print(f"Recall (Weighted):    {rec_weighted * 100:.2f}%")
    print(f"F1-Score (Weighted):  {f1_weighted * 100:.2f}%")
    print("=" * 70)

    # Print Per-Class Summary Table
    print("\n📋 PER-CLASS CLASSIFICATION METRICS:")
    print(f"{'Class Name':<50} | {'Prec':<7} | {'Recall':<7} | {'F1-Score':<8} | {'Support':<7}")
    print("-" * 85)
    for c_idx, c_name in enumerate(target_names):
        if c_name in cls_report:
            item = cls_report[c_name]
            p = item["precision"] * 100
            r = item["recall"] * 100
            f = item["f1-score"] * 100
            s = int(item["support"])
            print(f"{c_name:<50} | {p:>6.2f}% | {r:>6.2f}% | {f:>7.2f}% | {s:>7}")

    # Compute and Plot Confusion Matrix
    cm = confusion_matrix(y_true, y_pred, labels=np.arange(num_classes))
    
    plt.figure(figsize=(20, 18))
    plt.imshow(cm, interpolation="nearest", cmap=plt.cm.Greens)
    plt.title("CropShield AI: Multi-Crop Disease Classification Confusion Matrix", fontsize=16, pad=20)
    plt.colorbar()
    
    tick_marks = np.arange(num_classes)
    clean_labels = [name.replace("___", " - ").replace("_", " ") for name in target_names]
    plt.xticks(tick_marks, clean_labels, rotation=90, fontsize=8)
    plt.yticks(tick_marks, clean_labels, fontsize=8)
    plt.xlabel("Predicted Label", fontsize=12, labelpad=10)
    plt.ylabel("Ground Truth Label", fontsize=12, labelpad=10)

    # Annotate numbers in confusion matrix if size is readable
    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            val = cm[i, j]
            if val > 0:
                plt.text(j, i, format(val, "d"),
                         ha="center", va="center",
                         color="white" if val > thresh else "black",
                         fontsize=6)

    plt.tight_layout()
    cm_output_path = OUTPUT_DIR / "confusion_matrix_eval.png"
    plt.savefig(cm_output_path, dpi=300)
    plt.close()
    print(f"\n[SAVED] Confusion matrix visualization saved to: {cm_output_path}")

    # Save summary metrics JSON
    metrics_summary = {
        "top1_accuracy": round(float(acc) * 100, 2),
        "top5_accuracy": round(float(top5_acc) * 100, 2),
        "precision_macro": round(float(prec_macro) * 100, 2),
        "recall_macro": round(float(rec_macro) * 100, 2),
        "f1_macro": round(float(f1_macro) * 100, 2),
        "precision_weighted": round(float(prec_weighted) * 100, 2),
        "recall_weighted": round(float(rec_weighted) * 100, 2),
        "f1_weighted": round(float(f1_weighted) * 100, 2),
        "total_test_samples": total_processed,
        "num_classes": num_classes,
        "classes": target_names,
        "per_class_report": cls_report
    }

    metrics_json_path = OUTPUT_DIR / "evaluation_metrics.json"
    with open(metrics_json_path, "w", encoding="utf-8") as f:
        json.dump(metrics_summary, f, indent=2)
    print(f"[SAVED] Metrics JSON report saved to: {metrics_json_path}")

    return metrics_summary

if __name__ == "__main__":
    evaluate_model()
