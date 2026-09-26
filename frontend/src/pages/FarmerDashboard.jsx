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
  AlertTriangle,
  CloudRain,
  Bot,
  History,
  BarChart3,
  Calendar,
  Percent,
  Heart,
  Eye,
  ChevronRight,
  RefreshCw,
  Bell,
  CheckCheck,
  Calculator,
  Landmark,
  Layers,
  Store,
  Sprout,
} from 'lucide-react';

import { mockWeather } from '../data/mockData';
import { indianStates, stateDistrictMap } from '../data/indiaLocations';
import { getStoredScans } from '../utils/scanHistory';
import { getExactDiseaseAdvisory } from '../data/diseaseAdvisories';
import {
  getCropHealth,
  getRiskSummary,
  getRecentCropScans,
  getCropHealthHistory,
  getFarmerAlerts,
  toggleAlertReadStatus,
  markAllAlertsAsRead,
} from '../services/farmerDashboardService';
import { getAggregatedEarlyWarnings } from '../services/earlyWarningService';
import KisanVoiceAssistant from '../components/KisanVoiceAssistant';
import MandiMarketModal from '../components/MandiMarketModal';
import NotificationCenterModal from '../components/NotificationCenterModal';
import KisanSprayCalcModal from '../components/KisanSprayCalcModal';
import KisanYojanaModal from '../components/KisanYojanaModal';
import KisanFertilizerModal from '../components/KisanFertilizerModal';
import CropCalendarModal from '../components/CropCalendarModal';
import KisanKendraModal from '../components/KisanKendraModal';
import {
  getUnifiedNotifications,
  toggleNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationHubService';
import '../styles/FarmerDashboard.css';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  // Modals state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showAllScansModal, setShowAllScansModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showMandiModal, setShowMandiModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showSprayModal, setShowSprayModal] = useState(false);
  const [showYojanaModal, setShowYojanaModal] = useState(false);
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showKendraModal, setShowKendraModal] = useState(false);
  const [unifiedNotifs, setUnifiedNotifs] = useState(getUnifiedNotifications);
  const [expertModalTab, setExpertModalTab] = useState('answers'); // 'answers' | 'ask'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingAnswerId, setPlayingAnswerId] = useState(null);

  // AI Assistant Quick Chat in modal
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Namaste Kisan! I am your CropShield AI Agronomist. How can I help protect your crop today? You can ask about spray dosage, pest identification, or weather risks.',
      time: 'Just now',
    },
  ]);

  const [expertQuestion, setExpertQuestion] = useState('');
  const [expertUrgency, setExpertUrgency] = useState('Medium');
  const [expertSubmitted, setExpertSubmitted] = useState(false);

  // Farmer & Field Profile State
  const [farmerName, setFarmerName] = useState(() => user?.name || 'Poojitha Boinapalli');
  const [selectedCrop, setSelectedCrop] = useState(() => user?.crop || 'Tomato');
  const [growthStage, setGrowthStage] = useState('Fruiting');
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

  // Dynamic service states
  const [recentScans, setRecentScans] = useState([]);
  const [scansList, setScansList] = useState([]);
  const [healthHistory, setHealthHistory] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  const [riskData, setRiskData] = useState(() => getRiskSummary(selectedCrop, selectedDistrict));

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
        },
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
        },
      },
    ];
  });

  const loadAllData = () => {
    const rawStored = getStoredScans();
    const topScan = rawStored.length > 0 ? rawStored[0] : null;
    setRecentScans(rawStored);
    setScansList(getRecentCropScans());
    setHealthHistory(getCropHealthHistory(selectedCrop));
    const dynamicAlerts = getAggregatedEarlyWarnings({
      weather: mockWeather.current,
      crop: selectedCrop,
      stage: growthStage,
      latestScan: topScan,
      district: selectedDistrict,
    });
    setAlertsList(dynamicAlerts);
    setRiskData(getRiskSummary(selectedCrop, selectedDistrict, growthStage, topScan, mockWeather.current));
  };

  useEffect(() => {
    loadAllData();
    const refreshNotifs = () => setUnifiedNotifs(getUnifiedNotifications());
    window.addEventListener('cropshield_scans_updated', loadAllData);
    window.addEventListener('cropshield_alerts_updated', loadAllData);
    window.addEventListener('cropshield_mandi_updated', loadMandi);
    window.addEventListener('cropshield_notifications_updated', refreshNotifs);
    return () => {
      window.removeEventListener('cropshield_scans_updated', loadAllData);
      window.removeEventListener('cropshield_alerts_updated', loadAllData);
      window.removeEventListener('cropshield_mandi_updated', loadMandi);
      window.removeEventListener('cropshield_notifications_updated', refreshNotifs);
    };
  }, [selectedCrop, selectedDistrict, growthStage]);

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

  // Weather Metrics
  const currentTemp = mockWeather.current?.temp || 29.4;
  const currentHumidity = mockWeather.current?.humidity || 86;
  const currentWind = mockWeather.current?.windSpeed || 14.5;
  const currentCondition = mockWeather.current?.condition || 'Overcast & High Moisture';

  // Crop Health Data from Service
  const latestScan = recentScans.length > 0 ? recentScans[0] : null;
  const cropHealth = getCropHealth(selectedCrop, growthStage, latestScan);
  const isNewUser = !latestScan;

  const currentCrop = cropHealth.crop;
  const currentDisease = cropHealth.latestDisease;
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

  // Today's action plan tasks
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
      },
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

  // AI Assistant message handler
  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userText = aiQuestion.trim();
    const newHistory = [
      ...aiChatHistory,
      { sender: 'user', text: userText, time: 'Just now' },
    ];
    setAiChatHistory(newHistory);
    setAiQuestion('');

    setTimeout(() => {
      let reply = `Based on agricultural guidelines for ${selectedCrop}, maintain 65-70% soil moisture and apply recommended preventative sprays during morning windows (6 AM - 10 AM).`;
      if (userText.toLowerCase().includes('spray') || userText.toLowerCase().includes('chemical') || userText.toLowerCase().includes('medicine')) {
        reply = `For ${selectedCrop} foliar protection, use CIBRC registered Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L water or Copper Oxychloride 50% WP @ 2.5 g/L water.`;
      } else if (userText.toLowerCase().includes('water') || userText.toLowerCase().includes('irrigation')) {
        reply = `Current soil moisture is optimal at 68%. Next recommended drip irrigation cycle is tomorrow at 06:30 AM for 45 minutes.`;
      } else if (userText.toLowerCase().includes('weather') || userText.toLowerCase().includes('rain')) {
        reply = `Current conditions: ${Math.round(currentTemp)}°C, ${currentHumidity}% humidity. Low precipitation probability (<10%) for the next 24 hours.`;
      }

      setAiChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: 'Just now' },
      ]);
    }, 600);
  };

  // Alert Actions
  const handleToggleAlert = (alertId) => {
    setAlertsList((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: !a.read } : a))
    );
    toggleAlertReadStatus(alertId);
  };

  const handleMarkAllAlerts = () => {
    setAlertsList((prev) => prev.map((a) => ({ ...a, read: true })));
    markAllAlertsAsRead();
  };

  const latestAnswer = consultations.length > 0 ? consultations[0] : null;
  const unreadAlertsCount = alertsList.filter((a) => !a.read).length;

  // Helper function for Risk Pill Styling
  const getRiskBadgeClass = (riskLevel) => {
    const r = (riskLevel || '').toLowerCase();
    if (r === 'low') return 'risk-pill-low';
    if (r === 'medium' || r === 'moderate') return 'risk-pill-medium';
    return 'risk-pill-high';
  };

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
            onClick={() => setShowNotifModal(true)}
            style={{ position: 'relative' }}
          >
            <Bell size={14} />
            <span>Alerts & Notifications</span>
            {unifiedNotifs.filter((n) => !n.read).length > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  marginLeft: '4px',
                }}
              >
                {unifiedNotifs.filter((n) => !n.read).length}
              </span>
            )}
          </button>

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

      {/* ================= 2. QUICK ACTIONS (SECTION 6) ================= */}
      <section className="farmer-quick-actions-bar">
        <div className="quick-actions-title-row">
          <div className="qa-title-left">
            <Sparkles size={16} className="text-emerald-600" />
            <span className="qa-section-heading">Quick Actions</span>
          </div>
          <span className="qa-section-sub">Direct access to core farm diagnostic & intelligence tools</span>
        </div>

        <div className="quick-actions-grid">
          {/* Action 1: Scan Crop */}
          <button
            type="button"
            className="quick-action-card qa-scan"
            onClick={() => navigate('/detect')}
          >
            <div className="qa-icon-wrap qa-icon-green">
              <Scan size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Scan Crop</span>
              <span className="qa-desc">Instant AI leaf diagnosis</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 2: Weather Risk */}
          <button
            type="button"
            className="quick-action-card qa-weather"
            onClick={() => navigate('/weather')}
          >
            <div className="qa-icon-wrap qa-icon-blue">
              <CloudSun size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Weather Risk</span>
              <span className="qa-desc">Hourly spray window</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 3: Risk Map */}
          <button
            type="button"
            className="quick-action-card qa-map"
            onClick={() => navigate('/map')}
          >
            <div className="qa-icon-wrap qa-icon-purple">
              <MapPin size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Risk Map</span>
              <span className="qa-desc">Regional disease clusters</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 4: Ask AI Assistant (Kisan Voice AI) */}
          <button
            type="button"
            className="quick-action-card qa-ai"
            onClick={() => setShowAiModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-teal">
              <Bot size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Kisan Voice AI</span>
              <span className="qa-desc">Speech ↔ Speech Agronomist</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 5: Expert Validation */}
          <button
            type="button"
            className="quick-action-card qa-expert"
            onClick={() => {
              setExpertModalTab('answers');
              setShowExpertModal(true);
            }}
          >
            <div className="qa-icon-wrap qa-icon-amber">
              <UserCheck size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Expert Validation</span>
              <span className="qa-desc">KVK scientist review</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 6: Mandi Intelligence */}
          <button
            type="button"
            className="quick-action-card qa-mandi"
            onClick={() => setShowMandiModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-emerald">
              <TrendingUp size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Mandi Prices</span>
              <span className="qa-desc">APMC trends & yards</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 7: Alerts Hub */}
          <button
            type="button"
            className="quick-action-card qa-notif"
            onClick={() => setShowNotifModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-blue">
              <Bell size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Alerts Hub</span>
              <span className="qa-desc">Crop, weather & disease</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 8: Kisan Spray Tank Calculator */}
          <button
            type="button"
            className="quick-action-card qa-scan"
            onClick={() => setShowSprayModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-teal">
              <Calculator size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Spray Calculator</span>
              <span className="qa-desc">Knapsack & Drone dosage</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 9: PM Kisan & Govt Yojana */}
          <button
            type="button"
            className="quick-action-card qa-expert"
            onClick={() => setShowYojanaModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-amber">
              <Landmark size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">PM Krishi Yojana</span>
              <span className="qa-desc">Subsidies, Drip & Drones</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 10: Khad Mitra NPK Calculator */}
          <button
            type="button"
            className="quick-action-card qa-weather"
            onClick={() => setShowFertilizerModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-green">
              <Layers size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Khad Mitra NPK</span>
              <span className="qa-desc">Urea, DAP & Potash bags</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 11: Crop Calendar (Fasal Charka) */}
          <button
            type="button"
            className="quick-action-card qa-map"
            onClick={() => setShowCalendarModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-blue">
              <Calendar size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Fasal Charka</span>
              <span className="qa-desc">Stage-wise disease timeline</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>

          {/* Action 12: Near-Me Krishi Kendra & Labs */}
          <button
            type="button"
            className="quick-action-card qa-mandi"
            onClick={() => setShowKendraModal(true)}
          >
            <div className="qa-icon-wrap qa-icon-purple">
              <Store size={20} />
            </div>
            <div className="qa-text-wrap">
              <span className="qa-label">Agro-Centers</span>
              <span className="qa-desc">KVK, Soil Labs & Drone rent</span>
            </div>
            <ChevronRight size={16} className="qa-arrow" />
          </button>
        </div>
      </section>

      {/* ================= 3. CROP HEALTH + 4-CARD RISK SUMMARY (SECTIONS 1 & 2) ================= */}
      <section className="crop-health-and-risk-section">
        <div className="ch-risk-grid">
          {/* LEFT: CROP HEALTH CARD (SECTION 1) */}
          <div className="crop-health-card">
            <div className="ch-card-header">
              <div className="ch-header-title">
                <div className="ch-icon-badge">
                  <Heart size={18} />
                </div>
                <div>
                  <h3 className="ch-title">Crop Health Status</h3>
                  <p className="ch-subtitle">Active Field Health Index & Real-Time Assessment</p>
                </div>
              </div>
              <span className={`ch-status-badge status-${cropHealth.healthStatus.toLowerCase()}`}>
                <CheckCircle2 size={13} /> {cropHealth.healthStatus}
              </span>
            </div>

            {/* Visual Health Score Gauge */}
            <div className="ch-score-meter-wrap">
              <div className="ch-score-numbers">
                <div className="ch-score-main">
                  <span className="ch-score-val">{cropHealth.healthPercentage}%</span>
                  <span className="ch-score-label">Health Score</span>
                </div>
                <div className="ch-score-eval">
                  <span className="eval-pill">
                    {cropHealth.healthPercentage >= 80 ? '🌿 Optimal Growth' : cropHealth.healthPercentage >= 60 ? '⚠️ Moderate Attention' : '🔴 Action Required'}
                  </span>
                </div>
              </div>

              <div className="ch-progress-bar-track">
                <div
                  className="ch-progress-bar-fill"
                  style={{
                    width: `${cropHealth.healthPercentage}%`,
                    background:
                      cropHealth.healthPercentage >= 80
                        ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                        : cropHealth.healthPercentage >= 60
                        ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                        : 'linear-gradient(90deg, #ef4444, #dc2626)',
                  }}
                />
              </div>
            </div>

            {/* 4 Essential Health Key-Value Details */}
            <div className="ch-details-grid">
              <div className="ch-detail-item">
                <span className="ch-detail-lbl">Current Crop</span>
                <strong className="ch-detail-val">{cropHealth.crop}</strong>
              </div>

              <div className="ch-detail-item">
                <span className="ch-detail-lbl">Crop Stage</span>
                <strong className="ch-detail-val">{cropHealth.stage}</strong>
              </div>

              <div className="ch-detail-item">
                <span className="ch-detail-lbl">Last Scan Date</span>
                <strong className="ch-detail-val">{cropHealth.lastScanDate}</strong>
              </div>

              <div className="ch-detail-item">
                <span className="ch-detail-lbl">Latest Detection</span>
                <strong className="ch-detail-val" style={{ color: cropHealth.latestDisease.toLowerCase().includes('healthy') ? '#16a34a' : '#b91c1c' }}>
                  {cropHealth.latestDisease}
                </strong>
              </div>
            </div>
          </div>

          {/* RIGHT: 4 RISK SUMMARY CARDS (SECTION 2) */}
          <div className="risk-summary-4cards-wrap">
            <div className="rs-cards-header">
              <div className="rs-title-wrap">
                <ShieldAlert size={18} className="text-amber-600" />
                <h3 className="rs-title">Risk Summary</h3>
              </div>
              <span className="rs-badge-info">District Model: {selectedDistrict}</span>
            </div>

            <div className="risk-cards-grid-4">
              {/* Card 1: Disease Risk */}
              <div className="risk-mini-card">
                <div className="rmc-top">
                  <span className="rmc-title">Disease Risk</span>
                  <span className={`risk-pill ${getRiskBadgeClass(riskData.diseaseRisk)}`}>
                    {riskData.diseaseRisk}
                  </span>
                </div>
                <div className="rmc-icon-row">
                  <div className="rmc-icon-badge rmc-disease-ic">
                    <Activity size={18} />
                  </div>
                  <p className="rmc-reason">{riskData.details?.diseaseReason || 'Moderate foliar spot risk'}</p>
                </div>
              </div>

              {/* Card 2: Pest Risk */}
              <div className="risk-mini-card">
                <div className="rmc-top">
                  <span className="rmc-title">Pest Risk</span>
                  <span className={`risk-pill ${getRiskBadgeClass(riskData.pestRisk)}`}>
                    {riskData.pestRisk}
                  </span>
                </div>
                <div className="rmc-icon-row">
                  <div className="rmc-icon-badge rmc-pest-ic">
                    <AlertTriangle size={18} />
                  </div>
                  <p className="rmc-reason">{riskData.details?.pestReason || 'Low whitefly presence'}</p>
                </div>
              </div>

              {/* Card 3: Weather Risk */}
              <div className="risk-mini-card">
                <div className="rmc-top">
                  <span className="rmc-title">Weather Risk</span>
                  <span className={`risk-pill ${getRiskBadgeClass(riskData.weatherRisk)}`}>
                    {riskData.weatherRisk}
                  </span>
                </div>
                <div className="rmc-icon-row">
                  <div className="rmc-icon-badge rmc-weather-ic">
                    <CloudRain size={18} />
                  </div>
                  <p className="rmc-reason">{riskData.details?.weatherReason || 'High relative humidity'}</p>
                </div>
              </div>

              {/* Card 4: Overall Risk */}
              <div className="risk-mini-card rmc-overall">
                <div className="rmc-top">
                  <span className="rmc-title font-bold">Overall Risk</span>
                  <span className={`risk-pill ${getRiskBadgeClass(riskData.overallRisk)}`}>
                    {riskData.overallRisk}
                  </span>
                </div>
                <div className="rmc-icon-row">
                  <div className="rmc-icon-badge rmc-overall-ic">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="rmc-reason">{riskData.details?.overallReason || 'Safe with morning spray'}</p>
                </div>
              </div>
            </div>

            {/* Overall Risk Explanation Drivers */}
            {riskData.overallReasons && riskData.overallReasons.length > 0 && (
              <div className="rs-overall-reasons-strip">
                <span className="rs-reasons-title">Key Risk Drivers:</span>
                <div className="rs-reasons-tags">
                  {riskData.overallReasons.map((reason, idx) => (
                    <span key={idx} className="rs-reason-chip">
                      • {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 4. TODAY'S ACTION CARD (BANNER) ================= */}
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

      {/* ================= 5. CROP HEALTH HISTORY TREND + RECENT ALERTS (SECTIONS 4 & 5) ================= */}
      <section className="history-and-alerts-dual-grid">
        {/* LEFT: CROP HEALTH HISTORY TREND CHART (SECTION 4) */}
        <div className="dashboard-sub-card health-history-card">
          <div className="card-header-simple">
            <div className="card-header-left-title">
              <div className="header-icon-box icon-box-green">
                <BarChart3 size={19} />
              </div>
              <div>
                <h3 className="card-heading-title">Crop Health History Trend</h3>
                <p className="card-heading-sub">Temporal health index tracking across scan milestones</p>
              </div>
            </div>
            <div className="history-avg-badge">
              <span>Avg Score: <strong>80%</strong></span>
            </div>
          </div>

          {/* Clean SVG Trend Chart */}
          <div className="health-trend-chart-container">
            <div className="chart-svg-wrapper">
              <svg viewBox="0 0 500 180" className="health-trend-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="healthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Reference Lines */}
                <line x1="40" y1="30" x2="480" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="40" y1="75" x2="480" y2="75" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="12" y="34" fill="#94a3b8" fontSize="11" fontWeight="600">100</text>
                <text x="18" y="79" fill="#94a3b8" fontSize="11" fontWeight="600">75</text>
                <text x="18" y="124" fill="#94a3b8" fontSize="11" fontWeight="600">50</text>

                {/* Compute Dynamic Coordinates */}
                {(() => {
                  const points = healthHistory.map((item, idx) => {
                    const x = 70 + idx * ((450 - 70) / Math.max(1, healthHistory.length - 1));
                    // 100 score -> y=30, 0 score -> y=150
                    const y = 150 - (item.score / 100) * 120;
                    return { x, y, ...item };
                  });

                  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                  const areaD = `${pathD} L ${points[points.length - 1]?.x || 450} 150 L ${points[0]?.x || 70} 150 Z`;

                  return (
                    <>
                      {/* Area fill */}
                      <path d={areaD} fill="url(#healthGrad)" />
                      {/* Smooth line */}
                      <path d={pathD} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Data Dots & Score Tooltip Pills */}
                      {points.map((p, idx) => (
                        <g key={idx} className="chart-point-group">
                          <circle cx={p.x} cy={p.y} r="6" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
                          <circle cx={p.x} cy={p.y} r="2.5" fill="#16a34a" />
                          
                          {/* Score Label Bubble */}
                          <rect x={p.x - 16} y={p.y - 26} width="32" height="18" rx="4" fill="#0f172a" />
                          <text x={p.x} y={p.y - 13} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                            {p.score}
                          </text>

                          {/* X-Axis Date */}
                          <text x={p.x} y="170" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="600">
                            {p.date}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="trend-summary-strip">
              <div className="tss-col">
                <span className="tss-lbl">Start (10 Sep)</span>
                <strong className="tss-val">76 pts</strong>
              </div>
              <ArrowRight size={14} className="text-slate-400" />
              <div className="tss-col">
                <span className="tss-lbl">Current (16 Sep)</span>
                <strong className="tss-val text-emerald-600">82 pts (+6 pts)</strong>
              </div>
              <div className="tss-col tss-status">
                <span className="trend-up-tag">
                  <TrendingUp size={12} /> Healing Upward
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: RECENT ALERTS (SECTION 5) */}
        <div className="dashboard-sub-card recent-alerts-card">
          <div className="card-header-simple">
            <div className="card-header-left-title">
              <div className="header-icon-box icon-box-amber">
                <Bell size={19} />
              </div>
              <div>
                <h3 className="card-heading-title">
                  Recent Alerts
                  {unreadAlertsCount > 0 && (
                    <span className="unread-count-pill">{unreadAlertsCount} New</span>
                  )}
                </h3>
                <p className="card-heading-sub">Real-time disease warnings, weather alerts & advisories</p>
              </div>
            </div>

            {unreadAlertsCount > 0 && (
              <button
                type="button"
                className="btn-mark-read-all"
                onClick={handleMarkAllAlerts}
                title="Mark all notifications as read"
              >
                <CheckCheck size={13} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          <div className="alerts-feed-list">
            {alertsList.map((alert) => (
              <div
                key={alert.id}
                className={`alert-feed-item ${alert.read ? 'alert-item-read' : 'alert-item-unread'}`}
                onClick={() => handleToggleAlert(alert.id)}
                title="Click to toggle read status"
              >
                <div className="alert-item-left">
                  <span className="alert-emoji-icon">{alert.icon || '⚠️'}</span>
                  <div className="alert-text-body">
                    <p className="alert-message-txt">{alert.message}</p>
                    <div className="alert-meta-row">
                      <span className="alert-time-stamp">
                        <Clock size={11} /> {alert.dateTime}
                      </span>
                      <span className={`alert-type-tag type-${alert.type}`}>
                        {alert.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="alert-item-right">
                  <span
                    className={`alert-status-dot ${alert.read ? 'dot-read' : 'dot-unread'}`}
                    title={alert.read ? 'Read' : 'Unread (Click to mark read)'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. RECENT CROP SCANS TABLE (SECTION 3) ================= */}
      <section className="dashboard-sub-card recent-scans-section">
        <div className="card-header-simple">
          <div className="card-header-left-title">
            <div className="header-icon-box icon-box-blue">
              <History size={19} />
            </div>
            <div>
              <h3 className="card-heading-title">Recent Crop Scans</h3>
              <p className="card-heading-sub">Verified leaf diagnostic logs, confidence scores and pathogen risks</p>
            </div>
          </div>

          <div className="scans-header-actions">
            <button
              type="button"
              className="btn-pill-action btn-settings-pill"
              onClick={() => setShowAllScansModal(true)}
            >
              <Eye size={14} />
              <span>View All ({scansList.length})</span>
            </button>

            <button
              type="button"
              className="btn-pill-action btn-green-pill"
              onClick={() => navigate('/detect')}
            >
              <Scan size={14} />
              <span>Scan New Leaf</span>
            </button>
          </div>
        </div>

        {/* Responsive Table / Card Layout */}
        <div className="scans-table-container">
          <table className="scans-custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Crop</th>
                <th>Disease</th>
                <th>Confidence</th>
                <th>Severity</th>
                <th>Risk</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {scansList.slice(0, 4).map((scan, idx) => (
                <tr key={scan.id || idx}>
                  <td className="scan-td-date">
                    <div className="td-date-wrap">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{scan.date}</span>
                    </div>
                  </td>

                  <td className="scan-td-crop">
                    <span className="crop-tag-pill">{scan.crop}</span>
                  </td>

                  <td className="scan-td-disease">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong>{scan.disease}</strong>
                      {scan.isExpertVerified && (
                        <span className="verified-expert-pill" title="Verified by KVK Agricultural Scientist">
                          <UserCheck size={11} /> Verified
                        </span>
                      )}
                      {scan.isLowConfidence && !scan.isExpertVerified && (
                        <span className="pending-expert-pill" title="Escalated to KVK Agronomists">
                          ⏳ Reviewing
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="scan-td-conf">
                    <span className="conf-pill">
                      <Percent size={11} /> {scan.confidence}
                    </span>
                  </td>

                  <td className="scan-td-sev">
                    <span className={`severity-tag sev-${(scan.severity || 'mild').toLowerCase()}`}>
                      {scan.severity}
                    </span>
                  </td>

                  <td className="scan-td-risk">
                    <span className={`risk-pill ${getRiskBadgeClass(scan.risk)}`}>
                      {scan.risk}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-table-action"
                      onClick={() => navigate('/detect')}
                      title="Inspect scan advisory"
                    >
                      <span>Details</span>
                      <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= 7. DETECT → UNDERSTAND → DECIDE → ACT → MONITOR (5-STEP LIFECYCLE) ================= */}
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

      {/* ================= 8. LIVE APMC MANDI MARKET RATES STRIP ================= */}
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
          <div className="farmer-mandi-strip" style={{ cursor: 'pointer' }} onClick={() => setShowMandiModal(true)}>
            <div className="mandi-item-group">
              <span className="mandi-badge">APMC Mandi Rates</span>
              <span><strong>{selectedDistrict} Mandi ({currentCrop}):</strong></span>
              <span className="mandi-price-val">₹{activeMandiItem.price?.toLocaleString('en-IN')} / Quintal</span>
              <span className="mandi-trend-up">
                <TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> ↗ {activeMandiItem.trend?.startsWith('+') ? activeMandiItem.trend : `+₹${activeMandiItem.trend}`} Today
              </span>
              <span style={{ color: '#64748b' }}>• Modal Range: ₹{activeMandiItem.minPrice?.toLocaleString('en-IN')} - ₹{activeMandiItem.maxPrice?.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-pill-action btn-green-pill"
                style={{ padding: '5px 12px', fontSize: '11.5px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMandiModal(true);
                }}
              >
                <span>7-Day Trends & Nearby Mandis ↗</span>
              </button>

              <div className="scheme-status-badge">
                <CheckCircle2 size={14} color="#16a34a" />
                <span>PM-Kisan: <strong>Active</strong></span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= 9. HORIZONTAL 3 ESSENTIAL CARDS ================= */}
      <main className="farmer-essential-grid">
        {/* CARD 1: INSTANT LEAF SCANNER */}
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

      {/* ================= 10. IRRIGATION & ASK AN EXPERT DUAL ROW ================= */}
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

      {/* ================= 10A. KISAN PRECISION AGRI-UTILITIES & DECISION SUPPORT HUB ================= */}
      <section className="farmer-utilities-hub-section" style={{ margin: '24px 0' }}>
        <div className="section-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                🌾 Kisan Precision Agri-Utilities & Farm Decision Hub
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Essential daily tools for chemical dilution, fertilizer optimization, government subsidies & local agro-services
              </p>
            </div>
          </div>
          <span style={{ fontSize: '11.5px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '9999px', fontWeight: 700 }}>
            5 Interactive Decision Tools
          </span>
        </div>

        <div className="kisan-utilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {/* TOOL 1: SPRAY CALCULATOR */}
          <div
            className="kisan-util-card"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #059669',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setShowSprayModal(true)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator size={18} />
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '4px' }}>
                  Knapsack & Drone
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Spray Tank & Dosage Calc
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                Compute exact chemical grams/ml, water liters, and tanks for any field area (Acres/Guntas).
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Prevent Overdose & Save Cost</span>
              <ChevronRight size={15} color="#059669" />
            </div>
          </div>

          {/* TOOL 2: PM YOJANA NAVIGATOR */}
          <div
            className="kisan-util-card"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #d97706',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setShowYojanaModal(true)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Landmark size={18} />
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px' }}>
                  Govt Subsidies
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                PM Kisan & Yojana Hub
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                Instant eligibility checks for PMFBY insurance, PMKSY 75% drip subsidy, and Krishi Drone grants.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 700 }}>Direct Apply Links & Docs</span>
              <ChevronRight size={15} color="#d97706" />
            </div>
          </div>

          {/* TOOL 3: KHAD MITRA NPK FERTILIZER */}
          <div
            className="kisan-util-card"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setShowFertilizerModal(true)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={18} />
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px' }}>
                  Balanced NPK
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                NPK Soil Nutrient Calculator
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                3-stage split schedule (Basal, Top 1, Top 2) for Urea, DAP, MOP Potash, and FYM organic manure.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>Prevent Fungal Blights</span>
              <ChevronRight size={15} color="#2563eb" />
            </div>
          </div>

          {/* TOOL 4: CROP CALENDAR */}
          <div
            className="kisan-util-card"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #7c3aed',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setShowCalendarModal(true)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#ede9fe', color: '#5b21b6', padding: '2px 8px', borderRadius: '4px' }}>
                  Stage Roadmap
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Fasal Charka Crop Calendar
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                Stage-wise pest vulnerability alerts, prophylactic spray timings, and critical irrigation windows.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700 }}>5 Phenological Milestones</span>
              <ChevronRight size={15} color="#7c3aed" />
            </div>
          </div>

          {/* TOOL 5: NEARBY AGRO-CENTERS */}
          <div
            className="kisan-util-card"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #0891b2',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setShowKendraModal(true)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfeff', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={18} />
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#cffafe', color: '#155e75', padding: '2px 8px', borderRadius: '4px' }}>
                  District Directory
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Krishi Kendra & Soil Labs
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                Verified KVK scientists, soil testing labs, and Custom Hiring Centers (CHC Drone & Tractor rent).
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#0891b2', fontWeight: 700 }}>Direct Call & Verified Centers</span>
              <ChevronRight size={15} color="#0891b2" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10B. UNIFIED FIELD NOTIFICATIONS & ALERTS HUB ================= */}
      <section className="farmer-notifications-section" style={{ margin: '20px 0' }}>
        <div className="section-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Live Field Notifications & Early Warnings</h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b' }}>Active stream of Crop milestones, Disease outbreaks, Weather risks, and Expert responses</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-pill-action btn-green-pill"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => setShowNotifModal(true)}
          >
            <Bell size={13} />
            <span>Open Notification Center ({unifiedNotifs.filter(n => !n.read).length} New)</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {unifiedNotifs.slice(0, 4).map((notif) => (
            <div
              key={notif.id}
              style={{
                background: notif.read ? '#ffffff' : '#f8fafc',
                border: `1px solid ${notif.read ? '#e2e8f0' : notif.category === 'disease' ? '#fecaca' : notif.category === 'weather' ? '#fed7aa' : notif.category === 'expert' ? '#ddd6fe' : '#bbf7d0'}`,
                borderLeft: `4px solid ${notif.category === 'disease' ? '#ef4444' : notif.category === 'weather' ? '#f59e0b' : notif.category === 'expert' ? '#8b5cf6' : '#10b981'}`,
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              }}
              onClick={() => {
                const updated = toggleNotificationRead(notif.id);
                setUnifiedNotifs(updated);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: notif.category === 'disease' ? '#fee2e2' : notif.category === 'weather' ? '#fef3c7' : notif.category === 'expert' ? '#f3e8ff' : '#dcfce7',
                    color: notif.category === 'disease' ? '#991b1b' : notif.category === 'weather' ? '#92400e' : notif.category === 'expert' ? '#6b21a8' : '#166534',
                  }}
                >
                  {notif.categoryLabel}
                </span>

                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{notif.timestamp}</span>
              </div>

              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{notif.title}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>{notif.message.slice(0, 110)}...</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '11.5px', fontWeight: 700, color: '#2563eb', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (notif.actionRoute) navigate(notif.actionRoute);
                  }}
                >
                  <span>{notif.actionText}</span>
                  <ArrowRight size={11} />
                </button>

                <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                  {notif.read ? 'Read' : '• New'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 11. HORIZONTAL HELPFUL STATUS STRIP ================= */}
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

      {/* ================= MODAL: VIEW ALL SCANS ================= */}
      {showAllScansModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAllScansModal(false)}>
          <div className="modal-content-card" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-with-icon">
                <History size={18} className="icon-green" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>All Historical Crop Scans</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAllScansModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-form-body mt-14">
              <div className="all-scans-modal-list">
                {scansList.map((scan, idx) => (
                  <div key={scan.id || idx} className="all-scans-item-card">
                    <div className="asic-left">
                      <span className="asic-crop-tag">{scan.crop}</span>
                      <div>
                        <h4 className="asic-disease-title">{scan.disease}</h4>
                        <span className="asic-meta-text">
                          📅 {scan.date} • {scan.time || '08:30 AM'} • Plot: {scan.field || 'Main Field'}
                        </span>
                      </div>
                    </div>

                    <div className="asic-right">
                      <span className="conf-pill">Match: {scan.confidence}</span>
                      <span className={`risk-pill ${getRiskBadgeClass(scan.risk)}`}>{scan.risk} Risk</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KISAN VOICE AI ASSISTANT (5-STAGE PIPELINE) ================= */}
      <KisanVoiceAssistant
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        currentCrop={selectedCrop}
        weather={{
          temp: currentTemp,
          humidity: currentHumidity,
          rainfall: 0,
          windSpeed: 8,
        }}
      />

      {/* ================= MODAL: APMC MANDI & MARKET INTELLIGENCE ================= */}
      <MandiMarketModal
        isOpen={showMandiModal}
        onClose={() => setShowMandiModal(false)}
        currentCrop={selectedCrop}
        selectedDistrict={selectedDistrict}
      />

      {/* ================= MODAL: NOTIFICATION & EARLY WARNING HUB ================= */}
      <NotificationCenterModal
        isOpen={showNotifModal}
        onClose={() => setShowNotifModal(false)}
      />

      {/* ================= MODAL: KISAN SPRAY TANK & CHEMICAL DOSAGE CALCULATOR ================= */}
      <KisanSprayCalcModal
        isOpen={showSprayModal}
        onClose={() => setShowSprayModal(false)}
        cropName={selectedCrop}
        initialChemical=""
        detectedDisease={latestScan ? latestScan.disease : ''}
      />

      {/* ================= MODAL: PM KISAN & GOVT SCHEME NAVIGATOR ================= */}
      <KisanYojanaModal
        isOpen={showYojanaModal}
        onClose={() => setShowYojanaModal(false)}
        userState={selectedState}
      />

      {/* ================= MODAL: NPK SOIL NUTRIENT & FERTILIZER CALCULATOR ================= */}
      <KisanFertilizerModal
        isOpen={showFertilizerModal}
        onClose={() => setShowFertilizerModal(false)}
        defaultCrop={selectedCrop}
      />

      {/* ================= MODAL: CROP CALENDAR & PHENOLOGICAL TIMELINE ================= */}
      <CropCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        currentCrop={selectedCrop}
      />

      {/* ================= MODAL: NEARBY KRISHI KENDRA & LABS DIRECTORY ================= */}
      <KisanKendraModal
        isOpen={showKendraModal}
        onClose={() => setShowKendraModal(false)}
        initialState={selectedState}
        initialDistrict={selectedDistrict}
      />

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
                  <option value="Vegetative">Vegetative Growth Stage</option>
                  <option value="Fruiting">Flowering & Fruiting Stage</option>
                  <option value="Harvest">Fruit Maturation & Harvest</option>
                  <option value="Seedling">Seedling / Germination Stage</option>
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

      {/* ================= 8 QUICK ACTION MODALS ================= */}
      {/* 1. KISAN SPRAY TANK CALCULATOR */}
      {showSprayModal && (
        <KisanSprayCalcModal
          isOpen={showSprayModal}
          onClose={() => setShowSprayModal(false)}
          cropName={selectedCrop}
        />
      )}

      {/* 2. MANDI MARKET RATES */}
      {showMandiModal && (
        <MandiMarketModal
          isOpen={showMandiModal}
          onClose={() => setShowMandiModal(false)}
          currentCrop={selectedCrop}
          selectedDistrict={selectedDistrict}
        />
      )}

      {/* 3. NOTIFICATION & ALERTS HUB */}
      {showNotifModal && (
        <NotificationCenterModal
          isOpen={showNotifModal}
          onClose={() => setShowNotifModal(false)}
        />
      )}

      {/* 4. KISAN VOICE AI ASSISTANT */}
      {showAiModal && (
        <KisanVoiceAssistant
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          currentCrop={selectedCrop}
        />
      )}

      {/* 5. PM KRISHI YOJANA SUBSIDIES */}
      {showYojanaModal && (
        <KisanYojanaModal
          isOpen={showYojanaModal}
          onClose={() => setShowYojanaModal(false)}
          userState={selectedState}
        />
      )}

      {/* 6. KHAD MITRA NPK FERTILIZER */}
      {showFertilizerModal && (
        <KisanFertilizerModal
          isOpen={showFertilizerModal}
          onClose={() => setShowFertilizerModal(false)}
          defaultCrop={selectedCrop}
        />
      )}

      {/* 7. CROP CALENDAR (FASAL CHARKA) */}
      {showCalendarModal && (
        <CropCalendarModal
          isOpen={showCalendarModal}
          onClose={() => setShowCalendarModal(false)}
          currentCrop={selectedCrop}
        />
      )}

      {/* 8. AGRO-CENTERS & LAB DIRECTORY */}
      {showKendraModal && (
        <KisanKendraModal
          isOpen={showKendraModal}
          onClose={() => setShowKendraModal(false)}
          initialState={selectedState}
          initialDistrict={selectedDistrict}
        />
      )}
    </div>
  );
}
