import os
import sys

# Ensure backend directory is in Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)
sys.path.insert(0, os.path.join(CURRENT_DIR, "backend"))

from backend.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[CropShield AI] Starting Flask Production Server on {host}:{port}...")
    app.run(host=host, port=port, debug=False)
