import React, { useState, useEffect } from 'react';
import { fetchRiskMapData } from '../services/api';
import {
  MapPin,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Building,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function RiskMap() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [cropFilter, setCropFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    fetchRiskMapData(cropFilter, riskFilter).then((res) => {
      if (res.success) {
        setDistricts(res.data);
        if (res.data.length > 0 && !selectedDistrict) {
          setSelectedDistrict(res.data[0]);
        }
      }
    });
  }, [cropFilter, riskFilter]);

  return (
    <div className="riskmap-page">
      <div className="page-header">
        <div>
          <span className="sih-badge-inline">SIH26131 SPATIAL INTEL</span>
          <h1 className="page-title">Regional Outbreak & Disease Risk Map</h1>
          <p className="page-subtitle">
            Real-time geospatial hotspot monitoring across Indian agricultural belts to trigger targeted containment.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-card">
        <div className="filter-group">
          <Filter size={16} className="icon-green" />
          <span className="filter-title">Filter Hotspots:</span>
        </div>

        <div className="filter-controls">
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Crops</option>
            <option value="wheat">Wheat</option>
            <option value="rice">Rice / Paddy</option>
            <option value="tomato">Tomato</option>
            <option value="cotton">Cotton</option>
            <option value="potato">Potato</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* MAP + DETAILS GRID */}
      <div className="riskmap-grid">
        {/* INTERACTIVE GEOSPATIAL MAP CANVAS */}
        <div className="map-view-card">
          <div className="map-card-header">
            <h3>
              <MapPin size={18} className="icon-green" /> Interactive Hotspot Pinboard
            </h3>
            <span className="badge-pill badge-green">{districts.length} Active Regions</span>
          </div>

          <div className="map-canvas-container">
            {/* Visual India Map Representation */}
            <div className="map-background">
              <svg viewBox="0 0 100 100" className="india-svg-outline">
                <path
                  d="M 30,10 L 45,8 L 60,15 L 75,25 L 85,35 L 70,50 L 55,75 L 45,90 L 35,70 L 25,50 L 20,30 Z"
                  fill="rgba(34, 197, 94, 0.05)"
                  stroke="rgba(34, 197, 94, 0.25)"
                  strokeWidth="0.8"
                />
              </svg>

              {districts.map((d) => (
                <button
                  key={d.id}
                  className={`map-pin-btn ${selectedDistrict?.id === d.id ? 'pin-active' : ''} ${
                    d.riskLevel === 'Critical'
                      ? 'pin-critical'
                      : d.riskLevel === 'High'
                      ? 'pin-high'
                      : d.riskLevel === 'Medium'
                      ? 'pin-medium'
                      : 'pin-low'
                  }`}
                  style={{ left: `${d.coords.x}%`, top: `${d.coords.y}%` }}
                  onClick={() => setSelectedDistrict(d)}
                >
                  <span className="pin-pulse"></span>
                  <span className="pin-title">{d.district}</span>
                </button>
              ))}
            </div>

            <div className="map-legend">
              <span className="legend-item"><span className="dot dot-critical"></span> Critical</span>
              <span className="legend-item"><span className="dot dot-high"></span> High</span>
              <span className="legend-item"><span className="dot dot-medium"></span> Medium</span>
              <span className="legend-item"><span className="dot dot-low"></span> Low</span>
            </div>
          </div>
        </div>

        {/* SELECTED DISTRICT DETAILS DRAWER */}
        <div className="district-detail-card">
          {selectedDistrict ? (
            <div>
              <div className="detail-header">
                <div>
                  <span className="state-tag">{selectedDistrict.state}</span>
                  <h2>{selectedDistrict.district} District</h2>
                </div>
                <span
                  className={`status-pill ${
                    selectedDistrict.riskLevel === 'Critical'
                      ? 'pill-red'
                      : selectedDistrict.riskLevel === 'High'
                      ? 'pill-red'
                      : selectedDistrict.riskLevel === 'Medium'
                      ? 'pill-amber'
                      : 'pill-green'
                  }`}
                >
                  {selectedDistrict.riskLevel} Risk
                </span>
              </div>

              <div className="risk-score-display">
                <div className="score-number-box">
                  <span className="score-num">{selectedDistrict.riskScore}</span>
                  <span className="score-max">/100</span>
                </div>
                <div className="score-meta">
                  <h4>Disease Threat Index</h4>
                  <p>Primary Outbreak: <strong>{selectedDistrict.activeDisease}</strong></p>
                </div>
              </div>

              <div className="district-stats-row">
                <div className="d-stat-box">
                  <Building size={16} className="icon-green" />
                  <div>
                    <span className="d-lbl">Primary Crop</span>
                    <span className="d-val">{selectedDistrict.primaryCrop}</span>
                  </div>
                </div>

                <div className="d-stat-box">
                  <Users size={16} className="icon-amber" />
                  <div>
                    <span className="d-lbl">Farms at Risk</span>
                    <span className="d-val">{selectedDistrict.affectedFarms.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="advisory-callout">
                <h4>
                  <ShieldAlert size={16} className="icon-red" /> Official Advisory Notice
                </h4>
                <p>{selectedDistrict.advisory}</p>
              </div>

              <div className="district-action-footer">
                <a href="#broadcast" className="primary-btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                  Issue Emergency SMS Advisory to Farmers in {selectedDistrict.district}
                </a>
              </div>
            </div>
          ) : (
            <div className="empty-selection">Select a district pin from the map to view outbreak details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
