import os
import sys
import uvicorn

# Add backend directory to sys.path so app and models resolve properly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from backend.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
