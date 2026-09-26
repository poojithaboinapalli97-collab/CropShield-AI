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
    <div className="auth-root-wrapper">
      <style>{`
        .auth-root-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          box-sizing: border-box;
          background: linear-gradient(135deg, rgba(6, 78, 59, 0.88) 0%, rgba(15, 23, 42, 0.92) 50%, rgba(30, 58, 138, 0.88) 100%),
                      url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85') center/cover no-repeat fixed;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .auth-main-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff !important;
          border-radius: 24px;
          box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2);
          overflow: hidden;
          color: #0f172a;
          box-sizing: border-box;
        }

        .auth-header-strip {
          padding: 24px 20px 18px;
          text-align: center;
          background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 55%, #ffffff 100%);
          border-bottom: 1.5px solid #a7f3d0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .auth-logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .auth-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }

        .auth-brand-text {
          margin: 0;
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
        }

        .auth-tagline {
          margin: 0;
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        }

        .auth-portal-selector {
          display: flex;
          background: #f1f5f9;
          padding: 6px;
          gap: 6px;
          border-bottom: 1px solid #e2e8f0;
        }

        .portal-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .portal-btn:hover {
          background: rgba(255, 255, 255, 0.8);
          color: #0f172a;
        }

        .portal-btn.active-farmer {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
        }

        .portal-btn.active-expert {
          background: linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
        }

        .portal-btn.active-admin {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
        }

        .auth-portal-banner {
          padding: 9px 16px;
          font-size: 12px;
          font-weight: 750;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .auth-portal-banner.bg-farmer {
          background: #ecfdf5;
          color: #047857;
        }

        .auth-portal-banner.bg-expert {
          background: #e0f2fe;
          color: #0369a1;
        }

        .auth-portal-banner.bg-admin {
          background: #fff7ed;
          color: #c2410c;
        }

        .auth-mode-tabs {
          display: flex;
          background: #f8fafc;
          padding: 4px;
          margin: 14px 20px 0;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          gap: 6px;
        }

        .mode-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 14px;
          border-radius: 9px;
          border: none;
          font-size: 13px;
          font-weight: 800;
          color: #64748b;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-tab.active {
          background: #ffffff;
          color: #059669;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .auth-body-content {
          padding: 18px 22px 26px;
          background: #ffffff;
        }

        .quick-demo-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 12px;
        }

        .quick-demo-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #fcd34d;
          color: #b45309;
          font-size: 11.5px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
          transition: all 0.2s ease;
        }

        .quick-demo-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .form-colorful-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 800;
          color: #334155;
        }

        .input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-box svg {
          position: absolute;
          left: 12px;
          pointer-events: none;
        }

        .input-field,
        .select-field {
          width: 100%;
          padding: 11px 14px 11px 40px;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .field-group > .input-field,
        .field-group > .select-field {
          padding-left: 12px;
        }

        .input-field:focus,
        .select-field:focus {
          background: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: 14px;
          border: none;
          font-size: 14.5px;
          font-weight: 900;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          margin-top: 6px;
          transition: all 0.2s ease;
        }

        .submit-farmer {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
        }

        .submit-farmer:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(16, 185, 129, 0.6);
        }

        .submit-expert {
          background: linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%);
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
        }

        .submit-expert:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(2, 132, 199, 0.6);
        }

        .submit-admin {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
        }

        .submit-admin:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(245, 158, 11, 0.6);
        }

        .auth-error-box {
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
      `}</style>

      <div className="auth-main-card">
        
        {/* VIBRANT TOP BRAND HEADER */}
        <div className="auth-header-strip">
          <div className="auth-logo-row">
            <div className="auth-icon-badge">
              <Sprout size={28} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h1 className="auth-brand-text">CropShield <span style={{ color: '#059669' }}>AI</span></h1>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                🌿 AI Precision Agriculture System
              </span>
            </div>
          </div>
          <p className="auth-tagline">Early Foliar Disease Detection • IPDM Dosage • Outbreak Surveillance</p>
        </div>

        {/* 3-PORTAL VIBRANT ROLE SELECTOR BAR */}
        <div className="auth-portal-selector">
          <button
            type="button"
            className={`portal-btn ${loginRole === 'Farmer' ? 'active-farmer' : ''}`}
            onClick={() => handleRoleTabChange('Farmer')}
          >
            <Tractor size={16} />
            <span>🌾 Farmer Portal</span>
          </button>
          <button
            type="button"
            className={`portal-btn ${loginRole === 'Agronomist' ? 'active-expert' : ''}`}
            onClick={() => handleRoleTabChange('Agronomist')}
          >
            <UserCheck size={16} />
            <span>🔬 Expert / KVK</span>
          </button>
          <button
            type="button"
            className={`portal-btn ${loginRole === 'Admin' ? 'active-admin' : ''}`}
            onClick={() => handleRoleTabChange('Admin')}
          >
            <ShieldCheck size={16} />
            <span>🛡️ Admin Portal</span>
          </button>
        </div>

        {/* ROLE STATUS BANNER */}
        <div className={`auth-portal-banner ${loginRole === 'Farmer' ? 'bg-farmer' : loginRole === 'Agronomist' ? 'bg-expert' : 'bg-admin'}`}>
          {loginRole === 'Farmer' && <span>👨‍🌾 Kisan / Farmer Sign-In • Access Crop Scans & Weather Advisory</span>}
          {loginRole === 'Agronomist' && <span>🔬 ICAR & KVK Scientist Portal • Clinical Image Validation</span>}
          {loginRole === 'Admin' && <span>🏛️ Agricultural Directorate Command & Outbreak Center</span>}
        </div>

        {/* MODE TOGGLE: SIGN IN / CREATE ACCOUNT */}
        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`mode-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegError('');
            }}
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            type="button"
            className={`mode-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegError('');
            }}
          >
            <UserPlus size={15} /> Create Account
          </button>
        </div>

        {/* =========================================================================
            MODE 1: SIGN IN (LOGIN FORM)
           ========================================================================= */}
        {mode === 'login' && (
          <div className="auth-body-content">
            {loginError && (
              <div className="auth-error-box">
                <AlertTriangle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="quick-demo-row">
              <button
                type="button"
                onClick={handleQuickFill}
                className="quick-demo-btn"
              >
                <Sparkles size={13} color="#d97706" />
                <span>⚡ Auto Fill Demo ({loginRole})</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="form-colorful-stack">
              {/* FARMER LOGIN */}
              {loginRole === 'Farmer' && (
                <>
                  <div className="field-group">
                    <label className="field-label">Farmer / Kisan Name *</label>
                    <div className="input-box">
                      <User size={18} color="#059669" />
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter your Name (e.g. Boinapalli Poojitha)"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Kisan Mobile / Registered ID</label>
                    <div className="input-box">
                      <Phone size={18} color="#059669" />
                      <input
                        type="tel"
                        className="input-field"
                        placeholder="Enter mobile (e.g. +91 98480 12345)"
                        value={farmerMobile}
                        onChange={(e) => setFarmerMobile(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Village / Gram Panchayat</label>
                    <div className="input-box">
                      <MapPin size={18} color="#059669" />
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Rampur, Kothapalli, Tadikonda"
                        value={farmerVillage}
                        onChange={(e) => setFarmerVillage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid-2-col">
                    <div className="field-group">
                      <label className="field-label">State / UT</label>
                      <select
                        className="select-field"
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

                    <div className="field-group">
                      <label className="field-label">District</label>
                      <select
                        className="select-field"
                        value={farmerDistrict}
                        onChange={(e) => setFarmerDistrict(e.target.value)}
                      >
                        {(stateDistrictMap[farmerState] || []).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid-2-col">
                    <div className="field-group">
                      <label className="field-label">Farm Land Size</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. 5 Acres"
                        value={farmerSize}
                        onChange={(e) => setFarmerSize(e.target.value)}
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">Password / PIN *</label>
                      <div className="input-box">
                        <Lock size={18} color="#059669" />
                        <input
                          type="password"
                          className="input-field"
                          placeholder="Enter PIN"
                          value={farmerPassword}
                          onChange={(e) => setFarmerPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn submit-farmer">
                    <span>🚀 Login to Farmer Dashboard</span>
                    <ArrowRight size={17} />
                  </button>
                </>
              )}

              {/* AGRONOMIST LOGIN */}
              {loginRole === 'Agronomist' && (
                <>
                  <div className="field-group">
                    <label className="field-label">Agronomist Full Name *</label>
                    <div className="input-box">
                      <User size={18} color="#0284c7" />
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Dr. A. K. Sharma"
                        value={agronomistName}
                        onChange={(e) => setAgronomistName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">KVK Center / Ag-Station</label>
                    <div className="input-box">
                      <MapPin size={18} color="#0284c7" />
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Regional Ag-Station Guntur"
                        value={agronomistKvk}
                        onChange={(e) => setAgronomistKvk(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Password *</label>
                    <div className="input-box">
                      <Lock size={18} color="#0284c7" />
                      <input
                        type="password"
                        className="input-field"
                        placeholder="Enter password"
                        value={agronomistPassword}
                        onChange={(e) => setAgronomistPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn submit-expert">
                    <span>🔬 Access KVK Validation Portal</span>
                    <ArrowRight size={17} />
                  </button>
                </>
              )}

              {/* ADMIN LOGIN */}
              {loginRole === 'Admin' && (
                <>
                  <div className="field-group">
                    <label className="field-label">Directorate Officer Name *</label>
                    <div className="input-box">
                      <User size={18} color="#d97706" />
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Dr. Rajeshwar Rao, IAS"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid-2-col">
                    <div className="field-group">
                      <label className="field-label">Badge ID *</label>
                      <div className="input-box">
                        <Tag size={18} color="#d97706" />
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. DIR-0428"
                          value={adminBadge}
                          onChange={(e) => setAdminBadge(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Designation</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Joint Director"
                        value={adminDesignation}
                        onChange={(e) => setAdminDesignation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Password *</label>
                    <div className="input-box">
                      <Lock size={18} color="#d97706" />
                      <input
                        type="password"
                        className="input-field"
                        placeholder="Enter password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn submit-admin">
                    <span>🛡️ Enter Command Center</span>
                    <ArrowRight size={17} />
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {/* =========================================================================
            MODE 2: REGISTER (CREATE ACCOUNT)
           ========================================================================= */}
        {mode === 'register' && (
          <div className="auth-body-content">
            {regError && (
              <div className="auth-error-box">
                <AlertTriangle size={16} />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="form-colorful-stack">
              <div className="field-group">
                <label className="field-label">Account Role</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Farmer', 'Agronomist', 'Admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegRole(r)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: regRole === r ? '1.5px solid #10b981' : '1.5px solid #cbd5e1',
                        background: regRole === r ? '#ecfdf5' : '#f8fafc',
                        color: regRole === r ? '#047857' : '#475569',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {r === 'Farmer' && '🌾 Farmer'}
                      {r === 'Agronomist' && '🔬 Agronomist'}
                      {r === 'Admin' && '🛡️ Admin'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Full Name *</label>
                <div className="input-box">
                  <User size={18} color="#059669" />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2-col">
                <div className="field-group">
                  <label className="field-label">Password *</label>
                  <div className="input-box">
                    <Lock size={18} color="#059669" />
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Create password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Confirm *</label>
                  <div className="input-box">
                    <Lock size={18} color="#059669" />
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Confirm"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn submit-farmer">
                <span>✨ Create {regRole} Account</span>
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
