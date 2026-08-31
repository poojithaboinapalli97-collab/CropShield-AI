import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
import {
  LayoutDashboard,
  Scan,
  Bug,
  CloudSun,
  MapPin,
  FileText,
  Bell,
  Settings,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Thermometer,
  Droplets,
  Wind,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Menu,
  X,
  FileDown,
  Info,
  LogOut,
} from 'lucide-react';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Active sidebar tab state: 'dashboard' | 'detect' | 'pest' | 'weather' | 'map' | 'advisories' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check Crop Health form state
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [growthStage, setGrowthStage] = useState('Flowering & Booting');
  const [locationInput, setLocationInput] = useState('Ludhiana District, Sector 4, Punjab');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Settings form state with localStorage persistence
  const [farmerName, setFarmerName] = useState(() => {
    const saved = localStorage.getItem('farmerName');
    return saved || user?.name || 'Sardar Rameshwar Singh';
  });
  const [preferredLang, setPreferredLang] = useState(() => {
    const saved = localStorage.getItem('preferredLang');
    return saved || 'en';
  });
  const [smsAlerts, setSmsAlerts] = useState(() => {
    const saved = localStorage.getItem('smsAlerts');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [settingsNotice, setSettingsNotice] = useState('');

  // Settings Location - State, District, Village with localStorage persistence
  const [selectedState, setSelectedState] = useState(() => {
    const saved = localStorage.getItem('selectedState');
    return saved || 'Punjab';
  });
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    const saved = localStorage.getItem('selectedDistrict');
    return saved || 'Ludhiana';
  });
  const [selectedVillage, setSelectedVillage] = useState(() => {
    const saved = localStorage.getItem('selectedVillage');
    return saved || 'Sector 4';
  });

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setUploadedImagePreview(URL.createObjectURL(file));
    }
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      // Load all saved settings from localStorage
      const savedFarmerName = localStorage.getItem('farmerName');
      const savedLang = localStorage.getItem('preferredLang');
      const savedSmsAlerts = localStorage.getItem('smsAlerts');
      const savedState = localStorage.getItem('selectedState');
      const savedDistrict = localStorage.getItem('selectedDistrict');
      const savedVillage = localStorage.getItem('selectedVillage');

      if (savedFarmerName) setFarmerName(savedFarmerName);
      if (savedLang) setPreferredLang(savedLang);
      if (savedSmsAlerts) setSmsAlerts(JSON.parse(savedSmsAlerts));
      if (savedState) setSelectedState(savedState);
      if (savedDistrict) setSelectedDistrict(savedDistrict);
      if (savedVillage) setSelectedVillage(savedVillage);

      console.log('Settings loaded from localStorage:', {
        farmerName: savedFarmerName,
        lang: savedLang,
        state: savedState,
        district: savedDistrict,
        village: savedVillage,
      });
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }, []);

  // Handle Quick Crop Health Analysis
  const handleQuickAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const presetKey =
      selectedCrop.toLowerCase().includes('tomato') ? 'tomato_blight' :
      selectedCrop.toLowerCase().includes('rice') || selectedCrop.toLowerCase().includes('paddy') ? 'rice_blast' :
      selectedCrop.toLowerCase().includes('cotton') ? 'cotton_curl' :
      selectedCrop.toLowerCase().includes('maize') ? 'healthy_maize' : 'wheat_rust';

    const res = await detectCropDisease(uploadedImage || presetKey, selectedCrop);
    setIsAnalyzing(false);

    if (res.success) {
      setAnalysisResult(res.data);
    }
  };

  // Handle Save Settings - Persist to localStorage
  const handleSaveSettings = (e) => {
    e.preventDefault();
    
    try {
      // Save to localStorage
      localStorage.setItem('farmerName', farmerName);
      localStorage.setItem('preferredLang', preferredLang);
      localStorage.setItem('smsAlerts', JSON.stringify(smsAlerts));
      localStorage.setItem('selectedState', selectedState);
      localStorage.setItem('selectedDistrict', selectedDistrict);
      localStorage.setItem('selectedVillage', selectedVillage);
      
      console.log('Settings saved to localStorage:', {
        farmerName,
        preferredLang,
        smsAlerts,
        selectedState,
        selectedDistrict,
        selectedVillage,
      });
      
      // Show success message
      setSettingsNotice('✓ Settings saved successfully!');
      setTimeout(() => setSettingsNotice(''), 3000);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
      setSettingsNotice('❌ Error saving settings. Check browser console.');
      setTimeout(() => setSettingsNotice(''), 3000);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detect', label: 'Disease Detection', icon: Scan },
    { id: 'pest', label: 'Pest Monitoring', icon: Bug },
    { id: 'weather', label: 'Weather Risk', icon: CloudSun },
    { id: 'map', label: 'Risk Map', icon: MapPin },
    { id: 'advisories', label: 'Advisories', icon: Bell },
    { id: 'reports', label: 'My Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSidebarClick = (itemId) => {
    setActiveTab(itemId);
    setSidebarOpen(false);
    if (itemId === 'detect') navigate('/detect');
    else if (itemId === 'weather') navigate('/weather');
    else if (itemId === 'map') navigate('/map');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="farmer-dashboard-layout">
      {/* MOBILE SIDEBAR TOGGLE HEADER */}
      <div className="mobile-dash-nav-bar">
        <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Dashboard Menu</span>
        </button>
        <span className="dash-mobile-badge">Farmer Portal</span>
      </div>

      <div className="dashboard-container">
        {/* SIDEBAR NAVIGATION - FARMER THEMED LEFT SIDE */}
        <aside className={`dash-sidebar ${sidebarOpen ? 'sidebar-mobile-open' : ''}`}>
          <div className="sidebar-farmer-profile">
            <div className="profile-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=200&q=80"
                alt="Farmer Profile Avatar"
                className="profile-img-avatar"
              />
              <span className="avatar-online-dot"></span>
            </div>
            <div className="profile-info">
              <h4 className="profile-name">{user?.name || farmerName}</h4>
              <span className="profile-loc">📍 Ludhiana, Punjab</span>
              <div className="profile-farm-badge">
                <span>🌾 12.5 Acres Wheat Farm</span>
              </div>
            </div>
          </div>

          {/* FARMER QUICK STATUS WIDGET IN SIDEBAR */}
          <div className="sidebar-farm-widget">
            <div className="widget-row">
              <span className="widget-lbl">Active Crop</span>
              <strong className="widget-val text-emerald">Wheat (Flowering)</strong>
            </div>
            <div className="widget-row">
              <span className="widget-lbl">Crop Health Score</span>
              <strong className="widget-val text-gold">94% Healthy</strong>
            </div>
            <div className="widget-row">
              <span className="widget-lbl">Soil Moisture</span>
              <strong className="widget-val text-sky">65% Optimal</strong>
            </div>
          </div>

          <nav className="sidebar-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                  onClick={() => handleSidebarClick(item.id)}
                >
                  <Icon size={18} className="sidebar-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* LOGOUT BUTTON IN SIDEBAR */}
            <button className="sidebar-link sidebar-logout-btn" onClick={handleLogout}>
              <LogOut size={18} className="sidebar-icon icon-red" />
              <span>Logout</span>
            </button>
          </nav>

          <div className="sidebar-footer-box">
            <div className="sih-mini-badge">
              <Sparkles size={12} className="icon-gold" />
              <span>SIH 2026 Prototype</span>
            </div>
            <p className="sih-ps-text">Problem Statement: SIH26131</p>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="dash-main-content">
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-view-content">
              {/* WELCOME SECTION WITH FARMER PORTRAIT */}
              <div className="welcome-banner-card">
                <div className="welcome-text-group">
                  <span className="welcome-tag">SMART AGRICULTURE DASHBOARD</span>
                  <h1 className="welcome-title">Welcome back, {user?.name || farmerName}! 👋</h1>
                  <p className="welcome-sub">
                    Field Location: <strong>{selectedVillage}, {selectedDistrict}, {selectedState}</strong> • Today: <strong>31 Aug 2026</strong>
                  </p>
                  <div className="welcome-badge-box mt-12">
                    <span className="status-pulse pulse-green"></span>
                    <span className="welcome-status-lbl">AI Risk Engine Active</span>
                  </div>
                </div>

                {/* FARMER HERO PORTRAIT IMAGE */}
                <div className="welcome-farmer-portrait">
                  <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"
                    alt="Sardar Rameshwar Singh in Wheat Field"
                    className="farmer-hero-img"
                  />
                  <div className="farmer-badge-overlay">
                    <CheckCircle2 size={14} className="icon-green" />
                    <span>Verified Farmer Plot</span>
                  </div>
                </div>
              </div>

              {/* TOP 4 KPI CARDS */}
              <div className="kpi-cards-grid">
                <div className="kpi-card highlight-kpi-green">
                  <div className="kpi-icon-box green-icon-bg"><CheckCircle2 size={22} /></div>
                  <div>
                    <span className="kpi-lbl">Current Crop Health Status</span>
                    <h3 className="kpi-val">{mockDashboardKPIs.overallHealthStatus}</h3>
                    <span className="kpi-sub val-success">Optimal Growth Pattern</span>
                  </div>
                </div>

                <div className="kpi-card highlight-kpi-blue">
                  <div className="kpi-icon-box blue-icon-bg"><FileText size={22} /></div>
                  <div>
                    <span className="kpi-lbl">Total Health Reports</span>
                    <h3 className="kpi-val">{mockDashboardKPIs.totalReportsFiled} Reports</h3>
                    <span className="kpi-sub">Filed across 3 plots</span>
                  </div>
                </div>

                <div className="kpi-card highlight-kpi-amber">
                  <div className="kpi-icon-box amber-icon-bg"><AlertTriangle size={22} /></div>
                  <div>
                    <span className="kpi-lbl">Active Disease/Pest Alerts</span>
                    <h3 className="kpi-val">{mockDashboardKPIs.activeAlertsCount} Alerts</h3>
                    <span className="kpi-sub val-warning">Needs Spraying Attention</span>
                  </div>
                </div>

                <div className="kpi-card highlight-kpi-red">
                  <div className="kpi-icon-box red-icon-bg"><ShieldAlert size={22} /></div>
                  <div>
                    <span className="kpi-lbl">High-Risk Areas Nearby</span>
                    <h3 className="kpi-val">{mockDashboardKPIs.highRiskHotspotsCount} Hotspots</h3>
                    <span className="kpi-sub val-danger">Spore Risk in District</span>
                  </div>
                </div>
              </div>

              {/* CHECK CROP HEALTH CARD & WEATHER SUMMARY GRID */}
              <div className="dash-dual-grid">
                {/* 1. CHECK CROP HEALTH CARD */}
                <div className="check-crop-card">
                  <div className="check-card-header">
                    <div className="title-with-icon">
                      <Scan className="icon-green" size={22} />
                      <div>
                        <h3>Check Crop Health</h3>
                        <p className="sub-title-text">Run instant YOLOv8 AI disease diagnosis & risk analysis</p>
                      </div>
                    </div>
                    <span className="badge-pill badge-green">YOLOv8 Engine</span>
                  </div>

                  <form onSubmit={handleQuickAnalyze} className="check-crop-form">
                    {/* Image Upload Zone */}
                    <div className="crop-upload-box">
                      <input
                        type="file"
                        id="quick-crop-photo"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input-hidden"
                      />
                      <label htmlFor="quick-crop-photo" className="quick-upload-label">
                        {uploadedImagePreview ? (
                          <div className="upload-preview-container">
                            <img src={uploadedImagePreview} alt="Uploaded crop preview" className="uploaded-thumb" />
                            <span className="change-photo-txt">Click to Change Photo</span>
                          </div>
                        ) : (
                          <div className="upload-placeholder-content">
                            <UploadCloud size={28} className="icon-green" />
                            <div>
                              <strong>Upload Crop Image</strong>
                              <p>Drag leaf photo or click to browse</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Form Controls Row */}
                    <div className="form-row-3">
                      <div className="form-group">
                        <label>Select Crop</label>
                        <select
                          value={selectedCrop}
                          onChange={(e) => setSelectedCrop(e.target.value)}
                          className="form-select"
                        >
                          <option value="Wheat">Wheat (PBW 550)</option>
                          <option value="Rice / Paddy">Rice / Paddy (Basmati)</option>
                          <option value="Tomato">Tomato (Heirloom)</option>
                          <option value="Cotton">Cotton (Bt Cotton)</option>
                          <option value="Maize">Maize / Corn</option>
                          <option value="Potato">Potato (Kufri Jyoti)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Crop Growth Stage</label>
                        <select
                          value={growthStage}
                          onChange={(e) => setGrowthStage(e.target.value)}
                          className="form-select"
                        >
                          <option value="Seedling / Germination">Seedling / Germination</option>
                          <option value="Vegetative Stage">Vegetative Stage</option>
                          <option value="Flowering & Booting">Flowering & Booting</option>
                          <option value="Grain Filling / Fruiting">Grain Filling / Fruiting</option>
                          <option value="Maturity / Harvest">Maturity / Harvest</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Field Location</label>
                        <input
                          type="text"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          className="form-input"
                          placeholder="e.g. Ludhiana, Punjab"
                        />
                      </div>
                    </div>

                    <button type="submit" className="analyze-btn" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <RefreshCw size={18} className="spin-icon" /> Running YOLOv8 Inference...
                        </>
                      ) : (
                        <>
                          <Scan size={18} /> Analyze Crop Health Now
                        </>
                      )}
                    </button>
                  </form>

                  {/* Immediate Analysis Result Preview */}
                  {analysisResult && (
                    <div className="quick-result-card">
                      <div className="q-res-header">
                        <div>
                          <span className="crop-tag">{analysisResult.crop}</span>
                          <h4>{analysisResult.diseaseName}</h4>
                          <span className="scientific-txt"><em>{analysisResult.scientificName}</em></span>
                        </div>
                        <div className="q-res-conf">
                          <span className="conf-num">{analysisResult.confidence}%</span>
                          <span className="conf-lbl">Confidence</span>
                        </div>
                      </div>

                      <div className="q-res-remedy">
                        <strong>Recommended Organic Action:</strong> {analysisResult.organicRemedies[0]}
                      </div>

                      <Link to="/detect" className="view-full-report-link">
                        View Complete Diagnostic Report & YOLOv8 Bounding Boxes &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                {/* 2. WEATHER SUMMARY CARD */}
                <div className="weather-summary-card">
                  <div className="dash-card-header">
                    <div className="title-with-icon">
                      <CloudSun className="icon-amber" size={22} />
                      <div>
                        <h3>Weather Summary</h3>
                        <p className="sub-title-text">{mockWeather.current.district}</p>
                      </div>
                    </div>
                    <span className="status-pill pill-red">High Risk</span>
                  </div>

                  <div className="weather-grid-metrics">
                    <div className="w-metric-box">
                      <Thermometer size={20} className="icon-amber" />
                      <div>
                        <span className="w-val-num">{mockWeather.current.temp}°C</span>
                        <span className="w-val-lbl">Temperature</span>
                      </div>
                    </div>

                    <div className="w-metric-box">
                      <Droplets size={20} className="icon-blue" />
                      <div>
                        <span className="w-val-num">{mockWeather.current.humidity}%</span>
                        <span className="w-val-lbl">Humidity</span>
                      </div>
                    </div>

                    <div className="w-metric-box">
                      <CloudSun size={20} className="icon-purple" />
                      <div>
                        <span className="w-val-num">{mockWeather.current.rainfall} mm</span>
                        <span className="w-val-lbl">Rainfall</span>
                      </div>
                    </div>

                    <div className="w-metric-box">
                      <Wind size={20} className="icon-green" />
                      <div>
                        <span className="w-val-num">{mockWeather.current.windSpeed} km/h</span>
                        <span className="w-val-lbl">Wind Speed</span>
                      </div>
                    </div>
                  </div>

                  <div className="weather-risk-alert-box">
                    <div className="w-risk-header">
                      <AlertTriangle size={18} className="icon-red" />
                      <span>Weather-Based Risk Level</span>
                    </div>
                    <p className="w-risk-msg">{mockWeather.current.riskLevel}</p>
                    <span className="w-risk-tip">
                      High relative humidity (&gt;80%) & cloudy sky promote rapid Puccinia spore dispersal.
                    </span>
                  </div>

                  <Link to="/weather" className="weather-full-link">
                    View 7-Day Disease Risk Forecast &rarr;
                  </Link>
                </div>
              </div>

              {/* RECENT ALERTS SECTION */}
              <section className="dash-section-block">
                <div className="section-title-row">
                  <div>
                    <h2>Recent Disease & Pest Alerts</h2>
                    <p className="sub-title-text">Real-time agricultural threat alerts detected in your region</p>
                  </div>
                  <Link to="/weather" className="link-green">View All Risk Maps &rarr;</Link>
                </div>

                <div className="alerts-cards-grid">
                  {mockRecentAlerts.map((alert) => (
                    <div key={alert.id} className="alert-card-item">
                      <div className="alert-card-top">
                        <span className="alert-crop-pill">{alert.crop}</span>
                        <span
                          className={`status-pill ${
                            alert.riskLevel === 'Critical' || alert.riskLevel === 'High'
                              ? 'pill-red'
                              : 'pill-amber'
                          }`}
                        >
                          {alert.riskLevel} Risk
                        </span>
                      </div>

                      <h4 className="alert-disease-name">{alert.diseaseName}</h4>
                      <p className="alert-loc">
                        <MapPin size={13} /> {alert.location}
                      </p>

                      <div className="alert-action-box">
                        <span className="alert-date"><Clock size={12} /> {alert.date}</span>
                        <span className="alert-remedy-badge">{alert.actionRequired}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* RECENT HEALTH REPORTS SECTION */}
              <section className="dash-section-block">
                <div className="section-title-row">
                  <div>
                    <h2>Recent Health Reports</h2>
                    <p className="sub-title-text">History of AI crop diagnostics and agronomist validations</p>
                  </div>
                  <button onClick={() => setActiveTab('reports')} className="secondary-btn-sm">
                    View All Reports
                  </button>
                </div>

                <div className="table-responsive-card">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Report ID</th>
                        <th>Crop & Stage</th>
                        <th>Location</th>
                        <th>AI Diagnosis</th>
                        <th>Confidence</th>
                        <th>Risk Level</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecentReports.map((report) => (
                        <tr key={report.reportId}>
                          <td><strong>#{report.reportId}</strong></td>
                          <td>
                            <div>
                              <strong>{report.crop}</strong>
                              <span className="sub-txt-tbl">{report.growthStage}</span>
                            </div>
                          </td>
                          <td>{report.location}</td>
                          <td>{report.diagnosis}</td>
                          <td><span className="conf-badge">{report.confidence}</span></td>
                          <td>
                            <span
                              className={`status-pill ${
                                report.riskLevel === 'High' || report.riskLevel === 'Critical'
                                  ? 'pill-red'
                                  : report.riskLevel === 'Medium'
                                  ? 'pill-amber'
                                  : 'pill-green'
                              }`}
                            >
                              {report.riskLevel}
                            </span>
                          </td>
                          <td>{report.date}</td>
                          <td>
                            <Link to="/detect" className="table-action-link">
                              View PDF
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: PEST MONITORING */}
          {activeTab === 'pest' && (
            <div className="subview-container">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Pest & Insect Surveillance</h1>
                  <p className="page-subtitle">Real-time vector tracking and bio-pesticide dosage guidelines</p>
                </div>
              </div>

              <div className="pest-cards-grid">
                {mockPestMonitoring.map((pest) => (
                  <div key={pest.id} className="dash-card">
                    <div className="dash-card-header">
                      <div className="title-with-icon">
                        <Bug className="icon-purple" size={22} />
                        <div>
                          <h3>{pest.pestName}</h3>
                          <p className="sub-title-text">Target: {pest.targetCrop}</p>
                        </div>
                      </div>
                      <span className="status-pill pill-red">{pest.infestationLevel}</span>
                    </div>
                    <div className="pest-body-box">
                      <p><strong>Recommended Control:</strong> {pest.recommendedControl}</p>
                      <span className="pest-date">Last Observed: {pest.lastObserved}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADVISORIES */}
          {activeTab === 'advisories' && (
            <div className="subview-container">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Official Agricultural Advisories</h1>
                  <p className="page-subtitle">Government & Agronomist directives issued for Punjab & neighboring belts</p>
                </div>
              </div>

              <div className="advisories-list">
                {mockAdvisories.map((adv) => (
                  <div key={adv.id} className={`dash-card ${adv.urgent ? 'border-urgent-amber' : ''}`}>
                    <div className="dash-card-header">
                      <div>
                        <span className="sih-tag">{adv.issuingBody}</span>
                        <h3>{adv.title}</h3>
                      </div>
                      <span className="alert-date">{adv.date}</span>
                    </div>
                    <p className="adv-summary">{adv.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MY REPORTS */}
          {activeTab === 'reports' && (
            <div className="subview-container">
              <div className="page-header">
                <div>
                  <h1 className="page-title">My Filed Crop Health Reports</h1>
                  <p className="page-subtitle">Complete history of saved diagnostic scans and agronomist advisories</p>
                </div>
              </div>

              <div className="table-responsive-card">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Crop</th>
                      <th>Growth Stage</th>
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
                        <td><strong>#{report.reportId}</strong></td>
                        <td>{report.crop}</td>
                        <td>{report.growthStage}</td>
                        <td>{report.location}</td>
                        <td>{report.diagnosis}</td>
                        <td><span className="conf-badge">{report.confidence}</span></td>
                        <td>{report.date}</td>
                        <td>
                          <button className="secondary-btn-sm" onClick={() => alert(`Downloading Report #${report.reportId}`)}>
                            <FileDown size={14} /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="subview-container">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Farmer Account & Alert Settings</h1>
                  <p className="page-subtitle">Configure preferred language, field locations, and SMS advisories</p>
                </div>
              </div>

              <div className="dash-card" style={{ maxWidth: '680px' }}>
                <form
                  onSubmit={handleSaveSettings}
                  className="validation-form"
                >
                  <div className="form-group">
                    <label>Farmer Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        // Reset district to first available district of new state
                        setSelectedDistrict(statesAndDistricts[e.target.value][0]);
                      }}
                      className="form-input"
                    >
                      {Object.keys(statesAndDistricts).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="form-input"
                    >
                      {statesAndDistricts[selectedState].map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Village / Sector</label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      placeholder="Enter your village or sector name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Preferred Language</label>
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value)}
                      className="form-select"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                    </select>
                  </div>

                  <div className="seal-checkbox">
                    <input
                      type="checkbox"
                      id="sms-alerts-chk"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                    />
                    <label htmlFor="sms-alerts-chk">
                      Receive High-Risk Weather & Disease SMS Alerts on Mobile (+91 98765-XXXXX)
                    </label>
                  </div>

                  <button type="submit" className="primary-btn-sm" style={{ width: 'fit-content' }}>
                    Save Settings
                  </button>

                  {settingsNotice && (
                    <div className="notice-banner banner-success mt-12">
                      <CheckCircle2 size={16} /> {settingsNotice}
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
