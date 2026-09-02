import React, { useState, useEffect } from 'react';
import { fetchWeatherRisk } from '../services/api';
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
} from 'lucide-react';

export default function WeatherRisk() {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('Ludhiana District, Punjab');

  useEffect(() => {
    fetchWeatherRisk(selectedDistrict).then((res) => {
      if (res && res.success && res.data && res.data.current) {
        setWeatherData(res.data);
      }
    });
  }, [selectedDistrict]);

  if (!weatherData) return <div className="loading-card">Loading Weather Intelligence...</div>;

  const { current, vulnerabilityIndices, forecast7Days } = weatherData;

  const sprayWindows = [
    { time: '06:00 AM - 09:30 AM', status: 'Optimal Window', condition: 'Wind < 6 km/h, Temp 22°C, Zero Rain Risk', safe: true },
    { time: '11:00 AM - 03:00 PM', status: 'Unfavorable / Drift Risk', condition: 'High UV Photolysis, High Heat > 32°C', safe: false },
    { time: '04:30 PM - 06:30 PM', status: 'Moderate Window', condition: 'Wind 8 km/h, Good Foliage Absorption', safe: true },
    { time: '08:00 PM - Midnight', status: 'Night Dew / Wash Risk', condition: 'Heavy Dew Precipitation (>90% RH)', safe: false },
  ];

  return (
    <div className="weather-page">
      <div className="page-header">
        <div>
          <span className="sih-badge-inline">
            <Sparkles size={13} /> SIH26131 • MICROCLIMATE EPIDEMIOLOGY ENGINE
          </span>
          <h1 className="page-title">Weather & Microclimate Disease Forecasting</h1>
          <p className="page-subtitle">
            Correlate ambient temperature, relative humidity, leaf wetness hours, and dew point to forecast fungal spore dispersal, insect generation cycles, and safe pesticide spray windows.
          </p>
        </div>

        <div className="location-select-box">
          <label>Target District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="district-select"
          >
            <option value="Ludhiana District, Punjab">Ludhiana, Punjab</option>
            <option value="Karnal, Haryana">Karnal, Haryana</option>
            <option value="Nashik, Maharashtra">Nashik, Maharashtra</option>
            <option value="Guntur, Andhra Pradesh">Guntur, Andhra Pradesh</option>
            <option value="Hooghly, West Bengal">Hooghly, West Bengal</option>
          </select>
        </div>
      </div>

      {/* CURRENT WEATHER CARDS GRID */}
      <div className="weather-metrics-grid">
        <div className="w-metric-card highlight-temp">
          <div className="w-icon-box"><Thermometer size={24} /></div>
          <div>
            <span className="w-label">Ambient Temperature</span>
            <h3 className="w-value">{current.temp}°C</h3>
            <span className="w-sub">Dew Point: {current.dewPoint}°C</span>
          </div>
        </div>

        <div className="w-metric-card highlight-humidity">
          <div className="w-icon-box"><Droplets size={24} /></div>
          <div>
            <span className="w-label">Relative Humidity</span>
            <h3 className="w-value">{current.humidity}%</h3>
            <span className="w-sub text-danger">Spore germination threshold exceeded (&gt;80%)</span>
          </div>
        </div>

        <div className="w-metric-card highlight-rain">
          <div className="w-icon-box"><CloudSun size={24} /></div>
          <div>
            <span className="w-label">24h Rainfall Probability</span>
            <h3 className="w-value">{current.rainfall} mm</h3>
            <span className="w-sub">{current.condition}</span>
          </div>
        </div>

        <div className="w-metric-card highlight-wind">
          <div className="w-icon-box"><Wind size={24} /></div>
          <div>
            <span className="w-label">Wind Velocity & Drift</span>
            <h3 className="w-value">{current.windSpeed} km/h</h3>
            <span className="w-sub">Vector Dispersal: SE Breeze</span>
          </div>
        </div>
      </div>

      {/* OPTIMAL SPRAY APPLICATION WINDOWS */}
      <section className="weather-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <Clock size={20} className="icon-green" />
            <h2>Precision Spray Timing & Drift Advisory</h2>
          </div>
          <span className="badge-pill badge-green">Prevent Chemical Wastage & Drift</span>
        </div>

        <div className="spray-windows-grid">
          {sprayWindows.map((win, idx) => (
            <div key={idx} className={`spray-win-card ${win.safe ? 'win-safe' : 'win-risky'}`}>
              <div className="win-top">
                <strong className="win-time">{win.time}</strong>
                <span className={`win-status-badge ${win.safe ? 'badge-green' : 'badge-red'}`}>
                  {win.status}
                </span>
              </div>
              <p className="win-condition">{win.condition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VULNERABILITY GAUGES */}
      <section className="weather-section">
        <div className="section-title-row">
          <h2>Microclimate Disease & Pest Vulnerability Matrix</h2>
          <span className="badge-pill badge-amber"><Info size={13} /> Calibrated with Field Sensors</span>
        </div>

        <div className="vulnerability-grid">
          <div className="v-card">
            <div className="v-header">
              <h4>Fungal Spore Germination (Mills Index)</h4>
              <span className="v-score val-danger">{vulnerabilityIndices.fungalSpore}%</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-danger" style={{ width: `${vulnerabilityIndices.fungalSpore}%` }}></div>
            </div>
            <p className="v-desc">Puccinia (Yellow Rust) and Alternaria (Early Blight) spores propagate rapidly above 80% RH.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>Bacterial Blight Risk (Xanthomonas)</h4>
              <span className="v-score val-warning">{vulnerabilityIndices.bacterialBlight}%</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-warning" style={{ width: `${vulnerabilityIndices.bacterialBlight}%` }}></div>
            </div>
            <p className="v-desc">Warm temperatures (28-32°C) combined with high moisture create moderate bacterial streak risk.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>Pythium & Root Rot Index</h4>
              <span className="v-score val-danger">{vulnerabilityIndices.rootRot}%</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-danger" style={{ width: `${vulnerabilityIndices.rootRot}%` }}></div>
            </div>
            <p className="v-desc">Excess waterlogging in soil leads to Pythium and Rhizoctonia root collar dampening.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>Insect Vector Flight Velocity (GDD)</h4>
              <span className="v-score val-success">{vulnerabilityIndices.insectPest}%</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-success" style={{ width: `${vulnerabilityIndices.insectPest}%` }}></div>
            </div>
            <p className="v-desc">Wind speeds above 12km/h decrease Whitefly & Aphid settling rates.</p>
          </div>
        </div>
      </section>

      {/* 7-DAY FORECAST TIMELINE */}
      <section className="weather-section">
        <div className="section-title-row">
          <h2>7-Day Epidemiological Risk Curve</h2>
          <span className="sub-title-text">Predictive spore pressure over the upcoming week</span>
        </div>

        <div className="forecast-timeline-grid">
          {forecast7Days.map((item, idx) => (
            <div key={idx} className={`forecast-card ${item.riskScore > 75 ? 'forecast-danger' : item.riskScore > 50 ? 'forecast-warning' : ''}`}>
              <div className="f-day">{item.day}</div>
              <div className="f-temp">{item.tempMax}° / {item.tempMin}°C</div>
              <div className="f-humidity"><Droplets size={12} /> {item.humidity}%</div>

              <div className="f-risk-gauge">
                <div
                  className="f-risk-bar"
                  style={{
                    height: `${item.riskScore}%`,
                    background: item.riskScore > 75 ? '#ef4444' : item.riskScore > 50 ? '#f59e0b' : '#10b981',
                  }}
                ></div>
              </div>

              <div className="f-score">{item.riskScore}% Risk</div>
              <div className="f-threat">{item.dominantThreat}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
