import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AudioAdvisoryPlayer from '../components/AudioAdvisoryPlayer';
import '../styles/Home.css';
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
  Bug,
  FlaskConical,
  Layers,
  Clock,
  Building2,
  Radio,
  Volume2,
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
            <Link to="/detect" className="primary-cta-btn">
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
              <span>Pest Traps & IoT Sensor Fusion</span>
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} className="icon-green" />
              <span>4-Tier IPDM & Safe Dosage</span>
            </div>
          </div>
        </div>

        <div className="hero-graphic-card">
          <div className="graphic-badge">
            <Activity size={18} className="icon-green" />
            <span>AI Agricultural Radar Active</span>
          </div>

          <div className="graphic-main-box">
            <div className="graphic-image-placeholder">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80"
                alt="AI Disease Scan Preview"
                className="graphic-img"
              />
              <div className="graphic-overlay-box">
                <span className="overlay-tag">Alternaria solani (94.6% Confidence)</span>
              </div>
            </div>

            <div className="graphic-stats-row">
              <div className="g-stat">
                <span className="g-label">Detection Time</span>
                <span className="g-val">0.38s</span>
              </div>
              <div className="g-stat">
                <span className="g-label">IPDM Strategy</span>
                <span className="g-val val-success">4 Tiers</span>
              </div>
              <div className="g-stat">
                <span className="g-label">Expert Review</span>
                <span className="g-val val-success">KVK Verified</span>
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

      {/* VERNACULAR VOICE ADVISORY PLAYER PREVIEW */}
      <section className="transparency-section mb-20">
        <AudioAdvisoryPlayer
          title="CropShield AI Spoken Advisory Preview"
          summaryText="Welcome to CropShield AI. Farmers can listen to localized spoken advisories in Hindi, Punjabi, Marathi, Telugu, Tamil, Bengali, and English."
          advisorySteps={[
            'Scan any leaf photo for instant lesion detection and confidence metrics',
            'View cultural and biological management steps before chemical intervention',
            'Calculate exact chemical dosage and sprayer water requirements for your farm acreage',
          ]}
        />
      </section>

      {/* FEATURES GRID - 6 KEY PILLARS */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">COMPREHENSIVE CROP PROTECTION SUITE</span>
          <h2>Unified Defense from Soil to Harvest</h2>
          <p>Full spectrum solution answering all 11 core capabilities under SIH 2026 Problem Statement SIH26131</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="f-icon-box green-icon"><Scan size={26} /></div>
            <h3>1. Visual AI Disease Detection</h3>
            <p>Upload leaf or crop photos for instant YOLOv8 visual bounding box localization, affected area percentages, and severity scoring.</p>
            <Link to="/detect" className="f-link">Check Crop Health &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box purple-icon"><Bug size={26} /></div>
            <h3>2. Smart Pest-Trap & IoT Sensors</h3>
            <p>Monitor solar pheromone trap counts, Economic Threshold Level (ETL) breaches, canopy temperature, leaf wetness, and soil moisture.</p>
            <Link to="/dashboard" className="f-link">View Pest & Sensor Hub &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box amber-icon"><CloudSun size={26} /></div>
            <h3>3. Weather Risk & Spore Forecast</h3>
            <p>Combines temperature, dew point, and humidity to predict fungal spore dispersal, insect generation cycles, and precision spray timing.</p>
            <Link to="/weather" className="f-link">Check Weather Risk &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box blue-icon"><MapPin size={26} /></div>
            <h3>4. Geospatial Hotspot Mapping</h3>
            <p>Interactive regional maps highlighting disease clusters, trap surges, and 25km quarantine buffer zones for official surveillance.</p>
            <Link to="/map" className="f-link">View Risk Map &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box emerald-icon"><Layers size={26} /></div>
            <h3>5. 4-Tier IPDM & Safe Pesticide Guide</h3>
            <p>Prioritizes cultural, physical, and bio-organic controls with precision acreage dosage calculators, PHI countdowns, and PPE checklists.</p>
            <Link to="/detect" className="f-link">Explore IPDM Engine &rarr;</Link>
          </div>

          <div className="feature-card">
            <div className="f-icon-box red-icon"><Building2 size={26} /></div>
            <h3>6. KVK Lab Referral & Recovery Loop</h3>
            <p>Escalate ambiguous cases to certified agronomists and accredited PCR labs. Monitor Day 0/7/14 field healing to train the AI model.</p>
            <Link to="/expert" className="f-link">Validation & Referrals &rarr;</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="workflow-section">
        <div className="section-header">
          <span className="section-tag">END-TO-END WORKFLOW</span>
          <h2>From Crop Scan to Verified Field Recovery</h2>
        </div>

        <div className="workflow-steps">
          <div className="w-step">
            <div className="w-num">01</div>
            <h4>Photo / Sensor Input</h4>
            <p>Take a leaf photo or connect smart pheromone traps and canopy microclimate sensors.</p>
          </div>

          <div className="w-step">
            <div className="w-num">02</div>
            <h4>YOLOv8 & Weather Fusion</h4>
            <p>Neural vision model identifies lesions while weather data assesses spore germination pressure.</p>
          </div>

          <div className="w-step">
            <div className="w-num">03</div>
            <h4>4-Tier IPDM & Dosage</h4>
            <p>Receive vernacular spoken guidance, bio-controls, and exact tank dilution measurements.</p>
          </div>

          <div className="w-step">
            <div className="w-num">04</div>
            <h4>KVK Escalation & Recovery</h4>
            <p>Refer difficult cases to accredited labs and track 14-day field healing to enrich AI learning.</p>
          </div>
        </div>
      </section>

      {/* TRY SAMPLE CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to Protect Your Crops with CropShield AI?</h2>
          <p>Test instant AI detection on Wheat, Paddy, Tomato, Cotton, and Maize crops with full IPDM recommendations.</p>
          <Link to="/detect" className="primary-cta-btn">
            <Scan size={18} /> Launch AI Disease Detection
          </Link>
        </div>
      </section>
    </div>
  );
}
