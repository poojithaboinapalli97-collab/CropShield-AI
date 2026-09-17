import React, { useState, useEffect } from 'react';
import { mockAdminStats, mockRiskMapDistricts, mockOfficialSurveillance } from '../data/mockData';
import { allIndiaDistrictOptions, stateDistrictMap, indianStates } from '../data/indiaLocations';
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
  TrendingUp,
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
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

const DEFAULT_ADMIN_PROFILE = {
  name: 'Dr. Rajeshwar Rao, IAS',
  role: 'Director General (Plant Protection)',
  designation: 'Joint Director of Agriculture (Plant Protection)',
  department: 'Directorate of Plant Protection, Quarantine & Storage',
  email: 'directorate.command@agri.gov.in',
  phone: '+91 98480 23456',
  badgeId: 'DIR-AGRI-0428',
  jurisdiction: 'AP & Telangana Agricultural Surveillance Zones',
  officeLocation: 'Krishi Bhawan, Hyderabad / New Delhi',
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

const INITIAL_MANDI_RATES = [
  { id: 'm1', crop: 'Tomato', district: 'Guntur APMC Yard', price: 2100, trend: '+150', trendType: 'up', minPrice: 1850, maxPrice: 2400, arrivalQty: '1,450 Qtl' },
  { id: 'm2', crop: 'Potato', district: 'Kurnool / Agra Yard', price: 1450, trend: '+50', trendType: 'up', minPrice: 1200, maxPrice: 1650, arrivalQty: '2,800 Qtl' },
  { id: 'm3', crop: 'Corn / Maize', district: 'Warangal Grain Market', price: 2250, trend: '-30', trendType: 'down', minPrice: 2050, maxPrice: 2400, arrivalQty: '3,100 Qtl' },
  { id: 'm4', crop: 'Chilli / Pepper', district: 'Guntur Mirchi Yard', price: 14800, trend: '+400', trendType: 'up', minPrice: 13500, maxPrice: 16200, arrivalQty: '950 Qtl' },
  { id: 'm5', crop: 'Cotton', district: 'Adilabad / Guntur Cotton Yard', price: 7450, trend: '+200', trendType: 'up', minPrice: 6900, maxPrice: 7800, arrivalQty: '1,200 Qtl' },
  { id: 'm6', crop: 'Rice / Paddy', district: 'Krishna / West Godavari', price: 2320, trend: '+60', trendType: 'up', minPrice: 2180, maxPrice: 2450, arrivalQty: '5,600 Qtl' },
  { id: 'm7', crop: 'Wheat', district: 'Ludhiana / Indore APMC', price: 2275, trend: '+25', trendType: 'up', minPrice: 2125, maxPrice: 2350, arrivalQty: '4,200 Qtl' },
  { id: 'm8', crop: 'Soybean', district: 'Nizamabad / Indore APMC', price: 4600, trend: '+80', trendType: 'up', minPrice: 4300, maxPrice: 4850, arrivalQty: '1,850 Qtl' },
  { id: 'm9', crop: 'Groundnut', district: 'Anantapur / Kurnool Yard', price: 6750, trend: '+120', trendType: 'up', minPrice: 6200, maxPrice: 7100, arrivalQty: '1,100 Qtl' },
];

const INITIAL_OUTBREAKS = [
  {
    id: 'OB-901',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    crop: 'Tomato',
    pathogen: 'Late Blight (Phytophthora infestans)',
    severity: 'Critical Red',
    status: 'Active Alert',
    action: 'Emergency foliar Cymoxanil + Mancozeb @ 2.0 g/L within 24h. Cease sprinkler irrigation.',
    affectedArea: '320 Hectares',
    date: 'Today, 08:30 AM',
  },
  {
    id: 'OB-902',
    state: 'Telangana',
    district: 'Warangal',
    crop: 'Chilli / Pepper',
    pathogen: 'Black Thrips & Leaf Curl Virus',
    severity: 'High Warning',
    status: 'Active Alert',
    action: 'Deploy blue sticky traps @ 30/acre. Spray Spinetoram 11.7% SC @ 1.0 ml/L.',
    affectedArea: '185 Hectares',
    date: 'Yesterday',
  },
  {
    id: 'OB-903',
    state: 'Andhra Pradesh',
    district: 'Kurnool',
    crop: 'Cotton',
    pathogen: 'Pink Bollworm (Pectinophora gossypiella)',
    severity: 'Moderate',
    status: 'Under Control',
    action: 'Install pheromone traps @ 8/acre. Release Trichogramma @ 1.5 lakh eggs/ha.',
    affectedArea: '90 Hectares',
    date: '3 days ago',
  },
];

export default function AdminDashboard() {
  const { user, updateUser } = useAuth();
  const [metrics, setMetrics] = useState(() => getScanMetrics());
  const [activeTab, setActiveTab] = useState('mandi'); // 'mandi' | 'outbreaks' | 'broadcast' | 'surveillance'

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

    try {
      const saved = localStorage.getItem('cropshield_admin_profile');
      if (saved) {
        return { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {}

    return DEFAULT_ADMIN_PROFILE;
  };

  // Admin Profile State
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

  // ==========================================
  // MANDI RATES STATE & MANAGEMENT
  // ==========================================
  const [mandiRates, setMandiRates] = useState(() => {
    try {
      const stored = localStorage.getItem('cropshield_mandi_rates');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_MANDI_RATES;
  });
  const [mandiToast, setMandiToast] = useState('');

  const handleMandiFieldChange = (id, field, value) => {
    setMandiRates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveAllMandiRates = () => {
    try {
      localStorage.setItem('cropshield_mandi_rates', JSON.stringify(mandiRates));
      window.dispatchEvent(new Event('cropshield_mandi_updated'));
      setMandiToast('APMC Mandi Rates updated and broadcast live to all Farmer Dashboards!');
      setTimeout(() => setMandiToast(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Add new commodity to Mandi
  const handleAddNewMandiCrop = () => {
    const newId = 'm-' + Date.now();
    const newCrop = {
      id: newId,
      crop: 'New Crop',
      district: 'Guntur APMC Yard',
      price: 2500,
      trend: '+100',
      trendType: 'up',
      minPrice: 2200,
      maxPrice: 2800,
      arrivalQty: '500 Qtl',
    };
    const updated = [newCrop, ...mandiRates];
    setMandiRates(updated);
    try {
      localStorage.setItem('cropshield_mandi_rates', JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_mandi_updated'));
    } catch {}
  };

  const handleDeleteMandiCrop = (id) => {
    const updated = mandiRates.filter((item) => item.id !== id);
    setMandiRates(updated);
    try {
      localStorage.setItem('cropshield_mandi_rates', JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_mandi_updated'));
    } catch {}
  };

  // ==========================================
  // OUTBREAK ALERTS STATE & MANAGEMENT
  // ==========================================
  const [outbreakAlerts, setOutbreakAlerts] = useState(() => {
    try {
      const stored = localStorage.getItem('cropshield_active_outbreaks');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_OUTBREAKS;
  });

  const [newOutbreakCrop, setNewOutbreakCrop] = useState('Tomato');
  const [newOutbreakDisease, setNewOutbreakDisease] = useState('Late Blight (Phytophthora infestans)');
  const [newOutbreakState, setNewOutbreakState] = useState('Andhra Pradesh');
  const [newOutbreakDistrict, setNewOutbreakDistrict] = useState('Guntur');
  const [newOutbreakSeverity, setNewOutbreakSeverity] = useState('Critical Red');
  const [newOutbreakAction, setNewOutbreakAction] = useState('Apply curative translaminar spray Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L within 24h.');
  const [newOutbreakArea, setNewOutbreakArea] = useState('250 Hectares');
  const [outbreakToast, setOutbreakToast] = useState('');

  const handleCreateOutbreakAlert = (e) => {
    e.preventDefault();
    const newAlert = {
      id: 'OB-' + Math.floor(100 + Math.random() * 900),
      state: newOutbreakState,
      district: newOutbreakDistrict,
      crop: newOutbreakCrop,
      pathogen: newOutbreakDisease,
      severity: newOutbreakSeverity,
      status: 'Active Alert',
      action: newOutbreakAction,
      affectedArea: newOutbreakArea,
      date: 'Just now',
    };

    const updated = [newAlert, ...outbreakAlerts];
    setOutbreakAlerts(updated);
    try {
      localStorage.setItem('cropshield_active_outbreaks', JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_outbreaks_updated'));
      setOutbreakToast(`Emergency alert for ${newOutbreakDistrict} published to Regional Surveillance Map!`);
      setTimeout(() => setOutbreakToast(''), 3000);
    } catch {}
  };

  const handleToggleOutbreakStatus = (id) => {
    const updated = outbreakAlerts.map((ob) => {
      if (ob.id === id) {
        return {
          ...ob,
          status: ob.status === 'Active Alert' ? 'Resolved / Contained' : 'Active Alert',
        };
      }
      return ob;
    });
    setOutbreakAlerts(updated);
    try {
      localStorage.setItem('cropshield_active_outbreaks', JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_outbreaks_updated'));
    } catch {}
  };

  const handleDeleteOutbreak = (id) => {
    const updated = outbreakAlerts.filter((ob) => ob.id !== id);
    setOutbreakAlerts(updated);
    try {
      localStorage.setItem('cropshield_active_outbreaks', JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_outbreaks_updated'));
    } catch {}
  };

  // ==========================================
  // EMERGENCY BROADCAST FORM STATE
  // ==========================================
  const [broadcastDistrict, setBroadcastDistrict] = useState(() => localStorage.getItem('selectedDistrict') || 'Guntur');
  const [alertType, setAlertType] = useState('Critical Emergency');
  const [broadcastChannel, setBroadcastChannel] = useState('SMS + Automated IVR Voice Call');
  const [broadcastMsg, setBroadcastMsg] = useState(() => {
    const d = localStorage.getItem('selectedDistrict') || 'Guntur';
    return `URGENT ADVISORY: High humidity detected across ${d} district. Inspect tomato and chilli crops for bacterial leaf spots and black thrips. Apply recommended bio-spray before evening.`;
  });
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
              <Sparkles size={13} /> DIRECTORATE SURVEILLANCE & COMMAND
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
            Agricultural Directorate Command & Data Center
          </h1>

          <p className="admin-page-subtitle">
            Live administrative management for APMC Mandi commodity rates, regional pest outbreak alerts, CIBRC chemical protocols, and emergency mass farmer dispatch.
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

      {/* 1.5. EDITABLE ADMIN PROFILE BAR */}
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

      {/* =========================================================================
          2. ADMIN PRIMARY DATA MANAGEMENT TABS NAVIGATION
         ========================================================================= */}
      <div className="admin-nav-tabs-bar">
        <button
          type="button"
          className={`admin-nav-tab-btn ${activeTab === 'mandi' ? 'tab-active tab-active-mandi' : ''}`}
          onClick={() => setActiveTab('mandi')}
        >
          <DollarSign size={17} />
          <span>📊 APMC Mandi Rates Live Management</span>
        </button>

        <button
          type="button"
          className={`admin-nav-tab-btn ${activeTab === 'outbreaks' ? 'tab-active tab-active-outbreaks' : ''}`}
          onClick={() => setActiveTab('outbreaks')}
        >
          <Flame size={17} />
          <span>🚨 State Outbreak Alerts & Quarantine Orders</span>
        </button>

        <button
          type="button"
          className={`admin-nav-tab-btn ${activeTab === 'broadcast' ? 'tab-active tab-active-broadcast' : ''}`}
          onClick={() => setActiveTab('broadcast')}
        >
          <Radio size={17} />
          <span>📢 Emergency Kisan Broadcast Tool</span>
        </button>

        <button
          type="button"
          className={`admin-nav-tab-btn ${activeTab === 'surveillance' ? 'tab-active tab-active-surveillance' : ''}`}
          onClick={() => setActiveTab('surveillance')}
        >
          <Activity size={17} />
          <span>📡 Radar & Surveillance Overview</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: APMC MANDI RATES LIVE MANAGEMENT (ADMIN UPDATE FEATURE)
         ========================================================================= */}
      {activeTab === 'mandi' && (
        <section className="admin-mandi-control-card mb-24">
          <div className="admin-section-header-flex">
            <div>
              <div className="title-with-icon">
                <DollarSign size={22} className="icon-green" />
                <h3 className="admin-block-title">
                  Live APMC Mandi Commodity Rates Control
                </h3>
              </div>
              <p className="admin-block-sub">
                Edit market rates, price trends, and modal ranges per quintal. Saved values instantly update across all active farmer dashboards.
              </p>
            </div>

            <div className="admin-action-btn-group">
              <button
                type="button"
                className="btn-pill-action admin-add-crop-btn"
                onClick={handleAddNewMandiCrop}
              >
                <Plus size={15} /> Add Crop Rate
              </button>
              <button
                type="button"
                className="scan-cta-large-btn admin-save-broadcast-btn"
                onClick={handleSaveAllMandiRates}
              >
                <Check size={16} /> Save & Broadcast Rates
              </button>
            </div>
          </div>

          {mandiToast && (
            <div className="admin-toast-success">
              <CheckCircle2 size={16} /> {mandiToast}
            </div>
          )}

          <div className="admin-table-scroll-wrap">
            <table className="admin-mandi-live-table">
              <thead>
                <tr>
                  <th>Crop Name</th>
                  <th>Mandi / Yard</th>
                  <th>Price (₹ / Q)</th>
                  <th>Min Modal (₹)</th>
                  <th>Max Modal (₹)</th>
                  <th>Today's Trend (₹)</th>
                  <th>Arrival Qty</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mandiRates.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="text"
                        value={item.crop}
                        onChange={(e) => handleMandiFieldChange(item.id, 'crop', e.target.value)}
                        className="admin-table-input crop-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.district}
                        onChange={(e) => handleMandiFieldChange(item.id, 'district', e.target.value)}
                        className="admin-table-input district-input"
                      />
                    </td>
                    <td>
                      <div className="currency-input-wrap">
                        <span>₹</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleMandiFieldChange(item.id, 'price', e.target.value)}
                          className="admin-table-input price-input text-emerald font-bold"
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.minPrice}
                        onChange={(e) => handleMandiFieldChange(item.id, 'minPrice', e.target.value)}
                        className="admin-table-input num-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.maxPrice}
                        onChange={(e) => handleMandiFieldChange(item.id, 'maxPrice', e.target.value)}
                        className="admin-table-input num-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.trend}
                        onChange={(e) => handleMandiFieldChange(item.id, 'trend', e.target.value)}
                        className={`admin-table-input num-input ${item.trend?.startsWith('-') ? 'text-danger' : 'text-emerald'}`}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.arrivalQty}
                        onChange={(e) => handleMandiFieldChange(item.id, 'arrivalQty', e.target.value)}
                        className="admin-table-input num-input"
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteMandiCrop(item.id)}
                        className="admin-delete-row-btn"
                        title="Delete Commodity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: STATE OUTBREAK ALERTS & QUARANTINE ORDERS (ADMIN UPDATE FEATURE)
         ========================================================================= */}
      {activeTab === 'outbreaks' && (
        <section className="admin-outbreaks-control-card mb-24">
          <div className="admin-section-header-flex">
            <div className="title-with-icon">
              <Flame size={22} className="icon-amber" />
              <div>
                <h3 className="admin-block-title">
                  State Outbreak Surveillance & Quarantine Orders
                </h3>
                <p className="admin-block-sub">
                  Publish regional phytosanitary emergency notices, high-risk quarantine zones, and mandatory chemical spray orders.
                </p>
              </div>
            </div>
          </div>

          {outbreakToast && (
            <div className="admin-toast-warning">
              <AlertTriangle size={16} /> {outbreakToast}
            </div>
          )}

          {/* ADD NEW OUTBREAK FORM */}
          <form onSubmit={handleCreateOutbreakAlert} className="admin-new-outbreak-form">
            <h4 className="admin-form-heading">
              ➕ Issue New Regional Phytosanitary Threat Alert
            </h4>

            <div className="admin-form-grid-4">
              <div className="form-group">
                <label className="admin-form-lbl">State</label>
                <select
                  value={newOutbreakState}
                  onChange={(e) => {
                    const st = e.target.value;
                    setNewOutbreakState(st);
                    const dists = stateDistrictMap[st] || [];
                    setNewOutbreakDistrict(dists[0] || '');
                  }}
                  className="admin-form-select"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="admin-form-lbl">District</label>
                <select
                  value={newOutbreakDistrict}
                  onChange={(e) => setNewOutbreakDistrict(e.target.value)}
                  className="admin-form-select"
                >
                  {(stateDistrictMap[newOutbreakState] || []).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="admin-form-lbl">Affected Crop</label>
                <input
                  type="text"
                  value={newOutbreakCrop}
                  onChange={(e) => setNewOutbreakCrop(e.target.value)}
                  placeholder="e.g. Tomato, Chilli, Cotton"
                  required
                  className="admin-form-input"
                />
              </div>

              <div className="form-group">
                <label className="admin-form-lbl">Severity Level</label>
                <select
                  value={newOutbreakSeverity}
                  onChange={(e) => setNewOutbreakSeverity(e.target.value)}
                  className="admin-form-select"
                >
                  <option value="Critical Red">🔴 Critical Red (Immediate Lockdown/Spray)</option>
                  <option value="High Warning">🟡 High Warning (Spore Dispersal Threat)</option>
                  <option value="Moderate">🟢 Moderate Alert (Preventative Action)</option>
                </select>
              </div>
            </div>

            <div className="admin-form-grid-2">
              <div className="form-group">
                <label className="admin-form-lbl">Pathogen / Pest Name & Symptom</label>
                <input
                  type="text"
                  value={newOutbreakDisease}
                  onChange={(e) => setNewOutbreakDisease(e.target.value)}
                  placeholder="e.g. Late Blight (Phytophthora infestans)"
                  required
                  className="admin-form-input"
                />
              </div>

              <div className="form-group">
                <label className="admin-form-lbl">Estimated Area Impacted</label>
                <input
                  type="text"
                  value={newOutbreakArea}
                  onChange={(e) => setNewOutbreakArea(e.target.value)}
                  placeholder="e.g. 350 Hectares"
                  className="admin-form-input"
                />
              </div>
            </div>

            <div className="form-group mb-12">
              <label className="admin-form-lbl">Mandatory Agronomic Directive / Spray Prescription</label>
              <textarea
                rows={2}
                value={newOutbreakAction}
                onChange={(e) => setNewOutbreakAction(e.target.value)}
                placeholder="e.g. Apply Cymoxanil + Mancozeb @ 2.0 g/L. Cease overhead irrigation."
                required
                className="admin-form-textarea"
              />
            </div>

            <button
              type="submit"
              className="scan-cta-large-btn admin-publish-outbreak-btn"
            >
              <Send size={15} /> Publish Outbreak Directive to Farmers
            </button>
          </form>

          {/* ACTIVE OUTBREAKS LIST */}
          <h4 className="admin-subheading-title">
            📋 Active Directorate Threat Directives ({outbreakAlerts.length})
          </h4>

          <div className="admin-threat-directives-list">
            {outbreakAlerts.map((ob) => (
              <div
                key={ob.id}
                className={`admin-threat-directive-item ${ob.status === 'Active Alert' ? 'item-active-alert' : ''}`}
              >
                <div className="directive-item-left">
                  <div className="directive-header-row">
                    <span className="directive-loc-title">
                      📍 {ob.district}, {ob.state}
                    </span>
                    <span className={`risk-severity-pill-badge ${ob.severity.includes('Red') ? 'badge-critical' : 'badge-medium'}`}>
                      {ob.severity}
                    </span>
                    <span className="directive-crop-meta">
                      Crop: <strong>{ob.crop}</strong> ({ob.affectedArea})
                    </span>
                  </div>

                  <p className="directive-pathogen-title">
                    ⚠️ {ob.pathogen}
                  </p>
                  <p className="directive-action-desc">
                    💊 Directive: {ob.action}
                  </p>
                </div>

                <div className="directive-item-actions">
                  <button
                    type="button"
                    onClick={() => handleToggleOutbreakStatus(ob.id)}
                    className={`btn-directive-status ${ob.status === 'Active Alert' ? 'status-active' : 'status-resolved'}`}
                  >
                    {ob.status}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOutbreak(ob.id)}
                    className="admin-delete-row-btn"
                    title="Delete Alert"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: EMERGENCY KISAN BROADCAST DISPATCHER
         ========================================================================= */}
      {activeTab === 'broadcast' && (
        <div className="admin-grid-2 mb-24">
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="title-with-icon">
                <Radio size={20} className="icon-red" />
                <h3>Send Direct Alert Message to Farmers</h3>
              </div>
              <span className="badge-pill badge-red">
                <Bell size={12} /> SMS • Phone Call • WhatsApp
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
                  <label>Select Target District (AP & Telangana)</label>
                  <select
                    value={broadcastDistrict}
                    onChange={(e) => setBroadcastDistrict(e.target.value)}
                    className="form-input"
                  >
                    <optgroup label="Andhra Pradesh">
                      {(stateDistrictMap['Andhra Pradesh'] || []).map((dist) => (
                        <option key={dist} value={dist}>{dist}, Andhra Pradesh</option>
                      ))}
                    </optgroup>
                    <optgroup label="Telangana">
                      {(stateDistrictMap['Telangana'] || []).map((dist) => (
                        <option key={dist} value={dist}>{dist}, Telangana</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label>Urgency Level</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="form-input"
                  >
                    <option value="Critical Emergency">🔴 Urgent Emergency Alert (Immediate Crop Threat)</option>
                    <option value="High Warning">🟡 High Warning (Spore Spread / Pest Risk)</option>
                    <option value="Informational Advisory">🟢 Helpful Advisory (General Farm Guidance)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>How to Send Alert</label>
                <select
                  value={broadcastChannel}
                  onChange={(e) => setBroadcastChannel(e.target.value)}
                  className="form-input"
                >
                  <option value="SMS + Automated IVR Voice Call">SMS Text + Automated Voice Call in Local Language (Telugu & Hindi)</option>
                  <option value="SMS Text Dispatch Only">SMS Text Message Only</option>
                  <option value="WhatsApp Community Broadcast">WhatsApp Kisan Group Community Alert</option>
                </select>
              </div>

              <div className="form-group">
                <label>Alert Message for Farmers (Sent in Simple Telugu & English)</label>
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
                <span>{isSending ? 'Dispatching Message to Farmers...' : 'Send Alert Message to Farmers'}</span>
              </button>

              {broadcastResult && (
                <div className="broadcast-success-alert">
                  <CheckCircle2 size={18} className="alert-icon-green" />
                  <div>
                    <strong>Alert Message Sent Successfully!</strong>
                    <p>
                      Transmitted to <strong>{broadcastResult.sentToCount.toLocaleString()} farmers</strong> in {broadcastResult.district} via {broadcastChannel} at {broadcastResult.timestamp}.
                    </p>
                    <small style={{ display: 'block', marginTop: '4px', opacity: 0.85 }}>
                      Dispatched by {adminProfile.name} • Badge {adminProfile.badgeId} • {adminProfile.department}
                    </small>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="title-with-icon">
                <Flame size={20} className="icon-amber" />
                <h3>Monitored Farming Districts & Threat Status</h3>
              </div>
              <span className="badge-pill badge-amber">AP & Telangana Zones</span>
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
      )}

      {/* =========================================================================
          TAB 4: REGIONAL RADAR & SURVEILLANCE OVERVIEW
         ========================================================================= */}
      {activeTab === 'surveillance' && (
        <div className="admin-grid-2">
          {/* CARD A: EXTENSION AGENT ESCALATION SLA TELEMETRY */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="title-with-icon">
                <Clock size={20} className="icon-purple" />
                <h3>Regional Extension Worker & KVK SLA Status</h3>
              </div>
              <span className="badge-pill badge-purple">District Level SLA</span>
            </div>

            <div className="sla-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Pending Escalations</th>
                    <th>Avg Resolution</th>
                    <th>SLA Adherence</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOfficialSurveillance.extensionWorkerSla.map((item) => (
                    <tr key={item.district}>
                      <td>
                        <strong>{item.district}</strong>
                        <span className="table-sub">{item.state}</span>
                      </td>
                      <td>
                        <span className="count-pill">{item.pendingEscalations} cases</span>
                      </td>
                      <td>{item.avgResolutionHours} hrs</td>
                      <td>
                        <div className="sla-bar-container">
                          <div
                            className={`sla-fill ${item.complianceRate >= 90 ? 'fill-green' : item.complianceRate >= 80 ? 'fill-amber' : 'fill-red'}`}
                            style={{ width: `${item.complianceRate}%` }}
                          ></div>
                          <span className="sla-pct">{item.complianceRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARD B: BIO-INPUT & FUNGICIDE BUFFER STOCKPILES */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="title-with-icon">
                <Package size={20} className="icon-blue" />
                <h3>State Strategic Bio-Input Buffer Reserves</h3>
              </div>
              <span className="badge-pill badge-blue">Kisan Supply Depot</span>
            </div>

            <div className="stockpile-grid">
              {mockOfficialSurveillance.strategicStockpiles.map((stock) => (
                <div key={stock.item} className="stockpile-card">
                  <div className="stockpile-top">
                    <span className="stock-category-badge">{stock.category}</span>
                    <span className={`stock-status-pill ${stock.daysOfStockRemaining <= 15 ? 'pill-alert-red' : 'pill-alert-green'}`}>
                      {stock.daysOfStockRemaining} Days Reserve
                    </span>
                  </div>
                  <h4 className="stock-title">{stock.item}</h4>
                  <div className="stock-metric-row">
                    <span className="stock-qty">{stock.currentStockMetricTons} MT</span>
                    <span className="stock-target">Target: {stock.targetReserveMetricTons} MT</span>
                  </div>
                  <div className="stock-progress-track">
                    <div
                      className="stock-progress-fill"
                      style={{
                        width: `${Math.min(100, Math.round((stock.currentStockMetricTons / stock.targetReserveMetricTons) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <span className="stock-depot-loc">
                    <Building2 size={12} /> Depot: {stock.primaryDepotLocation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
