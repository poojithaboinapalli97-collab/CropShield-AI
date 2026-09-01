import React, { useState } from 'react';
import {
  ShieldAlert,
  Sprout,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Bug,
  Flame,
  Scissors,
  CheckSquare,
  Square,
  ChevronRight,
  Info,
} from 'lucide-react';
import { mockIpdmProtocols } from '../data/mockData';

export default function IpdmRecommender({ cropName, diseaseName, onOpenPesticideCalc, onOpenLabModal }) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [activeTierTab, setActiveTierTab] = useState('all');

  // Look up protocol or fallback
  const lookupKey = Object.keys(mockIpdmProtocols).find(
    (k) =>
      k.toLowerCase().includes(cropName?.toLowerCase() || '') ||
      (diseaseName && k.toLowerCase().includes(diseaseName?.toLowerCase() || ''))
  ) || 'Tomato Early Blight';

  const protocol = mockIpdmProtocols[lookupKey] || mockIpdmProtocols['Tomato Early Blight'];

  const toggleStep = (stepId) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const totalStepsCount =
    (protocol.tier1_cultural?.length || 0) +
    (protocol.tier2_physical?.length || 0) +
    (protocol.tier3_biological?.length || 0) +
    (protocol.tier4_chemical?.length || 0);

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalStepsCount > 0 ? Math.round((completedCount / totalStepsCount) * 100) : 0;

  return (
    <div className="ipdm-container-card">
      <div className="ipdm-header">
        <div className="ipdm-badge-title-row">
          <span className="ipdm-badge">
            <Layers size={14} /> 4-Tier IPDM Protocol
          </span>
          <span className="ipdm-spread-velocity">
            ⚡ Spread Velocity: <strong>{protocol.spreadVelocity}</strong>
          </span>
        </div>

        <h3 className="ipdm-title">Integrated Pest & Disease Management (IPDM) Strategy</h3>
        <p className="ipdm-subtitle">
          Holistic agro-ecological management prioritizing cultural, physical, and bio-organic controls before judicious chemical application.
        </p>

        {/* Progress Tracker */}
        <div className="ipdm-progress-box">
          <div className="progress-info-row">
            <span className="progress-label">
              <CheckCircle2 size={14} className="icon-green" /> Farmer Action Implementation Progress:
            </span>
            <span className="progress-value">
              {completedCount} of {totalStepsCount} Steps Completed ({progressPercent}%)
            </span>
          </div>
          <div className="ipdm-progress-track">
            <div className="ipdm-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* TIER FILTER TABS */}
      <div className="ipdm-tier-nav">
        <button
          type="button"
          onClick={() => setActiveTierTab('all')}
          className={`tier-nav-btn ${activeTierTab === 'all' ? 'tier-nav-active' : ''}`}
        >
          All Tiers
        </button>
        <button
          type="button"
          onClick={() => setActiveTierTab('cultural')}
          className={`tier-nav-btn ${activeTierTab === 'cultural' ? 'tier-nav-active' : ''}`}
        >
          🌱 Tier 1: Cultural
        </button>
        <button
          type="button"
          onClick={() => setActiveTierTab('physical')}
          className={`tier-nav-btn ${activeTierTab === 'physical' ? 'tier-nav-active' : ''}`}
        >
          🪤 Tier 2: Physical/Trap
        </button>
        <button
          type="button"
          onClick={() => setActiveTierTab('biological')}
          className={`tier-nav-btn ${activeTierTab === 'biological' ? 'tier-nav-active' : ''}`}
        >
          🦠 Tier 3: Bio-Organic
        </button>
        <button
          type="button"
          onClick={() => setActiveTierTab('chemical')}
          className={`tier-nav-btn ${activeTierTab === 'chemical' ? 'tier-nav-active' : ''}`}
        >
          🧪 Tier 4: Chemical (Last Resort)
        </button>
      </div>

      {/* TIER CONTENT CARDS */}
      <div className="ipdm-tiers-stack">
        {/* TIER 1: CULTURAL */}
        {(activeTierTab === 'all' || activeTierTab === 'cultural') && (
          <div className="ipdm-tier-card tier-cultural">
            <div className="tier-card-header">
              <div className="tier-icon-title">
                <span className="tier-pill-badge pill-green">Tier 1</span>
                <h4>Cultural & Agronomic Practices (Preventative Base)</h4>
              </div>
              <span className="tier-timing">Apply Immediately</span>
            </div>
            <div className="tier-steps-list">
              {protocol.tier1_cultural?.map((step) => {
                const isChecked = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    className={`tier-step-item ${isChecked ? 'step-completed' : ''}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <button type="button" className="step-checkbox" aria-label="Toggle step">
                      {isChecked ? <CheckSquare size={18} className="icon-green" /> : <Square size={18} />}
                    </button>
                    <div className="step-content">
                      <div className="step-title-line">
                        <span className="step-emoji">{step.icon}</span>
                        <strong className="step-title">{step.title}</strong>
                      </div>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TIER 2: PHYSICAL & MECHANICAL */}
        {(activeTierTab === 'all' || activeTierTab === 'physical') && (
          <div className="ipdm-tier-card tier-physical">
            <div className="tier-card-header">
              <div className="tier-icon-title">
                <span className="tier-pill-badge pill-amber">Tier 2</span>
                <h4>Physical & Mechanical Barriers / Trapping</h4>
              </div>
              <span className="tier-timing">Field Grid Deployment</span>
            </div>
            <div className="tier-steps-list">
              {protocol.tier2_physical?.map((step) => {
                const isChecked = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    className={`tier-step-item ${isChecked ? 'step-completed' : ''}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <button type="button" className="step-checkbox" aria-label="Toggle step">
                      {isChecked ? <CheckSquare size={18} className="icon-green" /> : <Square size={18} />}
                    </button>
                    <div className="step-content">
                      <div className="step-title-line">
                        <span className="step-emoji">{step.icon}</span>
                        <strong className="step-title">{step.title}</strong>
                      </div>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TIER 3: BIOLOGICAL & ORGANIC */}
        {(activeTierTab === 'all' || activeTierTab === 'biological') && (
          <div className="ipdm-tier-card tier-biological">
            <div className="tier-card-header">
              <div className="tier-icon-title">
                <span className="tier-pill-badge pill-emerald">Tier 3</span>
                <h4>Biological Control & Botanical Formulations</h4>
              </div>
              <span className="tier-timing">Eco-Friendly & Safe for Pollinators</span>
            </div>
            <div className="tier-steps-list">
              {protocol.tier3_biological?.map((step) => {
                const isChecked = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    className={`tier-step-item ${isChecked ? 'step-completed' : ''}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <button type="button" className="step-checkbox" aria-label="Toggle step">
                      {isChecked ? <CheckSquare size={18} className="icon-green" /> : <Square size={18} />}
                    </button>
                    <div className="step-content">
                      <div className="step-title-line">
                        <span className="step-emoji">{step.icon}</span>
                        <strong className="step-title">{step.title}</strong>
                      </div>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TIER 4: JUDICIOUS CHEMICAL (LAST RESORT) */}
        {(activeTierTab === 'all' || activeTierTab === 'chemical') && (
          <div className="ipdm-tier-card tier-chemical">
            <div className="tier-card-header">
              <div className="tier-icon-title">
                <span className="tier-pill-badge pill-red">Tier 4</span>
                <h4>Judicious Chemical Intervention (Strict Last Resort)</h4>
              </div>
              <span className="tier-timing">Targeted Spray with FRAC/IRAC Rotation</span>
            </div>
            <div className="tier-steps-list">
              {protocol.tier4_chemical?.map((step) => {
                const isChecked = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    className={`tier-step-item ${isChecked ? 'step-completed' : ''}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <button type="button" className="step-checkbox" aria-label="Toggle step">
                      {isChecked ? <CheckSquare size={18} className="icon-green" /> : <Square size={18} />}
                    </button>
                    <div className="step-content">
                      <div className="step-title-line">
                        <span className="step-emoji">{step.icon}</span>
                        <strong className="step-title">{step.title}</strong>
                      </div>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Bar for Tier 4 */}
            <div className="tier-action-footer">
              {onOpenPesticideCalc && (
                <button
                  type="button"
                  onClick={onOpenPesticideCalc}
                  className="tier-btn-primary"
                >
                  <FlaskConical size={16} />
                  <span>Open Safe Pesticide & Water Dosage Calculator</span>
                </button>
              )}
              {onOpenLabModal && (
                <button
                  type="button"
                  onClick={onOpenLabModal}
                  className="tier-btn-secondary"
                >
                  <Info size={16} />
                  <span>Refer to KVK Lab if Uncontrolled</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
