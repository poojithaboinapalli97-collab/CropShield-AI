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
} from 'lucide-react';
import { allIndiaDistrictOptions } from '../data/indiaLocations';
import { fetchLiveWeatherTelemetry } from '../services/weatherService';
import { evaluateWeatherRisk } from '../services/cropRiskEngine';
import { generateEarlyWarnings } from '../services/earlyWarningService';
import { mockWeather } from '../data/mockData';

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
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="sih-badge-inline">
              <Sparkles size={13} /> PRECISION AGRI-VISION • WEATHER RISK FORECAST
            </span>
            <span className={`data-source-pill ${isLiveWeather ? 'pill-live' : 'pill-fallback'}`}>
              <Radio size={12} className={isLiveWeather ? 'animate-pulse' : ''} />
              {isLiveWeather ? 'Live Agro-Station Telemetry' : 'Simulated Agro-Climatic Data (Offline Fallback)'}
            </span>
          </div>
          <h1 className="page-title">Weather & Disease Risk Forecast for Farmers</h1>
          <p className="page-subtitle">
            Live meteorological data, multi-pillar disease risk calculations, and real-time early warnings to protect crop yield.
          </p>
        </div>

        <div className="location-select-box">
          <label>Target District (AP & Telangana):</label>
          <div className="relative">
            <input
              type="text"
              list="all-india-weather-districts"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="district-select"
              placeholder="Select district..."
            />
            <datalist id="all-india-weather-districts">
              {allIndiaDistrictOptions.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>
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
