import React, { useState, useEffect } from 'react';
import { fetchExpertQueue, submitExpertValidation } from '../services/api';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Send,
  User,
  MapPin,
  Clock,
  MessageSquare,
} from 'lucide-react';

export default function ExpertValidation() {
  const [queue, setQueue] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [agronomistNotes, setAgronomistNotes] = useState('');
  const [confirmedDisease, setConfirmedDisease] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    fetchExpertQueue().then((res) => {
      if (res.success) {
        setQueue(res.data);
        if (res.data.length > 0) {
          setSelectedScan(res.data[0]);
          setConfirmedDisease(res.data[0].aiPrediction);
        }
      }
    });
  }, []);

  const handleSelectScan = (scan) => {
    setSelectedScan(scan);
    setConfirmedDisease(scan.aiPrediction);
    setAgronomistNotes(scan.expertNotes || '');
    setSubmitStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedScan) return;

    const res = await submitExpertValidation(selectedScan.scanId, {
      confirmedDisease,
      agronomistNotes,
      agronomistName: 'Dr. A. K. Sharma (Senior Agronomist, PAU)',
    });

    if (res.success) {
      setSubmitStatus('Verified Advisory issued and dispatched to farmer via SMS & App notification!');
      setQueue((prev) =>
        prev.map((item) =>
          item.scanId === selectedScan.scanId
            ? { ...item, status: 'Validated', expertNotes: agronomistNotes }
            : item
        )
      );
    }
  };

  return (
    <div className="expert-page">
      <div className="page-header">
        <div>
          <span className="sih-badge-inline">SIH26131 HUMAN-IN-THE-LOOP</span>
          <h1 className="page-title">Agronomist Expert Validation Portal</h1>
          <p className="page-subtitle">
            Bridge AI predictions with human expertise. Review pending farmer scans, confirm diagnoses, and issue certified field advisories.
          </p>
        </div>
      </div>

      <div className="expert-layout-grid">
        {/* PENDING QUEUE LIST */}
        <div className="queue-card">
          <div className="queue-header">
            <h3>Review Queue ({queue.length})</h3>
          </div>

          <div className="queue-list">
            {queue.map((item) => (
              <div
                key={item.scanId}
                className={`queue-item ${selectedScan?.scanId === item.scanId ? 'active' : ''}`}
                onClick={() => handleSelectScan(item)}
              >
                <div className="q-item-top">
                  <span className="q-id">#{item.scanId}</span>
                  <span
                    className={`status-pill ${
                      item.status === 'Validated' ? 'pill-green' : 'pill-amber'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="q-crop">{item.crop} - {item.aiPrediction}</h4>
                <div className="q-meta">
                  <span><User size={12} /> {item.farmerName}</span>
                  <span><MapPin size={12} /> {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VALIDATION WORKSPACE */}
        <div className="workspace-card">
          {selectedScan ? (
            <div>
              <div className="workspace-header">
                <div>
                  <span className="sih-tag">Scan #{selectedScan.scanId}</span>
                  <h2>{selectedScan.crop} Diagnosis Verification</h2>
                  <p className="sub-text">Submitted by {selectedScan.farmerName} from {selectedScan.location}</p>
                </div>
                <div className="ai-pred-badge">
                  <span className="pred-label">AI Diagnosis</span>
                  <span className="pred-val">{selectedScan.aiPrediction} ({selectedScan.aiConfidence}%)</span>
                </div>
              </div>

              <div className="workspace-grid">
                {/* Farmer Photo Preview */}
                <div className="farmer-photo-box">
                  <h4>Uploaded Crop Image</h4>
                  <img src={selectedScan.sampleImage} alt="Crop sample" className="farmer-img" />
                  <div className="farmer-note-quote">
                    <MessageSquare size={14} className="icon-green" />
                    <p>"{selectedScan.farmerNote}"</p>
                  </div>
                </div>

                {/* Validation Form */}
                <form className="validation-form" onSubmit={handleSubmit}>
                  <h4>Agronomist Review & Advisory Form</h4>

                  <div className="form-group">
                    <label>Confirmed Disease Diagnosis</label>
                    <select
                      value={confirmedDisease}
                      onChange={(e) => setConfirmedDisease(e.target.value)}
                      className="form-input"
                    >
                      <option value="Yellow Rust">Yellow / Stripe Rust (Confirmed)</option>
                      <option value="Leaf Curl Virus">Cotton Leaf Curl Virus (Confirmed)</option>
                      <option value="Paddy Leaf Blast">Paddy Leaf Blast (Confirmed)</option>
                      <option value="Early Blight">Early Blight (Confirmed)</option>
                      <option value="Nutrient Deficiency">Nutrient Deficiency (Override AI)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Agronomist Field Treatment Advisory & Dosage Notes</label>
                    <textarea
                      rows={4}
                      className="form-textarea"
                      placeholder="Enter specific chemical/organic treatment spray dosages and water drainage recommendations..."
                      value={agronomistNotes}
                      onChange={(e) => setAgronomistNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="seal-checkbox">
                    <input type="checkbox" id="seal-check" defaultChecked />
                    <label htmlFor="seal-check">
                      Attach Certified Agronomist Quality Seal (PAU / ICAR Standard)
                    </label>
                  </div>

                  <button type="submit" className="primary-btn-sm" style={{ width: '100%' }}>
                    <Send size={16} /> Validate & Send Official Advisory to Farmer
                  </button>

                  {submitStatus && (
                    <div className="notice-banner banner-success mt-12">
                      <CheckCircle2 size={16} /> {submitStatus}
                    </div>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div className="empty-selection">Select a scan from the queue to perform agronomist validation.</div>
          )}
        </div>
      </div>
    </div>
  );
}
