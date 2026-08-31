import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Scan,
  CloudSun,
  MapPin,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Award,
  LayoutDashboard,
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="sih-tag-pill">
            <Sparkles size={14} className="icon-gold" />
            <span>{t('heroTag')}</span>
          </div>

          <h1 className="hero-headline">
            Detect Early. <br />
            <span className="hero-highlight">Shield Harvests.</span>
          </h1>

          <p className="hero-description">{t('heroDesc')}</p>

          <div className="hero-cta-group">
            <Link to="/dashboard" className="primary-cta-btn">
              <Scan size={18} />
              <span>{t('btnCheckCrop')}</span>
            </Link>

            <Link to="/dashboard" className="secondary-cta-btn">
              <LayoutDashboard size={18} />
              <span>{t('btnDashboard')}</span>
            </Link>
          </div>

          <div className="hero-trust-row">
            <div className="trust-item">
              <CheckCircle2 size={16} className="icon-green" />
              <span>YOLOv8 Computer Vision</span>
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} className="icon-green" />
              <span>Weather Microclimate Fusion</span>
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} className="icon-green" />
              <span>FastAPI Backend Ready</span>
            </div>
          </div>
        </div>

        <div className="hero-graphic-card">
          <div className="graphic-badge">
            <Activity size={18} className="icon-green" />
            <span>Live AI System Active</span>
          </div>

          <div className="graphic-main-box">
            <div className="graphic-image-placeholder">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80"
                alt="AI Disease Scan Preview"
                className="graphic-img"
              />
              <div className="graphic-overlay-box">
                <span className="overlay-tag">Alternaria solani (94.6%)</span>
              </div>
            </div>

            <div className="graphic-stats-row">
              <div className="g-stat">
                <span className="g-label">Detection Time</span>
                <span className="g-val">0.42s</span>
              </div>
              <div className="g-stat">
                <span className="g-label">Threat Severity</span>
                <span className="g-val val-danger">High</span>
              </div>
              <div className="g-stat">
                <span className="g-label">Expert Review</span>
                <span className="g-val val-success">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS & STATS COUNTER */}
      <section className="stats-banner">
        <div className="stat-card">
          <div className="stat-icon-bg"><Zap size={22} /></div>
          <div>
            <h3 className="stat-number">48,920+</h3>
            <p className="stat-title">{t('statScans')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg"><Award size={22} /></div>
          <div>
            <h3 className="stat-number">94.8%</h3>
            <p className="stat-title">{t('statAccuracy')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg"><MapPin size={22} /></div>
          <div>
            <h3 className="stat-number">120+</h3>
            <p className="stat-title">{t('statDistricts')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg"><Activity size={22} /></div>
          <div>
            <h3 className="stat-number">&lt; 0.5s</h3>
            <p className="stat-title">{t('statResponse')}</p>
          </div>
        </div>
      </section>

      {/* AI TRANSPARENCY & ASSURANCE SECTION */}
      <section className="transparency-section">
        <div className="transparency-card">
          <div className="transparency-icon">
            <ShieldCheck size={28} className="icon-green" />
          </div>
          <div className="transparency-content">
            <h3>{t('disclaimerTitle')}</h3>
            <p>{t('disclaimerDesc')}</p>
          </div>
          <Link to="/expert" className="transparency-link">
            Meet Our Agronomist Network &rarr;
          </Link>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">SMART AGRICULTURE PLATFORM</span>
          <h2>One Unified Shield for Crop Protection</h2>
          <p>Designed specifically to solve agricultural losses under SIH 2026 Problem Statement SIH26131</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="f-icon-box green-icon"><Scan size={26} /></div>
            <h3>YOLOv8 AI Detection</h3>
            <p>Upload leaf or crop photos to get instant visual bounding box detection with exact confidence scores and scientific taxonomy.</p>
            <Link to="/dashboard" className="f-link">Check Crop Health &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box amber-icon"><CloudSun size={26} /></div>
            <h3>Weather Risk Engine</h3>
            <p>Combines temperature, dew point, and humidity index to predict fungal spore dispersal and pest vulnerability 7 days ahead.</p>
            <Link to="/weather" className="f-link">Check Weather Risk &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box blue-icon"><MapPin size={26} /></div>
            <h3>Spatial Hotspot Mapping</h3>
            <p>Interactive regional maps highlighting high-risk outbreak districts so agricultural authorities can deploy targeted alerts.</p>
            <Link to="/map" className="f-link">View Risk Map &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box purple-icon"><UserCheck size={26} /></div>
            <h3>Human Expert Validation</h3>
            <p>Certified agronomists validate AI diagnoses for complex cases, giving farmers 100% confidence before applying treatments.</p>
            <Link to="/expert" className="f-link">Validation Portal &rarr;</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="workflow-section">
        <div className="section-header">
          <span className="section-tag">STEP-BY-STEP WORKFLOW</span>
          <h2>From Crop Scan to Verified Field Guidance</h2>
        </div>

        <div className="workflow-steps">
          <div className="w-step">
            <div className="w-num">01</div>
            <h4>Upload Photo</h4>
            <p>Take or upload a crisp photo of affected leaf or stem using mobile or browser.</p>
          </div>

          <div className="w-step">
            <div className="w-num">02</div>
            <h4>YOLOv8 Inference</h4>
            <p>AI scans bounding regions, identifies symptoms, and computes confidence score.</p>
          </div>

          <div className="w-step">
            <div className="w-num">03</div>
            <h4>Microclimate Fusion</h4>
            <p>Local weather parameters (humidity, dew point) are combined to grade disease severity.</p>
          </div>

          <div className="w-step">
            <div className="w-num">04</div>
            <h4>Act with Remedies</h4>
            <p>Receive organic & chemical dosage guidelines or request expert agronomist verification.</p>
          </div>
        </div>
      </section>

      {/* TRY SAMPLE CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to Test CropShield AI?</h2>
          <p>Try our preset AI detection samples for Wheat, Paddy, Tomato, and Cotton right now.</p>
          <Link to="/dashboard" className="primary-cta-btn">
            <Scan size={18} /> Launch Crop Health Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
