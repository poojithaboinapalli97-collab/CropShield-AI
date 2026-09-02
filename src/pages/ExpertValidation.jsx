import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Send,
  User,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  Bot,
  FileText,
  Filter,
  ChevronRight,
  Sprout,
  Award,
  AlertCircle,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';

import {
  fetchExpertQueue,
  submitExpertValidation,
} from '../services/api';

import '../styles/ExpertValidation.css';

export default function ExpertValidation() {
  const [queue, setQueue] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [agronomistNotes, setAgronomistNotes] = useState('');
  const [confirmedDisease, setConfirmedDisease] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queueFilter, setQueueFilter] = useState('all'); // 'all', 'pending', 'validated'
  const [certifiedCheck, setCertifiedCheck] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const res = await fetchExpertQueue();

      if (res && res.success && Array.isArray(res.data)) {
        setQueue(res.data);

        if (res.data.length > 0) {
          const firstScan = res.data[0];
          setSelectedScan(firstScan);
          setConfirmedDisease(firstScan.aiPrediction || '');
          setAgronomistNotes(firstScan.expertNotes || '');
        }
      }
    } catch (error) {
      console.error('Failed to load expert queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectScan = (scan) => {
    setSelectedScan(scan);
    setConfirmedDisease(scan.aiPrediction || '');
    setAgronomistNotes(scan.expertNotes || '');
    setSubmitStatus('');
  };

  const handleQuickAddNote = (text) => {
    setAgronomistNotes((prev) => (prev ? `${prev}\n• ${text}` : `• ${text}`));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedScan) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const res = await submitExpertValidation(
        selectedScan.scanId,
        {
          confirmedDisease: confirmedDisease,
          agronomistNotes: agronomistNotes,
          agronomistName: 'Dr. A. K. Sharma (KVK Lead Pathologist)',
          certified: certifiedCheck,
        }
      );

      if (res && res.success) {
        setSubmitStatus(
          'Verified advisory issued successfully! Farmer alerted via SMS & App.'
        );

        setQueue((previousQueue) => {
          return previousQueue.map((item) => {
            if (item.scanId === selectedScan.scanId) {
              return {
                ...item,
                status: 'Validated',
                expertNotes: agronomistNotes,
                confirmedDisease: confirmedDisease,
              };
            }
            return item;
          });
        });

        setSelectedScan((prev) => ({
          ...prev,
          status: 'Validated',
          expertNotes: agronomistNotes,
          confirmedDisease: confirmedDisease,
        }));
      } else {
        setSubmitStatus('Unable to submit validation.');
      }
    } catch (error) {
      console.error('Validation submission error:', error);
      setSubmitStatus('Something went wrong while submitting advisory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQueue = queue.filter((item) => {
    if (queueFilter === 'pending') return item.status !== 'Validated';
    if (queueFilter === 'validated') return item.status === 'Validated';
    return true;
  });

  const pendingCount = queue.filter((i) => i.status !== 'Validated').length;
  const validatedCount = queue.filter((i) => i.status === 'Validated').length;

  if (loading) {
    return (
      <div className="expert-page">
        <div className="expert-loading-box">
          <div className="expert-spinner"></div>
          <h3>Connecting to Expert Validation Network...</h3>
          <p>Loading pending farmer diagnostic scans and microclimate telemetry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expert-page">

      {/* 1. TOP HERO HEADER */}
      <header className="expert-header-card">
        <div className="expert-header-content">
          <div className="expert-badge-row">
            <span className="sih-pill-badge">
              <Sparkles size={13} /> SIH26131 • HUMAN-IN-THE-LOOP QUALITY ASSURANCE
            </span>
            <span className="kvk-station-badge">
              <Award size={13} /> KVK Accredited Ag-Station • ICAR Network
            </span>
          </div>

          <h1 className="expert-main-title">
            Agronomist Expert <span>Validation Portal</span>
          </h1>

          <p className="expert-subtitle">
            Bridge edge deep learning predictions with verified agricultural science.
            Examine high-resolution leaf symptomatology, certify diagnosis accuracy, and dispatch
            actionable IPDM advisories directly to farmers.
          </p>
        </div>

        {/* STATS BAR */}
        <div className="expert-stats-deck">
          <div className="expert-stat-card">
            <div className="stat-icon-wrap amber-tint">
              <Clock size={18} />
            </div>
            <div>
              <span className="stat-num">{pendingCount}</span>
              <span className="stat-lbl">Pending Review</span>
            </div>
          </div>

          <div className="expert-stat-card">
            <div className="stat-icon-wrap green-tint">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="stat-num">{validatedCount}</span>
              <span className="stat-lbl">Advisories Issued</span>
            </div>
          </div>

          <div className="expert-stat-card">
            <div className="stat-icon-wrap blue-tint">
              <Bot size={18} />
            </div>
            <div>
              <span className="stat-num">96.4%</span>
              <span className="stat-lbl">AI Agreement</span>
            </div>
          </div>

          <div className="expert-stat-card">
            <div className="stat-icon-wrap purple-tint">
              <ShieldCheck size={18} />
            </div>
            <div>
              <span className="stat-num">&lt; 15 min</span>
              <span className="stat-lbl">Advisory SLA</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HUMAN-IN-THE-LOOP WORKFLOW STEPPER */}
      <section className="hitl-workflow-strip">
        <div className="hitl-strip-title">
          <Layers size={16} className="hitl-title-icon" />
          <span>Human-in-the-Loop (HITL) Validation Pipeline:</span>
        </div>

        <div className="hitl-steps-flow">
          {/* Step 1 */}
          <div className="hitl-step-node step-completed">
            <div className="step-circle">
              <Bot size={16} />
            </div>
            <div className="step-meta">
              <span className="step-number">Stage 1</span>
              <strong className="step-title">AI Prediction</strong>
              <span className="step-desc">YOLOv8 Edge Inference</span>
            </div>
          </div>

          <div className="hitl-connector completed">
            <ChevronRight size={18} />
          </div>

          {/* Step 2 */}
          <div className={`hitl-step-node ${selectedScan ? 'step-active' : 'step-idle'}`}>
            <div className="step-circle">
              <UserCheck size={16} />
            </div>
            <div className="step-meta">
              <span className="step-number">Stage 2</span>
              <strong className="step-title">Agronomist Review</strong>
              <span className="step-desc">Symptom & Context Check</span>
            </div>
          </div>

          <div className={`hitl-connector ${selectedScan?.status === 'Validated' ? 'completed' : 'active'}`}>
            <ChevronRight size={18} />
          </div>

          {/* Step 3 */}
          <div className={`hitl-step-node ${selectedScan?.status === 'Validated' ? 'step-completed' : 'step-active'}`}>
            <div className="step-circle">
              <ShieldCheck size={16} />
            </div>
            <div className="step-meta">
              <span className="step-number">Stage 3</span>
              <strong className="step-title">Expert Verification</strong>
              <span className="step-desc">Clinical IPDM Sign-off</span>
            </div>
          </div>

          <div className={`hitl-connector ${selectedScan?.status === 'Validated' ? 'completed' : ''}`}>
            <ChevronRight size={18} />
          </div>

          {/* Step 4 */}
          <div className={`hitl-step-node ${selectedScan?.status === 'Validated' ? 'step-completed' : 'step-idle'}`}>
            <div className="step-circle">
              <Send size={16} />
            </div>
            <div className="step-meta">
              <span className="step-number">Stage 4</span>
              <strong className="step-title">Verified Advisory</strong>
              <span className="step-desc">Dispatched to Farmer</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN INTERACTIVE DASHBOARD GRID */}
      <div className="expert-dashboard-grid">

        {/* LEFT COLUMN: REVIEW QUEUE */}
        <aside className="expert-queue-column">
          <div className="queue-card-wrapper">
            <div className="queue-header-area">
              <div className="queue-title-row">
                <div className="queue-heading-group">
                  <Clock size={18} className="queue-icon-brand" />
                  <h2>Review Queue</h2>
                </div>
                <span className="queue-pill-count">{filteredQueue.length} Scans</span>
              </div>

              {/* Filter Tabs */}
              <div className="queue-tabs-bar">
                <button
                  type="button"
                  className={`queue-tab ${queueFilter === 'all' ? 'tab-active' : ''}`}
                  onClick={() => setQueueFilter('all')}
                >
                  All ({queue.length})
                </button>
                <button
                  type="button"
                  className={`queue-tab ${queueFilter === 'pending' ? 'tab-active' : ''}`}
                  onClick={() => setQueueFilter('pending')}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  type="button"
                  className={`queue-tab ${queueFilter === 'validated' ? 'tab-active' : ''}`}
                  onClick={() => setQueueFilter('validated')}
                >
                  Validated ({validatedCount})
                </button>
              </div>
            </div>

            {/* Queue Items List */}
            <div className="queue-scroll-container">
              {filteredQueue.length === 0 ? (
                <div className="queue-empty-state">
                  <CheckCircle2 size={36} className="empty-state-icon" />
                  <h4>No Scans in this Filter</h4>
                  <p>All matching farmer submissions have been processed.</p>
                </div>
              ) : (
                filteredQueue.map((item) => {
                  const isSelected = selectedScan && selectedScan.scanId === item.scanId;
                  const isValidated = item.status === 'Validated';

                  return (
                    <div
                      key={item.scanId}
                      role="button"
                      tabIndex={0}
                      className={`queue-scan-item ${isSelected ? 'selected-scan' : ''} ${isValidated ? 'validated-border' : ''}`}
                      onClick={() => handleSelectScan(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleSelectScan(item);
                      }}
                    >
                      <div className="scan-item-header">
                        <span className="scan-id-tag">#{item.scanId}</span>
                        <span className={`status-pill-badge ${isValidated ? 'badge-validated' : 'badge-pending'}`}>
                          {isValidated ? (
                            <>
                              <Check size={11} /> Validated
                            </>
                          ) : (
                            <>
                              <Clock size={11} /> Pending Review
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="scan-crop-prediction">
                        {item.crop} • <span>{item.aiPrediction}</span>
                      </h3>

                      <div className="scan-meta-details">
                        <span className="scan-meta-item">
                          <User size={13} />
                          {item.farmerName}
                        </span>
                        <span className="scan-meta-item">
                          <MapPin size={13} />
                          {item.location}
                        </span>
                      </div>

                      <div className="scan-item-footer">
                        <span className="scan-confidence-tag">
                          AI Confidence: <strong>{item.aiConfidence}%</strong>
                        </span>
                        <span className="scan-date-text">
                          <Calendar size={11} /> {item.dateSubmitted || 'Recent'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: WORKSPACE */}
        <main className="expert-workspace-column">
          {!selectedScan ? (
            <div className="empty-workspace-view">
              <ShieldCheck size={56} className="empty-workspace-icon" />
              <h3>Select a Farmer Scan from Queue</h3>
              <p>Choose an incoming scan from the left panel to inspect imagery, verify diagnosis, and issue advisory.</p>
            </div>
          ) : (
            <div className="workspace-main-card">

              {/* A. WORKSPACE HEADER WITH AI DIAGNOSIS BANNER */}
              <div className="workspace-case-header">
                <div className="case-title-block">
                  <div className="case-breadcrumbs">
                    <span className="case-chip">CASE #{selectedScan.scanId}</span>
                    <span className="case-crop-chip">{selectedScan.crop}</span>
                    <span className={`case-status-chip ${selectedScan.status === 'Validated' ? 'chip-green' : 'chip-amber'}`}>
                      {selectedScan.status}
                    </span>
                  </div>
                  <h2 className="case-heading">
                    {selectedScan.crop} Disease Diagnostic Verification
                  </h2>
                  <p className="case-submitter-line">
                    Submitted by <strong>{selectedScan.farmerName}</strong> from{' '}
                    <strong>{selectedScan.location}</strong> • <Calendar size={13} /> {selectedScan.dateSubmitted || 'Today'}
                  </p>
                </div>

                <div className="case-ai-diagnosis-badge">
                  <div className="ai-badge-header">
                    <Bot size={16} />
                    <span>AI EDGE DIAGNOSIS</span>
                  </div>
                  <strong className="ai-prediction-name">
                    {selectedScan.aiPrediction}
                  </strong>
                  <div className="ai-confidence-gauge">
                    <div className="gauge-track">
                      <div
                        className="gauge-fill"
                        style={{ width: `${selectedScan.aiConfidence}%` }}
                      ></div>
                    </div>
                    <span>{selectedScan.aiConfidence}% Model Confidence</span>
                  </div>
                </div>
              </div>

              {/* B. TWO-COLUMN SPLIT: EVIDENCE vs AGRONOMIST ACTIONS */}
              <div className="workspace-body-split">

                {/* LEFT EVIDENCE COLUMN */}
                <div className="evidence-subcolumn">

                  {/* Leaf Image Card */}
                  <div className="subcard evidence-image-card">
                    <div className="subcard-header">
                      <div className="subcard-title-group">
                        <Sprout size={16} className="icon-green" />
                        <h4>Farmer Crop Leaf Imagery</h4>
                      </div>
                      <span className="evidence-tag">High-Res Capture</span>
                    </div>

                    <div className="evidence-image-canvas">
                      <img
                        src={selectedScan.sampleImage}
                        alt="Crop Leaf Scan"
                        className="leaf-evidence-img"
                      />
                      <div className="image-overlay-badge">
                        <Bot size={13} />
                        <span>AI Detected: <strong>{selectedScan.aiPrediction}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Farmer Message & Field Observation Card */}
                  <div className="subcard farmer-note-card">
                    <div className="subcard-header">
                      <div className="subcard-title-group">
                        <MessageSquare size={16} className="icon-amber" />
                        <h4>Farmer Query & Symptoms</h4>
                      </div>
                      <span className="note-source-tag">Voice & Text Input</span>
                    </div>

                    <div className="farmer-speech-box">
                      <p className="farmer-note-text">
                        "{selectedScan.farmerNote || 'Farmer noted discoloration on foliage and requested urgent identification and treatment recommendation.'}"
                      </p>
                      <div className="farmer-attribution">
                        <User size={13} />
                        <span>{selectedScan.farmerName} • {selectedScan.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Microclimate Advisory Hint */}
                  <div className="subcard microclimate-hint-card">
                    <div className="hint-icon-box">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <h5>Regional Epidemiology Alert</h5>
                      <p>Elevated humidity (&gt;85% RH) reported in {selectedScan.location.split(',')[0]}. Spore dispersal risk is currently high for foliar blights.</p>
                    </div>
                  </div>

                </div>

                {/* RIGHT AGRONOMIST REVIEW & ADVISORY COLUMN */}
                <div className="actions-subcolumn">
                  <div className="subcard agronomist-form-card">
                    <div className="subcard-header form-card-header">
                      <div className="subcard-title-group">
                        <UserCheck size={18} className="icon-green" />
                        <h4>Certified Agronomist Review</h4>
                      </div>
                      <span className="expert-station-tag">Dr. A. K. Sharma</span>
                    </div>

                    <form onSubmit={handleSubmit} className="expert-form">

                      {/* Input 1: Confirmed Disease */}
                      <div className="expert-form-group">
                        <label className="form-field-label">
                          1. Confirmed Disease Diagnosis
                          <span className="required-star">*</span>
                        </label>
                        <select
                          value={confirmedDisease}
                          onChange={(e) => setConfirmedDisease(e.target.value)}
                          className="expert-form-select"
                        >
                          <option value="Yellow Rust">Wheat - Yellow / Stripe Rust (Puccinia striiformis)</option>
                          <option value="Leaf Curl Virus">Cotton - Leaf Curl Virus (CLCuV)</option>
                          <option value="Paddy Blast">Rice - Paddy Leaf Blast (Magnaporthe oryzae)</option>
                          <option value="Early Blight">Tomato - Early Blight (Alternaria solani)</option>
                          <option value="Bacterial Spot">Tomato - Bacterial Spot (Xanthomonas)</option>
                          <option value="Late Blight">Potato / Tomato - Late Blight (Phytophthora)</option>
                          <option value="Nutrient Deficiency">General - Micronutrient Chlorosis</option>
                          <option value="Healthy">Optimal Health - No Pathogen Detected</option>
                        </select>
                      </div>

                      {/* Quick Diagnosis Matcher */}
                      <div className="quick-tags-row">
                        <span className="quick-label">Quick Set:</span>
                        <button
                          type="button"
                          className="quick-chip-btn"
                          onClick={() => setConfirmedDisease(selectedScan.aiPrediction)}
                        >
                          <Check size={12} /> Confirm AI: {selectedScan.aiPrediction}
                        </button>
                        <button
                          type="button"
                          className="quick-chip-btn"
                          onClick={() => setConfirmedDisease('Nutrient Deficiency')}
                        >
                          Nutrient Deficiency
                        </button>
                        <button
                          type="button"
                          className="quick-chip-btn"
                          onClick={() => setConfirmedDisease('Healthy')}
                        >
                          Healthy Crop
                        </button>
                      </div>

                      {/* Input 2: Advisory Notes */}
                      <div className="expert-form-group">
                        <label className="form-field-label">
                          2. Agronomist Field Advisory & Treatment Plan
                          <span className="required-star">*</span>
                        </label>
                        <textarea
                          rows={6}
                          value={agronomistNotes}
                          onChange={(e) => setAgronomistNotes(e.target.value)}
                          className="expert-form-textarea"
                          placeholder="Specify verified chemical/biological treatments, active ingredients, dosage per acre, spray window, and preventive cultural actions..."
                        ></textarea>
                      </div>

                      {/* Quick Advisory Presets */}
                      <div className="quick-advisory-presets">
                        <span className="quick-label">Add Verified Protocol:</span>
                        <div className="preset-buttons-wrap">
                          <button
                            type="button"
                            className="preset-btn"
                            onClick={() => handleQuickAddNote('Spray Propiconazole 25% EC @ 1ml/L water during clear morning hours.')}
                          >
                            + Propiconazole 25% EC
                          </button>
                          <button
                            type="button"
                            className="preset-btn"
                            onClick={() => handleQuickAddNote('Apply Tricyclazole 75% WP @ 0.6g/L water at first sign of spindle lesions.')}
                          >
                            + Tricyclazole 75% WP
                          </button>
                          <button
                            type="button"
                            className="preset-btn"
                            onClick={() => handleQuickAddNote('Apply Neem Seed Kernel Extract (NSKE 5%) or Agniastra bio-fungicide.')}
                          >
                            + Organic NSKE 5%
                          </button>
                          <button
                            type="button"
                            className="preset-btn"
                            onClick={() => handleQuickAddNote('Avoid excess nitrogen fertigation and maintain furrow drainage.')}
                          >
                            + Nitrogen & Water Mgmt
                          </button>
                        </div>
                      </div>

                      {/* Input 3: Expert Verification Checkbox */}
                      <div className="expert-quality-seal-card">
                        <div className="seal-checkbox-wrap">
                          <input
                            type="checkbox"
                            id="expert-cert-check"
                            checked={certifiedCheck}
                            onChange={(e) => setCertifiedCheck(e.target.checked)}
                            className="seal-checkbox-input"
                          />
                        </div>
                        <label htmlFor="expert-cert-check" className="seal-label-content">
                          <div className="seal-title-row">
                            <ShieldCheck size={16} className="seal-icon" />
                            <strong>Certified Agronomist Quality Verification</strong>
                          </div>
                          <p className="seal-description">
                            I certify as an accredited agronomist that this diagnosis and treatment protocol
                            have been verified under Good Agricultural Practices (GAP) and national IPDM regulations.
                          </p>
                        </label>
                      </div>

                      {/* Submit Action Button */}
                      <div className="form-action-area">
                        <button
                          type="submit"
                          className={`validate-advisory-btn ${isSubmitting ? 'btn-submitting' : ''}`}
                          disabled={isSubmitting || !certifiedCheck}
                        >
                          <Send size={18} />
                          {isSubmitting ? 'Transmitting Verified Advisory...' : 'Validate & Send Advisory'}
                        </button>
                      </div>

                      {/* Success Feedback Alert */}
                      {submitStatus && (
                        <div className="advisory-success-alert">
                          <CheckCircle2 size={20} className="alert-icon-check" />
                          <div>
                            <strong>Verification Confirmed</strong>
                            <p>{submitStatus}</p>
                          </div>
                        </div>
                      )}

                    </form>
                  </div>
                </div>

              </div>

              {/* C. WORKSPACE FOOTER STATUS BAR */}
              <div className="workspace-audit-footer">
                <div className="audit-item">
                  <CheckCircle2 size={15} className="audit-icon-green" />
                  <span>AI Inference: YOLOv8-Cls Edge Engine</span>
                </div>
                <div className="audit-item">
                  <ShieldCheck size={15} className="audit-icon-green" />
                  <span>Human-in-the-Loop: KVK Verified</span>
                </div>
                <div className="audit-item">
                  <Send size={15} className="audit-icon-blue" />
                  <span>Dispatch Channel: Kisan SMS & App Push</span>
                </div>
              </div>

            </div>
          )}
        </main>

      </div>

    </div>
  );
}