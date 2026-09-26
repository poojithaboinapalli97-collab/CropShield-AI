import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  UserPlus,
  LogIn,
  AlertTriangle,
  CheckCircle2,
  Tractor,
  UserCheck,
  ShieldCheck,
  Phone,
  MapPin,
  Tag,
  Home,
  Sparkles,
  Sprout,
  ArrowRight,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { indianStates, stateDistrictMap } from '../data/indiaLocations';
import '../styles/AuthPage.css';

export default function AuthPage({ initialRole = 'Farmer' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Determine active portal role from URL or prop
  const getRoleFromPath = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/admin')) return 'Admin';
    if (path.includes('/expert')) return 'Agronomist';
    if (path.includes('/farmer')) return 'Farmer';
    return initialRole || 'Farmer';
  };

  // Selected Role for Sign In: 'Farmer' | 'Agronomist' | 'Admin'
  const [loginRole, setLoginRole] = useState(getRoleFromPath);

  // Sync role whenever URL path changes
  useEffect(() => {
    const r = getRoleFromPath();
    setLoginRole(r);
  }, [location.pathname, initialRole]);

  const handleRoleTabChange = (targetRole) => {
    setLoginRole(targetRole);
    setLoginError('');
    setRegError('');
    if (targetRole === 'Farmer') navigate('/login/farmer');
    else if (targetRole === 'Agronomist') navigate('/login/expert');
    else if (targetRole === 'Admin') navigate('/login/admin');
  };

  // Farmer specific login fields
  const [farmerName, setFarmerName] = useState('');
  const [farmerMobile, setFarmerMobile] = useState('');
  const [farmerCrop, setFarmerCrop] = useState('Tomato');
  const [farmerState, setFarmerState] = useState('Andhra Pradesh');
  const [farmerDistrict, setFarmerDistrict] = useState('Guntur');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [farmerSize, setFarmerSize] = useState('');
  const [farmerPassword, setFarmerPassword] = useState('');

  // Agronomist specific login fields
  const [agronomistName, setAgronomistName] = useState('');
  const [agronomistKvk, setAgronomistKvk] = useState('');
  const [agronomistPassword, setAgronomistPassword] = useState('');

  // Admin specific login fields
  const [adminName, setAdminName] = useState('');
  const [adminBadge, setAdminBadge] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('');
  const [adminDepartment, setAdminDepartment] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminZones, setAdminZones] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Common errors
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState(loginRole);
  const [regCrop, setRegCrop] = useState('Tomato');
  const [regState, setRegState] = useState('Andhra Pradesh');
  const [regDistrict, setRegDistrict] = useState('Guntur');
  const [regVillage, setRegVillage] = useState('');
  const [regFarmSize, setRegFarmSize] = useState('5 Acres');
  const [regError, setRegError] = useState('');

  // Sync regRole with loginRole
  useEffect(() => {
    setRegRole(loginRole);
  }, [loginRole]);

  // Quick Fill Demo Credentials based on active role
  const handleQuickFill = () => {
    setLoginError('');
    if (loginRole === 'Farmer') {
      setFarmerName('K. Venkateswara Rao');
      setFarmerMobile('+91 98480 12345');
      setFarmerCrop('Tomato');
      setFarmerState('Andhra Pradesh');
      setFarmerDistrict('Guntur');
      setFarmerVillage('Tadikonda');
      setFarmerSize('6.5 Acres');
      setFarmerPassword('demo123');
    } else if (loginRole === 'Agronomist') {
      setAgronomistName('Dr. A. K. Sharma');
      setAgronomistKvk('ANGRAU Regional Agricultural Research Station (Guntur)');
      setAgronomistPassword('demo123');
    } else if (loginRole === 'Admin') {
      setAdminName('Dr. Rajeshwar Rao, IAS');
      setAdminBadge('DIR-AGRI-0428');
      setAdminDesignation('Joint Director of Agriculture (Plant Protection)');
      setAdminDepartment('Directorate of Agriculture, Andhra Pradesh & Telangana');
      setAdminEmail('rajeshwar.rao@agri.gov.in');
      setAdminPhone('+91 98480 23456');
      setAdminZones('AP & Telangana Agricultural Surveillance Zones');
      setAdminPassword('demo123');
    }
  };

  // Handle Login Submit with proper role handling & redirection
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (loginRole === 'Farmer') {
      if (!farmerName.trim()) {
        setLoginError('Please enter Farmer / Kisan Name.');
        return;
      }
      if (!farmerPassword.trim()) {
        setLoginError('Please enter your password or demo PIN.');
        return;
      }

      const cleanFarmSize = farmerSize.trim()
        ? (farmerSize.toLowerCase().includes('acre') ? farmerSize.trim() : `${farmerSize.trim()} Acres`)
        : (localStorage.getItem('farmerFarmSize') || '5 Acres');

      login(farmerName, 'Farmer', {
        mobile: farmerMobile.trim() || '+91 98480 12345',
        crop: farmerCrop || 'Tomato',
        state: farmerState || 'Andhra Pradesh',
        district: farmerDistrict || 'Guntur',
        village: farmerVillage.trim() || 'Tadikonda',
        farmSize: cleanFarmSize,
      });

      localStorage.setItem('farmerName', farmerName.trim());
      localStorage.setItem('farmerCrop', farmerCrop || 'Tomato');
      localStorage.setItem('selectedState', farmerState || 'Andhra Pradesh');
      localStorage.setItem('selectedDistrict', farmerDistrict || 'Guntur');
      if (farmerVillage.trim()) localStorage.setItem('selectedVillage', farmerVillage.trim());
      localStorage.setItem('farmerFarmSize', cleanFarmSize);

      navigate('/dashboard');
    } else if (loginRole === 'Agronomist') {
      if (!agronomistName.trim()) {
        setLoginError('Please enter Agronomist / Expert Name.');
        return;
      }
      if (!agronomistPassword.trim()) {
        setLoginError('Please enter password.');
        return;
      }

      login(agronomistName, 'Agronomist', {
        kvkCenter: agronomistKvk || 'ANGRAU Regional Agricultural Research Station (Guntur)',
      });
      navigate('/expert');
    } else if (loginRole === 'Admin') {
      if (!adminName.trim()) {
        setLoginError('Please enter Official Name.');
        return;
      }
      if (!adminPassword.trim()) {
        setLoginError('Please enter password.');
        return;
      }

      login(adminName, 'Admin', {
        badgeId: adminBadge || 'DIR-AGRI-0428',
        designation: adminDesignation || 'Joint Director of Agriculture',
        department: adminDepartment || 'Directorate of Plant Protection',
        email: adminEmail || 'rajeshwar.rao@agri.gov.in',
        phone: adminPhone || '+91 98480 23456',
        zones: adminZones || 'National Crop Surveillance Grid',
      });
      navigate('/admin');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regPassword.trim()) {
      setRegError('Please create a password.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify.');
      return;
    }

    if (regRole === 'Farmer') {
      const cleanFarmSize = regFarmSize.trim() || '5 Acres';
      login(regName, 'Farmer', {
        crop: regCrop,
        state: regState,
        district: regDistrict,
        village: regVillage,
        farmSize: cleanFarmSize,
      });
      localStorage.setItem('farmerName', regName);
      localStorage.setItem('selectedVillage', regVillage.trim());
      localStorage.setItem('selectedDistrict', regDistrict || 'Guntur');
      localStorage.setItem('selectedState', regState || 'Andhra Pradesh');
      localStorage.setItem('farmerFarmSize', cleanFarmSize);
      navigate('/dashboard');
    } else if (regRole === 'Agronomist') {
      login(regName, 'Agronomist');
      navigate('/expert');
    } else {
      login(regName, 'Admin');
      navigate('/admin');
    }
  };

  return (
    <div className="auth-fullscreen-container">
      <div className="auth-card-wrapper">
        
        {/* VIBRANT TOP BRAND HEADER */}
        <div className="auth-colorful-header">
          <div className="auth-brand-logo-row">
            <div className="auth-brand-icon-box">
              <Sprout size={28} className="auth-sprout-icon" />
            </div>
            <div className="auth-brand-text-col">
              <h1 className="auth-brand-title">CropShield <span className="text-gradient-emerald">AI</span></h1>
              <span className="auth-sih-badge">🌿 AI Precision Agriculture System</span>
            </div>
          </div>
          <p className="auth-brand-tagline">Early Foliar Disease Detection • IPDM Dosage • Outbreak Surveillance</p>
        </div>

        {/* 3-PORTAL VIBRANT ROLE SELECTOR BAR */}
        <div className="auth-portal-tabs-bar">
          <button
            type="button"
            className={`auth-portal-tab-btn ${loginRole === 'Farmer' ? 'portal-tab-farmer-active' : ''}`}
            onClick={() => handleRoleTabChange('Farmer')}
          >
            <Tractor size={18} className="tab-icon" />
            <span>🌾 Farmer Portal</span>
          </button>
          <button
            type="button"
            className={`auth-portal-tab-btn ${loginRole === 'Agronomist' ? 'portal-tab-expert-active' : ''}`}
            onClick={() => handleRoleTabChange('Agronomist')}
          >
            <UserCheck size={18} className="tab-icon" />
            <span>🔬 Expert / KVK</span>
          </button>
          <button
            type="button"
            className={`auth-portal-tab-btn ${loginRole === 'Admin' ? 'portal-tab-admin-active' : ''}`}
            onClick={() => handleRoleTabChange('Admin')}
          >
            <ShieldCheck size={18} className="tab-icon" />
            <span>🛡️ Admin Portal</span>
          </button>
        </div>

        {/* ROLE STATUS BANNER */}
        <div className={`auth-role-status-banner banner-theme-${loginRole.toLowerCase()}`}>
          {loginRole === 'Farmer' && (
            <div className="role-banner-content">
              <Tractor size={16} />
              <span>👨‍🌾 Kisan / Farmer Sign-In • Access Crop Scans & Weather Advisory</span>
            </div>
          )}
          {loginRole === 'Agronomist' && (
            <div className="role-banner-content">
              <UserCheck size={16} />
              <span>🔬 ICAR & KVK Scientist Portal • Clinical Image Validation</span>
            </div>
          )}
          {loginRole === 'Admin' && (
            <div className="role-banner-content">
              <ShieldCheck size={16} />
              <span>🏛️ Agricultural Directorate Command & Outbreak Center</span>
            </div>
          )}
        </div>

        {/* MODE TOGGLE: SIGN IN / CREATE ACCOUNT */}
        <div className="auth-mode-toggle-bar">
          <button
            type="button"
            className={`mode-toggle-btn ${mode === 'login' ? 'mode-active' : ''}`}
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegError('');
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${mode === 'register' ? 'mode-active' : ''}`}
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegError('');
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* =========================================================================
            MODE 1: SIGN IN (LOGIN FORM)
           ========================================================================= */}
        {mode === 'login' && (
          <div className="auth-form-card-body">
            {loginError && (
              <div className="auth-error-alert">
                <AlertTriangle size={18} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="auth-quick-fill-row">
              <button
                type="button"
                onClick={handleQuickFill}
                className="quick-fill-glow-btn"
              >
                <Sparkles size={14} className="icon-sparkle" />
                <span>⚡ Auto Fill Demo ({loginRole})</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="colorful-auth-form">
              {/* -------------------------------------------------------------
                  A. ROLE: FARMER LOGIN FIELDS
                  ------------------------------------------------------------- */}
              {loginRole === 'Farmer' && (
                <>
                  <div className="form-group-colorful">
                    <label className="form-label-colorful">Farmer / Kisan Name *</label>
                    <div className="input-icon-box">
                      <User size={18} className="icon-green" />
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="Enter your Name (e.g. Boinapalli Poojitha)"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-colorful">
                    <label className="form-label-colorful">Kisan Mobile / Registered ID</label>
                    <div className="input-icon-box">
                      <Phone size={18} className="icon-green" />
                      <input
                        type="tel"
                        className="colorful-input"
                        placeholder="Enter mobile (e.g. +91 98480 12345)"
                        value={farmerMobile}
                        onChange={(e) => setFarmerMobile(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group-colorful">
                    <label className="form-label-colorful">Village / Gram Panchayat</label>
                    <div className="input-icon-box">
                      <MapPin size={18} className="icon-green" />
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="e.g. Rampur, Kothapalli, Tadikonda"
                        value={farmerVillage}
                        onChange={(e) => setFarmerVillage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-colorful">
                      <label className="form-label-colorful">State / UT (All India)</label>
                      <select
                        className="colorful-select"
                        value={farmerState}
                        onChange={(e) => {
                          const newState = e.target.value;
                          setFarmerState(newState);
                          const dists = stateDistrictMap[newState] || [];
                          setFarmerDistrict(dists[0] || '');
                        }}
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group-colorful">
                      <label className="form-label-colorful">District</label>
                      <select
                        className="colorful-select"
                        value={farmerDistrict}
                        onChange={(e) => setFarmerDistrict(e.target.value)}
                      >
                        {(stateDistrictMap[farmerState] || []).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-colorful">
                      <label className="form-label-colorful">Farm Land Size</label>
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="e.g. 5 Acres, 10 Bigha"
                        value={farmerSize}
                        onChange={(e) => setFarmerSize(e.target.value)}
                      />
                    </div>

                    <div className="form-group-colorful">
                      <label className="form-label-colorful">Password / Kisan PIN *</label>
                      <div className="input-icon-box">
                        <Lock size={18} className="icon-green" />
                        <input
                          type="password"
                          className="colorful-input"
                          placeholder="Enter password or PIN"
                          value={farmerPassword}
                          onChange={(e) => setFarmerPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn-colorful btn-farmer-theme">
                    <span>🚀 Login to Farmer Dashboard</span>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}

              {/* -------------------------------------------------------------
                  B. ROLE: AGRONOMIST LOGIN FIELDS
                  ------------------------------------------------------------- */}
              {loginRole === 'Agronomist' && (
                <>
                  <div className="form-group-colorful">
                    <label className="form-label-colorful">Agronomist Full Name *</label>
                    <div className="input-icon-box">
                      <User size={18} className="icon-blue" />
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="e.g. Dr. A. K. Sharma"
                        value={agronomistName}
                        onChange={(e) => setAgronomistName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-colorful">
                    <label className="form-label-colorful">KVK Extension Center / Ag-Station</label>
                    <div className="input-icon-box">
                      <MapPin size={18} className="icon-blue" />
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="e.g. ANGRAU Regional Agricultural Research Station"
                        value={agronomistKvk}
                        onChange={(e) => setAgronomistKvk(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group-colorful">
                    <label className="form-label-colorful">Password *</label>
                    <div className="input-icon-box">
                      <Lock size={18} className="icon-blue" />
                      <input
                        type="password"
                        className="colorful-input"
                        placeholder="Enter password"
                        value={agronomistPassword}
                        onChange={(e) => setAgronomistPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn-colorful btn-expert-theme">
                    <span>🔬 Access KVK Validation Portal</span>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}

              {/* -------------------------------------------------------------
                  C. ROLE: ADMIN LOGIN FIELDS
                  ------------------------------------------------------------- */}
              {loginRole === 'Admin' && (
                <>
                  <div className="form-group-colorful">
                    <label className="form-label-colorful">Directorate Officer Name *</label>
                    <div className="input-icon-box">
                      <User size={18} className="icon-amber" />
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="e.g. Dr. Rajeshwar Rao, IAS"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-colorful">
                      <label className="form-label-colorful">Officer Badge ID *</label>
                      <div className="input-icon-box">
                        <Tag size={18} className="icon-amber" />
                        <input
                          type="text"
                          className="colorful-input"
                          placeholder="e.g. DIR-AGRI-0428"
                          value={adminBadge}
                          onChange={(e) => setAdminBadge(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group-colorful">
                      <label className="form-label-colorful">Designation</label>
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="e.g. Joint Director"
                        value={adminDesignation}
                        onChange={(e) => setAdminDesignation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group-colorful">
                    <label className="form-label-colorful">Password *</label>
                    <div className="input-icon-box">
                      <Lock size={18} className="icon-amber" />
                      <input
                        type="password"
                        className="colorful-input"
                        placeholder="Enter password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn-colorful btn-admin-theme">
                    <span>🛡️ Enter Directorate Command Center</span>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {/* =========================================================================
            MODE 2: REGISTER (CREATE ACCOUNT FORM)
           ========================================================================= */}
        {mode === 'register' && (
          <div className="auth-form-card-body">
            {regError && (
              <div className="auth-error-alert">
                <AlertTriangle size={18} />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="colorful-auth-form">
              <div className="form-group-colorful">
                <label className="form-label-colorful">Account Role</label>
                <div className="role-pill-select-group">
                  {['Farmer', 'Agronomist', 'Admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`role-pill-btn ${regRole === r ? 'role-pill-selected' : ''}`}
                      onClick={() => setRegRole(r)}
                    >
                      {r === 'Farmer' && '🌾 Farmer'}
                      {r === 'Agronomist' && '🔬 Agronomist'}
                      {r === 'Admin' && '🛡️ Admin'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group-colorful">
                <label className="form-label-colorful">Full Name *</label>
                <div className="input-icon-box">
                  <User size={18} className="icon-green" />
                  <input
                    type="text"
                    className="colorful-input"
                    placeholder="Enter your full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {regRole === 'Farmer' && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group-colorful">
                      <label className="form-label-colorful">Primary Crop</label>
                      <select
                        className="colorful-select"
                        value={regCrop}
                        onChange={(e) => setRegCrop(e.target.value)}
                      >
                        {['Tomato', 'Wheat', 'Paddy / Rice', 'Cotton', 'Chilli', 'Potato', 'Maize'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group-colorful">
                      <label className="form-label-colorful">Farm Land Size</label>
                      <input
                        type="text"
                        className="colorful-input"
                        placeholder="e.g. 5 Acres"
                        value={regFarmSize}
                        onChange={(e) => setRegFarmSize(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-colorful">
                      <label className="form-label-colorful">State</label>
                      <select
                        className="colorful-select"
                        value={regState}
                        onChange={(e) => {
                          const ns = e.target.value;
                          setRegState(ns);
                          setRegDistrict((stateDistrictMap[ns] || [])[0] || '');
                        }}
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group-colorful">
                      <label className="form-label-colorful">District</label>
                      <select
                        className="colorful-select"
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                      >
                        {(stateDistrictMap[regState] || []).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="form-grid-2">
                <div className="form-group-colorful">
                  <label className="form-label-colorful">Password *</label>
                  <div className="input-icon-box">
                    <Lock size={18} className="icon-green" />
                    <input
                      type="password"
                      className="colorful-input"
                      placeholder="Create password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-colorful">
                  <label className="form-label-colorful">Confirm Password *</label>
                  <div className="input-icon-box">
                    <Lock size={18} className="icon-green" />
                    <input
                      type="password"
                      className="colorful-input"
                      placeholder="Confirm password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn-colorful btn-farmer-theme">
                <span>✨ Create {regRole} Account</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
