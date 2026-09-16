import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Star,
  Activity,
  Layers,
} from 'lucide-react';
import { mockFieldRecoveryCases } from '../data/mockData';

export default function FieldMonitoringTracker({ onNewScanClick }) {
  const [selectedCaseId, setSelectedCaseId] = useState(mockFieldRecoveryCases[0].caseId);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [farmerRating, setFarmerRating] = useState(5);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const currentCase =
    mockFieldRecoveryCases.find((c) => c.caseId === selectedCaseId) ||
    mockFieldRecoveryCases[0];

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pos);
    }
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setNewFeedbackText('');
      alert('Thank you! Confirmed recovery data recorded into CropShield AI continuous learning engine.');
    }, 1200);
  };

  return (
    <div className="recovery-tracker-container">
      {/* HEADER */}
      <div className="tracker-header">
        <div className="tracker-title-group">
          <div className="tracker-badge-row">
            <span className="badge-pill badge-green">
              <Activity size={13} /> Continuous AI Learning Loop
            </span>
            <span className="badge-pill badge-purple">Post-Treatment Surveillance</span>
          </div>
          <h2 className="tracker-title">Field Post-Treatment Recovery & AI Learning Tracker</h2>
          <p className="tracker-subtitle">
            Monitor crop recovery progression (Day 0 → Day 7 → Day 14), compare before/after foliage healing, and feed confirmed treatment outcomes to improve AI recommendations.
          </p>
        </div>

        {onNewScanClick && (
          <button type="button" onClick={onNewScanClick} className="btn-new-followup-scan">
            📷 Upload Day 7 / Day 14 Follow-up Scan
          </button>
        )}
      </div>

      {/* CASE SELECTOR TABS */}
      <div className="cases-selector-tabs">
        {mockFieldRecoveryCases.map((item) => (
          <button
            key={item.caseId}
            type="button"
            onClick={() => setSelectedCaseId(item.caseId)}
            className={`case-tab-btn ${selectedCaseId === item.caseId ? 'case-tab-active' : ''}`}
          >
            <span className="case-tab-crop">{item.crop}</span>
            <strong className="case-tab-name">{item.farmerName} ({item.location})</strong>
            <span className="case-tab-disease">{item.diagnosedDisease}</span>
          </button>
        ))}
      </div>

      {/* MAIN CASE DETAILS & INTERACTIVE COMPARISON GRID */}
      <div className="recovery-details-grid">
        {/* LEFT COLUMN: BEFORE VS AFTER INTERACTIVE COMPARISON */}
        <div className="comparison-card">
          <div className="comparison-card-header">
            <h3 className="card-sec-title">
              <Layers size={18} /> Interactive Before vs After Foliage Slider
            </h3>
            <span className="status-efficacy-pill">{currentCase.status}</span>
          </div>

          {/* DRAGGABLE BEFORE/AFTER SLIDER */}
          <div
            className="interactive-slider-wrapper"
            onMouseMove={(e) => {
              if (e.buttons === 1) handleSliderMove(e);
            }}
            onClick={handleSliderMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full Background) */}
            <img
              src={currentCase.day14Image}
              alt="Day 14 Recovered Foliage"
              className="slider-image-after"
            />
            <div className="slider-label-after">Day 14 (Recovered: {currentCase.day14Severity}% Severity)</div>

            {/* Before Image (Clipped Left Side) */}
            <div
              className="slider-before-container"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentCase.day0Image}
                alt="Day 0 Infected Foliage"
                className="slider-image-before"
              />
              <div className="slider-label-before">Day 0 (Infected: {currentCase.day0Severity}% Severity)</div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="slider-handle-line"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="slider-handle-button">
                <span>◀ ▶</span>
              </div>
            </div>
          </div>
          <p className="slider-hint-text">
            👆 Drag the center slider left/right to compare Day 0 initial infection vs Day 14 treatment recovery.
          </p>

          {/* 14-DAY RECOVERY TIMELINE PROGRESS TRACK */}
          <div className="recovery-timeline-bar-box">
            <h4 className="timeline-title">
              <Clock size={16} /> 14-Day Treatment Progression Milestones:
            </h4>

            <div className="timeline-steps-row">
              <div className="timeline-step step-done">
                <div className="step-circle">Day 0</div>
                <strong className="step-label">Initial AI Scan</strong>
                <span className="step-stat">{currentCase.day0Severity}% Severity</span>
              </div>

              <div className="timeline-connector connector-done"></div>

              <div className="timeline-step step-done">
                <div className="step-circle">Day 3</div>
                <strong className="step-label">Treatment Applied</strong>
                <span className="step-stat">IPDM & Spray</span>
              </div>

              <div className="timeline-connector connector-done"></div>

              <div className="timeline-step step-done">
                <div className="step-circle">Day 7</div>
                <strong className="step-label">Mid-Term Check</strong>
                <span className="step-stat">{currentCase.day7Severity}% Severity</span>
              </div>

              <div className="timeline-connector connector-done"></div>

              <div className="timeline-step step-done">
                <div className="step-circle">Day 14</div>
                <strong className="step-label">Full Recovery</strong>
                <span className="step-stat">{currentCase.day14Severity}% Severity</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TREATMENT DETAILS & AI CONTINUOUS LEARNING FEEDBACK */}
        <div className="treatment-feedback-card">
          <h3 className="card-sec-title">
            <Sparkles size={18} /> Treatment Protocol & Continuous AI Learning
          </h3>

          <div className="case-meta-box">
            <div className="meta-row">
              <span className="m-lbl">Applied Treatment:</span>
              <strong className="m-val text-emerald">{currentCase.treatmentApplied}</strong>
            </div>
            <div className="meta-row">
              <span className="m-lbl">Infection Reduction:</span>
              <strong className="m-val text-purple">
                From {currentCase.day0Severity}% down to {currentCase.day14Severity}% (-{currentCase.day0Severity - currentCase.day14Severity}%)
              </strong>
            </div>
            <div className="meta-row">
              <span className="m-lbl">Verified Farmer Feedback:</span>
              <p className="m-quote">“{currentCase.farmerFeedback}”</p>
            </div>
          </div>

          {/* AI CONTINUOUS LEARNING TELEMETRY CALLOUT */}
          <div className="ai-learning-banner">
            <div className="ai-learn-header">
              <ShieldCheck size={18} className="icon-green" />
              <strong>AI Model Self-Tuning & Knowledge Graph Update:</strong>
            </div>
            <p className="ai-learn-desc">
              {currentCase.aiModelLearnedFeedback}
            </p>
            <span className="ai-learn-stat">
              Confidence weighted +4.8% for similar agro-climatic zones across {currentCase.location.split(',')[1]}.
            </span>
          </div>

          {/* FARMER OUTCOME FEEDBACK FORM */}
          <form onSubmit={handleSubmitFeedback} className="farmer-rating-form">
            <h4 className="rating-form-title">
              <MessageSquare size={16} /> Submit Your Field Treatment Efficacy Feedback:
            </h4>

            <div className="star-rating-row">
              <span className="star-lbl">Treatment Efficacy:</span>
              <div className="stars-group">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFarmerRating(star)}
                    className={`star-btn ${farmerRating >= star ? 'star-gold' : ''}`}
                    aria-label={`${star} Stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-score-txt">({farmerRating}/5 Stars)</span>
            </div>

            <textarea
              rows={3}
              value={newFeedbackText}
              onChange={(e) => setNewFeedbackText(e.target.value)}
              placeholder="Did the recommended IPDM / safe spray cure your crop? Record your observations to improve CropShield AI..."
              className="feedback-textarea"
            />

            <button
              type="submit"
              disabled={feedbackSubmitted}
              className="btn-submit-efficacy"
            >
              {feedbackSubmitted ? (
                <>
                  <CheckCircle2 size={16} /> Feedback Synced to AI Knowledge Graph!
                </>
              ) : (
                <>
                  <ThumbsUp size={16} /> Record Verified Outcome in AI Model
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
