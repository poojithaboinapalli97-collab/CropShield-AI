import React, { useState } from 'react';
import { mockCropDemoResults, mockRecentReports } from '../data/mockData';
import BoundingBoxOverlay from '../components/BoundingBoxOverlay';
import {
  UploadCloud,
  Scan,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Leaf,
  Info,
  Send,
  X,
  FileCheck,
  MapPin,
  HelpCircle,
  Shield,
  Bug,
  CloudSun,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function DiseaseDetection() {
  // Form State
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState('Fruiting');
  const [village, setVillage] = useState('Pimplgaon Village');
  const [district, setDistrict] = useState('Nashik');
  const [selectedState, setSelectedState] = useState('Maharashtra');

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Accordion Expand States for Clean UI
  const [showWhySection, setShowWhySection] = useState(false);

  // History & Actions State
  const [savedSuccess, setSavedSuccess] = useState('');
  const [escalatedSuccess, setEscalatedSuccess] = useState('');
  const [reportsHistory, setReportsHistory] = useState(mockRecentReports);

  // Preset Sample Crop Presets for Instant 1-Click Testing
  const samplePresets = [
    { crop: 'Tomato', label: 'Tomato Early Blight', presetKey: 'Tomato' },
    { crop: 'Wheat', label: 'Wheat Yellow Rust', presetKey: 'Wheat' },
    { crop: 'Rice', label: 'Rice Blast', presetKey: 'Rice' },
    { crop: 'Cotton', label: 'Cotton Leaf Curl', presetKey: 'Cotton' },
    { crop: 'Maize', label: 'Healthy Maize', presetKey: 'Maize' },
  ];

  // Handle File Selection
  const processFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileName(file.name);
    setFileSize(`${sizeInMB} MB`);
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFileName('');
    setFileSize('');
    setErrorMessage('');
  };

  // Quick Preset Selection
  const handleSelectPreset = (preset) => {
    setSelectedCrop(preset.crop);
    const resultData = mockCropDemoResults[preset.crop];
    if (resultData) {
      setImagePreview(resultData.sampleImage);
      setFileName(`sample_${preset.crop.toLowerCase()}_leaf.jpg`);
      setFileSize('1.2 MB');
    }
  };

  // Run AI Analysis
  const handleAnalyze = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSavedSuccess('');
    setEscalatedSuccess('');

    if (!imagePreview && !imageFile) {
      setErrorMessage('Please upload a crop image or select a sample leaf preset below.');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      const resultData = mockCropDemoResults[selectedCrop] || mockCropDemoResults['Tomato'];
      setDemoResult({
        ...resultData,
        crop: selectedCrop,
        growthStage,
        location: `${village}, ${district}, ${selectedState}`,
        image: imagePreview || resultData.sampleImage,
      });
    }, 700);
  };

  const handleSaveReport = () => {
    if (!demoResult) return;
    const newReport = {
      reportId: `REP-2026-${Math.floor(88000 + Math.random() * 1000)}`,
      crop: selectedCrop,
      growthStage,
      location: `${district}, ${selectedState}`,
      diagnosis: demoResult.condition,
      confidence: `${demoResult.confidence}%`,
      riskLevel: demoResult.riskLevel,
      date: '31 Aug 2026',
      status: 'Demo AI Analyzed',
    };
    setReportsHistory([newReport, ...reportsHistory]);
    setSavedSuccess('Report saved successfully to your analysis history!');
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const handleRequestExpert = () => {
    setEscalatedSuccess('Scan dispatched to certified agronomists in Nashik district for verification!');
    setTimeout(() => setEscalatedSuccess(''), 4000);
  };

  return (
    <div className="disease-detection-page">
      {/* 1. CLEAN PAGE HEADER */}
      <div className="page-header-clean">
        <div className="title-area">
          <h1 className="page-title">Disease & Pest Detection</h1>
          <p className="page-subtitle">
            Upload a crop image to identify possible diseases or pest symptoms instantly with YOLOv8 AI.
          </p>
        </div>
      </div>

      {/* ERROR STATE ALERT BANNER */}
      {errorMessage && (
        <div className="notice-banner banner-danger mb-16">
          <AlertTriangle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* QUICK PRESET SAMPLE STRIP */}
      <div className="preset-samples-strip">
        <span className="preset-strip-lbl">Try Sample Image:</span>
        <div className="preset-pills-row">
          {samplePresets.map((preset) => (
            <button
              key={preset.crop}
              type="button"
              className={`preset-pill-btn ${selectedCrop === preset.crop ? 'active' : ''}`}
              onClick={() => handleSelectPreset(preset)}
            >
              <Leaf size={14} className="icon-green" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. STREAMLINED UPLOAD & FORM CARD */}
      <div className="dash-card clean-detection-card">
        <form onSubmit={handleAnalyze} className="clean-detection-layout">
          {/* UPLOAD DROPZONE BOX */}
          <div className="clean-upload-zone">
            {!imagePreview ? (
              <div
                className={`clean-drag-box ${dragActive ? 'dropzone-active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="main-crop-image-input"
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                  onChange={handleFileInput}
                  className="file-input-hidden"
                />
                <label htmlFor="main-crop-image-input" className="clean-drag-label">
                  <div className="upload-icon-circle-sm">
                    <UploadCloud size={24} className="icon-green" />
                  </div>
                  <div>
                    <strong>Drag & drop crop image here</strong>
                    <p className="sub-txt-sm">Supports JPG, PNG (Max 10MB)</p>
                  </div>
                  <span className="browse-files-btn-sm">Browse File</span>
                </label>
              </div>
            ) : (
              <div className="clean-image-preview">
                <div className="clean-preview-frame">
                  <img src={imagePreview} alt="Selected crop leaf" className="clean-preview-img" />
                </div>
                <div className="clean-file-bar">
                  <span className="file-name-tag">{fileName || 'crop_leaf_sample.jpg'}</span>
                  <div className="file-actions-row">
                    <label htmlFor="main-crop-image-input" className="link-action-btn">
                      Change
                    </label>
                    <button type="button" className="remove-link-btn" onClick={handleRemoveImage}>
                      <X size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CROP DETAILS & CONTROLS */}
          <div className="clean-form-controls">
            <div className="form-group">
              <label className="form-label">Crop Type</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="form-select"
              >
                <option value="Tomato">Tomato</option>
                <option value="Cotton">Cotton</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
                <option value="Wheat">Wheat</option>
                <option value="Chilli">Chilli</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Growth Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="form-select"
              >
                <option value="Seedling">Seedling</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Fruiting">Fruiting</option>
                <option value="Harvest">Harvest</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Field Location</label>
              <input
                type="text"
                value={`${village}, ${district}`}
                onChange={(e) => setVillage(e.target.value)}
                className="form-input"
                placeholder="e.g. Pimplgaon, Nashik"
              />
            </div>

            <button type="submit" className="primary-btn-sm analyze-submit-btn" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <RefreshCw size={18} className="spin-icon" /> Running YOLOv8 AI Model...
                </>
              ) : (
                <>
                  <Scan size={18} /> Run AI Disease Diagnosis
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* LOADING SPINNER STATE */}
      {isAnalyzing && (
        <div className="loading-card-clean">
          <RefreshCw size={36} className="spin-icon icon-green mb-12" />
          <h3>Processing Crop Image with YOLOv8 Computer Vision...</h3>
          <p>Analyzing leaf lesion boundaries, spore density, and microclimate risk factors</p>
        </div>
      )}

      {/* 3. CLEAN DIAGNOSTIC RESULT DASHBOARD */}
      {demoResult && !isAnalyzing && (
        <div className="clean-result-container">
          <div className="result-main-grid">
            {/* LEFT COLUMN: BOUNDING BOX VISUALIZER */}
            <div className="dash-card visualizer-card">
              <div className="visualizer-header">
                <div className="title-with-icon">
                  <Scan size={20} className="icon-green" />
                  <h4>YOLOv8 Lesion Localization</h4>
                </div>
                <button
                  type="button"
                  className="toggle-box-btn-sm"
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                >
                  {showBoundingBoxes ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showBoundingBoxes ? 'Hide Boxes' : 'Show Boxes'}</span>
                </button>
              </div>

              <div className="visualizer-body">
                <BoundingBoxOverlay
                  imageUrl={demoResult.image}
                  boundingBoxes={demoResult.boundingBoxes}
                  showBoxes={showBoundingBoxes}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: DIAGNOSIS & REMEDIES */}
            <div className="dash-card result-info-card">
              <div className="result-header-row">
                <div>
                  <span className="crop-pill-sm">{demoResult.crop}</span>
                  <h2 className="disease-title">{demoResult.condition}</h2>
                  <p className="location-txt-sm">
                    <MapPin size={13} /> {demoResult.location}
                  </p>
                </div>

                <div className="result-metrics">
                  <div className="metric-badge">
                    <span className="metric-num">{demoResult.confidence}%</span>
                    <span className="metric-lbl">Confidence</span>
                  </div>
                  <div className="metric-badge">
                    <span
                      className={`metric-num ${
                        demoResult.riskLevel === 'Critical' || demoResult.riskLevel === 'High'
                          ? 'val-danger'
                          : 'val-warning'
                      }`}
                    >
                      {demoResult.riskLevel}
                    </span>
                    <span className="metric-lbl">Risk Level</span>
                  </div>
                </div>
              </div>

              <div className="result-body-content">
                <div className="info-block">
                  <h5>Diagnostic Summary</h5>
                  <p>{demoResult.explanation}</p>
                </div>

                <div className="info-block">
                  <h5>Recommended Immediate Action</h5>
                  <p>{demoResult.suggestedNextStep}</p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="actions-button-row">
                  <button type="button" className="primary-btn-sm" onClick={handleSaveReport}>
                    <FileCheck size={16} /> Save Diagnostic Report
                  </button>

                  <button type="button" className="secondary-btn-sm" onClick={handleRequestExpert}>
                    <Send size={16} /> Request Expert Validation
                  </button>
                </div>

                {savedSuccess && <div className="notice-banner banner-success mt-12">{savedSuccess}</div>}
                {escalatedSuccess && <div className="notice-banner banner-success mt-12">{escalatedSuccess}</div>}
              </div>
            </div>
          </div>

          {/* EXPANDABLE "WHY THIS RESULT?" SECTION */}
          <div className="dash-card accordion-card">
            <button
              className="accordion-header-btn"
              onClick={() => setShowWhySection(!showWhySection)}
            >
              <div className="title-with-icon">
                <HelpCircle size={20} className="icon-green" />
                <div>
                  <h4>Why this result? (AI Telemetry Breakdown)</h4>
                  <p className="sub-title-text">Click to view multi-modal field data factors</p>
                </div>
              </div>
              {showWhySection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showWhySection && (
              <div className="accordion-body-content">
                <div className="why-grid">
                  <div className="why-item">
                    <Scan size={18} className="icon-green" />
                    <div>
                      <strong>Image Symptoms</strong>
                      <p>YOLOv8 neural vision model detects target concentric leaf spots.</p>
                    </div>
                  </div>

                  <div className="why-item">
                    <CloudSun size={18} className="icon-amber" />
                    <div>
                      <strong>Weather Parameters</strong>
                      <p>Relative humidity &gt;80% promotes fungal spore germination.</p>
                    </div>
                  </div>

                  <div className="why-item">
                    <Leaf size={18} className="icon-green" />
                    <div>
                      <strong>Crop Stage Vulnerability</strong>
                      <p>{growthStage} stage foliage has lower cellular resistance.</p>
                    </div>
                  </div>

                  <div className="why-item">
                    <Bug size={18} className="icon-purple" />
                    <div>
                      <strong>Pest Vectors</strong>
                      <p>Whitefly vector count cross-referenced with local sticky trap data.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. RECENT ANALYSIS HISTORY TABLE */}
      <div className="dash-card history-table-card mt-24">
        <div className="dash-card-header">
          <h3>Recent Analysis History</h3>
          <span className="sub-title-text">Log of saved crop health scans</span>
        </div>

        <div className="table-responsive-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Crop</th>
                <th>Diagnosis</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportsHistory.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.date}</strong></td>
                  <td>{item.crop}</td>
                  <td>{item.diagnosis}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.riskLevel === 'Critical' || item.riskLevel === 'High'
                          ? 'pill-red'
                          : item.riskLevel === 'Medium'
                          ? 'pill-amber'
                          : 'pill-green'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span className="badge-pill badge-green">
                      <CheckCircle2 size={12} /> {item.status}
                    </span>
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
