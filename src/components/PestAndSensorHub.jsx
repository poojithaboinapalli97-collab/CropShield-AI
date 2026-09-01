import React, { useState } from 'react';
import {
  Bug,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Thermometer,
  Sun,
  Battery,
  Wifi,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Info,
  Radio,
  Sliders,
} from 'lucide-react';
import { mockPestTrapData, mockSensorNodes } from '../data/mockData';

export default function PestAndSensorHub({ onTriggerAdvisory }) {
  const [activeTab, setActiveTab] = useState('traps');
  const [traps, setTraps] = useState(mockPestTrapData);
  const [sensors, setSensors] = useState(mockSensorNodes);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateTelemetry = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      // Random subtle variation
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          canopyTemp: parseFloat((s.canopyTemp + (Math.random() * 0.8 - 0.4)).toFixed(1)),
          canopyHumidity: Math.min(100, Math.max(40, Math.round(s.canopyHumidity + (Math.random() * 4 - 2)))),
          leafWetnessHours: parseFloat((s.leafWetnessHours + (Math.random() * 0.4 - 0.2)).toFixed(1)),
          sporeGerminationRiskIndex: Math.min(100, Math.max(10, Math.round(s.sporeGerminationRiskIndex + (Math.random() * 6 - 3)))),
          lastPing: 'Just now',
        }))
      );
    }, 600);
  };

  return (
    <div className="pest-sensor-hub-container">
      {/* HEADER */}
      <div className="hub-header">
        <div className="hub-title-group">
          <div className="hub-badge-row">
            <span className="badge-pill badge-purple">
              <Cpu size={13} /> IoT & Smart Trap Telemetry
            </span>
            <span className="badge-pill badge-green">Real-time Field Sensors</span>
          </div>
          <h2 className="hub-title">Smart Pest-Trap & Microclimate Sensor Hub</h2>
          <p className="hub-subtitle">
            Integrate automated solar pheromone traps with optical pest counts, Economic Threshold Limits (ETL), canopy leaf wetness, and soil moisture telemetry.
          </p>
        </div>

        <div className="hub-actions">
          <button
            type="button"
            onClick={handleSimulateTelemetry}
            disabled={isSimulating}
            className="btn-refresh-telemetry"
          >
            <RefreshCw size={15} className={isSimulating ? 'spinner' : ''} />
            <span>{isSimulating ? 'Updating Live Feed...' : 'Sync Sensor Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="hub-nav-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('traps')}
          className={`hub-tab-btn ${activeTab === 'traps' ? 'hub-tab-active' : ''}`}
        >
          <Bug size={17} />
          <span>Smart Pest Traps & ETL Counts ({traps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sensors')}
          className={`hub-tab-btn ${activeTab === 'sensors' ? 'hub-tab-active' : ''}`}
        >
          <Cpu size={17} />
          <span>Canopy & Soil Microclimate Nodes ({sensors.length})</span>
        </button>
      </div>

      {/* VIEW 1: SMART PEST TRAPS */}
      {activeTab === 'traps' && (
        <div className="traps-view-content">
          <div className="traps-grid">
            {traps.map((trap) => {
              const isBreached = trap.dailyCatchCount >= trap.economicThresholdLimit;
              return (
                <div
                  key={trap.trapId}
                  className={`trap-card ${isBreached ? 'trap-card-breached' : ''}`}
                >
                  <div className="trap-card-top">
                    <div>
                      <span className="trap-id-pill">{trap.trapId}</span>
                      <h4 className="trap-name">{trap.trapName}</h4>
                      <span className="trap-loc">📍 {trap.location} ({trap.crop})</span>
                    </div>
                    <span className={`trap-status-badge ${isBreached ? 'badge-red' : 'badge-green'}`}>
                      {trap.status}
                    </span>
                  </div>

                  {/* Target & Counts */}
                  <div className="trap-target-banner">
                    <span className="target-lbl">Target Pest Vector:</span>
                    <strong className="target-name">{trap.pestTarget}</strong>
                  </div>

                  <div className="trap-counts-row">
                    <div className="count-stat-box">
                      <span className="count-lbl">Today's Catch</span>
                      <h3 className={`count-val ${isBreached ? 'text-danger' : 'text-emerald'}`}>
                        {trap.dailyCatchCount}
                      </h3>
                      <span className="count-sub">Insects</span>
                    </div>

                    <div className="count-stat-box">
                      <span className="count-lbl">Threshold (ETL)</span>
                      <h3 className="count-val text-amber">{trap.economicThresholdLimit}</h3>
                      <span className="count-sub">ETL Limit / Day</span>
                    </div>

                    <div className="count-stat-box">
                      <span className="count-lbl">7-Day Total</span>
                      <h3 className="count-val text-purple">{trap.weeklyCatchCount}</h3>
                      <span className="count-sub">Cumulative</span>
                    </div>
                  </div>

                  {/* 7-Day Sparkline Trend Visualizer */}
                  <div className="trend-sparkline-box">
                    <span className="trend-lbl">7-Day Catch Velocity:</span>
                    <div className="sparkline-bars">
                      {trap.sevenDayTrend.map((val, idx) => {
                        const heightPct = Math.min(100, Math.round((val / 80) * 100));
                        return (
                          <div key={idx} className="sparkline-bar-track" title={`Day ${idx + 1}: ${val} pests`}>
                            <div
                              className={`sparkline-bar-fill ${val >= trap.economicThresholdLimit ? 'fill-red' : 'fill-green'}`}
                              style={{ height: `${heightPct}%` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Trap Details Footer */}
                  <div className="trap-footer-meta">
                    <div className="meta-left">
                      <span>🪤 Lure: {trap.lureType}</span>
                      <span>🔋 Battery: {trap.batteryLevel}%</span>
                    </div>
                    <span className="last-count-txt">⏱️ {trap.lastAutomatedCountDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: IOT MICROCLIMATE CANOPY SENSORS */}
      {activeTab === 'sensors' && (
        <div className="sensors-view-content">
          <div className="sensors-grid">
            {sensors.map((sensor) => {
              const isHighSporeRisk = sensor.sporeGerminationRiskIndex >= 70;
              return (
                <div key={sensor.nodeId} className="sensor-node-card">
                  <div className="sensor-top-row">
                    <div>
                      <span className="sensor-id-pill">{sensor.nodeId}</span>
                      <h4 className="sensor-name">{sensor.nodeName}</h4>
                      <span className="sensor-field">📍 {sensor.field}</span>
                    </div>
                    <div className="sensor-status-indicator">
                      <span className="online-beacon"></span>
                      <span className="sensor-ping-text">{sensor.lastPing}</span>
                    </div>
                  </div>

                  {/* SPORE GERMINATION RISK METER */}
                  <div className="spore-risk-meter-box">
                    <div className="spore-risk-header">
                      <span className="spore-risk-title">
                        <Activity size={15} /> Fungal Spore Germination Index:
                      </span>
                      <strong className={`spore-score ${isHighSporeRisk ? 'text-danger' : 'text-emerald'}`}>
                        {sensor.sporeGerminationRiskIndex}% ({isHighSporeRisk ? 'Elevated Spore Dispersal' : 'Normal'})
                      </strong>
                    </div>
                    <div className="spore-progress-track">
                      <div
                        className={`spore-progress-fill ${isHighSporeRisk ? 'bg-danger' : 'bg-emerald'}`}
                        style={{ width: `${sensor.sporeGerminationRiskIndex}%` }}
                      ></div>
                    </div>
                    <p className="spore-note">
                      Calculated from Leaf Wetness Duration ({sensor.leafWetnessHours} hrs) + Canopy RH ({sensor.canopyHumidity}%).
                    </p>
                  </div>

                  {/* TELEMETRY 4-PACK TILES */}
                  <div className="telemetry-tiles-grid">
                    <div className="tele-tile">
                      <div className="tile-icon icon-amber"><Thermometer size={18} /></div>
                      <div>
                        <span className="tile-lbl">Canopy Temperature</span>
                        <strong className="tile-val">{sensor.canopyTemp}°C</strong>
                      </div>
                    </div>

                    <div className="tele-tile">
                      <div className="tile-icon icon-sky"><Droplets size={18} /></div>
                      <div>
                        <span className="tile-lbl">Canopy Humidity</span>
                        <strong className="tile-val">{sensor.canopyHumidity}%</strong>
                      </div>
                    </div>

                    <div className="tele-tile">
                      <div className="tile-icon icon-blue"><Activity size={18} /></div>
                      <div>
                        <span className="tile-lbl">Leaf Wetness Duration</span>
                        <strong className="tile-val">{sensor.leafWetnessHours} hrs/day</strong>
                      </div>
                    </div>

                    <div className="tele-tile">
                      <div className="tile-icon icon-purple"><Sun size={18} /></div>
                      <div>
                        <span className="tile-lbl">Solar Radiation</span>
                        <strong className="tile-val">{sensor.solarRadiation} W/m²</strong>
                      </div>
                    </div>
                  </div>

                  {/* SOIL STRATA PROFILE */}
                  <div className="soil-strata-box">
                    <span className="soil-title">Soil Moisture Strata:</span>
                    <div className="soil-bars-row">
                      <div className="soil-bar-item">
                        <span className="soil-depth">15cm (Top Root Zone):</span>
                        <div className="soil-track">
                          <div className="soil-fill" style={{ width: `${sensor.soilMoisture15cm}%` }}></div>
                        </div>
                        <strong className="soil-pct">{sensor.soilMoisture15cm}%</strong>
                      </div>

                      <div className="soil-bar-item">
                        <span className="soil-depth">30cm (Deep Subsoil):</span>
                        <div className="soil-track">
                          <div className="soil-fill" style={{ width: `${sensor.soilMoisture30cm}%` }}></div>
                        </div>
                        <strong className="soil-pct">{sensor.soilMoisture30cm}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
