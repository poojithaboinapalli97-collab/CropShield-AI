import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Server,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="crop-main-footer">
      <div className="footer-container">
        {/* COLUMN 1: BRAND & SIH 2026 INFO */}
        <div className="footer-brand-column">
          <div className="footer-brand-logo">
            <div className="footer-brand-icon">
              <Sprout size={26} />
            </div>
            <div>
              <span className="footer-brand-name">
                CropShield <span className="brand-ai-text">AI</span>
              </span>
              <span className="footer-sih-tag">SIH 2026 • SIH26131</span>
            </div>
          </div>

          <p className="footer-tagline-desc">
            Early Detection. Smarter Decisions. Healthier Crops.
          </p>
          <p className="footer-sub-desc">
            AI-powered crop health diagnostic & microclimate risk forecasting platform engineered for Smart India Hackathon 2026.
          </p>

          <div className="footer-helpline-box">
            <Phone size={16} className="icon-emerald" />
            <div>
              <span className="helpline-lbl">KVK Agri Helpline (Toll-Free)</span>
              <span className="helpline-num">1800-180-1551</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: QUICK PLATFORM MODULES */}
        <div className="footer-links-column">
          <h4 className="footer-col-title">Platform Modules</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/">Home Overview</Link>
            </li>
            <li>
              <Link to="/dashboard">Farmer Dashboard</Link>
            </li>
            <li>
              <Link to="/detect">AI Disease & Pest Detection</Link>
            </li>
            <li>
              <Link to="/weather">Weather Risk Index</Link>
            </li>
            <li>
              <Link to="/map">Spatial Outbreak Risk Map</Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: AGRONOMIST & GOVERNANCE */}
        <div className="footer-links-column">
          <h4 className="footer-col-title">Agronomist & Governance</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/expert">Expert Agronomist Validation</Link>
            </li>
            <li>
              <Link to="/admin">District Outbreak Control Center</Link>
            </li>
            <li>
              <a href="#fastapi">FastAPI + YOLOv8 Setup</a>
            </li>
            <li>
              <a href="#charter">AI Transparency & Safety Charter</a>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: LIVE AI ENGINE & TRUST BADGES */}
        <div className="footer-info-column">
          <h4 className="footer-col-title">AI Engine Architecture</h4>

          <div className="footer-badge-item">
            <Zap size={16} className="icon-emerald" />
            <div>
              <strong>YOLOv8 Neural Detection</strong>
              <p>Sub-second computer vision lesion bounding boxes</p>
            </div>
          </div>

          <div className="footer-badge-item">
            <Activity size={16} className="icon-emerald" />
            <div>
              <strong>Microclimate Risk Forecasting</strong>
              <p>Correlates relative humidity & dew point spore risk</p>
            </div>
          </div>

          <div className="footer-badge-item">
            <ShieldCheck size={16} className="icon-emerald" />
            <div>
              <strong>IPM Safe Farming Rules</strong>
              <p>Eco-friendly organic spray & field sanitation guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p className="copyright-txt">
            © 2026 <strong>CropShield AI</strong> • SIH 2026 (Problem Statement <strong>SIH26131</strong>) • Built for Indian Farmers & Agriculture
          </p>

          <div className="footer-bottom-badges">
            <span className="bottom-pill">
              <CheckCircle2 size={12} className="icon-emerald" /> YOLOv8 Vision Active
            </span>
            <span className="bottom-pill">
              <Server size={12} className="icon-emerald" /> FastAPI Backend Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
