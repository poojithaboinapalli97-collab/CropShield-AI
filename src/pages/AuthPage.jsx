import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  User,
  Lock,
  UserPlus,
  LogIn,
  AlertTriangle,
  Info,
  CheckCircle2,
  Tractor,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Phone,
  MapPin,
  Tag,
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Selected Role for Sign In: 'Farmer' | 'Agronomist' | 'Admin'
  const [loginRole, setLoginRole] = useState('Farmer');

  // Farmer specific login fields (empty by default so user enters their own data)
  const [farmerName, setFarmerName] = useState('');
  const [farmerMobile, setFarmerMobile] = useState('');
  const [farmerCrop, setFarmerCrop] = useState('Wheat');
  const [farmerLocation, setFarmerLocation] = useState('Ludhiana, Punjab');
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
  const [adminPhotoUrl, setAdminPhotoUrl] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Common errors
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('Farmer');
  const [regCrop, setRegCrop] = useState('Wheat');
  const [regLocation, setRegLocation] = useState('Ludhiana, Punjab');
  const [regError, setRegError] = useState('');

  // Quick Fill Demo Credentials based on active role
  const handleQuickFill = () => {
    setLoginError('');
    if (loginRole === 'Farmer') {
      setFarmerName('Sardar Rameshwar Singh');
      setFarmerMobile('+91 98765 43210');
      setFarmerCrop('Wheat');
      setFarmerLocation('Ludhiana, Punjab');
      setFarmerSize('12.5 Acres');
      setFarmerPassword('demo123');
    } else if (loginRole === 'Agronomist') {
      setAgronomistName('Dr. A. K. Sharma');
      setAgronomistKvk('PAU Extension & KVK Pathology Lab');
      setAgronomistPassword('demo123');
    } else if (loginRole === 'Admin') {
      setAdminName('Dr. Rajeshwar Rao, IAS');
      setAdminBadge('DIR-AGRI-0428');
      setAdminDesignation('Joint Director of Agriculture (Plant Protection)');
      setAdminDepartment('Directorate of Plant Protection, Quarantine & Storage');
      setAdminEmail('rajeshwar.rao@agri.gov.in');
      setAdminPhone('+91 98480 23456');
      setAdminZones('7 Agricultural State Surveillance Zones');
      setAdminPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
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

      const [district, state] = farmerLocation.split(',').map((s) => s.trim());
      login(farmerName, 'Farmer', {
        mobile: farmerMobile,
        crop: farmerCrop,
        district: district || 'Ludhiana',
        state: state || 'Punjab',
        farmSize: farmerSize,
      });

      // Save to localStorage for Farmer Dashboard fallback
      localStorage.setItem('farmerName', farmerName);
      localStorage.setItem('selectedDistrict', district || 'Ludhiana');
      localStorage.setItem('selectedState', state || 'Punjab');

      navigate('/');
      return;
    }

    if (loginRole === 'Agronomist') {
      if (!agronomistName.trim()) {
        setLoginError('Please enter Agronomist / Expert Name.');
        return;
      }
      if (!agronomistPassword.trim()) {
        setLoginError('Please enter your password.');
        return;
      }

      login(agronomistName, 'Agronomist', {
        kvkStation: agronomistKvk,
      });
      navigate('/');
      return;
    }

    if (loginRole === 'Admin') {
      if (!adminName.trim()) {
        setLoginError('Please enter Directorate Officer Name.');
        return;
      }
      if (!adminPassword.trim()) {
        setLoginError('Please enter your password.');
        return;
      }

      const adminProfilePayload = {
        name: adminName,
        badgeId: adminBadge,
        adminId: adminBadge,
        designation: adminDesignation,
        department: adminDepartment,
        email: adminEmail,
        phone: adminPhone,
        jurisdiction: adminZones,
        authorizedZones: adminZones,
        photoUrl: adminPhotoUrl,
        officeLocation: 'Krishi Bhawan, New Delhi',
      };

      login(adminName, 'Admin', adminProfilePayload);
      localStorage.setItem('cropshield_admin_profile', JSON.stringify(adminProfilePayload));
      navigate('/');
      return;
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Full Name is required.');
      return;
    }
    if (!regPassword.trim()) {
      setRegError('Please create a password.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Confirm password does not match created password.');
      return;
    }

    if (regRole === 'Farmer') {
      const [district, state] = regLocation.split(',').map((s) => s.trim());
      login(regName, 'Farmer', {
        crop: regCrop,
        district: district || 'Ludhiana',
        state: state || 'Punjab',
        farmSize: '10 Acres',
      });
      localStorage.setItem('farmerName', regName);
      localStorage.setItem('selectedDistrict', district || 'Ludhiana');
      localStorage.setItem('selectedState', state || 'Punjab');
      navigate('/');
    } else if (regRole === 'Agronomist') {
      login(regName, 'Agronomist');
      navigate('/');
    } else {
      login(regName, 'Admin');
      navigate('/');
    }
  };

  return (
    <div className="auth-page-container">

      {/* WHITE BOX 1: BRAND HEADER CARD */}
      <div className="auth-white-card auth-brand-header-card">
        <div className="auth-brand-badge-row">
          <span className="brand-sih-tag-pill">SIH 2026 • Problem Statement SIH26131</span>
        </div>
        <div className="auth-logo-center">
          <div className="brand-icon-wrapper-large">
            <Sprout size={32} />
          </div>
          <div>
            <h1 className="auth-brand-title">
              CropShield <span className="brand-ai">AI</span>
            </h1>
          </div>
        </div>
        <p className="auth-tagline-subtitle">
          Early Detection • Smarter Decisions • Healthier Crops
        </p>
      </div>

      {/* WHITE BOX 2: DEMO DISCLAIMER CARD */}
      <div className="auth-white-card auth-info-banner-card">
        <div className="info-banner-content">
          <Info size={18} className="icon-emerald-spin" />
          <span>
            <strong>SIH Prototype Mode:</strong> Multi-role authentication enabled. Switch role below to preview Farmer, Agronomist, or Directorate Admin workflows.
          </span>
        </div>
      </div>

      {/* WHITE BOX 3: MAIN FORM & TABS CARD */}
      <div className="auth-white-card auth-main-form-card">

        {/* MODE TOGGLE TABS */}
        <div className="auth-tabs-header-white">
          <button
            type="button"
            className={`auth-tab-btn-white ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegError('');
            }}
          >
            <LogIn size={18} /> Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn-white ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegError('');
            }}
          >
            <UserPlus size={18} /> Create Account
          </button>
        </div>

        {/* =========================================================================
            MODE 1: SIGN IN (LOGIN FORM)
           ========================================================================= */}
        {mode === 'login' && (
          <div className="auth-form-body">
            <div className="auth-form-title-group">
              <h2>Welcome to CropShield AI</h2>
              <p>Select your user role to access your dedicated agriculture dashboard</p>
            </div>

            {loginError && (
              <div className="notice-banner banner-danger mb-12">
                <AlertTriangle size={16} /> {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="auth-form">

              {/* CLEAR ROLE SELECTOR (FARMER / AGRONOMIST / ADMIN) */}
              <div className="form-group">
                <label className="form-label">Select Your Role *</label>
                <div className="role-selector-grid">

                  {/* 1. Farmer Card */}
                  <div
                    className={`role-box-card ${loginRole === 'Farmer' ? 'selected' : ''}`}
                    onClick={() => {
                      setLoginRole('Farmer');
                      setLoginError('');
                    }}
                  >
                    <div className="role-card-header">
                      <Tractor size={22} className="role-icon" />
                      {loginRole === 'Farmer' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Farmer</div>
                    <div className="role-card-desc">Kisan Portal & Crop Scan</div>
                  </div>

                  {/* 2. Agronomist Card */}
                  <div
                    className={`role-box-card ${loginRole === 'Agronomist' ? 'selected' : ''}`}
                    onClick={() => {
                      setLoginRole('Agronomist');
                      setLoginError('');
                    }}
                  >
                    <div className="role-card-header">
                      <UserCheck size={22} className="role-icon" />
                      {loginRole === 'Agronomist' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Agronomist</div>
                    <div className="role-card-desc">KVK Expert Validation</div>
                  </div>

                  {/* 3. Admin Card */}
                  <div
                    className={`role-box-card ${loginRole === 'Admin' ? 'selected' : ''}`}
                    onClick={() => {
                      setLoginRole('Admin');
                      setLoginError('');
                    }}
                  >
                    <div className="role-card-header">
                      <ShieldCheck size={22} className="role-icon" />
                      {loginRole === 'Admin' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Directorate Admin</div>
                    <div className="role-card-desc">Outbreak Radar & Command</div>
                  </div>

                </div>
              </div>

              {/* -------------------------------------------------------------
                  A. ROLE: FARMER LOGIN FIELDS
                  ------------------------------------------------------------- */}
              {loginRole === 'Farmer' && (
                <>
                  <div className="auth-role-banner banner-farmer">
                    <div className="auth-role-banner-head">
                      <Tractor size={18} className="text-emerald" />
                      <span>Farmer Diagnostic & Advisory Portal</span>
                      <span className="badge-pill badge-green" style={{ marginLeft: 'auto' }}>
                        Kisan Access
                      </span>
                    </div>
                    <p>
                      Enter your details to access your farm dashboard, upload leaf photos for AI diagnosis, and receive audio advisories.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Farmer / Kisan Name *</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        className="form-input icon-padded"
                        placeholder="Enter your Name (e.g. Boinapalli Poojitha)"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kisan Mobile / Registered ID</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        className="form-input icon-padded"
                        placeholder="Enter mobile number (e.g. +91 98765 43210)"
                        value={farmerMobile}
                        onChange={(e) => setFarmerMobile(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Primary Cultivated Crop</label>
                      <select
                        className="form-input"
                        value={farmerCrop}
                        onChange={(e) => setFarmerCrop(e.target.value)}
                      >
                        <option value="Wheat">Wheat (PBW 550 / HD 3086)</option>
                        <option value="Rice">Basmati Rice (Pusa 1121)</option>
                        <option value="Cotton">Bt Cotton (Bollgard II)</option>
                        <option value="Tomato">Tomato (Hybrid Abhinav)</option>
                        <option value="Potato">Potato (Kufri Jyoti)</option>
                        <option value="Maize">Maize / Corn (HQPM 1)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Farm Location / District</label>
                      <select
                        className="form-input"
                        value={farmerLocation}
                        onChange={(e) => setFarmerLocation(e.target.value)}
                      >
                        <option value="Ludhiana, Punjab">Ludhiana, Punjab</option>
                        <option value="Sangli, Maharashtra">Sangli, Maharashtra</option>
                        <option value="Karnal, Haryana">Karnal, Haryana</option>
                        <option value="Guntur, Andhra Pradesh">Guntur, Andhra Pradesh</option>
                        <option value="Nashik, Maharashtra">Nashik, Maharashtra</option>
                        <option value="Hooghly, West Bengal">Hooghly, West Bengal</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Farm Land Size</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 5 Acres, 10 Bigha"
                        value={farmerSize}
                        onChange={(e) => setFarmerSize(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Password / Kisan PIN *</label>
                      <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input
                          type="password"
                          className="form-input icon-padded"
                          placeholder="Enter your password or PIN"
                          value={farmerPassword}
                          onChange={(e) => setFarmerPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* -------------------------------------------------------------
                  B. ROLE: AGRONOMIST LOGIN FIELDS
                  ------------------------------------------------------------- */}
              {loginRole === 'Agronomist' && (
                <>
                  <div className="auth-role-banner banner-agronomist">
                    <div className="auth-role-banner-head">
                      <UserCheck size={18} className="text-emerald" />
                      <span>Agronomist & KVK Scientist Portal</span>
                      <span className="badge-pill badge-green" style={{ marginLeft: 'auto' }}>
                        Expert Review
                      </span>
                    </div>
                    <p>
                      Inspect field crop scans, calibrate AI pathogen severity, verify clinical diagnoses, and issue certified IPDM advisories.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agronomist Full Name *</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        className="form-input icon-padded"
                        placeholder="e.g. Dr. A. K. Sharma"
                        value={agronomistName}
                        onChange={(e) => setAgronomistName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">KVK Extension Center / Ag-Station</label>
                    <div className="input-with-icon">
                      <MapPin size={18} className="input-icon" />
                      <input
                        type="text"
                        className="form-input icon-padded"
                        value={agronomistKvk}
                        onChange={(e) => setAgronomistKvk(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <div className="input-with-icon">
                      <Lock size={18} className="input-icon" />
                      <input
                        type="password"
                        className="form-input icon-padded"
                        placeholder="Enter password"
                        value={agronomistPassword}
                        onChange={(e) => setAgronomistPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* -------------------------------------------------------------
                  C. ROLE: ADMIN LOGIN FIELDS
                  ------------------------------------------------------------- */}
              {loginRole === 'Admin' && (
                <>
                  <div className="auth-role-banner banner-admin">
                    <div className="auth-role-banner-head">
                      <ShieldCheck size={18} className="text-sky" />
                      <span>Agricultural Directorate Command & Outbreak Center</span>
                      <span className="badge-pill badge-amber" style={{ marginLeft: 'auto' }}>
                        Command Level
                      </span>
                    </div>
                    <p>
                      Access national outbreak velocity indices, regional bio-input buffer stocks, and multi-channel mass emergency broadcast tools.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Directorate Officer Name *</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        className="form-input icon-padded"
                        placeholder="e.g. Dr. Rajeshwar Rao, IAS"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Admin / Officer Badge ID *</label>
                      <div className="input-with-icon">
                        <Tag size={18} className="input-icon" />
                        <input
                          type="text"
                          className="form-input icon-padded"
                          placeholder="e.g. DIR-AGRI-0428"
                          value={adminBadge}
                          onChange={(e) => setAdminBadge(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Joint Director of Agriculture"
                        value={adminDesignation}
                        onChange={(e) => setAdminDesignation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Directorate</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Directorate of Plant Protection, Quarantine & Storage"
                      value={adminDepartment}
                      onChange={(e) => setAdminDepartment(e.target.value)}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Official Email</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. rajeshwar.rao@agri.gov.in"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="e.g. +91 98480 23456"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Authorized Surveillance Zones / Jurisdiction</label>
                    <div className="input-with-icon">
                      <ShieldCheck size={18} className="input-icon" />
                      <input
                        type="text"
                        className="form-input icon-padded"
                        placeholder="e.g. 7 Agricultural State Surveillance Zones"
                        value={adminZones}
                        onChange={(e) => setAdminZones(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admin Profile Photo URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter photo URL"
                      value={adminPhotoUrl}
                      onChange={(e) => setAdminPhotoUrl(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <div className="input-with-icon">
                      <Lock size={18} className="input-icon" />
                      <input
                        type="password"
                        className="form-input icon-padded"
                        placeholder="Enter admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* DEMO CREDENTIALS QUICK FILL WHITE CARD */}
              <div className="demo-credentials-card-white">
                <div className="demo-credentials-header">
                  <Sparkles size={16} className="icon-amber" />
                  <strong>Demo {loginRole} Credentials</strong>
                </div>
                <div className="demo-credentials-details">
                  <p>
                    Account: <code>{loginRole === 'Farmer' ? farmerName : loginRole === 'Agronomist' ? agronomistName : adminName}</code>
                  </p>
                  <p>
                    Role: <code>{loginRole}</code>
                  </p>
                  <p>
                    Pass: <code>demo123</code>
                  </p>
                </div>
                <button
                  type="button"
                  className="quick-fill-btn"
                  onClick={handleQuickFill}
                >
                  ⚡ Auto-Fill Demo {loginRole} Access
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <button type="submit" className="primary-btn-sm auth-submit-btn">
                <LogIn size={20} />
                <span>
                  {loginRole === 'Farmer'
                    ? 'Login to Farmer Dashboard'
                    : loginRole === 'Agronomist'
                    ? 'Login to Expert Validation Portal'
                    : 'Login to Directorate Command Center'}
                </span>
              </button>

              <div className="auth-switch-prompt">
                <span>New to CropShield AI?</span>
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => setMode('register')}
                >
                  Create an account &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            MODE 2: CREATE ACCOUNT (REGISTER FORM)
           ========================================================================= */}
        {mode === 'register' && (
          <div className="auth-form-body">
            <div className="auth-form-title-group">
              <h2>Join CropShield AI</h2>
              <p>Select your role and create an account for early crop risk forecasting</p>
            </div>

            {regError && (
              <div className="notice-banner banner-danger mb-12">
                <AlertTriangle size={16} /> {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="auth-form">

              {/* ROLE SELECTION CARDS */}
              <div className="form-group">
                <label className="form-label">Select Your Role *</label>
                <div className="role-selector-grid">
                  <div
                    className={`role-box-card ${regRole === 'Farmer' ? 'selected' : ''}`}
                    onClick={() => setRegRole('Farmer')}
                  >
                    <div className="role-card-header">
                      <Tractor size={22} className="role-icon" />
                      {regRole === 'Farmer' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Farmer</div>
                    <div className="role-card-desc">AI Scan & Dashboard</div>
                  </div>

                  <div
                    className={`role-box-card ${regRole === 'Agronomist' ? 'selected' : ''}`}
                    onClick={() => setRegRole('Agronomist')}
                  >
                    <div className="role-card-header">
                      <UserCheck size={22} className="role-icon" />
                      {regRole === 'Agronomist' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Agronomist</div>
                    <div className="role-card-desc">KVK Clinical Review</div>
                  </div>

                  <div
                    className={`role-box-card ${regRole === 'Admin' ? 'selected' : ''}`}
                    onClick={() => setRegRole('Admin')}
                  >
                    <div className="role-card-header">
                      <ShieldCheck size={22} className="role-icon" />
                      {regRole === 'Admin' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Directorate Admin</div>
                    <div className="role-card-desc">Outbreak Radar & Broadcast</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input icon-padded"
                    placeholder="e.g. Gurpreet Singh"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {regRole === 'Farmer' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Primary Crop</label>
                    <select
                      className="form-input"
                      value={regCrop}
                      onChange={(e) => setRegCrop(e.target.value)}
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Maize">Maize</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Farm District</label>
                    <select
                      className="form-input"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                    >
                      <option value="Ludhiana, Punjab">Ludhiana, Punjab</option>
                      <option value="Sangli, Maharashtra">Sangli, Maharashtra</option>
                      <option value="Karnal, Haryana">Karnal, Haryana</option>
                      <option value="Guntur, Andhra Pradesh">Guntur, Andhra Pradesh</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Create Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input icon-padded"
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input icon-padded"
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="primary-btn-sm auth-submit-btn">
                <UserPlus size={20} /> Create {regRole} Account
              </button>

              <div className="auth-switch-prompt">
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => setMode('login')}
                >
                  Sign in instead &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
