import React, { useState } from 'react';
import {
  FlaskConical,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Droplets,
  HeartPulse,
  Bug,
  Fish,
  CheckCircle2,
  Square,
  CheckSquare,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { mockSafePesticidesRegistry } from '../data/mockData';

export default function SafePesticideGuide({ cropName, defaultPesticideId, initialAcreage, onClose }) {
  const [selectedPesticideId, setSelectedPesticideId] = useState(
    defaultPesticideId || mockSafePesticidesRegistry[0].id
  );
  const [acreage, setAcreage] = useState(initialAcreage ? parseFloat(initialAcreage) || 2.0 : 2.0);
  const [sprayerType, setSprayerType] = useState('16L Knapsack Manual Sprayer');
  const [ppeChecked, setPpeChecked] = useState({});

  const selectedChemical =
    mockSafePesticidesRegistry.find((p) => p.id === selectedPesticideId) ||
    mockSafePesticidesRegistry[0];

  // Sprayer tank capacities in Liters
  const tankCapacity = sprayerType.includes('16L')
    ? 16
    : sprayerType.includes('20L')
    ? 20
    : sprayerType.includes('500L')
    ? 500
    : 16;

  // Total water required = acreage * recommendedWaterLitersPerAcre
  const totalWaterRequiredLiters = Math.round(acreage * selectedChemical.recommendedWaterLitersPerAcre);

  // Total chemical required = acreage * dosePerAcreGramsOrMl
  const totalChemicalRequired = Math.round(acreage * selectedChemical.dosePerAcreGramsOrMl);

  // Number of tank loads
  const numberOfTankLoads = Math.ceil(totalWaterRequiredLiters / tankCapacity);

  // Chemical per tank load
  const chemicalPerTankLoad = numberOfTankLoads > 0 ? (totalChemicalRequired / numberOfTankLoads).toFixed(1) : 0;

  const togglePpe = (item) => {
    setPpeChecked((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div className="safe-pesticide-container">
      {/* HEADER */}
      <div className="pesticide-header">
        <div className="pesticide-header-title">
          <div className="pesticide-icon-box">
            <FlaskConical size={24} className="icon-green" />
          </div>
          <div>
            <div className="pesticide-badge-row">
              <span className="badge-pill badge-green">CIBRC Certified Safe Guide</span>
              <span className="badge-pill badge-blue">MRL & PHI Compliant</span>
            </div>
            <h2 className="pesticide-title">Safe Pesticide & Input Usage Calculator</h2>
            <p className="pesticide-subtitle">
              Scientific dosage dilution, sprayer tank calibration, Pre-Harvest Interval (PHI) tracking, and pollinator safety guidelines.
            </p>
          </div>
        </div>

        {onClose && (
          <button type="button" onClick={onClose} className="pesticide-close-btn">
            ✕
          </button>
        )}
      </div>

      {/* CHEMICAL SELECTOR & DOSAGE CALCULATION GRID */}
      <div className="pesticide-calc-grid">
        {/* LEFT COLUMN: SELECT CHEMICAL & FARM PARAMETERS */}
        <div className="calc-inputs-card">
          <h3 className="card-sec-title">
            <Calculator size={18} /> 1. Farm & Chemical Parameters
          </h3>

          <div className="form-group-field">
            <label>Select Approved Chemical Formulation:</label>
            <select
              value={selectedPesticideId}
              onChange={(e) => setSelectedPesticideId(e.target.value)}
              className="pesticide-select-input"
            >
              {mockSafePesticidesRegistry.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tradeName} ({item.activeIngredient})
                </option>
              ))}
            </select>
            <span className="cibrc-num-text">CIBRC Reg: {selectedChemical.cibrcRegNumber}</span>
          </div>

          <div className="form-row-2">
            <div className="form-group-field">
              <label>Farm Acreage (Acres):</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0.25"
                  max="100"
                  step="0.25"
                  value={acreage}
                  onChange={(e) => setAcreage(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="pesticide-num-input"
                />
                <span className="unit-label">Acres</span>
              </div>
            </div>

            <div className="form-group-field">
              <label>Sprayer Equipment Type:</label>
              <select
                value={sprayerType}
                onChange={(e) => setSprayerType(e.target.value)}
                className="pesticide-select-input"
              >
                <option value="16L Knapsack Manual Sprayer">16L Knapsack Sprayer (Manual)</option>
                <option value="20L Battery Sprayer">20L Battery Powered Sprayer</option>
                <option value="500L Tractor Boom Sprayer">500L Tractor Boom Sprayer</option>
              </select>
            </div>
          </div>

          {/* CALCULATED RESULTS CALLOUT */}
          <div className="dosage-results-banner">
            <h4 className="results-banner-title">
              <Sparkles size={16} /> Precision Application Prescription for {acreage} Acres:
            </h4>

            <div className="dosage-metric-cards-row">
              <div className="dosage-stat-box">
                <span className="stat-box-lbl">Total Chemical Required</span>
                <strong className="stat-box-val text-emerald">
                  {totalChemicalRequired} {selectedChemical.unit}
                </strong>
                <span className="stat-box-sub">({selectedChemical.dosePerAcreGramsOrMl} {selectedChemical.unit}/acre)</span>
              </div>

              <div className="dosage-stat-box">
                <span className="stat-box-lbl">Total Spray Water</span>
                <strong className="stat-box-val text-sky">
                  {totalWaterRequiredLiters} Liters
                </strong>
                <span className="stat-box-sub">Dilution: {selectedChemical.dilutionRatePerLiter}</span>
              </div>

              <div className="dosage-stat-box">
                <span className="stat-box-lbl">Tank Fills Required</span>
                <strong className="stat-box-val text-purple">
                  {numberOfTankLoads} Tanks ({tankCapacity}L each)
                </strong>
                <span className="stat-box-sub">
                  Mix {chemicalPerTankLoad} {selectedChemical.unit} per tank
                </span>
              </div>
            </div>
          </div>

          {/* RAIN FASTNESS & SPRAY WINDOW */}
          <div className="spray-timing-notice">
            <div className="notice-row">
              <Clock size={16} className="icon-amber" />
              <div>
                <strong>Optimal Spraying Window:</strong> {selectedChemical.optimalSprayingWindow}
              </div>
            </div>
            <div className="notice-row">
              <Droplets size={16} className="icon-sky" />
              <div>
                <strong>Rain-Fastness:</strong> Requires {selectedChemical.rainFastnessHours} hours dry period after spraying for maximum absorption.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SAFETY, PHI COUNTDOWN, MRL, PPE */}
        <div className="calc-safety-card">
          <h3 className="card-sec-title">
            <ShieldCheck size={18} /> 2. Safety, PHI & Eco-Toxicity Profiling
          </h3>

          {/* PRE-HARVEST INTERVAL (PHI) CALLOUT */}
          <div className="phi-card-highlight">
            <div className="phi-header">
              <div className="phi-title-group">
                <span className="phi-label">Pre-Harvest Interval (PHI)</span>
                <h4 className="phi-value">{selectedChemical.preHarvestIntervalDays} Days Withholding</h4>
              </div>
              <span className={`hazard-badge ${selectedChemical.hazardBand.includes('Green') ? 'badge-green' : selectedChemical.hazardBand.includes('Blue') ? 'badge-blue' : 'badge-amber'}`}>
                {selectedChemical.hazardBand}
              </span>
            </div>
            <p className="phi-explanation">
              ⚠️ <strong>Mandatory Rule:</strong> Do NOT harvest crops for minimum {selectedChemical.preHarvestIntervalDays} days after spraying to ensure chemical degradation below Codex MRL ({selectedChemical.maxResidueLimitPpm}).
            </p>
          </div>

          {/* ECO-TOXICITY BADGES */}
          <div className="eco-toxicity-box">
            <h4 className="eco-title">Ecological & Environmental Hazard Profile</h4>
            <div className="eco-items-list">
              <div className="eco-item">
                <span className="eco-icon">🐝</span>
                <div className="eco-info">
                  <strong>Honeybee & Pollinator Safety:</strong>
                  <p>{selectedChemical.beeSafety}</p>
                </div>
              </div>

              <div className="eco-item">
                <span className="eco-icon">🐟</span>
                <div className="eco-info">
                  <strong>Aquatic Life & Water Buffer:</strong>
                  <p>{selectedChemical.aquaticToxicity}</p>
                </div>
              </div>

              <div className="eco-item">
                <span className="eco-icon">🐄</span>
                <div className="eco-info">
                  <strong>Livestock Grazing Withholding:</strong>
                  <p>{selectedChemical.livestockWithholdingDays} Days before allowing animals in sprayed field</p>
                </div>
              </div>
            </div>
          </div>

          {/* PPE MANDATORY CHECKLIST */}
          <div className="ppe-checklist-box">
            <h4 className="ppe-title">
              <HeartPulse size={16} className="icon-green" /> Mandatory Personal Protective Equipment (PPE) Checklist:
            </h4>
            <div className="ppe-grid">
              {selectedChemical.ppeRequired.map((ppeItem) => {
                const isChecked = !!ppeChecked[ppeItem];
                return (
                  <div
                    key={ppeItem}
                    className={`ppe-check-item ${isChecked ? 'ppe-item-active' : ''}`}
                    onClick={() => togglePpe(ppeItem)}
                  >
                    <button type="button" className="ppe-checkbox-btn" aria-label="Toggle PPE">
                      {isChecked ? <CheckSquare size={16} className="icon-green" /> : <Square size={16} />}
                    </button>
                    <span>{ppeItem}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TANK MIX COMPATIBILITY */}
          <div className="tank-mix-box">
            <span className="tank-mix-lbl">Tank-Mix Compatibility:</span>
            <p className="tank-mix-text">{selectedChemical.tankMixCompatibility}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
