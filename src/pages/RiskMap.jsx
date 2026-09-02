import React, { useState, useEffect } from 'react';
import { fetchRiskMapData, sendAdminBroadcast } from '../services/api';
import '../styles/RiskMap.css';
import {
  MapPin,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sprout,
  Users,
  Info,
  Layers,
  Bug,
  Cpu,
  Building2,
  Radio,
  Send,
  Sparkles,
  ShieldCheck,
  Activity,
  Maximize2,
  Compass,
  FileSpreadsheet,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { mockPestTrapData, mockSensorNodes, mockKvkAndLabs } from '../data/mockData';

export default function RiskMap() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [cropFilter, setCropFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Layer Visibility Controls
  const [showDiseaseLayer, setShowDiseaseLayer] = useState(true);
  const [showPestTrapLayer, setShowPestTrapLayer] = useState(true);
  const [showSensorLayer, setShowSensorLayer] = useState(true);
  const [showLabLayer, setShowLabLayer] = useState(true);
  const [showContainmentZones, setShowContainmentZones] = useState(true);

  const [broadcastNotice, setBroadcastNotice] = useState('');
  const [selectedPinInfo, setSelectedPinInfo] = useState(null);

  useEffect(() => {
    fetchRiskMapData(cropFilter, riskFilter).then((res) => {
      if (res && res.success && Array.isArray(res.data)) {
        setDistricts(res.data);

        if (res.data.length > 0) {
          setSelectedDistrict((current) => {
            const stillExists = res.data.find((item) => item.id === current?.id);
            return stillExists || res.data[0];
          });
        } else {
          setSelectedDistrict(null);
        }
      }
    });
  }, [cropFilter, riskFilter]);

  const getRiskClass = (riskLevel) => {
    switch (riskLevel) {
      case 'Critical':
        return 'pin-critical';
      case 'High':
        return 'pin-high';
      case 'Medium':
        return 'pin-medium';
      default:
        return 'pin-low';
    }
  };

  const getRiskPillClass = (riskLevel) => {
    switch (riskLevel) {
      case 'Critical':
        return 'badge-critical';
      case 'High':
        return 'badge-high';
      case 'Medium':
        return 'badge-medium';
      default:
        return 'badge-low';
    }
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === 'Low') {
      return <CheckCircle2 size={16} />;
    }
    return <AlertTriangle size={16} />;
  };

  const handleSendDistrictBroadcast = async () => {
    if (!selectedDistrict) return;
    setBroadcastNotice('Dispatching emergency SMS & IVR advisory to all farmers in ' + selectedDistrict.district + '...');
    const res = await sendAdminBroadcast(
      selectedDistrict.district,
      'Emergency Containment Alert',
      selectedDistrict.advisory
    );
    if (res.success) {
      setBroadcastNotice(`✅ Alert broadcast successfully sent to ${res.farmersReached.toLocaleString()} registered farmers in ${selectedDistrict.district}!`);
      setTimeout(() => setBroadcastNotice(''), 4000);
    }
  };

  // Summary Metrics
  const criticalCount = districts.filter((d) => d.riskLevel === 'Critical').length;
  const highCount = districts.filter((d) => d.riskLevel === 'High').length;
  const totalFarmsMonitored = districts.reduce((acc, curr) => acc + (curr.affectedFarms || 0), 0);

  return (
    <div className="riskmap-page">
      {/* 1. TOP HEADER & METRIC KPI BOXES */}
      <div className="riskmap-header-box">
        <div className="riskmap-title-area">
          <span className="sih-badge-inline">
            <Sparkles size={13} /> SIH26131 • GEOSPATIAL SURVEILLANCE & HOTSPOT RADAR
          </span>
          <h1 className="page-title">Regional Outbreak & Epidemic Surveillance Map</h1>
          <p className="page-subtitle">
            Real-time geospatial intelligence fusing AI vision diagnoses, smart pheromone trap threshold breaches, microclimate IoT telemetry, and 25km containment zones.
          </p>
        </div>
      </div>

      {/* 4 SUMMARY KPI BOXES */}
      <div className="riskmap-kpi-summary-grid">
        <div className="risk-kpi-box">
          <div className="kpi-icon-circle kpi-icon-red">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-text-meta">
            <span className="kpi-num-val">{criticalCount} Zones</span>
            <span className="kpi-num-lbl">Critical Outbreaks</span>
            <span className="kpi-num-sub">Emergency Containment</span>
          </div>
        </div>

        <div className="risk-kpi-box">
          <div className="kpi-icon-circle kpi-icon-amber">
            <Activity size={22} />
          </div>
          <div className="kpi-text-meta">
            <span className="kpi-num-val">{highCount} Zones</span>
            <span className="kpi-num-lbl">High Spore Warnings</span>
            <span className="kpi-num-sub">Pre-emptive Action</span>
          </div>
        </div>

        <div className="risk-kpi-box">
          <div className="kpi-icon-circle kpi-icon-green">
            <Users size={22} />
          </div>
          <div className="kpi-text-meta">
            <span className="kpi-num-val">{totalFarmsMonitored.toLocaleString()}</span>
            <span className="kpi-num-lbl">Farms Monitored</span>
            <span className="kpi-num-sub">Across 6 Key States</span>
          </div>
        </div>

        <div className="risk-kpi-box">
          <div className="kpi-icon-circle kpi-icon-purple">
            <Cpu size={22} />
          </div>
          <div className="kpi-text-meta">
            <span className="kpi-num-val">{mockPestTrapData.length + mockSensorNodes.length} Nodes</span>
            <span className="kpi-num-lbl">IoT & Traps Active</span>
            <span className="kpi-num-sub">Live 15-min Telemetry</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & MULTI-LAYER CONTROLS CARD */}
      <div className="riskmap-controls-card">
        <div className="controls-row-top">
          <div className="filter-left-group">
            <Filter size={18} className="icon-green" />
            <div className="filter-header-text">
              <strong>Regional Zone Filters</strong>
              <span>Refine display by crop belt and threat level</span>
            </div>
          </div>

          <div className="filter-dropdowns-group">
            <div className="filter-input-wrap">
              <label>Crop Belt:</label>
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="filter-native-select"
              >
                <option value="all">All Crops (National)</option>
                <option value="wheat">Wheat (Northern Belt)</option>
                <option value="rice">Paddy / Rice (Delta Belts)</option>
                <option value="tomato">Tomato & Vegetables</option>
                <option value="chilli">Chilli & Commercial</option>
                <option value="potato">Potato & Tubers</option>
              </select>
            </div>

            <div className="filter-input-wrap">
              <label>Risk Severity:</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="filter-native-select"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">🔴 Critical Outbreak (&gt;85)</option>
                <option value="high">🟠 High Spore Pressure (70-85)</option>
                <option value="medium">🟡 Moderate Risk (40-70)</option>
                <option value="low">🟢 Low / Safe (&lt;40)</option>
              </select>
            </div>
          </div>
        </div>

        {/* LAYER TOGGLES */}
        <div className="layer-toggles-bar">
          <div className="layer-title-badge">
            <Layers size={16} className="icon-green" />
            <span>Map Overlays:</span>
          </div>

          <div className="layer-chips-group">
            <button
              type="button"
              className={`map-layer-chip ${showDiseaseLayer ? 'map-layer-chip-active' : ''}`}
              onClick={() => setShowDiseaseLayer(!showDiseaseLayer)}
            >
              🔴 Disease Outbreak Pins
            </button>
            <button
              type="button"
              className={`map-layer-chip ${showPestTrapLayer ? 'map-layer-chip-active' : ''}`}
              onClick={() => setShowPestTrapLayer(!showPestTrapLayer)}
            >
              🪤 Pest Trap Breaches ({mockPestTrapData.length})
            </button>
            <button
              type="button"
              className={`map-layer-chip ${showSensorLayer ? 'map-layer-chip-active' : ''}`}
              onClick={() => setShowSensorLayer(!showSensorLayer)}
            >
              📡 IoT Sensor Nodes ({mockSensorNodes.length})
            </button>
            <button
              type="button"
              className={`map-layer-chip ${showLabLayer ? 'map-layer-chip-active' : ''}`}
              onClick={() => setShowLabLayer(!showLabLayer)}
            >
              🔬 KVK Pathology Labs ({mockKvkAndLabs.length})
            </button>
            <button
              type="button"
              className={`map-layer-chip ${showContainmentZones ? 'map-layer-chip-active' : ''}`}
              onClick={() => setShowContainmentZones(!showContainmentZones)}
            >
              ⭕ 25km Buffer Rings
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT GRID (MAP ON LEFT, DETAILS ON RIGHT) */}
      <div className="riskmap-main-grid">
        {/* MAP PRESENTATION CARD */}
        <div className="map-presentation-card">
          <div className="map-card-topbar">
            <div>
              <h3>
                <Compass size={18} className="icon-green" /> India Agricultural Surveillance Radar
              </h3>
              <p>Click any district hotspot pin, smart trap, or IoT station to inspect telemetry</p>
            </div>
            <span className="badge-pill badge-green">
              {districts.length} Monitored Zones
            </span>
          </div>

          <div className="map-canvas-viewport">
            {/* ACCURATE PRESENTATION VECTOR MAP OF INDIA */}
            <svg viewBox="0 0 100 100" className="india-map-vector" aria-hidden="true">
              {/* Graticule Background Grid */}
              <line x1="10" y1="20" x2="90" y2="20" className="geo-graticule-line" />
              <line x1="10" y1="40" x2="90" y2="40" className="geo-graticule-line" />
              <line x1="10" y1="60" x2="90" y2="60" className="geo-graticule-line" />
              <line x1="10" y1="80" x2="90" y2="80" className="geo-graticule-line" />
              <line x1="30" y1="10" x2="30" y2="90" className="geo-graticule-line" />
              <line x1="50" y1="10" x2="50" y2="90" className="geo-graticule-line" />
              <line x1="70" y1="10" x2="70" y2="90" className="geo-graticule-line" />

              {/* Geographic Contour Outline of India */}
              <path
                d="M34,10 C36,7 41,8 43,12 C45,15 48,15 51,18 C55,22 59,20 62,23 C66,27 70,25 74,27 C78,30 83,28 86,33 C88,38 84,41 81,44 C77,47 79,52 75,55 C70,58 66,54 62,56 C58,60 54,68 51,75 C48,82 45,89 44,93 C42,88 39,81 36,74 C33,67 29,62 27,55 C24,49 20,44 19,38 C18,33 22,30 26,26 C29,22 32,15 34,10 Z"
                className="india-boundary-path"
              />

              {/* State Demographic Dividing Contours */}
              <path d="M26,26 C36,28 48,27 60,26" className="india-state-line" />
              <path d="M20,38 C32,38 48,40 68,36" className="india-state-line" />
              <path d="M24,49 C38,48 55,47 75,55" className="india-state-line" />
              <path d="M27,55 C38,60 50,60 62,56" className="india-state-line" />
              <path d="M33,67 C42,70 51,70 54,68" className="india-state-line" />
              <path d="M36,74 C42,78 48,78 51,75" className="india-state-line" />

              {/* Regional Label Watermarks */}
              <text x="35" y="19" className="region-label-text">NORTHERN WHEAT BELT</text>
              <text x="50" y="44" className="region-label-text">GANGETIC BASIN</text>
              <text x="30" y="60" className="region-label-text">DECCAN COTTON</text>
              <text x="38" y="86" className="region-label-text">SOUTHERN DELTA</text>

              {/* CONTAINMENT BUFFER CIRCLES */}
              {showContainmentZones &&
                districts
                  .filter((d) => d.riskLevel === 'Critical' || d.riskLevel === 'High')
                  .map((d) => (
                    <circle
                      key={`buffer-${d.id}`}
                      cx={d.coords.x}
                      cy={d.coords.y}
                      r={d.riskLevel === 'Critical' ? '12' : '8'}
                      fill={d.riskLevel === 'Critical' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(249, 115, 22, 0.14)'}
                      stroke={d.riskLevel === 'Critical' ? '#ef4444' : '#f97316'}
                      strokeWidth="0.8"
                      strokeDasharray="2 1"
                      className="pulse-circle"
                    />
                  ))}
            </svg>

            {/* LAYER 1: DISEASE HOTSPOT PINS */}
            {showDiseaseLayer &&
              districts.map((district) => (
                <button
                  key={district.id}
                  type="button"
                  className={`geo-pin-hotspot ${getRiskClass(district.riskLevel)} ${
                    selectedDistrict?.id === district.id ? 'geo-pin-active' : ''
                  }`}
                  style={{
                    left: `${district.coords.x}%`,
                    top: `${district.coords.y}%`,
                  }}
                  onClick={() => {
                    setSelectedDistrict(district);
                    setSelectedPinInfo(null);
                  }}
                  aria-label={`${district.district}, ${district.riskLevel} risk`}
                >
                  <div className="pin-core-beacon">
                    <span className="pin-pulse-ring"></span>
                    <MapPin size={13} />
                  </div>
                  <div className="pin-badge-tag">
                    <span>{district.district}</span>
                    <span
                      className={`pin-score-sub ${
                        district.riskScore > 80
                          ? 'score-badge-red'
                          : district.riskScore > 50
                          ? 'score-badge-amber'
                          : 'score-badge-green'
                      }`}
                    >
                      {district.riskScore}
                    </span>
                  </div>
                </button>
              ))}

            {/* LAYER 2: PEST TRAP PINS */}
            {showPestTrapLayer && (
              <div
                className="map-telemetry-badge badge-trap"
                style={{ left: '42%', top: '24%' }}
                onClick={() =>
                  setSelectedPinInfo({
                    type: 'Pest Trap',
                    title: 'Solar Smart Trap Alpha (Ludhiana)',
                    details: 'Pink Bollworm & Fall Armyworm counts: 142/day (ETL Breached).',
                  })
                }
                title="Click to view Trap Telemetry"
              >
                <span>🪤</span>
                <span>Trap #1: 142/day</span>
              </div>
            )}

            {/* LAYER 3: SENSOR NODES */}
            {showSensorLayer && (
              <div
                className="map-telemetry-badge badge-sensor"
                style={{ left: '32%', top: '56%' }}
                onClick={() =>
                  setSelectedPinInfo({
                    type: 'IoT Node',
                    title: 'IoT Microclimate Station #3 (Nashik)',
                    details: 'Canopy RH: 88%, Leaf Wetness: 6.8h, Soil Moisture: 36%.',
                  })
                }
                title="Click to view Microclimate Sensor"
              >
                <span>📡</span>
                <span>Node #3: RH 88%</span>
              </div>
            )}

            {/* LAYER 4: KVK LAB NODES */}
            {showLabLayer && (
              <div
                className="map-telemetry-badge badge-lab"
                style={{ left: '56%', top: '69%' }}
                onClick={() =>
                  setSelectedPinInfo({
                    type: 'Diagnostic Lab',
                    title: 'ANGRAU Advanced Pathology Clinic (Guntur)',
                    details: 'Accredited PCR testing & bio-assay facility. Turnaround: 24h.',
                  })
                }
                title="Click to view KVK Diagnostic Lab"
              >
                <span>🔬</span>
                <span>KVK Guntur Lab</span>
              </div>
            )}

            {/* MAP LEGEND OVERLAY */}
            <div className="map-canvas-legend">
              <span className="legend-head">Severity:</span>
              <span className="legend-pill-item">
                <span className="leg-dot dot-critical"></span> Critical (&gt;85)
              </span>
              <span className="legend-pill-item">
                <span className="leg-dot dot-high"></span> High (70-85)
              </span>
              <span className="legend-pill-item">
                <span className="leg-dot dot-medium"></span> Medium (40-70)
              </span>
              <span className="legend-pill-item">
                <span className="leg-dot dot-low"></span> Safe (&lt;40)
              </span>
            </div>
          </div>
        </div>

        {/* 4. DISTRICT INTELLIGENCE CARD (RIGHT COLUMN) */}
        <div className="district-intelligence-card">
          {selectedPinInfo ? (
            <div>
              <div className="district-intel-header">
                <div className="intel-title-group">
                  <span className="state-tag">{selectedPinInfo.type}</span>
                  <h2>{selectedPinInfo.title}</h2>
                  <p className="intel-loc-sub">Live Telemetry Station</p>
                </div>
                <button
                  type="button"
                  className="btn-locate-pin"
                  onClick={() => setSelectedPinInfo(null)}
                >
                  Close
                </button>
              </div>

              <div className="epidemic-dial-box mt-16">
                <div className="dial-meta-info">
                  <h4>Sensor Stream Details</h4>
                  <p>{selectedPinInfo.details}</p>
                </div>
              </div>

              <div className="official-directive-box mt-16">
                <div className="directive-header">
                  <ShieldCheck size={16} />
                  <span>Telemetry Health</span>
                </div>
                <p className="directive-text">
                  Data synchronized via 4G / LoRaWAN gateway. Next automated packet in 4 mins.
                </p>
              </div>
            </div>
          ) : selectedDistrict ? (
            <div>
              {/* HEADER */}
              <div className="district-intel-header">
                <div className="intel-title-group">
                  <span className="state-tag">{selectedDistrict.state} State</span>
                  <h2>{selectedDistrict.district} District</h2>
                  <p className="intel-loc-sub">
                    Primary Cropping Belt: <strong>{selectedDistrict.primaryCrop}</strong>
                  </p>
                </div>

                <span className={`risk-severity-pill-badge ${getRiskPillClass(selectedDistrict.riskLevel)}`}>
                  {getRiskIcon(selectedDistrict.riskLevel)}
                  {selectedDistrict.riskLevel}
                </span>
              </div>

              {/* EPIDEMIC VULNERABILITY DIAL */}
              <div className="epidemic-dial-box">
                <div className="dial-score-num text-danger">
                  {selectedDistrict.riskScore}
                  <span className="dial-score-max">/100</span>
                </div>
                <div className="dial-meta-info">
                  <h4>Epidemic Vulnerability Index</h4>
                  <p>
                    {selectedDistrict.riskLevel === 'Critical'
                      ? 'Immediate containment & bio-pesticide buffer quarantine enforced.'
                      : selectedDistrict.riskLevel === 'High'
                      ? 'Preventative fungicide / bio-agent application recommended within 24h.'
                      : 'Maintain routine field surveillance and trap inspection.'}
                  </p>
                </div>
              </div>

              {/* METRIC TILES */}
              <div className="intel-metrics-grid">
                <div className="intel-tile">
                  <div className="intel-tile-icon icon-bg-green">
                    <Sprout size={16} />
                  </div>
                  <div>
                    <span className="intel-tile-lbl">Active Vector / Disease</span>
                    <strong className="intel-tile-val">{selectedDistrict.activeDisease || 'None Detected'}</strong>
                  </div>
                </div>

                <div className="intel-tile">
                  <div className="intel-tile-icon icon-bg-blue">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="intel-tile-lbl">Farms Under Watch</span>
                    <strong className="intel-tile-val">{selectedDistrict.affectedFarms?.toLocaleString()} Farms</strong>
                  </div>
                </div>
              </div>

              {/* OFFICIAL EXTENSION DIRECTIVE */}
              <div className="official-directive-box">
                <div className="directive-header">
                  <ShieldAlert size={16} />
                  <span>Mandatory Regional Action Directive:</span>
                </div>
                <p className="directive-text">{selectedDistrict.advisory}</p>
              </div>

              {/* EMERGENCY BROADCAST DISPATCH BUTTON */}
              <div className="mt-14">
                <button
                  type="button"
                  onClick={handleSendDistrictBroadcast}
                  className="btn-broadcast-alert"
                >
                  <Radio size={16} /> Broadcast Emergency SMS & IVR to {selectedDistrict.district}
                </button>

                {broadcastNotice && (
                  <div className="notice-banner banner-success mt-10">
                    {broadcastNotice}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-district-selected">
              <MapPin size={38} className="icon-muted" />
              <h3>No Regional Hotspot Selected</h3>
              <p>Click any district pin or sensor node on the map to display surveillance data.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. REGIONAL SURVEILLANCE TABLE CARD (BOTTOM BOX) */}
      <div className="surveillance-matrix-card">
        <div className="matrix-header-row">
          <div>
            <h3>
              <FileSpreadsheet size={19} className="icon-green" /> District Epidemiological Risk Matrix
            </h3>
            <p className="map-help-text">Comprehensive state-wise surveillance records & response action protocols</p>
          </div>
          <span className="badge-pill badge-green">
            {districts.length} Monitored Districts
          </span>
        </div>

        <div className="matrix-table-wrap">
          <table>
            <thead>
              <tr>
                <th>District & State</th>
                <th>Dominant Crop</th>
                <th>Active Disease / Pathogen</th>
                <th>Risk Score</th>
                <th>Severity Status</th>
                <th>Farms at Risk</th>
                <th>Action Directive</th>
                <th>Map Focus</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => (
                <tr
                  key={d.id}
                  className={selectedDistrict?.id === d.id ? 'row-selected' : ''}
                >
                  <td>
                    <strong>{d.district}</strong>
                    <div className="text-muted text-xs">{d.state}</div>
                  </td>
                  <td>{d.primaryCrop}</td>
                  <td>
                    <span className="text-danger font-semibold">{d.activeDisease || 'Optimal Health'}</span>
                  </td>
                  <td>
                    <strong className="text-base">{d.riskScore}</strong>/100
                  </td>
                  <td>
                    <span className={`risk-severity-pill-badge ${getRiskPillClass(d.riskLevel)}`}>
                      {d.riskLevel}
                    </span>
                  </td>
                  <td>{d.affectedFarms.toLocaleString()}</td>
                  <td style={{ maxWidth: '280px', fontSize: '12px' }}>{d.advisory}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-locate-pin"
                      onClick={() => {
                        setSelectedDistrict(d);
                        setSelectedPinInfo(null);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                    >
                      <ArrowUpRight size={13} /> Focus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}