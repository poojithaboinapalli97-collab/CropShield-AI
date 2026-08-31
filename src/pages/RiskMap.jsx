import React, { useState, useEffect } from 'react';
import { fetchRiskMapData } from '../services/api';
import {
  MapPin,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sprout,
  Users,
  Info,
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

        if (res.data.length > 0) {
          setSelectedDistrict((current) => {
            const stillExists = res.data.find(
              (item) => item.id === current?.id
            );
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
      case 'High':
        return 'pill-red';
      case 'Medium':
        return 'pill-amber';
      default:
        return 'pill-green';
    }
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === 'Low') {
      return <CheckCircle2 size={18} />;
    }

    return <AlertTriangle size={18} />;
  };

  return (
    <div className="riskmap-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <span className="sih-badge-inline">
            SIH26131 • CROP HEALTH MAP
          </span>

          <h1 className="page-title">
            🗺️ Crop Disease Risk Map
          </h1>

          <p className="page-subtitle">
            See which farming areas have higher disease risk and get
            simple guidance to protect your crops.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-card">

        <div className="filter-group">
          <Filter size={18} className="icon-green" />

          <div>
            <span className="filter-title">
              Find Risk in Your Area
            </span>

            <small className="filter-help-text">
              Choose your crop and risk level
            </small>
          </div>
        </div>

        <div className="filter-controls">

          <div className="filter-control-group">
            <label>Crop</label>

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
          </div>

          <div className="filter-control-group">
            <label>Risk Level</label>

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
      </div>

      {/* MAIN MAP + DETAILS */}
      <div className="riskmap-grid">

        {/* MAP */}
        <div className="map-view-card">

          <div className="map-card-header">

            <div>
              <h3>
                <MapPin size={19} className="icon-green" />
                Disease Risk Areas
              </h3>

              <p className="map-help-text">
                Tap a location to see its disease risk
              </p>
            </div>

            <span className="badge-pill badge-green">
              {districts.length} Areas
            </span>

          </div>

          <div className="map-canvas-container">

            <div className="map-background">

              {/* SIMPLE INDIA MAP SHAPE */}
              <svg
                viewBox="0 0 100 100"
                className="india-svg-outline"
                aria-hidden="true"
              >
                <path
                  d="M30,10 L45,8 L60,15 L75,25 L85,35 L70,50 L55,75 L45,90 L35,70 L25,50 L20,30 Z"
                  fill="rgba(34, 197, 94, 0.05)"
                  stroke="rgba(34, 197, 94, 0.25)"
                  strokeWidth="0.8"
                />
              </svg>

              {districts.map((district) => (

                <button
                  key={district.id}
                  type="button"
                  className={`map-pin-btn ${getRiskClass(
                    district.riskLevel
                  )} ${
                    selectedDistrict?.id === district.id
                      ? 'pin-active'
                      : ''
                  }`}
                  style={{
                    left: `${district.coords.x}%`,
                    top: `${district.coords.y}%`,
                  }}
                  onClick={() => setSelectedDistrict(district)}
                  aria-label={`${district.district}, ${district.riskLevel} risk`}
                >
                  <span className="pin-pulse"></span>

                  <span className="pin-title">
                    {district.district}
                  </span>

                </button>

              ))}

              {districts.length === 0 && (
                <div className="map-empty-message">
                  <MapPin size={30} />
                  <strong>No areas found</strong>
                  <span>
                    Try changing the crop or risk filter.
                  </span>
                </div>
              )}

            </div>

            {/* LEGEND */}
            <div className="map-legend">

              <span className="legend-title">
                Risk:
              </span>

              <span className="legend-item">
                <span className="dot dot-critical"></span>
                Critical
              </span>

              <span className="legend-item">
                <span className="dot dot-high"></span>
                High
              </span>

              <span className="legend-item">
                <span className="dot dot-medium"></span>
                Medium
              </span>

              <span className="legend-item">
                <span className="dot dot-low"></span>
                Low
              </span>

            </div>

          </div>
        </div>

        {/* SELECTED LOCATION */}
        <div className="district-detail-card">

          {selectedDistrict ? (

            <div className="risk-detail-content">

              {/* LOCATION HEADER */}
              <div className="detail-header">

                <div>
                  <span className="state-tag">
                    {selectedDistrict.state}
                  </span>

                  <h2>
                    {selectedDistrict.district}
                  </h2>

                  <p className="detail-location-text">
                    District farming area
                  </p>
                </div>

                <span
                  className={`status-pill ${getRiskPillClass(
                    selectedDistrict.riskLevel
                  )}`}
                >
                  {getRiskIcon(selectedDistrict.riskLevel)}
                  {selectedDistrict.riskLevel} Risk
                </span>

              </div>

              {/* SIMPLE RISK SCORE */}
              <div className="risk-score-display">

                <div className="score-number-box">

                  <span className="score-num">
                    {selectedDistrict.riskScore}
                  </span>

                  <span className="score-max">
                    /100
                  </span>

                </div>

                <div className="score-meta">

                  <h4>
                    Disease Risk
                  </h4>

                  <p>
                    Main disease:
                    <strong>
                      {' '}
                      {selectedDistrict.activeDisease}
                    </strong>
                  </p>

                </div>

              </div>

              {/* CROP + FARM INFORMATION */}
              <div className="district-stats-row">

                <div className="d-stat-box">

                  <Sprout
                    size={20}
                    className="icon-green"
                  />

                  <div>
                    <span className="d-lbl">
                      Main Crop
                    </span>

                    <span className="d-val">
                      {selectedDistrict.primaryCrop}
                    </span>
                  </div>

                </div>

                <div className="d-stat-box">

                  <Users
                    size={20}
                    className="icon-amber"
                  />

                  <div>
                    <span className="d-lbl">
                      Farms at Risk
                    </span>

                    <span className="d-val">
                      {selectedDistrict.affectedFarms.toLocaleString()}
                    </span>
                  </div>

                </div>

              </div>

              {/* FARMER ADVISORY */}
              <div className="advisory-callout">

                <h4>
                  <ShieldAlert
                    size={18}
                    className="icon-red"
                  />

                  What Farmers Should Do
                </h4>

                <p>
                  {selectedDistrict.advisory}
                </p>

              </div>

              {/* SIMPLE INFORMATION BOX */}
              <div className="farmer-info-box">

                <Info size={17} />

                <span>
                  This risk information helps farmers take
                  preventive action early. For treatment decisions,
                  follow advice from a qualified agricultural expert.
                </span>

              </div>

              {/* ACTION */}
              <div className="district-action-footer">

                <button
                  type="button"
                  className="primary-btn-sm"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    alert(
                      `Farmer alert prepared for ${selectedDistrict.district}.`
                    );
                  }}
                >
                  <ShieldAlert size={17} />

                  Alert Farmers in This Area
                </button>

              </div>

            </div>

          ) : (

            <div className="empty-selection">

              <MapPin size={35} className="icon-green" />

              <h3>
                Select a Location
              </h3>

              <p>
                Tap a location on the map to see
                the disease risk and farmer guidance.
              </p>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}