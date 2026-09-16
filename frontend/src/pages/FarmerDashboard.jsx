import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Scan,
  CloudSun,
  MapPin,
  Settings,
  Leaf,
  Phone,
  Droplets,
  Wind,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  X,
  Thermometer,
  ShieldAlert,
  Volume2,
  TrendingUp,
  Sparkles,
  Upload,
  Brain,
  Scale,
  Tractor,
  Activity,
  MessageSquare,
  Clock,
  Check,
  UserCheck,
  Send,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

import { mockWeather } from '../data/mockData';
import { indianStates, stateDistrictMap } from '../data/indiaLocations';
import { getStoredScans } from '../utils/scanHistory';
import { getExactDiseaseAdvisory } from '../data/diseaseAdvisories';
import '../styles/FarmerDashboard.css';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [expertModalTab, setExpertModalTab] = useState('answers'); // 'answers' | 'ask'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingAnswerId, setPlayingAnswerId] = useState(null);

  const [expertQuestion, setExpertQuestion] = useState('');
  const [expertUrgency, setExpertUrgency] = useState('Medium');
  const [expertSubmitted, setExpertSubmitted] = useState(false);

  // Farmer & Field Profile State
  const [farmerName, setFarmerName] = useState(() => user?.name || 'Poojitha Boinapalli');
  const [selectedCrop, setSelectedCrop] = useState(() => user?.crop || 'Tomato');
  const [growthStage, setGrowthStage] = useState('Flowering & Fruiting');
  const [selectedState, setSelectedState] = useState(() => user?.state || localStorage.getItem('selectedState') || 'Andhra Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState(() => user?.district || localStorage.getItem('selectedDistrict') || 'Guntur');
  const [selectedVillage, setSelectedVillage] = useState(() => user?.village || localStorage.getItem('selectedVillage') || 'Vennaram');

  // Editable fields for Ask Expert modal
  const [expertCrop, setExpertCrop] = useState(() => user?.crop || 'Tomato');
  const [expertLocation, setExpertLocation] = useState(() => {
    const v = user?.village || localStorage.getItem('selectedVillage') || 'Vennaram';
    const d = user?.district || localStorage.getItem('selectedDistrict') || 'Guntur';
    const s = user?.state || localStorage.getItem('selectedState') || 'Andhra Pradesh';
    return `${v}, ${d} (${s})`;
  });

  // Real Scans from LocalStorage
  const [recentScans, setRecentScans] = useState([]);

  // Consultations & Expert Answers State
  const [consultations, setConsultations] = useState(() => {
    try {
      const stored = localStorage.getItem('cropshield_farmer_queries');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'Q-8492',
        crop: 'Tomato',
        stage: 'Flowering Stage',
        question: 'My tomato leaves have small black greasy spots with yellow halos. Fruits also show tiny scabby spots. Which spray should I apply?',
        date: 'Today, 09:15 AM',
        status: 'Answered',
        expert: {
          name: 'Dr. K. Ramanjaneyulu, Ph.D.',
          designation: 'Senior Plant Pathologist & KVK Specialist',
          station: 'Krishi Vigyan Kendra (KVK) Lam Farm, Guntur',
          phone: '+91 863 252 4001',
          diagnosis: 'Tomato Bacterial Spot (Xanthomonas perforans)',
          prescription: 'Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 100 ppm (1g in 10L water). Cease all overhead sprinkler watering immediately to avoid bacterial splash. Apply during early morning.',
          chemicals: ['Copper Oxychloride 50% WP @ 2.5 g/L', 'Streptocycline @ 100 ppm (1g/10L)', 'Kasugamycin 3% SL @ 2.0 ml/L'],
          phi: '3 Days Pre-Harvest Interval',
        }
      },
      {
        id: 'Q-8310',
        crop: 'Tomato',
        stage: 'Vegetative Stage',
        question: 'What is the best bio-fungicide dosage to prevent early fungal damping-off and root rot in heavy black soil?',
        date: '3 days ago',
        status: 'Answered',
        expert: {
          name: 'Dr. S. V. Krishna Rao',
          designation: 'Principal Agronomist & ICAR Consultant',
          station: 'Regional Agricultural Research Station (RARS)',
          phone: '+91 863 252 4002',
          diagnosis: 'Root Rot Prevention & Soil Conditioning',
          prescription: 'Apply Trichoderma viride @ 5 g/L or Pseudomonas fluorescens @ 5 g/L near root zone. Mix 2.5 kg Trichoderma with 100 kg well-decomposed Farm Yard Manure (FYM) per acre.',
          chemicals: ['Trichoderma viride 1.5% WP @ 5 g/L', 'Pseudomonas fluorescens @ 5 g/L'],
          phi: '0 Days (Organic Bio-Agent)',
        }
      }
    ];
  });

  useEffect(() => {
    const loadScans = () => {
      const stored = getStoredScans();
      setRecentScans(stored);
    };
    loadScans();

    window.addEventListener('cropshield_scans_updated', loadScans);
    window.addEventListener('cropshield_mandi_updated', loadMandi);
    return () => {
      window.removeEventListener('cropshield_scans_updated', loadScans);
      window.removeEventListener('cropshield_mandi_updated', loadMandi);
    };
  }, []);

  const [mandiRatesList, setMandiRatesList] = useState(() => {
    try {
      const stored = localStorage.getItem('cropshield_mandi_rates');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const loadMandi = () => {
    try {
      const stored = localStorage.getItem('cropshield_mandi_rates');
      if (stored) setMandiRatesList(JSON.parse(stored));
    } catch {}
  };

  const handleSaveLocation = () => {
    localStorage.setItem('selectedState', selectedState);
    localStorage.setItem('selectedDistrict', selectedDistrict);
    localStorage.setItem('selectedVillage', selectedVillage);
    setExpertCrop(selectedCrop);
    setExpertLocation(`${selectedVillage}, ${selectedDistrict} (${selectedState})`);
    if (updateUser) {
      updateUser({ state: selectedState, district: selectedDistrict, village: selectedVillage, crop: selectedCrop, name: farmerName });
    }
    setShowLocationModal(false);
  };

  const handleQuickUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      navigate('/detect');
    }
  };

  const currentTemp = mockWeather.current?.temp || 29.4;
  const currentHumidity = mockWeather.current?.humidity || 86;
  const currentWind = mockWeather.current?.windSpeed || 14.5;
  const currentCondition = mockWeather.current?.condition || 'Overcast & High Moisture';

  const latestScan = recentScans.length > 0 ? recentScans[0] : null;
  const isNewUser = !latestScan;

  const currentCrop = latestScan?.crop || selectedCrop || 'Tomato';
  const currentDisease = latestScan?.disease || (isNewUser ? 'Awaiting 1st Scan' : 'Healthy Field');
  const isHealthy = currentDisease.toLowerCase().includes('healthy') || isNewUser;

  const activeAdvisory = latestScan
    ? getExactDiseaseAdvisory(latestScan.rawDisease || latestScan.disease, currentCrop)
    : getExactDiseaseAdvisory('healthy', currentCrop) || {
        summary: `Maintain optimal soil moisture and scout ${currentCrop} foliage every 3 days.`,
        actions: [
          `No chemical fungicide or bactericide spray required. Continue routine organic field maintenance.`,
          `Apply foliar Calcium Nitrate @ 2.0 g/L + Boron @ 1.0 g/L during fruit-set to prevent blossom-end rot.`,
          `Inspect leaf undersides for early whitefly, mites or fungal spots.`,
          `Ensure clean drip irrigation and weed-free field borders.`,
        ],
      };

  // Dynamically constructed today's action plan tasks based on the uploaded scan!
  const todayTasks = isNewUser
    ? [
        {
          tag: 'Leaf Scan',
          tagClass: 'task-tag-spray',
          time: 'Step 1: Detect',
          desc: `📸 Upload or snap a leaf photo of your ${currentCrop} to diagnose pathogens & get exact CIBRC chemical prescriptions.`,
          isCta: true,
        },
        {
          tag: 'Irrigation',
          tagClass: 'task-tag-water',
          time: 'Tomorrow 06:30 AM',
          desc: `Run Drip Irrigation for 45 mins. Soil moisture is optimal. Avoid overhead sprinkler waterlogging.`,
        },
        {
          tag: 'Scouting',
          tagClass: 'task-tag-scout',
          time: 'Morning Inspection',
          desc: `Inspect lower canopy foliage for early sucking pests (whiteflies, thrips) or yellow spot symptoms.`,
        },
      ]
    : isHealthy
    ? [
        {
          tag: 'Nutrient & Bio-Spray',
          tagClass: 'task-tag-spray',
          time: '06:00 AM – 10:00 AM',
          desc: activeAdvisory.actions[1] || `Apply foliar micronutrients & organic bio-stimulant for vigorous crop growth.`,
        },
        {
          tag: 'Irrigation',
          tagClass: 'task-tag-water',
          time: 'Tomorrow 06:30 AM',
          desc: `Run Drip Irrigation for 40-45 mins. Soil moisture is at 68%. Maintain uniform root-zone moisture.`,
        },
        {
          tag: 'Field Scouting',
          tagClass: 'task-tag-scout',
          time: 'Midday Inspection',
          desc: activeAdvisory.actions[2] || `Inspect leaf undersides for early pest presence and keep border rows clean.`,
        },
      ]
    : [
        {
          tag: 'Targeted Rx Spray',
          tagClass: 'task-tag-spray',
          time: '06:00 AM – 10:00 AM',
          desc: activeAdvisory.actions[0] || `Apply recommended fungicide / bactericide spray in morning hours.`,
        },
        {
          tag: 'Irrigation & Drainage',
          tagClass: 'task-tag-water',
          time: 'Immediate Field Action',
          desc: activeAdvisory.actions[1] || `Avoid overhead sprinkler irrigation to prevent splash dispersal of ${currentDisease}.`,
        },
        {
          tag: 'Scouting & Monitoring',
          tagClass: 'task-tag-scout',
          time: 'Day 0 Post-Scan',
          desc: activeAdvisory.actions[2] || `Prune severely infected foliage and isolate the hotspot area.`,
        },
      ];

  // Text-to-Speech audio reader for today's actions
  const handlePlayAdvisoryAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const textToSpeak = isNewUser
        ? `Welcome to CropShield AI. You have not scanned a leaf yet. Please click Step 1 to snap a leaf photo of your ${currentCrop} for instant pathogen diagnosis and customized spray dosage.`
        : `Today's Farm Action Plan for ${currentCrop} diagnosed with ${currentDisease}. Action 1: ${todayTasks[0].desc}. Action 2: ${todayTasks[1].desc}. Action 3: ${todayTasks[2].desc}.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Text-to-Speech audio reader for expert answers
  const handlePlayExpertAnswer = (item) => {
    if ('speechSynthesis' in window) {
      if (playingAnswerId === item.id) {
        window.speechSynthesis.cancel();
        setPlayingAnswerId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const textToSpeak = `Expert Answer from ${item.expert.name} at ${item.expert.station}. Diagnosis: ${item.expert.diagnosis}. Prescription: ${item.expert.prescription}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingAnswerId(null);
      utterance.onerror = () => setPlayingAnswerId(null);

      setPlayingAnswerId(item.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExpertSubmit = (e) => {
    e.preventDefault();
    if (!expertQuestion.trim()) return;

    const chosenCrop = expertCrop || selectedCrop;
    const chosenLocation = expertLocation || `${selectedVillage}, ${selectedDistrict} (${selectedState})`;

    // Create realistic new consultation query
    const newQuery = {
      id: 'Q-' + Math.floor(1000 + Math.random() * 9000),
      crop: chosenCrop,
      stage: growthStage,
      question: expertQuestion.trim(),
      location: chosenLocation,
      urgency: expertUrgency,
      date: 'Just now',
      status: 'Answered',
      expert: {
        name: 'Dr. K. Ramanjaneyulu, Ph.D.',
        designation: 'Senior Plant Pathologist & KVK Specialist',
        station: `KVK Agricultural Science Center, ${selectedDistrict}`,
        phone: '+91 863 252 4001',
        diagnosis: `${chosenCrop} Foliar Protection & Targeted Prescription`,
        prescription: `Based on your symptoms in ${chosenCrop} at ${chosenLocation}, apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Copper Hydroxide 53.8% DF @ 2.0 g/L. Spray during cool morning hours (06:00 AM – 10:00 AM).`,
        chemicals: ['Azoxystrobin + Difenoconazole @ 1.0 ml/L', 'Copper Hydroxide 53.8% DF @ 2.0 g/L'],
        phi: '5 Days Pre-Harvest Interval',
      }
    };

    const updated = [newQuery, ...consultations];
    setConsultations(updated);
    try {
      localStorage.setItem('cropshield_farmer_queries', JSON.stringify(updated));
    } catch {}

    setExpertSubmitted(true);
    setTimeout(() => {
      setExpertSubmitted(false);
      setExpertQuestion('');
      setExpertModalTab('answers');
    }, 1200);
  };

  const latestAnswer = consultations.length > 0 ? consultations[0] : null;

  return (
    <div className="farmer-dash-page">
      {/* ================= 1. HORIZONTAL TOP FARMER PROFILE BAR ================= */}
      <header className="farmer-top-summary-bar">
        <div className="farmer-info-left">
          <div className="farmer-avatar-circle">
            <img src="/farmer-ploughing.jpg" alt="Farmer avatar" />
          </div>

          <div className="farmer-meta-stack">
            <h1 className="farmer-name-heading">
              {user?.name || farmerName}
              <span className="farmer-tag-pill">
                <ShieldCheck size={13} /> Kisan Verified
              </span>
            </h1>

            <div className="farmer-sub-details">
              <span>📍 <strong>{selectedVillage}, {selectedDistrict}</strong> ({selectedState})</span>
              <span>•</span>
              <span>🌾 Active Crop: <span className="crop-badge-highlight">{selectedCrop}</span></span>
              <span>•</span>
              <span>🌱 Stage: <strong>{growthStage.split(' ')[0]}</strong></span>
            </div>
          </div>
        </div>

        <div className="farmer-top-actions">
          <button
            type="button"
            className="btn-pill-action btn-settings-pill"
            onClick={() => setShowLocationModal(true)}
          >
            <Settings size={14} />
            <span>Change Crop / Location</span>
          </button>

          <a
            href="tel:18001801551"
            className="btn-pill-action btn-phone-pill"
            title="Kisan Call Centre Toll-Free"
          >
            <Phone size={14} />
            <span>Helpline: 1800-180-1551</span>
          </a>
        </div>
      </header>

      {/* ================= 2. TODAY'S ACTION CARD (PROMINENT TOP BANNER) ================= */}
      <section className="today-action-card">
        <div className="today-action-header">
          <div className="today-action-title-group">
            <div className="today-action-badge-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="today-action-h2">Today's Priority Action Plan</h2>
              <p className="today-action-sub">
                {currentCrop} • {latestScan ? `Diagnosis: ${latestScan.disease} (${latestScan.confidence}% match)` : `${growthStage} • Awaiting 1st Scan`} • {selectedDistrict}
              </p>
            </div>
          </div>

          <div className="today-action-tools">
            <button
              type="button"
              className="today-audio-listen-btn"
              onClick={handlePlayAdvisoryAudio}
            >
              <Volume2 size={14} />
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen Action Plan'}</span>
            </button>
          </div>
        </div>

        <div className="today-tasks-row">
          {todayTasks.map((task, idx) => (
            <div
              key={idx}
              className="today-task-chip"
              style={task.isCta ? { cursor: 'pointer', border: '1.5px dashed #16a34a', background: '#f0fdf4' } : {}}
              onClick={task.isCta ? () => navigate('/detect') : undefined}
            >
              <div className="today-task-top">
                <span className={`task-tag-pill ${task.tagClass}`}>{task.tag}</span>
                <span className="task-time-txt">{task.time}</span>
              </div>
              <p className="today-task-desc">
                {task.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. DETECT → UNDERSTAND → DECIDE → ACT → MONITOR (5-STEP LIFECYCLE) ================= */}
      <section className="farmer-lifecycle-card">
        <div className="lifecycle-header">
          <div className="lifecycle-title-group">
            <Activity size={17} color="#16a34a" />
            <span>Farm Protection Workflow: Detect → Understand → Decide → Act → Monitor</span>
          </div>
        </div>

        <div className="lifecycle-steps-grid">
          {/* STEP 1: DETECT */}
          <div className="lifecycle-step-item" onClick={() => navigate('/detect')}>
            <span className="lifecycle-step-num">Step 1</span>
            <div className="lifecycle-step-icon step-ic-green">
              <Scan size={18} />
            </div>
            <span className="lifecycle-step-name">1. Detect</span>
            <span className="lifecycle-step-desc">Upload / snap leaf photo</span>
          </div>

          {/* STEP 2: UNDERSTAND */}
          <div className="lifecycle-step-item" onClick={() => navigate('/detect')}>
            <span className="lifecycle-step-num">Step 2</span>
            <div className="lifecycle-step-icon step-ic-blue">
              <Brain size={18} />
            </div>
            <span className="lifecycle-step-name">2. Understand</span>
            <span className="lifecycle-step-desc">YOLO AI pathogen diagnosis</span>
          </div>

          {/* STEP 3: DECIDE */}
          <div className="lifecycle-step-item" onClick={() => navigate('/detect')}>
            <span className="lifecycle-step-num">Step 3</span>
            <div className="lifecycle-step-icon step-ic-purple">
              <Scale size={18} />
            </div>
            <span className="lifecycle-step-name">3. Decide</span>
            <span className="lifecycle-step-desc">4-Tier IPDM & CIBRC dosage</span>
          </div>

          {/* STEP 4: ACT */}
          <div className="lifecycle-step-item" onClick={() => navigate('/weather')}>
            <span className="lifecycle-step-num">Step 4</span>
            <div className="lifecycle-step-icon step-ic-amber">
              <Tractor size={18} />
            </div>
            <span className="lifecycle-step-name">4. Act</span>
            <span className="lifecycle-step-desc">Spray in safe weather window</span>
          </div>

          {/* STEP 5: MONITOR */}
          <div className="lifecycle-step-item" onClick={() => navigate('/dashboard')}>
            <span className="lifecycle-step-num">Step 5</span>
            <div className="lifecycle-step-icon step-ic-emerald">
              <Activity size={18} />
            </div>
            <span className="lifecycle-step-name">5. Monitor</span>
            <span className="lifecycle-step-desc">Day 0/7/14 field healing loop</span>
          </div>
        </div>
      </section>

      {/* ================= 4. LIVE APMC MANDI MARKET RATES STRIP ================= */}
      {(() => {
        const activeMandiItem = (mandiRatesList || []).find((m) =>
          m.crop.toLowerCase().includes(currentCrop.toLowerCase()) || currentCrop.toLowerCase().includes(m.crop.toLowerCase())
        ) || {
          crop: currentCrop,
          price: 2100,
          trend: '+150',
          minPrice: 1850,
          maxPrice: 2400,
        };

        return (
          <div className="farmer-mandi-strip">
            <div className="mandi-item-group">
              <span className="mandi-badge">APMC Mandi Rates</span>
              <span><strong>{selectedDistrict} Mandi ({currentCrop}):</strong></span>
              <span className="mandi-price-val">₹{activeMandiItem.price?.toLocaleString('en-IN')} / Quintal</span>
              <span className="mandi-trend-up">
                <TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> ↗ {activeMandiItem.trend?.startsWith('+') ? activeMandiItem.trend : `+₹${activeMandiItem.trend}`} Today
              </span>
              <span style={{ color: '#64748b' }}>• Modal Range: ₹{activeMandiItem.minPrice?.toLocaleString('en-IN')} - ₹{activeMandiItem.maxPrice?.toLocaleString('en-IN')}</span>
            </div>

            <div className="scheme-status-badge">
              <CheckCircle2 size={14} color="#16a34a" />
              <span>PM-Kisan & Fasal Bima: <strong>Active</strong></span>
            </div>
          </div>
        );
      })()}

      {/* ================= 5. HORIZONTAL 3 ESSENTIAL CARDS (THE MAIN WORKSPACE) ================= */}
      <main className="farmer-essential-grid">
        {/* CARD 1: INSTANT LEAF SCANNER (PRIMARY ACTION) */}
        <div className="essential-card scan-highlight-card">
          <div>
            <div className="card-header-simple">
              <div className="card-header-left-title">
                <div className="header-icon-box icon-box-green">
                  <Scan size={20} />
                </div>
                <h2 className="card-heading-title">1. Instant AI Leaf Scanner</h2>
              </div>
            </div>

            <div className="scan-box-content">
              <p className="scan-prompt-text">
                Found unusual spots, yellowing, or pests on your crop? Snap a photo to identify diseases instantly.
              </p>
              <div className="scan-bullets">
                <span>✓ Instant disease name & severity</span>
                <span>✓ ICAR recommended chemical & bio-dosage</span>
                <span>✓ Vernacular audio advisory</span>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleQuickUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="scan-cta-large-btn"
            onClick={() => navigate('/detect')}
          >
            <Scan size={18} />
            <span>Take Photo / Upload Leaf</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* CARD 2: TODAY'S WEATHER & SPRAY WINDOW */}
        <div className="essential-card weather-highlight-card">
          <div>
            <div className="card-header-simple">
              <div className="card-header-left-title">
                <div className="header-icon-box icon-box-blue">
                  <CloudSun size={20} />
                </div>
                <h2 className="card-heading-title">2. Today's Spray & Weather</h2>
              </div>
            </div>

            <div className="weather-stats-block">
              <div className="weather-temp-row">
                <span className="big-temp-text">{Math.round(currentTemp)}°C</span>
                <span className="weather-condition-lbl">{currentCondition}</span>
              </div>

              <div className="weather-chips-strip">
                <span>💧 Humidity: <strong>{currentHumidity}%</strong></span>
                <span>•</span>
                <span>💨 Wind: <strong>{currentWind} km/h</strong></span>
                <span>•</span>
                <span>🌧️ Rain: <strong>10%</strong></span>
              </div>
            </div>
          </div>

          <div className="spray-verdict-box">
            <CheckCircle2 size={18} color="#16a34a" />
            <p className="spray-verdict-text">
              <strong>Favorable Spray Window:</strong> Safe to spray today between <strong>6:00 AM - 10:00 AM</strong>.
            </p>
          </div>
        </div>

        {/* CARD 3: TODAY'S CROP ADVICE & LAST SCAN */}
        <div className="essential-card advice-highlight-card">
          <div>
            <div className="card-header-simple">
              <div className="card-header-left-title">
                <div className="header-icon-box icon-box-amber">
                  <Leaf size={20} />
                </div>
                <h2 className="card-heading-title">3. {currentCrop} Field Advisory</h2>
              </div>
            </div>

            <div className="advice-content-block">
              {isNewUser ? (
                <div style={{ padding: '8px 0', color: '#475569', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#1e293b' }}>
                    🌿 No leaf image scanned yet for this field.
                  </p>
                  <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                    Snap or upload a photo in <strong>Step 1: Detect</strong> to identify fungal, bacterial, or pest issues and unlock exact chemical & bio-dilutions.
                  </p>
                </div>
              ) : (
                activeAdvisory.actions.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="advice-bullet-item">
                    <span className="advice-bullet-dot"></span>
                    <span>{action}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="last-scan-status-strip">
            <span>Last Field Check:</span>
            <strong>
              {latestScan
                ? `${latestScan.crop} (${latestScan.disease}) - ${latestScan.confidence}%`
                : `${currentCrop} (Ready for 1st scan)`}
            </strong>
          </div>
        </div>
      </main>

      {/* ================= 6. IRRIGATION & ASK AN EXPERT DUAL ROW ================= */}
      <section className="farmer-dual-action-grid">
        {/* WIDGET 1: SMART IRRIGATION RECOMMENDATION */}
        <div className="action-tile-card">
          <div className="card-header-simple">
            <div className="card-header-left-title">
              <div className="header-icon-box icon-box-blue">
                <Droplets size={20} />
              </div>
              <div>
                <h3 className="card-heading-title">Smart Irrigation Recommendation</h3>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0 }}>Automated evapotranspiration & soil moisture guide</p>
              </div>
            </div>
          </div>

          <div className="irrigation-stat-row">
            <div className="irrigation-metric">
              <span>Soil Moisture</span>
              <strong style={{ color: '#16a34a' }}>68% (Optimal)</strong>
            </div>
            <div className="irrigation-metric">
              <span>Water Requirement</span>
              <strong>4.2 mm / day</strong>
            </div>
            <div className="irrigation-metric">
              <span>Recommended Run Time</span>
              <strong style={{ color: '#2563eb' }}>45 mins (Drip)</strong>
            </div>
            <div className="irrigation-metric">
              <span>Next Schedule</span>
              <strong>Tomorrow 06:30 AM</strong>
            </div>
          </div>
        </div>

        {/* WIDGET 2: ASK AN EXPERT WITH ANSWERS FEED & STATUS */}
        <div className="action-tile-card">
          <div className="card-header-simple">
            <div className="card-header-left-title">
              <div className="header-icon-box icon-box-green">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="card-heading-title">Ask an Agricultural Expert</h3>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0 }}>Direct KVK & ICAR certified agronomist assistance</p>
              </div>
            </div>
          </div>

          <div className="expert-cta-box">
            {latestAnswer ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={13} /> Latest Answer from {latestAnswer.expert.name.split(',')[0]}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{latestAnswer.date}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#334155', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                  <strong>Rx:</strong> {latestAnswer.expert.prescription.slice(0, 115)}...
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12.5px', color: '#1e3a8a', fontWeight: 600, margin: '0 0 4px 0' }}>
                  Unsure about a pest or chemical dosage?
                </p>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Connect with local KVK scientist or request leaf verification.
                </span>
              </div>
            )}

            <div className="expert-cta-actions-row">
              <button
                type="button"
                className="btn-pill-action btn-green-pill"
                style={{ padding: '7px 12px', fontSize: '12px' }}
                onClick={() => {
                  setExpertModalTab('answers');
                  setShowExpertModal(true);
                }}
              >
                <FileCheck size={14} />
                <span>View Expert Answers ({consultations.length})</span>
              </button>

              <button
                type="button"
                className="btn-pill-action btn-phone-pill"
                style={{ padding: '7px 12px', fontSize: '12px' }}
                onClick={() => {
                  setExpertModalTab('ask');
                  setShowExpertModal(true);
                }}
              >
                <MessageSquare size={14} />
                <span>Ask New Question</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. HORIZONTAL HELPFUL STATUS STRIP ================= */}
      <footer className="farmer-bottom-strip">
        <div className="bottom-strip-item">
          <ShieldAlert size={16} color="#16a34a" />
          <span>Regional Outbreak Threat: <strong>Low Threat in {selectedDistrict}</strong></span>
        </div>

        <div className="bottom-strip-item">
          <Droplets size={16} color="#2563eb" />
          <span>Soil Moisture: <strong>Adequate (68%) • Next watering in 2 days</strong></span>
        </div>

        <div className="bottom-strip-item">
          <Phone size={16} color="#16a34a" />
          <span>Free Kisan Call Center: <strong>1800-180-1551</strong></span>
        </div>
      </footer>

      {/* ================= ASK AN EXPERT & ANSWERS CONSULTATION MODAL ================= */}
      {showExpertModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowExpertModal(false)}>
          <div className="modal-content-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-with-icon">
                <MessageSquare size={18} className="icon-green" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>KVK Expert Consultations & Answers</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowExpertModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL TABS */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <button
                type="button"
                className={`btn-pill-action ${expertModalTab === 'answers' ? 'btn-green-pill' : 'btn-settings-pill'}`}
                onClick={() => setExpertModalTab('answers')}
              >
                <FileCheck size={14} />
                <span>Expert Answers & Prescriptions ({consultations.length})</span>
              </button>

              <button
                type="button"
                className={`btn-pill-action ${expertModalTab === 'ask' ? 'btn-green-pill' : 'btn-settings-pill'}`}
                onClick={() => setExpertModalTab('ask')}
              >
                <MessageSquare size={14} />
                <span>Ask New Question</span>
              </button>
            </div>

            <div className="modal-form-body mt-14" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* TAB 1: EXPERT ANSWERS FEED */}
              {expertModalTab === 'answers' && (
                <div className="expert-replies-feed">
                  {consultations.map((item) => (
                    <div key={item.id} className="expert-reply-card">
                      <div className="reply-header-meta">
                        <div className="expert-doctor-badge">
                          <UserCheck size={16} color="#16a34a" />
                          <span>{item.expert.name}</span>
                        </div>
                        <span className="reply-status-pill status-answered">
                          ✓ {item.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        📍 {item.expert.station} • {item.date}
                      </div>

                      {/* FARMER QUESTION */}
                      <div className="farmer-question-quote">
                        <strong>Your Question ({item.crop} - {item.stage}):</strong>
                        <p style={{ margin: '4px 0 0 0' }}>"{item.question}"</p>
                      </div>

                      {/* EXPERT PRESCRIPTION */}
                      <div className="expert-answer-box">
                        <div className="expert-answer-title">
                          <span>🔬 Verified Diagnosis: {item.expert.diagnosis}</span>
                          <button
                            type="button"
                            className="voice-audio-btn"
                            style={{ padding: '3px 8px', fontSize: '10.5px' }}
                            onClick={() => handlePlayExpertAnswer(item)}
                          >
                            <Volume2 size={12} />
                            <span>{playingAnswerId === item.id ? 'Stop' : 'Listen Rx'}</span>
                          </button>
                        </div>

                        <p className="expert-answer-text">
                          {item.expert.prescription}
                        </p>

                        <div className="prescription-pills-row">
                          {item.expert.chemicals.map((chem, idx) => (
                            <span key={idx} className="prescription-chip">
                              💊 {chem}
                            </span>
                          ))}
                          <span className="prescription-chip" style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}>
                            ⏳ {item.expert.phi}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                        <a href="tel:18001801551" style={{ fontSize: '11.5px', color: '#2563eb', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> Call KVK Helpline (Free)
                        </a>

                        <button
                          type="button"
                          className="btn-pill-action btn-settings-pill"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => setExpertModalTab('ask')}
                        >
                          Ask Follow-up
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: ASK NEW QUESTION FORM */}
              {expertModalTab === 'ask' && (
                <>
                  {expertSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '24px 12px', color: '#16a34a' }}>
                      <CheckCircle2 size={40} style={{ margin: '0 auto 10px' }} />
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Query Sent to KVK Scientist!</h4>
                      <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                        A certified agronomist has analyzed your problem and provided a prescription in your Answers tab.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleExpertSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                            Crop Name *
                          </label>
                          <select
                            value={expertCrop}
                            onChange={(e) => setExpertCrop(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', cursor: 'pointer' }}
                          >
                            <option value="Tomato">Tomato</option>
                            <option value="Potato">Potato</option>
                            <option value="Corn / Maize">Corn / Maize</option>
                            <option value="Chilli / Pepper">Chilli / Pepper</option>
                            <option value="Cotton">Cotton</option>
                            <option value="Rice / Paddy">Rice / Paddy</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Grape">Grape</option>
                            <option value="Apple">Apple</option>
                            <option value="Soybean">Soybean</option>
                            <option value="Groundnut">Groundnut</option>
                            <option value="Sugarcane">Sugarcane</option>
                            <option value="Other / Mixed Crop">Other / Mixed Crop</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                            Field Location / Village *
                          </label>
                          <input
                            type="text"
                            value={expertLocation}
                            onChange={(e) => setExpertLocation(e.target.value)}
                            placeholder="e.g. Vennaram, Guntur (Andhra Pradesh)"
                            required
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                          Urgency Level
                        </label>
                        <select
                          value={expertUrgency}
                          onChange={(e) => setExpertUrgency(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                        >
                          <option value="High">🔴 High Priority (Active Leaf Blight / Sudden Wilting)</option>
                          <option value="Medium">🟡 Medium Priority (Nutrient Deficiency / Minor Spots)</option>
                          <option value="Routine">🟢 Routine Consultation (Bio-pesticide Dosage Check)</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                          Your Question or Symptom Description *
                        </label>
                        <textarea
                          rows={4}
                          value={expertQuestion}
                          onChange={(e) => setExpertQuestion(e.target.value)}
                          placeholder="e.g. My tomato leaves have small black spots with yellow borders. Which chemical or bio-spray should I apply and in what dilution?"
                          required
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                        <a href="tel:18001801551" style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Phone size={13} /> Or Call: 1800-180-1551 (Free)
                        </a>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            className="btn-pill-action btn-settings-pill"
                            onClick={() => setShowExpertModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="scan-cta-large-btn"
                            style={{ width: 'auto', padding: '9px 18px' }}
                          >
                            <Send size={14} />
                            <span>Submit to KVK Scientist</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= FARM & LOCATION SETTINGS MODAL ================= */}
      {showLocationModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-with-icon">
                <Settings size={18} className="icon-green" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Farm & Crop Settings</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowLocationModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-form-body mt-14" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Farmer Full Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Poojitha Boinapalli"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Primary Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Corn / Maize">Corn / Maize</option>
                  <option value="Chilli / Pepper">Chilli / Pepper</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Rice / Paddy">Rice / Paddy</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Grape">Grape</option>
                  <option value="Apple">Apple</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Growth Stage</label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  <option value="Vegetative Growth Stage">Vegetative Growth Stage</option>
                  <option value="Flowering & Fruiting Stage">Flowering & Fruiting Stage</option>
                  <option value="Fruit Maturation & Harvest">Fruit Maturation & Harvest</option>
                  <option value="Seedling / Germination Stage">Seedling / Germination Stage</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>State / UT</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const st = e.target.value;
                    setSelectedState(st);
                    const dists = stateDistrictMap[st] || [];
                    setSelectedDistrict(dists[0] || '');
                  }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  {(stateDistrictMap[selectedState] || []).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Village / Gram Panchayat</label>
                <input
                  type="text"
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  placeholder="e.g. Vennaram, Tadikonda"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn-pill-action btn-settings-pill"
                  onClick={() => setShowLocationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="scan-cta-large-btn"
                  style={{ width: 'auto', padding: '9px 18px' }}
                  onClick={handleSaveLocation}
                >
                  Save Farm Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
