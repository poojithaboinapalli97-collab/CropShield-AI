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
import { allIndiaDistrictOptions, stateDistrictMap, indianStates } from '../data/indiaLocations';
import { mockWeather } from '../data/mockData';

export default function WeatherRisk() {
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    const d = localStorage.getItem('selectedDistrict') || 'Guntur';
    const s = localStorage.getItem('selectedState') || 'Andhra Pradesh';
    return `${d}, ${s}`;
  });

  const [weatherData, setWeatherData] = useState(() => ({
    ...mockWeather,
    current: {
      ...mockWeather.current,
      district: localStorage.getItem('selectedDistrict') ? `${localStorage.getItem('selectedDistrict')} District, ${localStorage.getItem('selectedState') || 'Andhra Pradesh'}` : mockWeather.current.district,
    }
  }));

  useEffect(() => {
    fetchWeatherRisk(selectedDistrict)
      .then((res) => {
        if (res && res.data) {
          setWeatherData({
            ...mockWeather,
            ...res.data,
            current: {
              ...mockWeather.current,
              ...(res.data.current || {}),
              district: selectedDistrict.includes('District') ? selectedDistrict : `${selectedDistrict} District`,
            },
          });
        }
      })
      .catch((err) => {
        console.error('Weather fetch error:', err);
      });
  }, [selectedDistrict]);

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
            <Sparkles size={13} /> PRECISION AGRI-VISION • WEATHER RISK FORECAST
          </span>
          <h1 className="page-title">Weather & Disease Risk Forecast for Farmers</h1>
          <p className="page-subtitle">
            Live weather conditions and simple risk alerts to protect your crops from fungal rot, bacterial spots, and insect pests.
          </p>
        </div>

        <div className="location-select-box">
          <label>Target District (AP & Telangana):</label>
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
            <span className="w-sub text-danger">⚠️ High moisture spreads leaf diseases</span>
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
            <span className="w-sub">Gentle breeze for spraying</span>
          </div>
        </div>
      </div>

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
          <span className="badge-pill badge-amber"><Info size={13} /> Live Field Advisory</span>
        </div>

        <div className="vulnerability-grid">
          <div className="v-card">
            <div className="v-header">
              <h4>🍄 Fungal Leaf Rot Threat (Blight / Rust / Mold)</h4>
              <span className="v-score val-danger">{vulnerabilityIndices.fungalSpore}% (High Threat)</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-danger" style={{ width: `${vulnerabilityIndices.fungalSpore}%` }}></div>
            </div>
            <p className="v-desc">High moisture and wet leaves make fungal rots spread rapidly. Ensure furrow drainage and spray recommended protective fungicide.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>🦠 Bacterial Leaf Spot Threat (Dark Spots on Leaves)</h4>
              <span className="v-score val-warning">{vulnerabilityIndices.bacterialBlight}% (Moderate Threat)</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-warning" style={{ width: `${vulnerabilityIndices.bacterialBlight}%` }}></div>
            </div>
            <p className="v-desc">Warm temperatures with humid air create moderate risk of black leaf spots. Check lower leaves and avoid excess sprinkler watering.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>🌱 Root Rot & Soil Waterlogging Threat</h4>
              <span className="v-score val-danger">{vulnerabilityIndices.rootRot}% (High Threat)</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-danger" style={{ width: `${vulnerabilityIndices.rootRot}%` }}></div>
            </div>
            <p className="v-desc">Excess standing water in soil causes roots to rot and plants to wilt. Clear field drainage channels to let extra water flow out.</p>
          </div>

          <div className="v-card">
            <div className="v-header">
              <h4>🐛 Insect & Pest Attack Threat (Whiteflies / Aphids / Mites)</h4>
              <span className="v-score val-success">{vulnerabilityIndices.insectPest}% (Low / Safe)</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-bar bar-fill-success" style={{ width: `${vulnerabilityIndices.insectPest}%` }}></div>
            </div>
            <p className="v-desc">Current wind speeds keep flying insect pests from settling heavily on crop leaves today.</p>
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
