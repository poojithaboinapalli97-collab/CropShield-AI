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
      <div className="auth-card-single">
        {/* TOP BRAND HEADER (TITLE NAME ONLY) */}
        <div className="auth-card-header-center">
          <div className="auth-logo-row">
            <div className="brand-icon-wrapper-large">
              <Sprout size={28} />
            </div>
            <div>
              <h1 className="auth-brand-name-title">
                CropShield <span className="brand-ai">AI</span>
              </h1>
              <span className="brand-sih-tag">SIH 2026 • SIH26131</span>
            </div>
          </div>
          <p className="auth-tagline-subtitle">
            Early Detection. Smarter Decisions. Healthier Crops.
          </p>
        </div>

        {/* AUTH FORM CONTAINER */}
        <div className="auth-form-centered-body">
          <div className="auth-demo-disclaimer-center">
            <Info size={14} className="icon-amber" />
            <span>SIH Prototype Demo Authentication</span>
          </div>

          {/* MODE TOGGLE TABS */}
          <div className="auth-tabs-header">
            <button
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setLoginError(''); setRegError(''); }}
            >
              <LogIn size={16} /> Login
            </button>
            <button
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setLoginError(''); setRegError(''); }}
            >
              <UserPlus size={16} /> Create Account
            </button>
          </div>

          {/* MODE 1: LOGIN FORM */}
          {mode === 'login' && (
            <div className="auth-form-body">
              <div className="auth-form-title-group">
                <h2>Welcome Back to CropShield AI</h2>
                <p>Enter your credentials to access your smart farmer dashboard</p>
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
                    <User size={16} className="input-icon" />
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
                    <Lock size={16} className="input-icon" />
                    <input
                      type="password"
                      className="form-input icon-padded"
                      placeholder="Enter demo password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="demo-credentials-box">
                  <strong>Demo Account Credentials:</strong>
                  <p>Name: <code>Sardar Rameshwar Singh</code> | Password: <code>demo123</code></p>
                </div>

                <button type="submit" className="primary-btn-sm auth-submit-btn">
                  <LogIn size={18} /> Login to CropShield AI
                </button>

                <div className="auth-switch-prompt">
                  <span>Don't have an account?</span>
                  <button type="button" className="auth-inline-link" onClick={() => setMode('register')}>
                    Create Account &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODE 2: CREATE ACCOUNT FORM */}
          {mode === 'register' && (
            <div className="auth-form-body">
              <div className="auth-form-title-group">
                <h2>Create Your CropShield Account</h2>
                <p>Join India's AI-powered crop health & risk forecasting network</p>
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
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      className="form-input icon-padded"
                      placeholder="e.g. Gurpreet Singh"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="form-select"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Extension Worker">Extension Worker</option>
                    <option value="Agriculture Expert">Agriculture Expert</option>
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Create Password *</label>
                    <div className="input-with-icon">
                      <Lock size={16} className="input-icon" />
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
                      <Lock size={16} className="input-icon" />
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
                  <button type="submit" className="primary-btn-sm auth-submit-btn">
                    <UserPlus size={18} /> Create Account
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
    </div>
  );
}
