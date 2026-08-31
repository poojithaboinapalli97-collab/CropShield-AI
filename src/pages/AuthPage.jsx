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
  ArrowLeft,
  CheckCircle2,
  Tractor,
  Briefcase,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Login form state
  const [loginName, setLoginName] = useState('Sardar Rameshwar Singh');
  const [loginPassword, setLoginPassword] = useState('demo123');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('Farmer');
  const [regError, setRegError] = useState('');

  // Quick Fill Demo Credentials
  const handleQuickFill = () => {
    setLoginName('Sardar Rameshwar Singh');
    setLoginPassword('demo123');
    setLoginError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginName.trim()) {
      setLoginError('Please enter your full name.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password.');
      return;
    }

    // Demo Authentication Validation
    login(loginName, 'Farmer');
    navigate('/dashboard');
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

    // Save temporary session & redirect
    login(regName, regRole);
    if (regRole === 'Agriculture Expert') {
      navigate('/expert');
    } else {
      navigate('/dashboard');
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
            <strong>SIH Prototype Mode:</strong> Instant access demo enabled. Switch role or fill details to test.
          </span>
        </div>
      </div>

      {/* WHITE BOX 3: MAIN FORM & TABS CARD */}
      <div className="auth-white-card auth-main-form-card">
        {/* MODE TOGGLE TABS */}
        <div className="auth-tabs-header-white">
          <button
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

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' && (
          <div className="auth-form-body">
            <div className="auth-form-title-group">
              <h2>Welcome Back</h2>
              <p>Sign in to access your crop health dashboard & risk alerts</p>
            </div>

            {loginError && (
              <div className="notice-banner banner-danger mb-12">
                <AlertTriangle size={16} /> {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input icon-padded"
                    placeholder="e.g. Sardar Rameshwar Singh"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-input icon-padded"
                    placeholder="Enter demo password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* DEMO CREDENTIALS QUICK FILL WHITE CARD */}
              <div className="demo-credentials-card-white">
                <div className="demo-credentials-header">
                  <Sparkles size={16} className="icon-amber" />
                  <strong>Demo Account Credentials</strong>
                </div>
                <div className="demo-credentials-details">
                  <p>
                    Name: <code>Sardar Rameshwar Singh</code>
                  </p>
                  <p>
                    Password: <code>demo123</code>
                  </p>
                </div>
                <button
                  type="button"
                  className="quick-fill-btn"
                  onClick={handleQuickFill}
                >
                  ⚡ Auto-Fill Demo Credentials
                </button>
              </div>

              <button type="submit" className="primary-btn-sm auth-submit-btn">
                <LogIn size={20} /> Login to CropShield AI
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

        {/* MODE 2: CREATE ACCOUNT FORM */}
        {mode === 'register' && (
          <div className="auth-form-body">
            <div className="auth-form-title-group">
              <h2>Join CropShield AI</h2>
              <p>Select your role and create an account for risk forecasting</p>
            </div>

            {regError && (
              <div className="notice-banner banner-danger mb-12">
                <AlertTriangle size={16} /> {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="auth-form">
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
                  />
                </div>
              </div>

              {/* ROLE SELECTION WHITE BOX CARDS */}
              <div className="form-group">
                <label className="form-label">Select Your Role</label>
                <div className="role-selector-grid">
                  <div
                    className={`role-box-card ${
                      regRole === 'Farmer' ? 'selected' : ''
                    }`}
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
                    className={`role-box-card ${
                      regRole === 'Extension Worker' ? 'selected' : ''
                    }`}
                    onClick={() => setRegRole('Extension Worker')}
                  >
                    <div className="role-card-header">
                      <Briefcase size={22} className="role-icon" />
                      {regRole === 'Extension Worker' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Extension Worker</div>
                    <div className="role-card-desc">Field Reports & Survey</div>
                  </div>

                  <div
                    className={`role-box-card ${
                      regRole === 'Agriculture Expert' ? 'selected' : ''
                    }`}
                    onClick={() => setRegRole('Agriculture Expert')}
                  >
                    <div className="role-card-header">
                      <Stethoscope size={22} className="role-icon" />
                      {regRole === 'Agriculture Expert' && (
                        <CheckCircle2 size={16} className="role-check-icon" />
                      )}
                    </div>
                    <div className="role-card-title">Agri Expert</div>
                    <div className="role-card-desc">Validation & Advisory</div>
                  </div>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Create Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input icon-padded"
                      placeholder="Create password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
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
                      placeholder="Confirm password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="auth-button-group">
                <button
                  type="submit"
                  className="primary-btn-sm auth-submit-btn"
                >
                  <UserPlus size={20} /> Create Account
                </button>

                <button
                  type="button"
                  className="secondary-btn-sm"
                  onClick={() => setMode('login')}
                >
                  <ArrowLeft size={16} /> Back to Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

