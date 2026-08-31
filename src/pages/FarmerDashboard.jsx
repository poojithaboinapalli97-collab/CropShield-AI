import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Scan,
  Bug,
  CloudSun,
  MapPin,
  FileText,
  Bell,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Thermometer,
  Droplets,
  Wind,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Menu,
  X,
  FileDown,
  LogOut,
  Settings,
} from 'lucide-react';

import {
  mockDashboardKPIs,
  mockRecentAlerts,
  mockRecentReports,
  mockWeather,
  mockPestMonitoring,
  mockAdvisories,
  statesAndDistricts,
} from '../data/mockData';

import { detectCropDisease } from '../services/api';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [growthStage, setGrowthStage] = useState('Flowering & Booting');
  const [locationInput, setLocationInput] = useState(
    'Ludhiana District, Sector 4, Punjab'
  );

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [farmerName, setFarmerName] = useState(
    user?.name || localStorage.getItem('farmerName') || 'Farmer'
  );

  const [preferredLang, setPreferredLang] = useState(
    localStorage.getItem('preferredLang') || 'en'
  );

  const [smsAlerts, setSmsAlerts] = useState(
    localStorage.getItem('smsAlerts') !== 'false'
  );

  const [selectedState, setSelectedState] = useState(
    localStorage.getItem('selectedState') || 'Punjab'
  );

  const [selectedDistrict, setSelectedDistrict] = useState(
    localStorage.getItem('selectedDistrict') || 'Ludhiana'
  );

  const [selectedVillage, setSelectedVillage] = useState(
    localStorage.getItem('selectedVillage') || 'Sector 4'
  );

  const [settingsNotice, setSettingsNotice] = useState('');

  /* ================= IMAGE UPLOAD ================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadedImage(file);
    setUploadedImagePreview(URL.createObjectURL(file));
  };

  /* ================= AI ANALYSIS ================= */

  const handleQuickAnalyze = async (e) => {
    e.preventDefault();

    setIsAnalyzing(true);
    setAnalysisResult(null);

    let presetKey = 'wheat_rust';

    if (selectedCrop.toLowerCase().includes('tomato')) {
      presetKey = 'tomato_blight';
    } else if (
      selectedCrop.toLowerCase().includes('rice') ||
      selectedCrop.toLowerCase().includes('paddy')
    ) {
      presetKey = 'rice_blast';
    } else if (selectedCrop.toLowerCase().includes('cotton')) {
      presetKey = 'cotton_curl';
    } else if (selectedCrop.toLowerCase().includes('maize')) {
      presetKey = 'healthy_maize';
    }

    try {
      const result = await detectCropDisease(
        uploadedImage || presetKey,
        selectedCrop
      );

      if (result?.success) {
        setAnalysisResult(result.data);
      }
    } catch (error) {
      console.error('Disease detection error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ================= SAVE SETTINGS ================= */

  const handleSaveSettings = (e) => {
    e.preventDefault();

    localStorage.setItem('farmerName', farmerName);
    localStorage.setItem('preferredLang', preferredLang);
    localStorage.setItem('smsAlerts', JSON.stringify(smsAlerts));
    localStorage.setItem('selectedState', selectedState);
    localStorage.setItem('selectedDistrict', selectedDistrict);
    localStorage.setItem('selectedVillage', selectedVillage);

    setSettingsNotice('Settings saved successfully!');

    setTimeout(() => {
      setSettingsNotice('');
    }, 3000);
  };

  /* ================= SIDEBAR ================= */

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'detect',
      label: 'Disease Detection',
      icon: Scan,
    },
    {
      id: 'pest',
      label: 'Pest Monitoring',
      icon: Bug,
    },
    {
      id: 'weather',
      label: 'Weather Risk',
      icon: CloudSun,
    },
    {
      id: 'map',
      label: 'Risk Map',
      icon: MapPin,
    },
    {
      id: 'advisories',
      label: 'Advisories',
      icon: Bell,
    },
    {
      id: 'reports',
      label: 'My Reports',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleSidebarClick = (itemId) => {
    setActiveTab(itemId);
    setSidebarOpen(false);

    if (itemId === 'detect') {
      navigate('/detect');
    }

    if (itemId === 'weather') {
      navigate('/weather');
    }

    if (itemId === 'map') {
      navigate('/map');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="farmer-dashboard-layout">

      {/* MOBILE HEADER */}

      <div className="mobile-dash-nav-bar">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Dashboard Menu</span>
        </button>

        <span className="dash-mobile-badge">
          Farmer Portal
        </span>
      </div>

      <div className="dashboard-container">

        {/* ================= SIDEBAR ================= */}

        <aside
          className={
            sidebarOpen
              ? 'dash-sidebar sidebar-mobile-open'
              : 'dash-sidebar'
          }
        >

          <div className="sidebar-farmer-profile">

            <div className="profile-avatar-wrapper">

              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=200&q=80"
                alt="Farmer"
                className="profile-img-avatar"
              />

              <span className="avatar-online-dot"></span>

            </div>

            <div className="profile-info">

              <h4 className="profile-name">
                {user?.name || farmerName}
              </h4>

              <span className="profile-loc">
                📍 {selectedDistrict}, {selectedState}
              </span>

              <div className="profile-farm-badge">
                🌾 12.5 Acres Farm
              </div>

            </div>

          </div>

          {/* FARM STATUS */}

          <div className="sidebar-farm-widget">

            <div className="widget-row">
              <span className="widget-lbl">
                Active Crop
              </span>

              <strong className="widget-val text-emerald">
                Wheat
              </strong>
            </div>

            <div className="widget-row">
              <span className="widget-lbl">
                Crop Health
              </span>

              <strong className="widget-val text-gold">
                94% Healthy
              </strong>
            </div>

            <div className="widget-row">
              <span className="widget-lbl">
                Soil Moisture
              </span>

              <strong className="widget-val text-sky">
                65% Optimal
              </strong>
            </div>

          </div>

          {/* NAVIGATION */}

          <nav className="sidebar-nav">

            {sidebarItems.map((item) => {

              const Icon = item.icon;

              const isActive =
                activeTab === item.id;

              return (
                <button
                  key={item.id}
                  className={
                    isActive
                      ? 'sidebar-link sidebar-link-active'
                      : 'sidebar-link'
                  }
                  onClick={() =>
                    handleSidebarClick(item.id)
                  }
                >
                  <Icon
                    size={18}
                    className="sidebar-icon"
                  />

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            })}

            <button
              className="sidebar-link sidebar-logout-btn"
              onClick={handleLogout}
            >
              <LogOut
                size={18}
                className="sidebar-icon icon-red"
              />

              <span>Logout</span>
            </button>

          </nav>

          <div className="sidebar-footer-box">

            <div className="sih-mini-badge">
              <Sparkles size={12} />
              <span>SIH 2026 Prototype</span>
            </div>

            <p className="sih-ps-text">
              Problem Statement: SIH26131
            </p>

          </div>

        </aside>

        {/* ================= MAIN ================= */}

        <main className="dash-main-content">

          {/* ================= DASHBOARD ================= */}

          {activeTab === 'dashboard' && (

            <div className="dashboard-view-content">

              {/* WELCOME */}

              <div className="welcome-banner-card">

                <div className="welcome-text-group">

                  <span className="welcome-tag">
                    SMART AGRICULTURE DASHBOARD
                  </span>

                  <h1 className="welcome-title">
                    Welcome back,{' '}
                    {user?.name || farmerName}! 👋
                  </h1>

                  <p className="welcome-sub">
                    Field Location:{' '}
                    <strong>
                      {selectedVillage},{' '}
                      {selectedDistrict},{' '}
                      {selectedState}
                    </strong>
                  </p>

                  <div className="welcome-badge-box mt-12">

                    <span className="status-pulse pulse-green"></span>

                    <span className="welcome-status-lbl">
                      AI Risk Engine Active
                    </span>

                  </div>

                </div>

                <div className="welcome-farmer-portrait">

                  <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"
                    alt="Farmer in field"
                    className="farmer-hero-img"
                  />

                  <div className="farmer-badge-overlay">
                    <CheckCircle2 size={14} />
                    <span>
                      Verified Farmer Plot
                    </span>
                  </div>

                </div>

              </div>

              {/* KPI CARDS */}

              <div className="kpi-cards-grid">

                <div className="kpi-card highlight-kpi-green">

                  <div className="kpi-icon-box green-icon-bg">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <span className="kpi-lbl">
                      Current Crop Health
                    </span>

                    <h3 className="kpi-val">
                      {mockDashboardKPIs.overallHealthStatus}
                    </h3>

                    <span className="kpi-sub val-success">
                      Optimal Growth Pattern
                    </span>
                  </div>

                </div>

                <div className="kpi-card highlight-kpi-blue">

                  <div className="kpi-icon-box blue-icon-bg">
                    <FileText size={22} />
                  </div>

                  <div>
                    <span className="kpi-lbl">
                      Total Health Reports
                    </span>

                    <h3 className="kpi-val">
                      {mockDashboardKPIs.totalReportsFiled}
                    </h3>

                    <span className="kpi-sub">
                      Filed across 3 plots
                    </span>
                  </div>

                </div>

                <div className="kpi-card highlight-kpi-amber">

                  <div className="kpi-icon-box amber-icon-bg">
                    <AlertTriangle size={22} />
                  </div>

                  <div>
                    <span className="kpi-lbl">
                      Disease / Pest Alerts
                    </span>

                    <h3 className="kpi-val">
                      {mockDashboardKPIs.activeAlertsCount}
                    </h3>

                    <span className="kpi-sub val-warning">
                      Needs attention
                    </span>
                  </div>

                </div>

                <div className="kpi-card highlight-kpi-red">

                  <div className="kpi-icon-box red-icon-bg">
                    <ShieldAlert size={22} />
                  </div>

                  <div>
                    <span className="kpi-lbl">
                      High Risk Areas
                    </span>

                    <h3 className="kpi-val">
                      {mockDashboardKPIs.highRiskHotspotsCount}
                    </h3>

                    <span className="kpi-sub val-danger">
                      Spore risk nearby
                    </span>
                  </div>

                </div>

              </div>

              {/* ================= CROP HEALTH ================= */}

              <div className="dash-dual-grid">

                <div className="check-crop-card">

                  <div className="check-card-header">

                    <div className="title-with-icon">

                      <Scan
                        className="icon-green"
                        size={22}
                      />

                      <div>

                        <h3>
                          Check Crop Health
                        </h3>

                        <p className="sub-title-text">
                          Run instant YOLOv8 AI disease diagnosis
                        </p>

                      </div>

                    </div>

                    <span className="badge-pill badge-green">
                      YOLOv8 Engine
                    </span>

                  </div>

                  <form
                    onSubmit={handleQuickAnalyze}
                    className="check-crop-form"
                  >

                    <div className="crop-upload-box">

                      <input
                        type="file"
                        id="quick-crop-photo"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input-hidden"
                      />

                      <label
                        htmlFor="quick-crop-photo"
                        className="quick-upload-label"
                      >

                        {uploadedImagePreview ? (

                          <div className="upload-preview-container">

                            <img
                              src={uploadedImagePreview}
                              alt="Crop preview"
                              className="uploaded-thumb"
                            />

                            <span className="change-photo-txt">
                              Click to Change Photo
                            </span>

                          </div>

                        ) : (

                          <div className="upload-placeholder-content">

                            <UploadCloud
                              size={28}
                              className="icon-green"
                            />

                            <div>

                              <strong>
                                Upload Crop Image
                              </strong>

                              <p>
                                Click to browse
                              </p>

                            </div>

                          </div>

                        )}

                      </label>

                    </div>

                    <div className="form-row-3">

                      <div className="form-group">

                        <label>
                          Select Crop
                        </label>

                        <select
                          value={selectedCrop}
                          onChange={(e) =>
                            setSelectedCrop(e.target.value)
                          }
                          className="form-select"
                        >

                          <option value="Wheat">
                            Wheat
                          </option>

                          <option value="Rice / Paddy">
                            Rice / Paddy
                          </option>

                          <option value="Tomato">
                            Tomato
                          </option>

                          <option value="Cotton">
                            Cotton
                          </option>

                          <option value="Maize">
                            Maize
                          </option>

                          <option value="Potato">
                            Potato
                          </option>

                        </select>

                      </div>

                      <div className="form-group">

                        <label>
                          Growth Stage
                        </label>

                        <select
                          value={growthStage}
                          onChange={(e) =>
                            setGrowthStage(e.target.value)
                          }
                          className="form-select"
                        >

                          <option>
                            Seedling / Germination
                          </option>

                          <option>
                            Vegetative Stage
                          </option>

                          <option>
                            Flowering & Booting
                          </option>

                          <option>
                            Grain Filling / Fruiting
                          </option>

                          <option>
                            Maturity / Harvest
                          </option>

                        </select>

                      </div>

                      <div className="form-group">

                        <label>
                          Field Location
                        </label>

                        <input
                          type="text"
                          value={locationInput}
                          onChange={(e) =>
                            setLocationInput(e.target.value)
                          }
                          className="form-input"
                        />

                      </div>

                    </div>

                    <button
                      type="submit"
                      className="analyze-btn"
                      disabled={isAnalyzing}
                    >

                      {isAnalyzing ? (

                        <>
                          <RefreshCw
                            size={18}
                            className="spin-icon"
                          />

                          Running YOLOv8...
                        </>

                      ) : (

                        <>
                          <Scan size={18} />

                          Analyze Crop Health
                        </>

                      )}

                    </button>

                  </form>

                  {/* RESULT */}

                  {analysisResult && (

                    <div className="quick-result-card">

                      <div className="q-res-header">

                        <div>

                          <span className="crop-tag">
                            {analysisResult.crop}
                          </span>

                          <h4>
                            {analysisResult.diseaseName}
                          </h4>

                          <span className="scientific-txt">
                            <em>
                              {analysisResult.scientificName}
                            </em>
                          </span>

                        </div>

                        <div className="q-res-conf">

                          <span className="conf-num">
                            {analysisResult.confidence}%
                          </span>

                          <span className="conf-lbl">
                            Confidence
                          </span>

                        </div>

                      </div>

                      <div className="q-res-remedy">

                        <strong>
                          Recommended Action:
                        </strong>{' '}
                        {analysisResult.organicRemedies?.[0]}
                      </div>

                      <Link
                        to="/detect"
                        className="view-full-report-link"
                      >
                        View Complete Diagnostic Report →
                      </Link>

                    </div>

                  )}

                </div>

                {/* ================= WEATHER ================= */}

                <div className="weather-summary-card">

                  <div className="dash-card-header">

                    <div className="title-with-icon">

                      <CloudSun
                        className="icon-amber"
                        size={22}
                      />

                      <div>

                        <h3>
                          Weather Summary
                        </h3>

                        <p className="sub-title-text">
                          {mockWeather.current.district}
                        </p>

                      </div>

                    </div>

                    <span className="status-pill pill-red">
                      High Risk
                    </span>

                  </div>

                  <div className="weather-grid-metrics">

                    <div className="w-metric-box">

                      <Thermometer size={20} />

                      <div>

                        <span className="w-val-num">
                          {mockWeather.current.temp}°C
                        </span>

                        <span className="w-val-lbl">
                          Temperature
                        </span>

                      </div>

                    </div>

                    <div className="w-metric-box">

                      <Droplets size={20} />

                      <div>

                        <span className="w-val-num">
                          {mockWeather.current.humidity}%
                        </span>

                        <span className="w-val-lbl">
                          Humidity
                        </span>

                      </div>

                    </div>

                    <div className="w-metric-box">

                      <CloudSun size={20} />

                      <div>

                        <span className="w-val-num">
                          {mockWeather.current.rainfall} mm
                        </span>

                        <span className="w-val-lbl">
                          Rainfall
                        </span>

                      </div>

                    </div>

                    <div className="w-metric-box">

                      <Wind size={20} />

                      <div>

                        <span className="w-val-num">
                          {mockWeather.current.windSpeed} km/h
                        </span>

                        <span className="w-val-lbl">
                          Wind Speed
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="weather-risk-alert-box">

                    <div className="w-risk-header">

                      <AlertTriangle size={18} />

                      <span>
                        Weather-Based Risk Level
                      </span>

                    </div>

                    <p className="w-risk-msg">
                      {mockWeather.current.riskLevel}
                    </p>

                    <span className="w-risk-tip">
                      High humidity and cloudy conditions can increase fungal disease risk.
                    </span>

                  </div>

                  <Link
                    to="/weather"
                    className="weather-full-link"
                  >
                    View 7-Day Disease Risk Forecast →
                  </Link>

                </div>

              </div>

              {/* ================= ALERTS ================= */}

              <section className="dash-section-block">

                <div className="section-title-row">

                  <div>

                    <h2>
                      Recent Disease & Pest Alerts
                    </h2>

                    <p className="sub-title-text">
                      Agricultural threat alerts detected in your region
                    </p>

                  </div>

                  <Link
                    to="/map"
                    className="link-green"
                  >
                    View Risk Map →
                  </Link>

                </div>

                <div className="alerts-cards-grid">

                  {mockRecentAlerts.map((alert) => (

                    <div
                      key={alert.id}
                      className="alert-card-item"
                    >

                      <div className="alert-card-top">

                        <span className="alert-crop-pill">
                          {alert.crop}
                        </span>

                        <span className="status-pill pill-red">
                          {alert.riskLevel} Risk
                        </span>

                      </div>

                      <h4 className="alert-disease-name">
                        {alert.diseaseName}
                      </h4>

                      <p className="alert-loc">
                        <MapPin size={13} />
                        {alert.location}
                      </p>

                      <div className="alert-action-box">

                        <span className="alert-date">
                          <Clock size={12} />
                          {alert.date}
                        </span>

                        <span className="alert-remedy-badge">
                          {alert.actionRequired}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </section>

              {/* ================= REPORTS ================= */}

              <section className="dash-section-block">

                <div className="section-title-row">

                  <div>

                    <h2>
                      Recent Health Reports
                    </h2>

                    <p className="sub-title-text">
                      History of AI crop diagnostics
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setActiveTab('reports')
                    }
                    className="secondary-btn-sm"
                  >
                    View All Reports
                  </button>

                </div>

                <div className="table-responsive-card">

                  <table className="custom-table">

                    <thead>

                      <tr>
                        <th>Report ID</th>
                        <th>Crop</th>
                        <th>Location</th>
                        <th>Diagnosis</th>
                        <th>Confidence</th>
                        <th>Risk</th>
                        <th>Date</th>
                      </tr>

                    </thead>

                    <tbody>

                      {mockRecentReports.map((report) => (

                        <tr key={report.reportId}>

                          <td>
                            <strong>
                              #{report.reportId}
                            </strong>
                          </td>

                          <td>
                            {report.crop}
                          </td>

                          <td>
                            {report.location}
                          </td>

                          <td>
                            {report.diagnosis}
                          </td>

                          <td>
                            <span className="conf-badge">
                              {report.confidence}
                            </span>
                          </td>

                          <td>
                            <span className="status-pill pill-green">
                              {report.riskLevel}
                            </span>
                          </td>

                          <td>
                            {report.date}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </section>

            </div>

          )}

          {/* ================= PEST ================= */}

          {activeTab === 'pest' && (

            <div className="subview-container">

              <div className="page-header">

                <h1 className="page-title">
                  Pest & Insect Surveillance
                </h1>

                <p className="page-subtitle">
                  Monitor agricultural pests and recommended control measures.
                </p>

              </div>

              <div className="pest-cards-grid">

                {mockPestMonitoring.map((pest) => (

                  <div
                    key={pest.id}
                    className="dash-card"
                  >

                    <div className="dash-card-header">

                      <div>

                        <h3>
                          {pest.pestName}
                        </h3>

                        <p className="sub-title-text">
                          Target: {pest.targetCrop}
                        </p>

                      </div>

                      <span className="status-pill pill-red">
                        {pest.infestationLevel}
                      </span>

                    </div>

                    <p>
                      <strong>
                        Recommended Control:
                      </strong>{' '}
                      {pest.recommendedControl}
                    </p>

                    <span className="pest-date">
                      Last Observed: {pest.lastObserved}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* ================= ADVISORIES ================= */}

          {activeTab === 'advisories' && (

            <div className="subview-container">

              <div className="page-header">

                <h1 className="page-title">
                  Official Agricultural Advisories
                </h1>

                <p className="page-subtitle">
                  Government and agronomist advisories.
                </p>

              </div>

              <div className="advisories-list">

                {mockAdvisories.map((adv) => (

                  <div
                    key={adv.id}
                    className="dash-card"
                  >

                    <div className="dash-card-header">

                      <div>

                        <span className="sih-tag">
                          {adv.issuingBody}
                        </span>

                        <h3>
                          {adv.title}
                        </h3>

                      </div>

                      <span className="alert-date">
                        {adv.date}
                      </span>

                    </div>

                    <p>
                      {adv.summary}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* ================= REPORTS TAB ================= */}

          {activeTab === 'reports' && (

            <div className="subview-container">

              <div className="page-header">

                <h1 className="page-title">
                  My Crop Health Reports
                </h1>

                <p className="page-subtitle">
                  Complete history of your crop diagnostic reports.
                </p>

              </div>

              <div className="table-responsive-card">

                <table className="custom-table">

                  <thead>

                    <tr>
                      <th>Report ID</th>
                      <th>Crop</th>
                      <th>Stage</th>
                      <th>Location</th>
                      <th>Diagnosis</th>
                      <th>Confidence</th>
                      <th>Date</th>
                      <th>Download</th>
                    </tr>

                  </thead>

                  <tbody>

                    {mockRecentReports.map((report) => (

                      <tr key={report.reportId}>

                        <td>
                          #{report.reportId}
                        </td>

                        <td>
                          {report.crop}
                        </td>

                        <td>
                          {report.growthStage}
                        </td>

                        <td>
                          {report.location}
                        </td>

                        <td>
                          {report.diagnosis}
                        </td>

                        <td>
                          {report.confidence}
                        </td>

                        <td>
                          {report.date}
                        </td>

                        <td>

                          <button
                            className="secondary-btn-sm"
                            onClick={() =>
                              alert(
                                `Downloading Report #${report.reportId}`
                              )
                            }
                          >

                            <FileDown size={14} />
                            PDF

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

          {/* ================= SETTINGS ================= */}

          {activeTab === 'settings' && (

            <div className="subview-container">

              <div className="page-header">

                <h1 className="page-title">
                  Farmer Account & Settings
                </h1>

                <p className="page-subtitle">
                  Configure your profile, location and alerts.
                </p>

              </div>

              <div
                className="dash-card"
                style={{ maxWidth: '680px' }}
              >

                <form
                  onSubmit={handleSaveSettings}
                  className="validation-form"
                >

                  <div className="form-group">

                    <label>
                      Farmer Name
                    </label>

                    <input
                      type="text"
                      className="form-input"
                      value={farmerName}
                      onChange={(e) =>
                        setFarmerName(e.target.value)
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      State
                    </label>

                    <select
                      value={selectedState}
                      onChange={(e) => {

                        const newState =
                          e.target.value;

                        setSelectedState(newState);

                        const districts =
                          statesAndDistricts[newState] || [];

                        setSelectedDistrict(
                          districts[0] || ''
                        );
                      }}
                      className="form-input"
                    >

                      {Object.keys(statesAndDistricts).map(
                        (state) => (

                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      District
                    </label>

                    <select
                      value={selectedDistrict}
                      onChange={(e) =>
                        setSelectedDistrict(
                          e.target.value
                        )
                      }
                      className="form-input"
                    >

                      {(statesAndDistricts[selectedState] ||
                        []).map((district) => (

                        <option
                          key={district}
                          value={district}
                        >
                          {district}
                        </option>

                      ))}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Village / Sector
                    </label>

                    <input
                      type="text"
                      className="form-input"
                      value={selectedVillage}
                      onChange={(e) =>
                        setSelectedVillage(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Preferred Language
                    </label>

                    <select
                      value={preferredLang}
                      onChange={(e) =>
                        setPreferredLang(
                          e.target.value
                        )
                      }
                      className="form-select"
                    >

                      <option value="en">
                        English
                      </option>

                      <option value="hi">
                        हिंदी
                      </option>

                      <option value="pa">
                        ਪੰਜਾਬੀ
                      </option>

                      <option value="mr">
                        मराठी
                      </option>

                    </select>

                  </div>

                  <div className="seal-checkbox">

                    <input
                      type="checkbox"
                      id="sms-alerts-chk"
                      checked={smsAlerts}
                      onChange={(e) =>
                        setSmsAlerts(
                          e.target.checked
                        )
                      }
                    />

                    <label htmlFor="sms-alerts-chk">
                      Receive high-risk weather and disease alerts
                    </label>

                  </div>

                  <button
                    type="submit"
                    className="primary-btn-sm"
                  >
                    Save Settings
                  </button>

                  {settingsNotice && (

                    <div className="notice-banner banner-success mt-12">

                      <CheckCircle2 size={16} />

                      {settingsNotice}

                    </div>

                  )}

                </form>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}
