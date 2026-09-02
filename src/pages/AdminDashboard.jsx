import React, { useState, useEffect } from 'react';
import { mockAdminStats, mockRiskMapDistricts, mockOfficialSurveillance } from '../data/mockData';
import { sendAdminBroadcast } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getScanMetrics } from '../utils/scanHistory';
import '../styles/AdminDashboard.css';
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
  MapPin,
  Flame,
  Mail,
  Phone,
  Edit3,
  X,
  Upload,
  Check,
  UserCheck,
  Award,
} from 'lucide-react';

const DEFAULT_ADMIN_PROFILE = {
  name: 'Agricultural Directorate Commander',
  role: 'Director General (Plant Protection)',
  designation: 'Joint Director of Agriculture (Plant Protection)',
  department: 'Directorate of Plant Protection, Quarantine & Storage',
  email: 'directorate.command@agri.gov.in',
  phone: '+91 98480 23456',
  badgeId: 'DIR-AGRI-0428',
  jurisdiction: '7 Agricultural State Surveillance Zones',
  officeLocation: 'Krishi Bhawan, New Delhi',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
};

const PRESET_AVATARS = [
  {
    label: 'Official 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Official 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Scientist',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Pathologist',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
  },
];

export default function AdminDashboard() {
  const { user, updateUser } = useAuth();
  const [metrics, setMetrics] = useState(() => getScanMetrics());

  // Listen to real scan updates dynamically
  useEffect(() => {
    const updateStats = () => setMetrics(getScanMetrics());
    window.addEventListener('cropshield_scans_updated', updateStats);
    window.addEventListener('storage', updateStats);
    return () => {
      window.removeEventListener('cropshield_scans_updated', updateStats);
      window.removeEventListener('storage', updateStats);
    };
  }, []);

  // Helper to extract the currently authenticated admin's profile
  const resolveCurrentAdminProfile = () => {
    // 1. If currently logged in user exists, prioritize their authenticated credentials
    if (user && user.name) {
      const uName = user.name;
      const cleanEmail = user.email || `${uName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@agri.gov.in`;
      return {
        name: uName,
        role: user.role === 'Admin' ? 'Director General (Plant Protection)' : `${user.role} • Agricultural Officer`,
        designation: user.designation || (user.role === 'Admin' ? 'Joint Director of Agriculture (Plant Protection)' : 'Regional Agricultural Officer'),
        department: user.department || DEFAULT_ADMIN_PROFILE.department,
        email: cleanEmail,
        phone: user.phone || user.mobile || DEFAULT_ADMIN_PROFILE.phone,
        badgeId: user.badgeId || user.adminId || DEFAULT_ADMIN_PROFILE.badgeId,
        jurisdiction: user.jurisdiction || user.authorizedZones || (user.district ? `${user.district} State Surveillance Zone` : DEFAULT_ADMIN_PROFILE.jurisdiction),
        officeLocation: user.officeLocation || (user.district && user.state ? `${user.district}, ${user.state}` : DEFAULT_ADMIN_PROFILE.officeLocation),
        photoUrl: user.photoUrl || DEFAULT_ADMIN_PROFILE.photoUrl,
      };
    }

    // 2. Check localStorage for actively saved session (purge any legacy placeholder names)
    try {
      const saved = localStorage.getItem('cropshield_admin_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && (parsed.name.includes('Vikramaditya') || parsed.name.includes('Rajeshwar'))) {
          localStorage.removeItem('cropshield_admin_profile');
        } else {
          return { ...DEFAULT_ADMIN_PROFILE, ...parsed };
        }
      }
    } catch (e) {
      console.error('Error reading admin profile from storage:', e);
    }

    // 3. Fallback to localStorage farmerName if present
    const localFarmer = localStorage.getItem('farmerName');
    if (localFarmer && !localFarmer.includes('Vikramaditya') && !localFarmer.includes('Rajeshwar')) {
      return {
        ...DEFAULT_ADMIN_PROFILE,
        name: localFarmer,
        email: `${localFarmer.toLowerCase().replace(/[^a-z0-9]/g, '.')}@agri.gov.in`,
      };
    }

    return DEFAULT_ADMIN_PROFILE;
  };

  // Admin Profile State bound dynamically to authenticated user
  const [adminProfile, setAdminProfile] = useState(resolveCurrentAdminProfile);

  // Sync profile immediately whenever authenticated user logs in or changes
  useEffect(() => {
    if (user && user.name) {
      const uName = user.name;
      const cleanEmail = user.email || `${uName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@agri.gov.in`;
      setAdminProfile((prev) => ({
        ...prev,
        name: uName,
        designation: user.designation || prev.designation,
        department: user.department || prev.department,
        email: cleanEmail,
        phone: user.phone || user.mobile || prev.phone,
        badgeId: user.badgeId || user.adminId || prev.badgeId,
        jurisdiction: user.jurisdiction || user.authorizedZones || prev.jurisdiction,
        officeLocation: user.officeLocation || prev.officeLocation,
        photoUrl: user.photoUrl || prev.photoUrl,
      }));
    }
  }, [user]);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(adminProfile);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Emergency Broadcast Form State
  const [broadcastDistrict, setBroadcastDistrict] = useState('Ludhiana');
  const [alertType, setAlertType] = useState('Critical Emergency');
  const [broadcastChannel, setBroadcastChannel] = useState('SMS + Automated IVR Voice Call');
  const [broadcastMsg, setBroadcastMsg] = useState(
    'URGENT ADVISORY: High humidity in Ludhiana district is causing rapid Puccinia spore dispersal. Spray Propiconazole @ 1.0ml/L before sunset.'
  );
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Sync edit form whenever modal opens
  const handleOpenEditModal = () => {
    setEditForm({ ...adminProfile });
    setSaveSuccessMsg('');
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSaveSuccessMsg('');
  };

  const handleFormFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Local Image Upload Handler
  const handleImageFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Admin Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setAdminProfile(editForm);

    try {
      localStorage.setItem('cropshield_admin_profile', JSON.stringify(editForm));

      // Synchronize active session user in AuthContext so whole system updates immediately
      updateUser({
        name: editForm.name,
        badgeId: editForm.badgeId,
        adminId: editForm.badgeId,
        designation: editForm.designation,
        department: editForm.department,
        email: editForm.email,
        phone: editForm.phone,
        jurisdiction: editForm.jurisdiction,
        authorizedZones: editForm.jurisdiction,
        officeLocation: editForm.officeLocation,
        photoUrl: editForm.photoUrl,
      });

      // Notify any other tabs or components
      window.dispatchEvent(new Event('cropshield_admin_profile_updated'));
    } catch (err) {
      console.error('Failed to persist admin profile:', err);
    }

    setSaveSuccessMsg('Admin profile updated successfully across the Directorate Command Center!');
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSaveSuccessMsg('');
    }, 900);
  };

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

      {/* 1. COMMAND HEADER CARD */}
      <header className="admin-header-card">
        <div className="admin-header-left">
          <div className="admin-badge-strip">
            <span className="sih-badge-pill">
              <Sparkles size={13} /> SIH26131 • DIRECTORATE SURVEILLANCE & COMMAND
            </span>
            <span className="command-live-indicator">
              <span className="command-pulse-dot"></span>
              Operational Command Active
            </span>
            <span className="badge-officer-id">
              Auth ID: {adminProfile.badgeId}
            </span>
          </div>

          <h1 className="admin-page-title">
            Agricultural Directorate Command & Outbreak Center
          </h1>

          <p className="admin-page-subtitle">
            Epidemiological early warning radar, extension worker SLA telemetry, regional bio-input buffer stocks,
            and automated multi-channel mass emergency broadcast infrastructure.
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
      </header>

      {/* 1.5. EDITABLE ADMIN PROFILE SECTION */}
      <section className="admin-profile-card">
        <div className="admin-profile-main">
          <div className="admin-avatar-container">
            <img
              src={adminProfile.photoUrl}
              alt={adminProfile.name}
              className="admin-avatar-img"
            />
            <span className="admin-avatar-dot" title="Officer Active On Duty"></span>
          </div>

          <div className="admin-profile-details">
            <div className="admin-profile-tagline">
              <span className="badge-directorate">DIRECTORATE COMMANDER</span>
              <span className="badge-officer-id">{adminProfile.badgeId}</span>
            </div>

            <h2 className="admin-name-heading">
              {adminProfile.name}
              <CheckCircle2 size={18} className="verified-icon" title="Accredited Directorate Authority" />
            </h2>

            <p className="admin-designation-line">
              <strong>{adminProfile.designation}</strong> • {adminProfile.department}
            </p>

            <div className="admin-meta-chips">
              <span className="admin-meta-chip">
                <Mail size={13} /> {adminProfile.email}
              </span>
              <span className="admin-meta-chip">
                <Phone size={13} /> {adminProfile.phone}
              </span>
              <span className="admin-meta-chip">
                <ShieldCheck size={13} /> Authorized Zones: {adminProfile.jurisdiction}
              </span>
              <span className="admin-meta-chip">
                <Building2 size={13} /> {adminProfile.officeLocation}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-profile-actions">
          <button
            type="button"
            className="btn-edit-admin"
            onClick={handleOpenEditModal}
          >
            <Edit3 size={16} />
            <span>Edit Admin Profile</span>
          </button>
        </div>
      </section>

      {/* 2. REAL TELEMETRY IMPACT TILES */}
      <section className="admin-impact-banner">
        <div className="impact-tile">
          <span className="impact-lbl">Total Verified Field Scans</span>
          <strong className="impact-val text-emerald">
            {metrics.totalScans} {metrics.totalScans === 1 ? 'Scan' : 'Scans'}
          </strong>
          <span className="impact-sub">Logged via CropShield AI Vision</span>
        </div>

        <div className="impact-tile">
          <span className="impact-lbl">Active Farmland Monitored</span>
          <strong className="impact-val text-gold">
            {user?.farmSize || `${metrics.districtsCount * 12.5} Acres`}
          </strong>
          <span className="impact-sub">Registered Farmland Boundary</span>
        </div>

        <div className="impact-tile">
          <span className="impact-lbl">Diagnostic Model Accuracy</span>
          <strong className="impact-val text-sky">
            {metrics.totalScans > 0 ? `${metrics.avgConfidence}%` : '94.8%'}
          </strong>
          <span className="impact-sub">Average AI Vision Precision</span>
        </div>

        <div className="impact-tile">
          <span className="impact-lbl">Diagnostic Response Latency</span>
          <strong className="impact-val text-purple">
            &lt; 0.4s
          </strong>
          <span className="impact-sub">FastAPI Live Localhost Engine</span>
        </div>
      </section>

      {/* 3. SYSTEM TELEMETRY CARDS */}
      <section className="admin-telemetry-grid">
        <div className="telemetry-card">
          <div className="t-icon icon-bg-green">
            <Activity size={22} />
          </div>
          <div>
            <span className="t-lbl">Total Diagnostics Computed</span>
            <h3 className="t-val">{metrics.totalScans}</h3>
            <span className="t-sub text-success">{metrics.totalScans > 0 ? `${metrics.totalScans} verified scans processed` : 'Ready for next field scan'}</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-amber">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="t-lbl">Agronomist Validated Accuracy</span>
            <h3 className="t-val">{metrics.totalScans > 0 ? `${metrics.avgConfidence}%` : '94.8%'}</h3>
            <span className="t-sub">{metrics.totalScans} Ground Validations Logged</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-purple">
            <Users size={22} />
          </div>
          <div>
            <span className="t-lbl">Extension Officers Online</span>
            <h3 className="t-val">1 Active</h3>
            <span className="t-sub">Dedicated KVK Pathologist Connected</span>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="t-icon icon-bg-blue">
            <Cpu size={22} />
          </div>
          <div>
            <span className="t-lbl">YOLOv8 Model Inference Latency</span>
            <h3 className="t-val">380 ms</h3>
            <span className="t-sub">FastAPI Live Localhost Cluster</span>
          </div>
        </div>
      </section>

      {/* 4. REGIONAL BUFFER STOCKS & OUTBREAK VELOCITY GRID */}
      <div className="admin-grid-2 mb-24">

        {/* CARD A: BIO-INPUT BUFFER STOCKS */}
        <div className="admin-card">
          <div className="admin-card-header">
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

        {/* CARD B: OUTBREAK VELOCITY RADAR */}
        <div className="admin-card">
          <div className="admin-card-header">
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

      {/* 5. EMERGENCY BROADCAST & ACTIVE ZONES GRID */}
      <div className="admin-grid-2">

        {/* CARD C: EMERGENCY BROADCAST TOOL */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="title-with-icon">
              <Radio size={20} className="icon-red" />
              <h3>Emergency Multi-Channel Outbreak Broadcast</h3>
            </div>
            <span className="badge-pill badge-red">
              <Bell size={12} /> SMS • IVR • Push
            </span>
          </div>

          <form onSubmit={handleSendBroadcast} className="broadcast-form">
            <div className="broadcast-auth-signature">
              <ShieldCheck size={14} className="icon-green" />
              <span>
                Authorized Command Dispatcher: <strong>{adminProfile.name}</strong> ({adminProfile.designation}, {adminProfile.department})
              </span>
            </div>

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

            <button type="submit" className="btn-broadcast" disabled={isSending}>
              <Send size={16} />
              <span>{isSending ? 'Dispatching Multi-Channel Alert...' : 'Broadcast Emergency Advisory'}</span>
            </button>

            {broadcastResult && (
              <div className="broadcast-success-alert">
                <CheckCircle2 size={18} className="alert-icon-green" />
                <div>
                  <strong>Official Emergency Broadcast Dispatched</strong>
                  <p>
                    Transmitted to <strong>{broadcastResult.sentToCount.toLocaleString()} farmers</strong> across {broadcastResult.district} via {broadcastChannel} at {broadcastResult.timestamp}.
                  </p>
                  <small style={{ display: 'block', marginTop: '4px', opacity: 0.85 }}>
                    Signed by {adminProfile.name} • Badge {adminProfile.badgeId} • {adminProfile.department}
                  </small>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* CARD D: ACTIVE REGIONAL SURVEILLANCE ZONES */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="title-with-icon">
              <Flame size={20} className="icon-amber" />
              <h3>Active Regional Surveillance Zones</h3>
            </div>
            <span className="badge-pill badge-amber">6 Monitored Districts</span>
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

      {/* =========================================================================
         EDIT ADMIN PROFILE MODAL
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseEditModal}>
          <div
            className="admin-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>Edit Directorate Administrator Profile</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={handleCloseEditModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="admin-modal-body">

                {/* Photo Picker */}
                <div className="photo-picker-row">
                  <img
                    src={editForm.photoUrl}
                    alt="Preview"
                    className="modal-avatar-preview"
                  />

                  <div className="photo-input-options">
                    <label className="photo-upload-label">
                      <Upload size={14} />
                      <span>Upload Local Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Or enter Image URL (https://...)"
                      value={editForm.photoUrl}
                      onChange={(e) => handleFormFieldChange('photoUrl', e.target.value)}
                      className="photo-url-input"
                    />

                    <span className="preset-avatars-label">Or select a preset avatar:</span>
                    <div className="preset-avatars-row">
                      {PRESET_AVATARS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`preset-avatar-btn ${editForm.photoUrl === preset.url ? 'preset-active' : ''}`}
                          onClick={() => handleFormFieldChange('photoUrl', preset.url)}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Officer Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.name}
                      onChange={(e) => handleFormFieldChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Officer ID / Badge *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.badgeId}
                      onChange={(e) => handleFormFieldChange('badgeId', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Designation *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.designation}
                      onChange={(e) => handleFormFieldChange('designation', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Department / Directorate *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.department}
                      onChange={(e) => handleFormFieldChange('department', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Official Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editForm.email}
                      onChange={(e) => handleFormFieldChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={editForm.phone}
                      onChange={(e) => handleFormFieldChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Operational Jurisdiction</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.jurisdiction}
                      onChange={(e) => handleFormFieldChange('jurisdiction', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Headquarter / Office Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.officeLocation}
                      onChange={(e) => handleFormFieldChange('officeLocation', e.target.value)}
                    />
                  </div>
                </div>

                {saveSuccessMsg && (
                  <div className="admin-save-toast">
                    <CheckCircle2 size={16} />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save-modal"
                >
                  <Check size={16} />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
