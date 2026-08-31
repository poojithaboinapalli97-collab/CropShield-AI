import React, { useState } from 'react';
import { mockAdminStats, mockRiskMapDistricts } from '../data/mockData';
import { sendAdminBroadcast } from '../services/api';
import {
  ShieldCheck,
  Radio,
  Activity,
  Users,
  Server,
  Send,
  CheckCircle2,
  AlertOctagon,
  Cpu,
  Database,
  Bell,
} from 'lucide-react';

export default function AdminDashboard() {
  const [broadcastDistrict, setBroadcastDistrict] = useState('Ludhiana');
  const [alertType, setAlertType] = useState('Critical Emergency');
  const [broadcastMsg, setBroadcastMsg] = useState(
    'URGENT ADVISORY: High humidity in Ludhiana district is causing rapid Puccinia spore dispersal. Spray Propiconazole @ 1.0ml/L before sunset.'
  );
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const res = await sendAdminBroadcast(broadcastDistrict, alertType, broadcastMsg);
    setIsSending(false);
    if (res.success) {
      setBroadcastResult(res);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <span className="sih-badge-inline">SIH26131 ADMIN CONTROL</span>
          <h1 className="page-title">Administrative Command & Outbreak Center</h1>
          <p className="page-subtitle">
            Platform monitoring, regional threat surveillance, emergency farmer advisories, and FastAPI model telemetry.
          </p>
        </div>
      </div>

      {/* SYSTEM TELEMETRY CARDS */}
      <div className="admin-telemetry-grid">
        <div className="telemetry-card">
          <div className="t-icon icon-bg-green"><Activity size={22} /></div>
          <div>
            <span className="t-lbl">Total Diagnostics</span>
            <h3 className="t-val">{mockAdminStats.totalScans.toLocaleString()}</h3>
            <span className="t-sub text-success">+1,240 scans today</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-amber"><ShieldCheck size={22} /></div>
          <div>
            <span className="t-lbl">Model Validation Accuracy</span>
            <h3 className="t-val">{mockAdminStats.accuracyRate}%</h3>
            <span className="t-sub">Verified via Agronomist Reviews</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-purple"><Users size={22} /></div>
          <div>
            <span className="t-lbl">Agronomists Online</span>
            <h3 className="t-val">{mockAdminStats.agronomistsOnline} Active</h3>
            <span className="t-sub">PAU & ICAR Affiliated</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-blue"><Cpu size={22} /></div>
          <div>
            <span className="t-lbl">YOLOv8 Model Latency</span>
            <h3 className="t-val">{mockAdminStats.fastapiLatencyMs} ms</h3>
            <span className="t-sub">Model: {mockAdminStats.modelName}</span>
          </div>
        </div>
      </div>

      {/* EMERGENCY BROADCAST & FASTAPI CONTROL GRID */}
      <div className="admin-grid-2">
        {/* EMERGENCY FARMER ADVISORY BROADCAST TOOL */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="title-with-icon">
              <Radio size={20} className="icon-red" />
              <h3>Emergency Outbreak Farmer Broadcast Tool</h3>
            </div>
            <span className="badge-pill badge-red"><Bell size={12} /> SMS & Push Dispatch</span>
          </div>

          <form onSubmit={handleSendBroadcast} className="broadcast-form">
            <div className="form-row-2">
              <div className="form-group">
                <label>Target District</label>
                <select
                  value={broadcastDistrict}
                  onChange={(e) => setBroadcastDistrict(e.target.value)}
                  className="form-input"
                >
                  <option value="Ludhiana">Ludhiana, Punjab</option>
                  <option value="Guntur">Guntur, Andhra Pradesh</option>
                  <option value="Nashik">Nashik, Maharashtra</option>
                  <option value="Hooghly">Hooghly, West Bengal</option>
                  <option value="Varanasi">Varanasi, Uttar Pradesh</option>
                </select>
              </div>

              <div className="form-group">
                <label>Alert Severity Level</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="form-input"
                >
                  <option value="Critical Emergency">Critical Emergency</option>
                  <option value="High Warning">High Warning</option>
                  <option value="Informational Advisory">Informational Advisory</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Broadcast Message Body (Dispatched in Multi-Language)</label>
              <textarea
                rows={3}
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="form-textarea"
                required
              ></textarea>
            </div>

            <button type="submit" className="primary-btn-sm" disabled={isSending}>
              <Send size={16} />
              <span>{isSending ? 'Dispatching Broadcast...' : 'Broadcast Emergency Advisory'}</span>
            </button>

            {broadcastResult && (
              <div className="notice-banner banner-success mt-12">
                <CheckCircle2 size={16} />
                <span>
                  Emergency alert dispatched to <strong>{broadcastResult.sentToCount.toLocaleString()} farmers</strong> in {broadcastResult.district} at {broadcastResult.timestamp}!
                </span>
              </div>
            )}
          </form>
        </div>

        {/* REGIONAL OUTBREAK SUMMARY */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Active Regional Disease Surveillance</h3>
          </div>

          <div className="outbreak-list">
            {mockRiskMapDistricts.map((item) => (
              <div key={item.id} className="outbreak-item">
                <div className="ob-left">
                  <h4 className="ob-district">{item.district}, {item.state}</h4>
                  <span className="ob-disease">{item.activeDisease} ({item.primaryCrop})</span>
                </div>
                <div className="ob-right">
                  <span className="ob-farms">{item.affectedFarms.toLocaleString()} farms</span>
                  <span className={`status-pill ${item.riskLevel === 'Critical' || item.riskLevel === 'High' ? 'pill-red' : 'pill-amber'}`}>
                    {item.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
