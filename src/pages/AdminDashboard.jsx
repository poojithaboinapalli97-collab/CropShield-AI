import React, { useState } from 'react';
import { mockAdminStats, mockRiskMapDistricts, mockOfficialSurveillance } from '../data/mockData';
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
  TrendingDown,
  Layers,
  FileDown,
  Building2,
  Sparkles,
  Package,
  Clock,
  BarChart3,
} from 'lucide-react';

export default function AdminDashboard() {
  const [broadcastDistrict, setBroadcastDistrict] = useState('Ludhiana');
  const [alertType, setAlertType] = useState('Critical Emergency');
  const [broadcastChannel, setBroadcastChannel] = useState('SMS + Automated IVR Voice Call');
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

  const handleExportSurveillanceReport = (format) => {
    alert(`Exporting official regional surveillance & epidemiology report (${format.toUpperCase()})... Download initiated.`);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <span className="sih-badge-inline">
            <Sparkles size={13} /> SIH26131 • DIRECTORATE SURVEILLANCE & COMMAND
          </span>
          <h1 className="page-title">Agricultural Directorate Command & Outbreak Center</h1>
          <p className="page-subtitle">
            Epidemiological early warning radar, extension worker SLA telemetry, regional bio-input buffer stocks, and mass emergency broadcast infrastructure.
          </p>
        </div>

        <div className="admin-export-actions">
          <button
            type="button"
            onClick={() => handleExportSurveillanceReport('pdf')}
            className="btn-export-rep"
          >
            <FileDown size={15} /> Export PDF Briefing
          </button>
          <button
            type="button"
            onClick={() => handleExportSurveillanceReport('csv')}
            className="btn-export-rep"
          >
            <FileDown size={15} /> Export CSV Data
          </button>
        </div>
      </div>

      {/* MACRO EPIDEMIOLOGY IMPACT TILES */}
      <div className="admin-impact-banner">
        <div className="impact-tile">
          <span className="impact-lbl">Total Monitored Acreage</span>
          <strong className="impact-val text-emerald">
            {mockOfficialSurveillance.totalMonitoredAcreage.toLocaleString()} Acres
          </strong>
          <span className="impact-sub">Across 7 Key States</span>
        </div>

        <div className="impact-tile">
          <span className="impact-lbl">Prevented Crop Loss Estimate</span>
          <strong className="impact-val text-gold">
            ₹ {mockOfficialSurveillance.preventedCropLossEstimateCr} Crores
          </strong>
          <span className="impact-sub">Early AI Intervention</span>
        </div>

        <div className="impact-tile">
          <span className="impact-lbl">Extension Response SLA</span>
          <strong className="impact-val text-sky">
            {mockOfficialSurveillance.avgExtensionResponseSlaHours} Hours
          </strong>
          <span className="impact-sub">Agronomist Review Speed</span>
        </div>

        <div className="impact-tile">
          <span className="impact-lbl">Pesticide Reduction Impact</span>
          <strong className="impact-val text-purple">
            -{mockOfficialSurveillance.targetedPesticideReductionPercent}%
          </strong>
          <span className="impact-sub">Targeted vs Blanket Spray</span>
        </div>
      </div>

      {/* SYSTEM TELEMETRY CARDS */}
      <div className="admin-telemetry-grid">
        <div className="telemetry-card">
          <div className="t-icon icon-bg-green"><Activity size={22} /></div>
          <div>
            <span className="t-lbl">Total Diagnostics Computed</span>
            <h3 className="t-val">{mockAdminStats.totalScans.toLocaleString()}</h3>
            <span className="t-sub text-success">+1,240 scans today</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-amber"><ShieldCheck size={22} /></div>
          <div>
            <span className="t-lbl">Agronomist Validated Accuracy</span>
            <h3 className="t-val">{mockAdminStats.accuracyRate}%</h3>
            <span className="t-sub">{mockAdminStats.validatedScans.toLocaleString()} Ground Validations</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-purple"><Users size={22} /></div>
          <div>
            <span className="t-lbl">Extension Officers Online</span>
            <h3 className="t-val">{mockAdminStats.agronomistsOnline} Active</h3>
            <span className="t-sub">KVK & ICAR Pathologists</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-blue"><Cpu size={22} /></div>
          <div>
            <span className="t-lbl">YOLOv8 Model Inference Latency</span>
            <h3 className="t-val">{mockAdminStats.fastapiLatencyMs} ms</h3>
            <span className="t-sub">FastAPI Neural Cluster</span>
          </div>
        </div>
      </div>

      {/* REGIONAL BUFFER STOCKS & OUTBREAK VELOCITY GRID */}
      <div className="admin-grid-2 mb-24">
        {/* BIO-INPUT & FUNGICIDE BUFFER STOCKS */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="title-with-icon">
              <Package size={20} className="icon-green" />
              <h3>Regional Bio-Input & Chemical Buffer Stocks</h3>
            </div>
            <span className="badge-pill badge-green">State Depots</span>
          </div>

          <div className="buffer-stock-table-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Input Name</th>
                  <th>Depot Location</th>
                  <th>Buffer Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOfficialSurveillance.regionalBufferStocks.map((stock, i) => (
                  <tr key={i}>
                    <td><strong>{stock.inputName}</strong></td>
                    <td>{stock.district}</td>
                    <td>
                      {stock.availableTons.toLocaleString()} / {stock.requiredTons.toLocaleString()}{' '}
                      {typeof stock.availableTons === 'number' && stock.availableTons > 1000 ? 'Units' : 'Tons'}
                    </td>
                    <td>
                      <span className={`status-pill ${stock.status.includes('Low') ? 'pill-red' : 'pill-green'}`}>
                        {stock.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OUTBREAK VELOCITY RADAR */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="title-with-icon">
              <BarChart3 size={20} className="icon-amber" />
              <h3>District Outbreak Velocity Index</h3>
            </div>
            <span className="badge-pill badge-amber">7-Day Spread Rate</span>
          </div>

          <div className="velocity-list">
            {mockOfficialSurveillance.outbreakVelocityByDistrict.map((v, i) => (
              <div key={i} className="velocity-item">
                <div className="v-info">
                  <strong>{v.district}</strong>
                  <span className="v-crop-dis">{v.crop} — {v.disease}</span>
                </div>
                <div className="v-metric-group">
                  <span className={`v-badge ${v.velocity.includes('+18%') || v.velocity.includes('+12%') ? 'text-danger' : 'text-amber'}`}>
                    📈 {v.velocity}
                  </span>
                  <span className="v-action">{v.actionStatus}</span>
                </div>
              </div>
            ))}
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
              <h3>Emergency Multi-Channel Outbreak Broadcast</h3>
            </div>
            <span className="badge-pill badge-red"><Bell size={12} /> SMS • IVR • Push</span>
          </div>

          <form onSubmit={handleSendBroadcast} className="broadcast-form">
            <div className="form-row-2">
              <div className="form-group">
                <label>Target Outbreak District</label>
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
                  <option value="Karnal">Karnal, Haryana</option>
                </select>
              </div>

              <div className="form-group">
                <label>Alert Severity Category</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="form-input"
                >
                  <option value="Critical Emergency">🔴 Level 1: Critical Emergency Containment</option>
                  <option value="High Warning">🟡 Level 2: High Warning Spore Dispersal</option>
                  <option value="Informational Advisory">🟢 Level 3: General Agronomic Advisory</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Dispatch Channels</label>
              <select
                value={broadcastChannel}
                onChange={(e) => setBroadcastChannel(e.target.value)}
                className="form-input"
              >
                <option value="SMS + Automated IVR Voice Call">SMS + Automated IVR Vernacular Voice Call (Illiterate Farmers)</option>
                <option value="SMS Text Dispatch Only">SMS Text Dispatch Only</option>
                <option value="WhatsApp Community Broadcast">WhatsApp Kisan Group Broadcast</option>
              </select>
            </div>

            <div className="form-group">
              <label>Broadcast Message Body (Auto-translated to Regional Vernacular)</label>
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
              <span>{isSending ? 'Dispatching Multi-Channel Alert...' : 'Broadcast Emergency Advisory'}</span>
            </button>

            {broadcastResult && (
              <div className="notice-banner banner-success mt-12">
                <CheckCircle2 size={16} />
                <span>
                  Emergency alert dispatched to <strong>{broadcastResult.sentToCount.toLocaleString()} farmers</strong> across {broadcastResult.district} via {broadcastChannel} at {broadcastResult.timestamp}!
                </span>
              </div>
            )}
          </form>
        </div>

        {/* REGIONAL OUTBREAK SUMMARY */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Active Regional Surveillance Zones</h3>
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
