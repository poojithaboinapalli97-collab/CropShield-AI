import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  LayoutDashboard,
  Scan,
  CloudSun,
  MapPin,
  UserCheck,
  ShieldCheck,
  Globe,
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const role = user?.role || (isAuthenticated ? 'Farmer' : null);

    if (role === 'Farmer') {
      return [
        { path: '/', label: t('navHome'), icon: Sprout },
        { path: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { path: '/detect', label: t('navDetect'), icon: Scan, highlight: true },
        { path: '/weather', label: t('navWeather'), icon: CloudSun },
      ];
    }

    if (role === 'Agronomist' || role === 'Expert') {
      return [
        { path: '/', label: t('navHome'), icon: Sprout },
        { path: '/expert', label: t('navExpert'), icon: UserCheck, highlight: true },
        { path: '/detect', label: t('navDetect'), icon: Scan },
        { path: '/map', label: t('navRiskMap'), icon: MapPin },
        { path: '/weather', label: t('navWeather'), icon: CloudSun },
      ];
    }

    if (role === 'Admin' || role === 'Government Official') {
      return [
        { path: '/', label: t('navHome'), icon: Sprout },
        { path: '/admin', label: t('navAdmin'), icon: ShieldCheck, highlight: true },
        { path: '/map', label: t('navRiskMap'), icon: MapPin },
        { path: '/expert', label: t('navExpert'), icon: UserCheck },
        { path: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { path: '/detect', label: t('navDetect'), icon: Scan },
        { path: '/weather', label: t('navWeather'), icon: CloudSun },
      ];
    }

    // Default / Guest (Unauthenticated)
    return [
      { path: '/', label: t('navHome'), icon: Sprout },
      { path: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
      { path: '/detect', label: t('navDetect'), icon: Scan, highlight: true },
      { path: '/weather', label: t('navWeather'), icon: CloudSun },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="main-navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <Sprout className="brand-leaf-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">CropShield <span className="brand-ai">AI</span></span>
            <span className="brand-sih">PRECISION AGRI-VISION</span>
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
              <option value="bn">BN (বাংলা)</option>
            </select>
          </div>

          {/* AUTH STATUS BADGE & LOGOUT BUTTON */}
          {isAuthenticated ? (
            <div className="nav-user-badge">
              <span className="user-name-txt">
                <User size={13} /> {user?.name?.split(' ')[0]} {user?.role ? `(${user.role})` : ''}
              </span>
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
  );
}
