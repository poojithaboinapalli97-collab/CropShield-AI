import React, { useState } from 'react';
import { getApiConfig, setApiMode } from '../services/api';
import { Code, Server, CheckCircle2, ShieldCheck, X, RefreshCw } from 'lucide-react';

export default function ApiModal({ isOpen, onClose }) {
  const config = getApiConfig();
  const [isMock, setIsMock] = useState(config.useMockData);
  const [customUrl, setCustomUrl] = useState(config.baseUrl);
  const [savedMsg, setSavedMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setApiMode(isMock, customUrl);
    setSavedMsg('API configuration updated successfully!');
    setTimeout(() => {
      setSavedMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Server className="icon-green" />
            <div>
              <h3>FastAPI + YOLOv8 Backend Integration</h3>
              <p className="modal-subtitle">SIH 2026 Modular Backend Connectivity</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="api-status-banner">
            <div className="status-indicator">
              <span className={`status-pulse ${isMock ? 'pulse-amber' : 'pulse-green'}`}></span>
              <span>Current Mode: <strong>{isMock ? 'Demo / Mock Data' : 'Live FastAPI Backend'}</strong></span>
            </div>
            <span className="sih-tag">SIH26131</span>
          </div>

          <div className="config-section">
            <label className="config-label">Mode Selection</label>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${isMock ? 'active' : ''}`}
                onClick={() => setIsMock(true)}
              >
                <ShieldCheck size={16} /> Demo / Mock Mode
              </button>
              <button
                className={`toggle-btn ${!isMock ? 'active' : ''}`}
                onClick={() => setIsMock(false)}
              >
                <Server size={16} /> Live FastAPI Server
              </button>
            </div>
          </div>

          <div className="config-section">
            <label className="config-label">FastAPI Endpoint Base URL</label>
            <input
              type="text"
              className="api-input"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="e.g. http://localhost:8000/api/v1"
            />
          </div>

          <div className="code-preview-block">
            <div className="code-header">
              <Code size={14} /> FastAPI Integration Specification (main.py)
            </div>
            <pre className="code-body">
{`from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO

app = FastAPI(title="CropShield AI Engine", version="1.0.0")
model = YOLO("models/yolov8x_cropshield.pt")

@app.post("/api/v1/detect")
async def detect_crop_disease(file: UploadFile = File(...)):
    # 1. Load image buffer
    # 2. Perform YOLOv8 inference & post-processing
    results = model(file.file)
    return {
        "disease_name": results[0].names[0],
        "confidence": float(results[0].boxes.conf[0]),
        "boxes": results[0].boxes.xywh.tolist(),
        "severity": "High"
    }`}
            </pre>
          </div>

          {savedMsg && <div className="saved-alert">{savedMsg}</div>}
        </div>

        <div className="modal-footer">
          <button className="secondary-btn-sm" onClick={onClose}>
            Close
          </button>
          <button className="primary-btn-sm" onClick={handleSave}>
            <CheckCircle2 size={16} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
