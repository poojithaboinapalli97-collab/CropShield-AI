import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  Package,
  Send,
  Sparkles,
  QrCode,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { mockKvkAndLabs } from '../data/mockData';

export default function LabReferralModal({
  isOpen,
  onClose,
  cropName = 'Tomato',
  diseaseName = 'Tomato Early Blight',
  farmerName = 'Gurpreet Singh',
  village = 'Pimplgaon',
  district = 'Nashik',
  state = 'Maharashtra',
}) {
  const [selectedLabId, setSelectedLabId] = useState(mockKvkAndLabs[0].labId);
  const [sampleType, setSampleType] = useState('Fresh Foliage (Leaf Blades)');
  const [urgencyLevel, setUrgencyLevel] = useState('High (Outbreak Risk)');
  const [farmerNotes, setFarmerNotes] = useState('Symptoms spreading rapidly across bottom 30% of canopy despite preliminary bio-spray.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);

  if (!isOpen) return null;

  const selectedLab =
    mockKvkAndLabs.find((lab) => lab.labId === selectedLabId) || mockKvkAndLabs[0];

  const handleGenerateTicket = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const ticketNumber = `KVK-LAB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedTicket({
        ticketId: ticketNumber,
        generatedAt: new Date().toLocaleString(),
        crop: cropName,
        disease: diseaseName,
        farmer: farmerName,
        location: `${village}, ${district}, ${state}`,
        assignedLab: selectedLab.name,
        contactPerson: selectedLab.contactPerson,
        phone: selectedLab.phone,
        turnaroundTime: selectedLab.turnaroundTime,
        status: 'Sample Dispatch Pending',
      });
    }, 600);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="lab-referral-modal" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header-row">
          <div className="modal-title-group">
            <div className="modal-badge-row">
              <span className="badge-pill badge-purple">
                <Building2 size={13} /> KVK & ICAR Extension Network
              </span>
              <span className="badge-pill badge-green">Accredited Diagnostic Clinics</span>
            </div>
            <h2 className="modal-title">Refer Case to Extension Agronomist or Lab</h2>
            <p className="modal-subtitle">
              Escalate ambiguous, severe, or pesticide-resistant crop cases for official laboratory pathology and PCR confirmation.
            </p>
          </div>
          <button type="button" onClick={onClose} className="modal-close-icon-btn">
            <X size={20} />
          </button>
        </div>

        {!generatedTicket ? (
          <form onSubmit={handleGenerateTicket} className="lab-modal-body">
            {/* 1. NEAREST KVK / LAB SELECTOR */}
            <div className="lab-select-section">
              <label className="section-label">
                <MapPin size={16} className="icon-green" /> 1. Select Nearest Accredited Plant Pathology Clinic / KVK:
              </label>
              <div className="lab-cards-selector-grid">
                {mockKvkAndLabs.map((lab) => {
                  const isSelected = lab.labId === selectedLabId;
                  return (
                    <div
                      key={lab.labId}
                      className={`lab-choice-card ${isSelected ? 'lab-choice-selected' : ''}`}
                      onClick={() => setSelectedLabId(lab.labId)}
                    >
                      <div className="lab-choice-top">
                        <h4 className="lab-choice-name">{lab.name}</h4>
                        <span className="lab-distance-badge">{lab.distanceKm} km away</span>
                      </div>
                      <p className="lab-inst-text">{lab.institution}</p>
                      <div className="lab-meta-row">
                        <span>👤 {lab.contactPerson}</span>
                        <span>⏱️ Turnaround: {lab.turnaroundTime}</span>
                      </div>
                      <div className="lab-caps-tags">
                        {lab.testingCapabilities.slice(0, 2).map((cap, i) => (
                          <span key={i} className="cap-tag">{cap}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CASE PARTICULARS & SAMPLE DETAILS */}
            <div className="form-row-2">
              <div className="form-group-field">
                <label>Physical Sample Tissue Type:</label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="pesticide-select-input"
                >
                  <option value="Fresh Foliage (Leaf Blades)">Fresh Foliage (Leaf Blades)</option>
                  <option value="Stem / Nodal Section">Stem / Nodal Section</option>
                  <option value="Panicle / Earhead Sample">Panicle / Earhead Sample</option>
                  <option value="Root / Rhizosphere Soil Core">Root / Rhizosphere Soil Core</option>
                  <option value="Insect Pest Specimen in Ethanol">Insect Pest Specimen in Ethanol</option>
                </select>
              </div>

              <div className="form-group-field">
                <label>Diagnostic Triage Urgency:</label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value)}
                  className="pesticide-select-input"
                >
                  <option value="High (Outbreak Risk)">🔴 High (Active Outbreak Threat)</option>
                  <option value="Moderate (Unidentified Spot)">🟡 Moderate (Unidentified Lesions)</option>
                  <option value="Low (Routine Screening)">🟢 Low (Routine Surveillance)</option>
                </select>
              </div>
            </div>

            <div className="form-group-field">
              <label>Farmer Field Observations & Symptoms Notice:</label>
              <textarea
                rows={3}
                value={farmerNotes}
                onChange={(e) => setFarmerNotes(e.target.value)}
                placeholder="Describe leaf symptoms, recent weather, and any previous chemical sprays..."
                className="pesticide-textarea"
              />
            </div>

            {/* 3. SOP PHYSICAL PACKAGING GUIDELINES */}
            <div className="sop-packaging-guide">
              <h4 className="sop-title">
                <Package size={16} className="icon-purple" /> Standard Operating Procedure (SOP) for Sample Packaging:
              </h4>
              <div className="sop-steps-grid">
                <div className="sop-step">
                  <span className="sop-num">1</span>
                  <p>Pick 4-6 leaves showing active margin between green tissue and disease lesions.</p>
                </div>
                <div className="sop-step">
                  <span className="sop-num">2</span>
                  <p>Do NOT wash or add water. Blot surface dew using clean tissue paper.</p>
                </div>
                <div className="sop-step">
                  <span className="sop-num">3</span>
                  <p>Enclose in paper envelope, then seal inside sterile zip-lock bag.</p>
                </div>
                <div className="sop-step">
                  <span className="sop-num">4</span>
                  <p>Attach printed/handwritten digital ticket number onto the pouch exterior.</p>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="modal-actions-bar">
              <button type="button" onClick={onClose} className="btn-cancel-modal">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-submit-ticket">
                {isSubmitting ? (
                  <>
                    <Clock size={16} className="spinner" /> Generating Official KVK Dispatch Ticket...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Generate Official Lab Diagnostic Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* TICKET GENERATED SUCCESS VIEW */
          <div className="ticket-success-view">
            <div className="ticket-card-printable">
              <div className="ticket-card-header">
                <div>
                  <span className="ticket-sub-brand">ICAR / KVK PLANT HEALTH CLINIC NETWORK</span>
                  <h3 className="ticket-main-id">{generatedTicket.ticketId}</h3>
                </div>
                <div className="qr-box-mock">
                  <QrCode size={48} />
                  <span className="qr-txt">Scan at Lab</span>
                </div>
              </div>

              <div className="ticket-details-grid">
                <div className="ticket-field">
                  <span className="t-label">Farmer Name:</span>
                  <strong className="t-val">{generatedTicket.farmer}</strong>
                </div>
                <div className="ticket-field">
                  <span className="t-label">Location:</span>
                  <strong className="t-val">{generatedTicket.location}</strong>
                </div>
                <div className="ticket-field">
                  <span className="t-label">Crop & AI Suspect:</span>
                  <strong className="t-val">{generatedTicket.crop} — {generatedTicket.disease}</strong>
                </div>
                <div className="ticket-field">
                  <span className="t-label">Assigned Laboratory:</span>
                  <strong className="t-val">{generatedTicket.assignedLab}</strong>
                </div>
                <div className="ticket-field">
                  <span className="t-label">Extension Officer:</span>
                  <strong className="t-val">{generatedTicket.contactPerson} ({generatedTicket.phone})</strong>
                </div>
                <div className="ticket-field">
                  <span className="t-label">Expected Report:</span>
                  <strong className="t-val text-emerald">Within {generatedTicket.turnaroundTime}</strong>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="ticket-status-timeline">
                <div className="timeline-milestone milestone-active">
                  <span className="milestone-dot"></span>
                  <span className="milestone-label">Ticket Issued</span>
                </div>
                <div className="timeline-milestone milestone-next">
                  <span className="milestone-dot"></span>
                  <span className="milestone-label">Sample Dispatch</span>
                </div>
                <div className="timeline-milestone">
                  <span className="milestone-dot"></span>
                  <span className="milestone-label">Lab Intake</span>
                </div>
                <div className="timeline-milestone">
                  <span className="milestone-dot"></span>
                  <span className="milestone-label">PCR / Culture</span>
                </div>
                <div className="timeline-milestone">
                  <span className="milestone-dot"></span>
                  <span className="milestone-label">Verified Advisory</span>
                </div>
              </div>
            </div>

            <div className="ticket-success-actions">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-print-ticket"
              >
                🖨️ Print Dispatch Label
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-done-ticket"
              >
                Done / Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
