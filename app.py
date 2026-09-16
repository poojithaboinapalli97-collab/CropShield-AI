import os
import sys

# Add backend directory to sys.path so app and models resolve properly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from backend.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app.run(host="0.0.0.0", port=port, debug=False)
