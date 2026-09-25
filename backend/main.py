"""
CropShield AI Backend - Production Flask Entry Adapter
Delegates to backend.app for Flask + Gunicorn compatibility.
"""
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

from backend.app import app, model, MODEL_PATH, predict, health_check

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[CropShield AI] Starting Flask ML server on {host}:{port}...")
    app.run(host=host, port=port, debug=False)
