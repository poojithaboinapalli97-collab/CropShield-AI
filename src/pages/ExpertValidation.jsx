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

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const res = await fetchExpertQueue();

      if (res && res.success) {
        setQueue(res.data || []);

        if (res.data && res.data.length > 0) {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedScan) {
      return;
    }

    try {
      const res = await submitExpertValidation(
        selectedScan.scanId,
        {
          confirmedDisease: confirmedDisease,
          agronomistNotes: agronomistNotes,
          agronomistName: 'Dr. A. K. Sharma',
        }
      );

      if (res && res.success) {
        setSubmitStatus(
          'Verified advisory issued successfully to the farmer.'
        );

        setQueue((previousQueue) => {
          return previousQueue.map((item) => {
            if (item.scanId === selectedScan.scanId) {
              return {
                ...item,
                status: 'Validated',
                expertNotes: agronomistNotes,
              };
            }

            return item;
          });
        });
      } else {
        setSubmitStatus('Unable to submit validation.');
      }
    } catch (error) {
      console.error('Validation submission error:', error);
      setSubmitStatus('Something went wrong while submitting.');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Validated') {
      return 'status-validated';
    }

    return 'status-pending';
  };

  if (loading) {
    return (
      <div className="expert-page">
        <div className="expert-loading">
          <div className="loading-spinner"></div>
          <p>Loading expert review queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expert-page">

      {/* HEADER */}
      <section className="expert-hero">
        <div className="expert-hero-icon">
          <UserCheck size={32} />
        </div>

        <div>
          <span className="expert-badge">
            SIH26131 • HUMAN-IN-THE-LOOP
          </span>

          <h1>
            Agronomist Expert
            <span> Validation Portal</span>
          </h1>

          <p>
            Bridge AI predictions with agricultural expertise.
            Review farmer scans, confirm diagnoses and issue
            verified field advisories.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="expert-layout">

        {/* QUEUE */}
        <aside className="queue-panel">

          <div className="queue-panel-header">
            <div>
              <span className="small-label">AI REVIEW SYSTEM</span>
              <h2>Review Queue</h2>
            </div>

            <span className="queue-count">
              {queue.length}
            </span>
          </div>

          <div className="queue-list">

            {queue.length === 0 ? (
              <div className="empty-queue">
                <CheckCircle2 size={34} />
                <h3>No Pending Scans</h3>
                <p>
                  There are no farmer scans waiting for expert validation.
                </p>
              </div>
            ) : (
              queue.map((item) => (
                <button
                  type="button"
                  key={item.scanId}
                  className={
                    selectedScan &&
                    selectedScan.scanId === item.scanId
                      ? 'queue-item queue-item-active'
                      : 'queue-item'
                  }
                  onClick={() => handleSelectScan(item)}
                >
                  <div className="queue-top">

                    <span className="scan-number">
                      #{item.scanId}
                    </span>

                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>

                  </div>

                  <h3>
                    {item.crop || 'Crop'} - {item.aiPrediction}
                  </h3>

                  <div className="queue-info">

                    <span>
                      <User size={13} />
                      {item.farmerName}
                    </span>

                    <span>
                      <MapPin size={13} />
                      {item.location}
                    </span>

                  </div>
                </button>
              ))
            )}

          </div>
        </aside>

        {/* WORKSPACE */}
        <main className="workspace-panel">

          {!selectedScan ? (
            <div className="workspace-empty">
              <ShieldCheck size={48} />
              <h2>Select a Farmer Scan</h2>
              <p>
                Choose a scan from the review queue to begin validation.
              </p>
            </div>
          ) : (

            <>

              {/* WORKSPACE HEADER */}
              <div className="workspace-top">

                <div>

                  <span className="scan-badge">
                    SCAN #{selectedScan.scanId}
                  </span>

                  <h2>
                    {selectedScan.crop} Diagnosis Verification
                  </h2>

                  <p>
                    Submitted by{' '}
                    <strong>{selectedScan.farmerName}</strong>
                    {' '}from{' '}
                    <strong>{selectedScan.location}</strong>
                  </p>

                </div>

                <div className="ai-result">

                  <span>
                    AI DIAGNOSIS
                  </span>

                  <strong>
                    {selectedScan.aiPrediction}
                  </strong>

                  <small>
                    Confidence: {selectedScan.aiConfidence}%
                  </small>

                </div>

              </div>

              {/* CONTENT */}
              <div className="workspace-content">

                {/* IMAGE */}
                <section className="image-section">

                  <div className="section-title">
                    <h3>Farmer Crop Image</h3>
                    <span>
                      <Clock size={14} />
                      AI Scan
                    </span>
                  </div>

                  <div className="farmer-image-wrapper">

                    <img
                      src={selectedScan.sampleImage}
                      alt="Uploaded crop"
                      className="farmer-image"
                    />

                    <div className="image-label">
                      AI detected:
                      <strong>
                        {selectedScan.aiPrediction}
                      </strong>
                    </div>

                  </div>

                  <div className="farmer-message">

                    <MessageSquare size={18} />

                    <div>
                      <span>FARMER NOTE</span>

                      <p>
                        {selectedScan.farmerNote ||
                          'No additional note provided.'}
                      </p>
                    </div>

                  </div>

                </section>

                {/* FORM */}
                <section className="validation-section">

                  <div className="section-title">
                    <h3>Agronomist Review</h3>
                    <ShieldCheck size={20} />
                  </div>

                  <form onSubmit={handleSubmit}>

                    <div className="form-group">

                      <label>
                        Confirmed Disease Diagnosis
                      </label>

                      <select
                        value={confirmedDisease}
                        onChange={(event) =>
                          setConfirmedDisease(event.target.value)
                        }
                        className="form-control"
                      >
                        <option value="Yellow Rust">
                          Yellow / Stripe Rust
                        </option>

                        <option value="Leaf Curl Virus">
                          Cotton Leaf Curl Virus
                        </option>

                        <option value="Paddy Leaf Blast">
                          Paddy Leaf Blast
                        </option>

                        <option value="Early Blight">
                          Early Blight
                        </option>

                        <option value="Nutrient Deficiency">
                          Nutrient Deficiency
                        </option>

                        <option value="Healthy">
                          Healthy Crop
                        </option>
                      </select>

                    </div>

                    <div className="form-group">

                      <label>
                        Agronomist Advisory Notes
                      </label>

                      <textarea
                        rows="7"
                        value={agronomistNotes}
                        onChange={(event) =>
                          setAgronomistNotes(event.target.value)
                        }
                        className="form-control textarea"
                        placeholder="Enter your field observations and advisory notes..."
                      ></textarea>

                    </div>

                    <div className="quality-box">

                      <div className="quality-icon">
                        <ShieldCheck size={20} />
                      </div>

                      <div>
                        <strong>
                          Expert Verification
                        </strong>

                        <p>
                          Attach the certified agronomist quality
                          verification to this diagnosis.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        defaultChecked
                        id="quality-check"
                      />

                    </div>

                    <button
                      type="submit"
                      className="validate-button"
                    >
                      <Send size={18} />
                      Validate & Send Advisory
                    </button>

                    {submitStatus && (
                      <div className="success-message">
                        <CheckCircle2 size={20} />
                        <span>{submitStatus}</span>
                      </div>
                    )}

                  </form>

                </section>

              </div>

              {/* FOOTER */}
              <div className="workspace-footer">

                <div>
                  <CheckCircle2 size={16} />
                  AI prediction available
                </div>

                <div>
                  <ShieldCheck size={16} />
                  Human verification required
                </div>

                <div>
                  <Send size={16} />
                  Advisory delivery ready
                </div>

              </div>

            </>

          )}

        </main>

      </div>

    </div>
  );
}