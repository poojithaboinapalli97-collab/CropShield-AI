import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ApiModal from './ApiModal';
import {
  Sprout,
  LayoutDashboard,
  Scan,
  CloudSun,
  MapPin,
  UserCheck,
  ShieldCheck,
  Globe,
  Server,
  Menu,
  X,
  LogOut,
  LogIn,
  User,
} from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: t('navHome'), icon: Sprout },
    { path: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { path: '/detect', label: t('navDetect'), icon: Scan, highlight: true },
    { path: '/weather', label: t('navWeather'), icon: CloudSun },
    { path: '/map', label: t('navRiskMap'), icon: MapPin },
    { path: '/expert', label: t('navExpert'), icon: UserCheck },
    { path: '/admin', label: t('navAdmin'), icon: ShieldCheck },
  ];

  return (
    <>
      <header className="main-navbar">
        <div className="nav-container">
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-icon-wrapper">
              <Sprout className="brand-leaf-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-name">CropShield <span className="brand-ai">AI</span></span>
              <span className="brand-sih">SIH 2026 • SIH26131</span>
            </div>
          </Link>

          <nav className={`nav-links-wrapper ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'nav-item-active' : ''} ${item.highlight ? 'nav-item-highlight' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={17} className="nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="nav-actions">
            <div className="lang-select-wrapper">
              <Globe size={16} className="lang-icon" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="lang-select"
                aria-label="Select Language"
              >
                <option value="en">EN (English)</option>
                <option value="hi">HI (हिंदी)</option>
                <option value="mr">MR (मराठी)</option>
                <option value="pa">PA (ਪੰਜਾਬੀ)</option>
                <option value="te">TE (తెలుగు)</option>
                <option value="ta">TA (தமிழ்)</option>
              </select>
            </div>

            <button
              className="api-config-trigger"
              onClick={() => setIsApiModalOpen(true)}
              title="Configure FastAPI / YOLOv8 Endpoint"
            >
              <Server size={15} />
              <span className="api-trigger-text">FastAPI Status</span>
            </button>

            {/* AUTH STATUS BADGE & LOGOUT BUTTON */}
            {isAuthenticated ? (
              <div className="nav-user-badge">
                <span className="user-name-txt"><User size={13} /> {user?.name?.split(' ')[0]}</span>
                <button className="logout-btn-sm" onClick={handleLogout} title="Logout of CropShield AI">
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-nav-btn">
                <LogIn size={15} />
                <span>Login</span>
              </Link>
            )}

            <button
              className="mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <ApiModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </>
  );
}
