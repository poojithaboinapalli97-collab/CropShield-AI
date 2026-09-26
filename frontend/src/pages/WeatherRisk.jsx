import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ArrowUpRight,
  Info,
  Clock,
  FlaskConical,
  Bug,
  Sparkles,
  Layers,
  CloudRain,
  ShieldCheck,
  Radio,
  Search,
  AlertOctagon,
  Eye,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { allIndiaDistrictOptions } from '../data/indiaLocations';
import { fetchLiveWeatherTelemetry } from '../services/weatherService';
import { evaluateWeatherRisk } from '../services/cropRiskEngine';
import { generateEarlyWarnings } from '../services/earlyWarningService';
import { mockWeather } from '../data/mockData';
import '../styles/WeatherRisk.css';

export default function WeatherRisk() {
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    const d = localStorage.getItem('selectedDistrict') || 'Guntur';
    const s = localStorage.getItem('selectedState') || 'Andhra Pradesh';
    return `${d}, ${s}`;
  });

  const [weatherData, setWeatherData] = useState(() => ({
    ...mockWeather,
    isLiveWeather: false,
    dataSource: 'Simulated Agro-Climatic Data (Offline Fallback)',
    current: {
      ...mockWeather.current,
      district: localStorage.getItem('selectedDistrict')
        ? `${localStorage.getItem('selectedDistrict')} District, ${localStorage.getItem('selectedState') || 'Andhra Pradesh'}`
        : mockWeather.current.district,
    },
  }));

  const [isLoading, setIsLoading] = useState(false);

  const loadWeather = async (districtStr) => {
    setIsLoading(true);
    const cleanDistrict = districtStr.split(',')[0].trim();
    try {
      const data = await fetchLiveWeatherTelemetry(cleanDistrict);
      setWeatherData(data);
    } catch (err) {
      console.error('Weather load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedDistrict);
  }, [selectedDistrict]);

  const { current, vulnerabilityIndices, forecast7Days, isLiveWeather, dataSource } = weatherData;

  // Evaluate dynamic weather risk via Crop Risk Engine
  const weatherRiskEval = evaluateWeatherRisk(current);

  // Generate dynamic early warnings
  const earlyWarnings = generateEarlyWarnings({
    weather: current,
    crop: 'Tomato',
    stage: 'Fruiting',
    district: selectedDistrict.split(',')[0].trim(),
  });

  // Spray windows dynamic evaluation based on weather
  const sprayWindows = [
    {
      time: '06:00 AM - 09:30 AM',
      status: current.windSpeed <= 12 && current.rainfall === 0 ? 'Optimal Window' : 'Caution Required',
      condition: `Wind ${current.windSpeed} km/h, Temp ${current.temp}°C, Zero Rain Risk`,
      safe: current.windSpeed <= 12 && current.rainfall === 0,
    },
    {
      time: '11:00 AM - 03:00 PM',
      status: 'Unfavorable / Drift Risk',
      condition: `High UV Photolysis, Peak Heat ${Math.max(current.temp + 4, 32)}°C, Evaporation Risk`,
      safe: false,
    },
    {
      time: '04:30 PM - 06:30 PM',
      status: current.windSpeed <= 14 ? 'Moderate Window' : 'High Wind Drift',
      condition: `Wind ${Math.max(current.windSpeed - 2, 6)} km/h, Good Foliage Absorption`,
      safe: current.windSpeed <= 14,
    },
    {
      time: '08:00 PM - Midnight',
      status: 'Night Dew / Wash Risk',
      condition: `Heavy Dew Precipitation (${current.humidity}% RH), Fungal Spore Spread`,
      safe: false,
    },
  ];

  return (
    <div className="weather-page">
      <style>{`
        .weather-page {
          max-width: 1280px !important;
          margin: 0 auto !important;
          padding: 24px 16px 60px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* 1. HERO HEADER BOX */
        .weather-hero-box {
          background: linear-gradient(135deg, #0284c7 0%, #0f172a 60%, #064e3b 100%) !important;
          border-radius: 20px !important;
          padding: 28px 32px !important;
          margin-bottom: 24px !important;
          color: #ffffff !important;
          border: 1px solid rgba(56, 189, 248, 0.35) !important;
          box-shadow: 0 12px 32px rgba(2, 132, 199, 0.25) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          flex-wrap: wrap !important;
          gap: 16px !important;
        }

        .weather-badge-pill {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 4px 12px !important;
          border-radius: 20px !important;
          background: rgba(56, 189, 248, 0.2) !important;
          border: 1px solid #38bdf8 !important;
          color: #bae6fd !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          letter-spacing: 0.8px !important;
          margin-bottom: 8px !important;
        }

        .weather-box-title {
          font-family: 'Outfit', sans-serif !important;
          font-size: 28px !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          margin: 0 0 6px 0 !important;
          letter-spacing: -0.02em !important;
        }

        .weather-box-subtitle {
          font-size: 14px !important;
          color: #cbd5e1 !important;
          margin: 0 !important;
          max-width: 680px !important;
          line-height: 1.5 !important;
        }

        /* 2. LOCATION SELECTOR BAR */
        .weather-location-bar {
          background: #ffffff !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 16px !important;
          padding: 16px 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          flex-wrap: wrap !important;
          gap: 14px !important;
          margin-bottom: 24px !important;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04) !important;
        }

        [data-theme="dark"] .weather-location-bar,
        body.dark-mode .weather-location-bar {
          background: #111827 !important;
          border-color: #26334d !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        }

        .location-label-txt {
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #0f172a !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        [data-theme="dark"] .location-label-txt,
        body.dark-mode .location-label-txt {
          color: #f8fafc !important;
        }

        .district-select-box {
          padding: 9px 16px !important;
          border-radius: 10px !important;
          border: 1.5px solid #cbd5e1 !important;
          background: #f8fafc !important;
          color: #0f172a !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          outline: none !important;
          min-width: 260px !important;
          transition: all 0.2s ease !important;
        }

        [data-theme="dark"] .district-select-box,
        body.dark-mode .district-select-box {
          background: #162035 !important;
          border-color: #2b3a58 !important;
          color: #f8fafc !important;
        }

        .district-select-box:focus {
          border-color: #0284c7 !important;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.25) !important;
        }

        /* 3. WEATHER RISK BANNER CARD */
        .weather-risk-hero-banner {
          background: #ffffff !important;
          border-radius: 20px !important;
          border: 1.5px solid #e2e8f0 !important;
          padding: 24px 28px !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          flex-wrap: wrap !important;
          gap: 20px !important;
          margin-bottom: 24px !important;
          box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05) !important;
          transition: all 0.25s ease !important;
        }

        [data-theme="dark"] .weather-risk-hero-banner,
        body.dark-mode .weather-risk-hero-banner {
          background: #111827 !important;
          border-color: #26334d !important;
          box-shadow: 0 6px 28px rgba(0, 0, 0, 0.5) !important;
        }

        .risk-tier-low {
          border-left: 6px solid #10b981 !important;
        }

        .risk-tier-medium, .risk-tier-moderate {
          border-left: 6px solid #f59e0b !important;
        }

        .risk-tier-high {
          border-left: 6px solid #ef4444 !important;
        }

        .wr-hero-left {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          flex: 1 !important;
        }

        .wr-hero-icon-badge {
          width: 52px !important;
          height: 52px !important;
          border-radius: 14px !important;
          background: #fef3c7 !important;
          color: #d97706 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
        }

        [data-theme="dark"] .wr-hero-icon-badge,
        body.dark-mode .wr-hero-icon-badge {
          background: rgba(245, 158, 11, 0.2) !important;
          color: #fbbf24 !important;
        }

        .wr-hero-tag {
          font-size: 11px !important;
          font-weight: 800 !important;
          color: #b45309 !important;
          letter-spacing: 0.6px !important;
        }

        [data-theme="dark"] .wr-hero-tag,
        body.dark-mode .wr-hero-tag {
          color: #fcd34d !important;
        }

        .wr-hero-title {
          font-family: 'Outfit', sans-serif !important;
          font-size: 20px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin: 2px 0 4px 0 !important;
        }

        [data-theme="dark"] .wr-hero-title,
        body.dark-mode .wr-hero-title {
          color: #f8fafc !important;
        }

        .wr-hero-desc {
          font-size: 13.5px !important;
          color: #475569 !important;
          margin: 0 !important;
          line-height: 1.4 !important;
        }

        [data-theme="dark"] .wr-hero-desc,
        body.dark-mode .wr-hero-desc {
          color: #94a3b8 !important;
        }

        .wr-hero-right {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 14px 18px !important;
          max-width: 380px !important;
        }

        [data-theme="dark"] .wr-hero-right,
        body.dark-mode .wr-hero-right {
          background: #162035 !important;
          border-color: #26334d !important;
        }

        .wr-mitigation-label {
          font-size: 11px !important;
          font-weight: 800 !important;
          color: #059669 !important;
          display: block !important;
          margin-bottom: 2px !important;
        }

        [data-theme="dark"] .wr-mitigation-label,
        body.dark-mode .wr-mitigation-label {
          color: #34d399 !important;
        }

        .wr-mitigation-text {
          font-size: 13px !important;
          font-weight: 600 !important;
          color: #0f172a !important;
          margin: 0 !important;
          line-height: 1.4 !important;
        }

        [data-theme="dark"] .wr-mitigation-text,
        body.dark-mode .wr-mitigation-text {
          color: #f8fafc !important;
        }

        /* 4. 4-METRICS TELEMETRY GRID */
        .weather-metrics-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
          gap: 18px !important;
          margin-bottom: 28px !important;
        }

        .w-metric-card {
          background: #ffffff !important;
          border-radius: 18px !important;
          border: 1.5px solid #e2e8f0 !important;
          padding: 20px 22px !important;
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04) !important;
          transition: all 0.25s ease !important;
        }

        [data-theme="dark"] .w-metric-card,
        body.dark-mode .w-metric-card {
          background: #111827 !important;
          border-color: #26334d !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        }

        .w-metric-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08) !important;
        }

        .w-icon-box {
          width: 50px !important;
          height: 50px !important;
          border-radius: 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
        }

        .highlight-temp .w-icon-box {
          background: linear-gradient(135deg, #fef3c7, #fde68a) !important;
          color: #d97706 !important;
        }

        .highlight-humidity .w-icon-box {
          background: linear-gradient(135deg, #e0f2fe, #bae6fd) !important;
          color: #0284c7 !important;
        }

        .highlight-rain .w-icon-box {
          background: linear-gradient(135deg, #ede9fe, #ddd6fe) !important;
          color: #7c3aed !important;
        }

        .highlight-wind .w-icon-box {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0) !important;
          color: #16a34a !important;
        }

        .w-label {
          font-size: 12.5px !important;
          font-weight: 700 !important;
          color: #64748b !important;
          display: block !important;
        }

        [data-theme="dark"] .w-label,
        body.dark-mode .w-label {
          color: #94a3b8 !important;
        }

        .w-value {
          font-family: 'Outfit', sans-serif !important;
          font-size: 24px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin: 2px 0 !important;
        }

        [data-theme="dark"] .w-value,
        body.dark-mode .w-value {
          color: #f8fafc !important;
        }

        .w-sub {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #64748b !important;
          display: block !important;
        }

        [data-theme="dark"] .w-sub,
        body.dark-mode .w-sub {
          color: #94a3b8 !important;
        }

        /* 5. SECTIONS & CARDS */
        .weather-section {
          background: #ffffff !important;
          border-radius: 20px !important;
          border: 1.5px solid #e2e8f0 !important;
          padding: 24px 28px !important;
          margin-bottom: 24px !important;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04) !important;
        }

        [data-theme="dark"] .weather-section,
        body.dark-mode .weather-section {
          background: #111827 !important;
          border-color: #26334d !important;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45) !important;
        }

        .section-title-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          margin-bottom: 20px !important;
          padding-bottom: 12px !important;
          border-bottom: 1px solid #f1f5f9 !important;
        }

        [data-theme="dark"] .section-title-row,
        body.dark-mode .section-title-row {
          border-bottom-color: #1e293b !important;
        }

        .section-title-row h2 {
          font-family: 'Outfit', sans-serif !important;
          font-size: 19px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin: 0 !important;
        }

        [data-theme="dark"] .section-title-row h2,
        body.dark-mode .section-title-row h2 {
          color: #f8fafc !important;
        }

        /* 6. WHY RISKY GRID */
        .why-risky-lead {
          background: #fffbeb !important;
          border: 1.5px solid #fde68a !important;
          border-radius: 12px !important;
          padding: 14px 18px !important;
          margin-bottom: 20px !important;
        }

        [data-theme="dark"] .why-risky-lead,
        body.dark-mode .why-risky-lead {
          background: rgba(245, 158, 11, 0.1) !important;
          border-color: rgba(245, 158, 11, 0.3) !important;
        }

        .why-risky-highlight {
          font-size: 13.5px !important;
          color: #92400e !important;
          line-height: 1.5 !important;
          margin: 0 !important;
        }

        [data-theme="dark"] .why-risky-highlight,
        body.dark-mode .why-risky-highlight {
          color: #fcd34d !important;
        }

        .why-risky-grid-4 {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
          gap: 16px !important;
        }

        .why-factor-card {
          border-radius: 14px !important;
          padding: 16px !important;
          border: 1.5px solid !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
        }

        .factor-danger {
          background: #fef2f2 !important;
          border-color: #fca5a5 !important;
        }

        [data-theme="dark"] .factor-danger,
        body.dark-mode .factor-danger {
          background: rgba(239, 68, 68, 0.1) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
        }

        .factor-warning {
          background: #fffbeb !important;
          border-color: #fde68a !important;
        }

        [data-theme="dark"] .factor-warning,
        body.dark-mode .factor-warning {
          background: rgba(245, 158, 11, 0.1) !important;
          border-color: rgba(245, 158, 11, 0.3) !important;
        }

        .factor-ok {
          background: #f0fdf4 !important;
          border-color: #86efac !important;
        }

        [data-theme="dark"] .factor-ok,
        body.dark-mode .factor-ok {
          background: rgba(34, 197, 94, 0.1) !important;
          border-color: rgba(34, 197, 94, 0.3) !important;
        }

        .why-factor-header {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          margin-bottom: 8px !important;
        }

        .why-factor-header h4 {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #0f172a !important;
          margin: 0 !important;
        }

        [data-theme="dark"] .why-factor-header h4,
        body.dark-mode .why-factor-header h4 {
          color: #f8fafc !important;
        }

        .why-factor-text {
          font-size: 13px !important;
          color: #475569 !important;
          line-height: 1.45 !important;
          margin-bottom: 12px !important;
        }

        [data-theme="dark"] .why-factor-text,
        body.dark-mode .why-factor-text {
          color: #94a3b8 !important;
        }

        .why-factor-status {
          font-size: 12px !important;
          font-weight: 800 !important;
          padding: 4px 8px !important;
          border-radius: 6px !important;
          background: rgba(255, 255, 255, 0.8) !important;
          width: fit-content !important;
        }

        [data-theme="dark"] .why-factor-status,
        body.dark-mode .why-factor-status {
          background: rgba(0, 0, 0, 0.4) !important;
        }

        /* 7. SPRAY WINDOWS GRID */
        .spray-windows-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          gap: 16px !important;
        }

        .spray-win-card {
          border-radius: 14px !important;
          padding: 16px 20px !important;
          border: 1.5px solid #e2e8f0 !important;
          background: #f8fafc !important;
        }

        [data-theme="dark"] .spray-win-card,
        body.dark-mode .spray-win-card {
          background: #162035 !important;
          border-color: #26334d !important;
        }

        .win-safe {
          border-color: #86efac !important;
          background: #f0fdf4 !important;
        }

        [data-theme="dark"] .win-safe,
        body.dark-mode .win-safe {
          background: rgba(34, 197, 94, 0.1) !important;
          border-color: rgba(34, 197, 94, 0.3) !important;
        }

        .win-risky {
          border-color: #fca5a5 !important;
          background: #fef2f2 !important;
        }

        [data-theme="dark"] .win-risky,
        body.dark-mode .win-risky {
          background: rgba(239, 68, 68, 0.08) !important;
          border-color: rgba(239, 68, 68, 0.25) !important;
        }

        .win-top {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 6px !important;
        }

        .win-time {
          font-family: 'Outfit', sans-serif !important;
          font-size: 15px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
        }

        [data-theme="dark"] .win-time,
        body.dark-mode .win-time {
          color: #f8fafc !important;
        }

        .win-condition {
          font-size: 12.5px !important;
          color: #64748b !important;
          margin: 0 !important;
        }

        [data-theme="dark"] .win-condition,
        body.dark-mode .win-condition {
          color: #94a3b8 !important;
        }

        /* 8. VULNERABILITY GAUGES */
        .vulnerability-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important;
          gap: 16px !important;
        }

        .v-card {
          background: #f8fafc !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 16px 18px !important;
        }

        [data-theme="dark"] .v-card,
        body.dark-mode .v-card {
          background: #162035 !important;
          border-color: #26334d !important;
        }

        .v-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 8px !important;
        }

        .v-header h4 {
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #0f172a !important;
          margin: 0 !important;
        }

        [data-theme="dark"] .v-header h4,
        body.dark-mode .v-header h4 {
          color: #f8fafc !important;
        }

        .v-score {
          font-size: 12px !important;
          font-weight: 800 !important;
        }

        .val-danger { color: #dc2626 !important; }
        .val-warning { color: #d97706 !important; }
        .val-success { color: #16a34a !important; }

        .v-progress-track {
          width: 100% !important;
          height: 8px !important;
          background: #e2e8f0 !important;
          border-radius: 4px !important;
          overflow: hidden !important;
          margin-bottom: 8px !important;
        }

        [data-theme="dark"] .v-progress-track,
        body.dark-mode .v-progress-track {
          background: #23304b !important;
        }

        .v-progress-bar {
          height: 100% !important;
          border-radius: 4px !important;
          transition: width 0.4s ease !important;
        }

        .bar-fill-danger { background: #ef4444 !important; }
        .bar-fill-warning { background: #f59e0b !important; }
        .bar-fill-success { background: #10b981 !important; }

        .v-desc {
          font-size: 12px !important;
          color: #64748b !important;
          line-height: 1.4 !important;
          margin: 0 !important;
        }

        [data-theme="dark"] .v-desc,
        body.dark-mode .v-desc {
          color: #94a3b8 !important;
        }

        /* 9. 7-DAY FORECAST GRID */
        .forecast-timeline-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important;
          gap: 12px !important;
        }

        .forecast-card {
          background: #f8fafc !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 14px 10px !important;
          text-align: center !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 6px !important;
          transition: all 0.2s ease !important;
        }

        [data-theme="dark"] .forecast-card,
        body.dark-mode .forecast-card {
          background: #162035 !important;
          border-color: #26334d !important;
        }

        .forecast-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08) !important;
        }

        .f-day {
          font-family: 'Outfit', sans-serif !important;
          font-size: 14px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
        }

        [data-theme="dark"] .f-day,
        body.dark-mode .f-day {
          color: #f8fafc !important;
        }

        .f-temp {
          font-size: 13px !important;
          font-weight: 700 !important;
          color: #0284c7 !important;
        }

        .f-humidity {
          font-size: 11px !important;
          color: #64748b !important;
          display: flex !important;
          align-items: center !important;
          gap: 3px !important;
        }

        .f-risk-gauge {
          width: 10px !important;
          height: 48px !important;
          background: #e2e8f0 !important;
          border-radius: 5px !important;
          display: flex !important;
          align-items: flex-end !important;
          overflow: hidden !important;
          margin: 4px 0 !important;
        }

        [data-theme="dark"] .f-risk-gauge,
        body.dark-mode .f-risk-gauge {
          background: #23304b !important;
        }

        .f-risk-bar {
          width: 100% !important;
          border-radius: 5px !important;
        }

        .f-score {
          font-size: 11px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
        }

        [data-theme="dark"] .f-score,
        body.dark-mode .f-score {
          color: #f8fafc !important;
        }

        .f-threat {
          font-size: 10px !important;
          color: #64748b !important;
          line-height: 1.2 !important;
        }
      `}</style>

      {/* 1. HERO HEADER BOX */}
      <div className="weather-hero-box">
        <div>
          <span className="weather-badge-pill">
            <Sparkles size={13} /> PRECISION AGRI-VISION • WEATHER RISK FORECAST
          </span>
          <h1 className="weather-box-title">Weather & Disease Risk Forecast for Farmers</h1>
          <p className="weather-box-subtitle">
            Live meteorological data, multi-pillar disease risk calculations, and real-time early warnings to protect crop yield.
          </p>
        </div>
        <div>
          <span className={`weather-badge-pill ${isLiveWeather ? 'pill-live' : 'pill-fallback'}`} style={{ background: isLiveWeather ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)', borderColor: isLiveWeather ? '#34d399' : '#fcd34d', color: isLiveWeather ? '#a7f3d0' : '#fef3c7' }}>
            <Radio size={13} className={isLiveWeather ? 'animate-pulse' : ''} />
            {isLiveWeather ? 'Live Agro-Station Telemetry' : 'Simulated Agro-Climatic Data (Offline Fallback)'}
          </span>
        </div>
      </div>

      {/* 2. LOCATION SELECTOR BAR BOX */}
      <div className="weather-location-bar">
        <label className="location-label-txt">
          <MapPin size={16} style={{ color: '#0284c7' }} /> Target District (AP & Telangana):
        </label>
        <div className="relative">
          <input
            type="text"
            list="all-india-weather-districts"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="district-select-box"
            placeholder="Select or type district..."
          />
          <datalist id="all-india-weather-districts">
            {allIndiaDistrictOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>
      </div>

      {/* WEATHER RISK HERO BANNER */}
      <div className={`weather-risk-hero-banner risk-tier-${weatherRiskEval.level.toLowerCase()}`}>
        <div className="wr-hero-left">
          <div className="wr-hero-icon-badge">
            <ShieldAlert size={28} />
          </div>
          <div>
            <div className="wr-hero-tag">CROP RISK ENGINE • WEATHER PILLAR EVALUATION</div>
            <h2 className="wr-hero-title">
              Weather Risk Level: <strong>{weatherRiskEval.level.toUpperCase()}</strong> ({weatherRiskEval.score}/100)
            </h2>
            <p className="wr-hero-desc">
              {weatherRiskEval.reasons[0] || 'Atmospheric conditions favor safe field management with scheduled morning operations.'}
            </p>
          </div>
        </div>
        <div className="wr-hero-right">
          <span className="wr-mitigation-label">Field Recommendation:</span>
          <p className="wr-mitigation-text">{weatherRiskEval.mitigation}</p>
        </div>
      </div>

      {/* CURRENT WEATHER CARDS GRID */}
      <div className="weather-metrics-grid">
        <div className="w-metric-card highlight-temp">
          <div className="w-icon-box"><Thermometer size={24} /></div>
          <div>
            <span className="w-label">Air Temperature</span>
            <h3 className="w-value">{current.temp}°C</h3>
            <span className="w-sub">Dew Point: {current.dewPoint}°C</span>
          </div>
        </div>

        <div className="w-metric-card highlight-humidity">
          <div className="w-icon-box"><Droplets size={24} /></div>
          <div>
            <span className="w-label">Air Moisture / Humidity</span>
            <h3 className="w-value">{current.humidity}%</h3>
            <span className={`w-sub ${current.humidity >= 75 ? 'text-danger' : 'text-slate-600'}`}>
              {current.humidity >= 75 ? '⚠️ High moisture spreads leaf diseases' : 'Normal ambient moisture'}
            </span>
          </div>
        </div>

        <div className="w-metric-card highlight-rain">
          <div className="w-icon-box"><CloudSun size={24} /></div>
          <div>
            <span className="w-label">Expected Rainfall</span>
            <h3 className="w-value">{current.rainfall} mm</h3>
            <span className="w-sub">{current.condition}</span>
          </div>
        </div>

        <div className="w-metric-card highlight-wind">
          <div className="w-icon-box"><Wind size={24} /></div>
          <div>
            <span className="w-label">Wind Speed</span>
            <h3 className="w-value">{current.windSpeed} km/h</h3>
            <span className="w-sub">
              {current.windSpeed >= 16 ? '⚠️ High wind / spray drift risk' : 'Gentle breeze for spraying'}
            </span>
          </div>
        </div>
      </div>

      {/* ================= SECTION: "WHY IS THIS RISKY?" ================= */}
      <section className="weather-section why-risky-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <ShieldAlert size={22} className="icon-amber" />
            <h2>Why is this risky?</h2>
          </div>
          <span className="badge-pill badge-amber">Agronomic Disease Causation</span>
        </div>

        <div className="why-risky-card">
          <div className="why-risky-lead">
            <p className="why-risky-highlight">
              <strong>Summary: </strong>
              {current.humidity >= 75 || current.rainfall > 0
                ? `High humidity (${current.humidity}%) and rainfall (${current.rainfall} mm) create prolonged leaf surface wetness, establishing optimal microclimate conditions for fungal and bacterial crop diseases.`
                : `Current atmospheric parameters maintain moderate foliar risk. Dry ambient air minimizes fungal germination, but thermal stress and insect vector mobility require regular scouting.`}
            </p>
          </div>

          <div className="why-risky-grid-4">
            {/* Factor 1: Humidity & Spore Germination */}
            <div className={`why-factor-card ${current.humidity >= 75 ? 'factor-danger' : 'factor-ok'}`}>
              <div className="why-factor-header">
                <div className="why-factor-icon"><Droplets size={20} /></div>
                <h4>Leaf Wetness & Spore Germination</h4>
              </div>
              <p className="why-factor-text">
                Relative humidity at <strong>{current.humidity}%</strong> creates microscopic water films on leaf surfaces. Fungal pathogens (Early Blight, Downy Mildew, Rust) require 4–6 hours of leaf wetness for spores to sprout and penetrate leaf stomata.
              </p>
              <div className="why-factor-status">
                {current.humidity >= 80 ? '🔴 Critical Incubation Risk' : current.humidity >= 65 ? '🟡 Moderate Infection Window' : '🟢 Low Wetness Risk'}
              </div>
            </div>

            {/* Factor 2: Temperature Incubation Range */}
            <div className={`why-factor-card ${current.temp >= 20 && current.temp <= 30 ? 'factor-warning' : 'factor-ok'}`}>
              <div className="why-factor-header">
                <div className="why-factor-icon"><Thermometer size={20} /></div>
                <h4>Optimal Pathogen Temperature (20°C - 30°C)</h4>
              </div>
              <p className="why-factor-text">
                Current temperature of <strong>{current.temp}°C</strong> falls directly in the thermal sweet spot where Alternaria and Phytophthora mycelium double their expansion rate compared to cooler or extreme hot weather.
              </p>
              <div className="why-factor-status">
                {current.temp >= 20 && current.temp <= 30 ? '🟡 Peak Pathogen Metabolism' : '🟢 Outside Optimal Incubation'}
              </div>
            </div>

            {/* Factor 3: Precipitation & Chemical Wash-off */}
            <div className={`why-factor-card ${current.rainfall > 0 ? 'factor-danger' : 'factor-ok'}`}>
              <div className="why-factor-header">
                <div className="why-factor-icon"><CloudRain size={20} /></div>
                <h4>Rainfall Wash-off & Splash Spread</h4>
              </div>
              <p className="why-factor-text">
                Rainfall of <strong>{current.rainfall} mm</strong> ({current.condition}) physically washes contact protective fungicides off the foliage within 30 minutes and splashes bacterial droplets (Xanthomonas) from soil to lower leaves.
              </p>
              <div className="why-factor-status">
                {current.rainfall > 5 ? '🔴 Chemical Wash-off & Soil Splash' : current.rainfall > 0 ? '🟡 Light Wash-off Hazard' : '🟢 Dry Canopy (No Wash-off)'}
              </div>
            </div>

            {/* Factor 4: Wind Speed & Spray Drift */}
            <div className={`why-factor-card ${current.windSpeed >= 15 ? 'factor-warning' : 'factor-ok'}`}>
              <div className="why-factor-header">
                <div className="why-factor-icon"><Wind size={20} /></div>
                <h4>Wind Speed & Chemical Drift</h4>
              </div>
              <p className="why-factor-text">
                Wind speeds of <strong>{current.windSpeed} km/h</strong> cause droplet drift away from target canopy, reducing chemical deposition and aiding the airborne migration of sucking vector insects (whiteflies and aphids).
              </p>
              <div className="why-factor-status">
                {current.windSpeed >= 16 ? '🟡 High Spray Drift Hazard' : '🟢 Safe Foliar Deposition'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION: EARLY-WARNING SYSTEM ================= */}
      <section className="weather-section early-warnings-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <AlertOctagon size={22} className="icon-red" />
            <h2>Early-Warning System & Field Advisories</h2>
          </div>
          <span className="badge-pill badge-red">{earlyWarnings.length} Active Early Warnings</span>
        </div>

        <div className="early-warnings-grid">
          {earlyWarnings.map((alert) => (
            <div key={alert.id} className={`ew-alert-card ew-sev-${alert.severity.toLowerCase()}`}>
              <div className="ew-card-top">
                <span className="ew-icon">{alert.icon}</span>
                <div className="ew-title-wrap">
                  <h4 className="ew-title">{alert.title}</h4>
                  <span className={`ew-severity-pill sev-${alert.severity.toLowerCase()}`}>
                    {alert.severity} Priority
                  </span>
                </div>
              </div>
              <p className="ew-message">{alert.message}</p>
              <div className="ew-action-box">
                <strong className="ew-action-lbl">Recommended Action:</strong>
                <p className="ew-action-text">{alert.action}</p>
              </div>
              <div className="ew-meta-footer">
                <span>⏱️ {alert.dateTime}</span>
                <span>📍 {selectedDistrict.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OPTIMAL SPRAY APPLICATION WINDOWS */}
      <section className="weather-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <Clock size={20} className="icon-green" />
            <h2>Best Times to Spray Pesticides Today</h2>
          </div>
          <span className="badge-pill badge-green">Prevent Chemical Wastage & Drift</span>
        </div>

        <div className="spray-windows-grid">
          {sprayWindows.map((win, idx) => (
            <div key={idx} className={`spray-win-card ${win.safe ? 'win-safe' : 'win-risky'}`}>
              <div className="win-top">
                <strong className="win-time">{win.time}</strong>
                <span className={`win-status-badge ${win.safe ? 'badge-green' : 'badge-red'}`}>
                  {win.safe ? '✅ Good to Spray' : '❌ Do Not Spray'}
                </span>
              </div>
              <p className="win-condition">{win.condition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VULNERABILITY GAUGES - SIMPLE FARMER LANGUAGE */}
      <section className="weather-section">
        <div className="section-title-row">
          <h2>Current Disease & Pest Threat Levels in Your Field</h2>
          <span className="badge-pill badge-amber"><Info size={13} /> Multi-Pathogen Threat Gauges</span>
        </div>

        <div className="vulnerability-grid">
          <div className="v-card">
            <div className="v-header">
              <h4>🍄 Fungal Leaf Rot Threat (Blight / Rust / Mold)</h4>
              <span className={`v-score ${vulnerabilityIndices.fungalSpore > 70 ? 'val-danger' : vulnerabilityIndices.fungalSpore > 40 ? 'val-warning' : 'val-success'}`}>
                {vulnerabilityIndices.fungalSpore}% ({vulnerabilityIndices.fungalSpore > 70 ? 'High' : vulnerabilityIndices.fungalSpore > 40 ? 'Moderate' : 'Low'} Threat)
              </span>
            </div>
            <div className="v-progress-track">
              <div
                className={`v-progress-bar ${vulnerabilityIndices.fungalSpore > 70 ? 'bar-fill-danger' : vulnerabilityIndices.fungalSpore > 40 ? 'bar-fill-warning' : 'bar-fill-success'}`}
                style={{ width: `${vulnerabilityIndices.fungalSpore}%` }}
              ></div>
            </div>
            <p className="v-desc">High moisture and wet leaves make fungal rots spread rapidly. Ensure furrow drainage and spray recommended protective fungicide.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>🦠 Bacterial Leaf Spot Threat (Dark Spots on Leaves)</h4>
              <span className={`v-score ${vulnerabilityIndices.bacterialBlight > 70 ? 'val-danger' : vulnerabilityIndices.bacterialBlight > 40 ? 'val-warning' : 'val-success'}`}>
                {vulnerabilityIndices.bacterialBlight}% ({vulnerabilityIndices.bacterialBlight > 70 ? 'High' : vulnerabilityIndices.bacterialBlight > 40 ? 'Moderate' : 'Low'} Threat)
              </span>
            </div>
            <div className="v-progress-track">
              <div
                className={`v-progress-bar ${vulnerabilityIndices.bacterialBlight > 70 ? 'bar-fill-danger' : vulnerabilityIndices.bacterialBlight > 40 ? 'bar-fill-warning' : 'bar-fill-success'}`}
                style={{ width: `${vulnerabilityIndices.bacterialBlight}%` }}
              ></div>
            </div>
            <p className="v-desc">Warm temperatures with humid air create risk of black leaf spots. Check lower leaves and avoid excess sprinkler watering.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>🌱 Root Rot & Soil Waterlogging Threat</h4>
              <span className={`v-score ${vulnerabilityIndices.rootRot > 70 ? 'val-danger' : vulnerabilityIndices.rootRot > 40 ? 'val-warning' : 'val-success'}`}>
                {vulnerabilityIndices.rootRot}% ({vulnerabilityIndices.rootRot > 70 ? 'High' : vulnerabilityIndices.rootRot > 40 ? 'Moderate' : 'Low'} Threat)
              </span>
            </div>
            <div className="v-progress-track">
              <div
                className={`v-progress-bar ${vulnerabilityIndices.rootRot > 70 ? 'bar-fill-danger' : vulnerabilityIndices.rootRot > 40 ? 'bar-fill-warning' : 'bar-fill-success'}`}
                style={{ width: `${vulnerabilityIndices.rootRot}%` }}
              ></div>
            </div>
            <p className="v-desc">Excess standing water in soil causes roots to rot and plants to wilt. Clear field drainage channels to let extra water flow out.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>🐛 Insect & Pest Attack Threat (Whiteflies / Aphids / Mites)</h4>
              <span className={`v-score ${vulnerabilityIndices.insectPest > 70 ? 'val-danger' : vulnerabilityIndices.insectPest > 40 ? 'val-warning' : 'val-success'}`}>
                {vulnerabilityIndices.insectPest}% ({vulnerabilityIndices.insectPest > 70 ? 'High' : vulnerabilityIndices.insectPest > 40 ? 'Moderate' : 'Low'} Threat)
              </span>
            </div>
            <div className="v-progress-track">
              <div
                className={`v-progress-bar ${vulnerabilityIndices.insectPest > 70 ? 'bar-fill-danger' : vulnerabilityIndices.insectPest > 40 ? 'bar-fill-warning' : 'bar-fill-success'}`}
                style={{ width: `${vulnerabilityIndices.insectPest}%` }}
              ></div>
            </div>
            <p className="v-desc">Ambient temperature and wind speeds govern flying insect vectors settling on crop leaves today.</p>
          </div>
        </div>
      </section>

      {/* 7-DAY FORECAST TIMELINE */}
      <section className="weather-section">
        <div className="section-title-row">
          <h2>7-Day Weather & Crop Disease Risk Forecast</h2>
          <span className="sub-title-text">Plan your farm irrigation and spray schedule for the coming week</span>
        </div>

        <div className="forecast-timeline-grid">
          {forecast7Days.map((item, idx) => (
            <div key={idx} className={`forecast-card ${item.riskScore > 75 ? 'forecast-danger' : item.riskScore > 50 ? 'forecast-warning' : ''}`}>
              <div className="f-day">{item.day}</div>
              <div className="f-temp">{item.tempMax}° / {item.tempMin}°C</div>
              <div className="f-humidity"><Droplets size={12} /> {item.humidity}% Humidity</div>

              <div className="f-risk-gauge">
                <div
                  className="f-risk-bar"
                  style={{
                    height: `${item.riskScore}%`,
                    background: item.riskScore > 75 ? '#ef4444' : item.riskScore > 50 ? '#f59e0b' : '#10b981',
                  }}
                ></div>
              </div>

              <div className="f-score">{item.riskScore}% Threat</div>
              <div className="f-threat">{item.dominantThreat}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
