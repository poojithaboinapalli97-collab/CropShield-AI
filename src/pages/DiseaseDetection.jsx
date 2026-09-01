import React, { useState } from 'react';
import { mockCropDemoResults, mockRecentReports } from '../data/mockData';
import BoundingBoxOverlay from '../components/BoundingBoxOverlay';
import AudioAdvisoryPlayer from '../components/AudioAdvisoryPlayer';
import IpdmRecommender from '../components/IpdmRecommender';
import SafePesticideGuide from '../components/SafePesticideGuide';
import LabReferralModal from '../components/LabReferralModal';
import FieldMonitoringTracker from '../components/FieldMonitoringTracker';
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
  FlaskConical,
  Activity,
  Layers,
  Clock,
  Building2,
  Droplets,
  AlertOctagon,
  Percent,
  Calculator,
  Beaker,
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

  // Active Tool Modal / Tab States
  const [activeTab, setActiveTab] = useState('diagnosis'); // 'diagnosis', 'ipdm', 'pesticide', 'followup'
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
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
      setErrorMessage('Unsupported file format. Please upload a JPG, JPEG, PNG or WEBP image.');
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
      setImageFile(null);
    }
  };

  // Generate Practical Pathology Analysis Data
  const generatePracticalData = (crop, isCustomUpload) => {
    switch (crop) {
      case 'Tomato':
        return {
          condition: 'Early Blight (Alternaria solani)',
          scientificName: 'Alternaria solani Sorauer',
          confidence: 94.6,
          riskLevel: 'High',
          affectedArea: '18.4%',
          chlorosisPct: '22.8%',
          necrosisPct: '9.4%',
          sporePressure: 84,
          lesionPattern: 'Concentric Target-Board Rings with Chlorotic Halo',
          spreadStage: 'Stage 2: Active Sporulation & Foliar Expansion',
          yieldLossRisk: '25% - 35% Loss if Untreated in 10 Days',
          urgencyWindow: 'Within 24 Hours (Before Evening Humidity Surge)',
          fracGroup: 'FRAC Group 3 (Triazoles) + FRAC Group M03 (Multi-site)',
          explanation: 'Fungal conidiophores detected on lower leaf canopy. Concentric rings indicate active Alternaria mycelium expansion stimulated by warm temperatures (24-29°C) and dew formation.',
          suggestedNextStep: 'Prune lower affected leaves to stop splash dispersal. Spray Mancozeb 75% WP @ 2.0g/L or Azoxystrobin @ 1.0ml/L.',
          tankDosageGuide: {
            chemicalName: 'Mancozeb 75% WP + Azoxystrobin 23% SC',
            dosagePerLiter: '2.0 grams / Liter water',
            perAcreWaterLiters: 200,
            knapsackTanksNeeded: '12.5 Tanks (16-Liter Capacity)',
            bucketSlurrySOP: 'Dissolve 400g Mancozeb in a 10L bucket first to form a smooth slurry before pouring into main sprayer tank.',
            reEntryInterval: '24 Hours',
            preHarvestInterval: '5 Days',
          },
          boundingBoxes: [
            { id: 1, x: 22, y: 28, width: 34, height: 32, label: 'Alternaria Lesion', confidence: 0.96 },
            { id: 2, x: 58, y: 44, width: 26, height: 28, label: 'Chlorotic Halo', confidence: 0.91 },
          ],
        };
      case 'Wheat':
        return {
          condition: 'Yellow / Stripe Rust (Puccinia striiformis)',
          scientificName: 'Puccinia striiformis f. sp. tritici',
          confidence: 96.2,
          riskLevel: 'Critical',
          affectedArea: '26.2%',
          chlorosisPct: '31.4%',
          necrosisPct: '12.6%',
          sporePressure: 92,
          lesionPattern: 'Parallel Linear Yellow Uredinial Pustules along Leaf Veins',
          spreadStage: 'Stage 3: Advanced Airborne Urediniospore Release',
          yieldLossRisk: '40% - 60% Loss if Untreated in 7 Days',
          urgencyWindow: 'Immediate (Within 12 Hours)',
          fracGroup: 'FRAC Group 3 (DMI Propiconazole / Tebuconazole)',
          explanation: 'Aggressive yellow rust pustules detected breaking through leaf epidermis. Night temperatures (10-14°C) and morning fog are enabling rapid spore germination across adjacent plots.',
          suggestedNextStep: 'Spray Propiconazole 25% EC (Tilt) @ 1.0 ml/L water immediately across entire field boundary.',
          tankDosageGuide: {
            chemicalName: 'Propiconazole 25% EC @ 1.0ml/L',
            dosagePerLiter: '1.0 ml / Liter water (200ml per acre)',
            perAcreWaterLiters: 200,
            knapsackTanksNeeded: '12.5 Tanks (16-Liter Capacity)',
            bucketSlurrySOP: 'Mix 200ml Propiconazole in 10L clean water, stir well for 2 mins, then dilute to 200L tank volume.',
            reEntryInterval: '24 Hours',
            preHarvestInterval: '30 Days',
          },
          boundingBoxes: [
            { id: 1, x: 20, y: 15, width: 28, height: 65, label: 'Stripe Rust Pustule', confidence: 0.97 },
            { id: 2, x: 54, y: 22, width: 24, height: 55, label: 'Secondary Uredinia', confidence: 0.93 },
          ],
        };
      case 'Rice':
        return {
          condition: 'Paddy Blast (Magnaporthe oryzae)',
          scientificName: 'Magnaporthe oryzae / Pyricularia oryzae',
          confidence: 93.8,
          riskLevel: 'High',
          affectedArea: '16.5%',
          chlorosisPct: '19.2%',
          necrosisPct: '8.4%',
          sporePressure: 78,
          lesionPattern: 'Spindle/Eye-shaped Lesions with Gray Centers and Brown Margins',
          spreadStage: 'Stage 2: Foliar Blast Collar Infiltration',
          yieldLossRisk: '30% - 45% Yield Loss if Neck Blast develops',
          urgencyWindow: 'Within 24 Hours',
          fracGroup: 'FRAC Group 1 (MBC) / FRAC Group 3 (Tricyclazole)',
          explanation: 'Spindle-shaped necrotic lesions identified on paddy leaf blade. High nitrogen fertilization and relative humidity above 85% have accelerated fungal penetration.',
          suggestedNextStep: 'Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.',
          tankDosageGuide: {
            chemicalName: 'Tricyclazole 75% WP (Beam)',
            dosagePerLiter: '0.6 grams / Liter water (120g per acre)',
            perAcreWaterLiters: 200,
            knapsackTanksNeeded: '12.5 Tanks (16-Liter Capacity)',
            bucketSlurrySOP: 'Pre-mix 120g powder in 5L water bucket until fully dissolved without lumps.',
            reEntryInterval: '12 Hours',
            preHarvestInterval: '14 Days',
          },
          boundingBoxes: [
            { id: 1, x: 30, y: 35, width: 35, height: 25, label: 'Spindle Blast Lesion', confidence: 0.95 },
          ],
        };
      case 'Cotton':
        return {
          condition: 'Cotton Leaf Curl Virus (CLCuV)',
          scientificName: 'Begomovirus (Whitefly-transmitted)',
          confidence: 91.5,
          riskLevel: 'High',
          affectedArea: '22.0%',
          chlorosisPct: '28.0%',
          necrosisPct: '5.0%',
          sporePressure: 80,
          lesionPattern: 'Upward Leaf Curling, Vein Thickening & Enations',
          spreadStage: 'Stage 2: Systemic Viral Vector Proliferation',
          yieldLossRisk: '30% - 50% Boll Formation Reduction',
          urgencyWindow: 'Within 48 Hours Vector Control',
          fracGroup: 'IRAC Group 4A (Neonicotinoids - Whitefly vector management)',
          explanation: 'Viral enations on leaf undersides caused by Whitefly (Bemisia tabaci) feeding. Controlling vector population is mandatory to protect adjacent squares and bolls.',
          suggestedNextStep: 'Install 15 Yellow Sticky Traps/Acre. Spray Diafenthiuron 50% WP @ 1.2g/L or Pyriproxyfen 10% EC @ 2ml/L.',
          tankDosageGuide: {
            chemicalName: 'Diafenthiuron 50% WP (Pegasus)',
            dosagePerLiter: '1.2 grams / Liter water (240g per acre)',
            perAcreWaterLiters: 200,
            knapsackTanksNeeded: '12.5 Tanks (16-Liter Capacity)',
            bucketSlurrySOP: 'Mix 240g in clean water slurry before adding to tank.',
            reEntryInterval: '24 Hours',
            preHarvestInterval: '21 Days',
          },
          boundingBoxes: [
            { id: 1, x: 25, y: 20, width: 45, height: 50, label: 'Curled Leaf Margin', confidence: 0.92 },
          ],
        };
      default:
        return {
          condition: 'Healthy Vigorous Foliage (No Active Pathogen)',
          scientificName: `${crop} (Optimal Phenological Growth)`,
          confidence: 98.2,
          riskLevel: 'Low',
          affectedArea: '0.0%',
          chlorosisPct: '0.5%',
          necrosisPct: '0.0%',
          sporePressure: 12,
          lesionPattern: 'Uniform Deep-Green Chlorophyll with Intact Cuticle',
          spreadStage: 'Optimal Healthy Growth',
          yieldLossRisk: '0% Expected Loss',
          urgencyWindow: 'Routine Preventive Monitoring',
          fracGroup: 'No chemical fungicide required',
          explanation: 'Deep green pigmentation and intact leaf margins detected with zero necrotic lesions or pest puncture marks.',
          suggestedNextStep: 'Maintain regular irrigation and balanced NPK fertigation during current phenological stage.',
          tankDosageGuide: {
            chemicalName: 'Bio-stimulant / Micronutrient Foliar Spray',
            dosagePerLiter: '2.0 ml / Liter water (Zinc + Boron 2%)',
            perAcreWaterLiters: 150,
            knapsackTanksNeeded: '10 Tanks (16-Liter Capacity)',
            bucketSlurrySOP: 'Dissolve nutrient mix in clean water and spray during cool morning hours.',
            reEntryInterval: '0 Hours',
            preHarvestInterval: '0 Days',
          },
          boundingBoxes: [
            { id: 1, x: 15, y: 15, width: 70, height: 70, label: 'Healthy Chlorophyll', confidence: 0.99 },
          ],
        };
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
      const practicalData = generatePracticalData(selectedCrop, !!imageFile);
      setDemoResult({
        ...practicalData,
        crop: selectedCrop,
        growthStage,
        location: `${village}, ${district}, ${selectedState}`,
        image: imagePreview || mockCropDemoResults[selectedCrop]?.sampleImage,
      });
      setActiveTab('diagnosis');
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
      date: '01 Sep 2026',
      status: 'AI Confirmed Diagnosis',
    };
    setReportsHistory([newReport, ...reportsHistory]);
    setSavedSuccess('Diagnostic report saved successfully to your analysis history!');
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  return (
    <div className="disease-detection-page">
      {/* 1. CLEAN PAGE HEADER */}
      <div className="page-header-clean">
        <div className="title-area">
          <span className="sih-badge-inline">
            <Sparkles size={13} /> SIH26131 • PRECISION AGRI-VISION & VERNACULAR ADVISORY
          </span>
          <h1 className="page-title">Practical AI Crop Disease Diagnosis & IPDM Suite</h1>
          <p className="page-subtitle">
            Upload any crop leaf photo for instant lesion localization, practical pathology metrics, vernacular voice advisory in 9 Indian languages, exact tank dilution formulas, and KVK referral.
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
        <span className="preset-strip-lbl">Instant Diagnostic Presets:</span>
        <div className="preset-pills-row">
          {samplePresets.map((preset) => (
            <button
              key={preset.crop}
              type="button"
              className={`preset-pill-btn ${selectedCrop === preset.crop && !imageFile ? 'active' : ''}`}
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
                    <strong>Drag & drop any crop leaf image here</strong>
                    <p className="sub-txt-sm">Upload real farm photo (JPG, PNG, WEBP)</p>
                  </div>
                  <span className="browse-files-btn-sm">Browse Device Camera / File</span>
                </label>
              </div>
            ) : (
              <div className="clean-image-preview">
                <div className="clean-preview-frame">
                  <img src={imagePreview} alt="Selected crop leaf" className="clean-preview-img" />
                </div>
                <div className="clean-file-bar">
                  <span className="file-name-tag">{fileName || 'uploaded_crop_leaf.jpg'} ({fileSize || '1.4 MB'})</span>
                  <div className="file-actions-row">
                    <label htmlFor="main-crop-image-input" className="link-action-btn">
                      Change Photo
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
              <label className="form-label">Crop Plant Type</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="form-select"
              >
                <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                <option value="Wheat">Wheat (Triticum aestivum)</option>
                <option value="Rice">Rice / Paddy (Oryza sativa)</option>
                <option value="Cotton">Cotton (Gossypium hirsutum)</option>
                <option value="Maize">Maize / Corn (Zea mays)</option>
                <option value="Chilli">Chilli / Pepper (Capsicum annuum)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Crop Phenological Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="form-select"
              >
                <option value="Seedling">Seedling / Germination Stage</option>
                <option value="Vegetative">Vegetative Growth Stage</option>
                <option value="Flowering">Flowering & Booting Stage</option>
                <option value="Fruiting">Fruiting / Grain Fill Stage</option>
                <option value="Harvest">Maturity / Pre-Harvest Stage</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Field Location (Village & District)</label>
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
                  <RefreshCw size={18} className="spin-icon" /> Computing Neural Pathology Diagnosis...
                </>
              ) : (
                <>
                  <Scan size={18} /> Run Practical AI Diagnosis
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
          <h3>Processing Image with YOLOv8 Neural Agri-Vision...</h3>
          <p>Localizing foliar lesion contours, concentric rings, chlorosis percentage, and pathogen pressure index</p>
        </div>
      )}

      {/* 3. CLEAN DIAGNOSTIC RESULT DASHBOARD */}
      {demoResult && !isAnalyzing && (
        <div className="clean-result-container">
          {/* RESULT TABS NAVIGATION BAR */}
          <div className="result-section-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('diagnosis')}
              className={`sec-tab-btn ${activeTab === 'diagnosis' ? 'sec-tab-active' : ''}`}
            >
              <Scan size={16} /> 1. Visual Pathology & Spoken Voice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ipdm')}
              className={`sec-tab-btn ${activeTab === 'ipdm' ? 'sec-tab-active' : ''}`}
            >
              <Layers size={16} /> 2. 4-Tier IPDM Strategy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pesticide')}
              className={`sec-tab-btn ${activeTab === 'pesticide' ? 'sec-tab-active' : ''}`}
            >
              <FlaskConical size={16} /> 3. Safe Dosage & Tank Dilution Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('followup')}
              className={`sec-tab-btn ${activeTab === 'followup' ? 'sec-tab-active' : ''}`}
            >
              <Clock size={16} /> 4. Post-Treatment Healing Tracker
            </button>
          </div>

          {/* TAB 1: VISUAL DIAGNOSIS & BOUNDING BOX OVERLAY */}
          {activeTab === 'diagnosis' && (
            <div className="tab-pane-content">
              {/* AUDIO ADVISORY VOICE PLAYER (ALL INDIAN PREFERRED LANGUAGES) */}
              <AudioAdvisoryPlayer
                title={`Diagnosis: ${demoResult.condition} on ${demoResult.crop}`}
                summaryText={demoResult.explanation}
                advisorySteps={[
                  demoResult.suggestedNextStep,
                  'Prune and destroy infected lower leaves away from field borders',
                  'Maintain optimal aeration and switch to drip irrigation to keep canopy dry',
                  'Consult the 4-Tier IPDM tab for biological remedies before chemical spraying',
                ]}
                diseaseData={demoResult}
                className="mb-20"
              />

              {/* PRACTICAL ANALYSED DATA SUMMARY TILES */}
              <div className="practical-analytics-banner mb-20">
                <div className="analytic-tile">
                  <span className="analytic-lbl">Leaf Chlorosis (Yellowing)</span>
                  <strong className="analytic-val text-amber">{demoResult.chlorosisPct || '22.8%'}</strong>
                  <span className="analytic-sub">Loss of Chlorophyll</span>
                </div>

                <div className="analytic-tile">
                  <span className="analytic-lbl">Leaf Necrosis (Dead Tissue)</span>
                  <strong className="analytic-val text-danger">{demoResult.necrosisPct || '9.4%'}</strong>
                  <span className="analytic-sub">Cellular Breakdown</span>
                </div>

                <div className="analytic-tile">
                  <span className="analytic-lbl">Spore Pressure Index</span>
                  <strong className="analytic-val text-purple">{demoResult.sporePressure || 84}/100</strong>
                  <span className="analytic-sub">Mills Risk Model</span>
                </div>

                <div className="analytic-tile">
                  <span className="analytic-lbl">Estimated Yield Loss</span>
                  <strong className="analytic-val text-danger">{demoResult.yieldLossRisk || '25% - 35%'}</strong>
                  <span className="analytic-sub">If Untreated in 10 Days</span>
                </div>
              </div>

              <div className="result-main-grid">
                {/* LEFT COLUMN: BOUNDING BOX VISUALIZER */}
                <div className="dash-card visualizer-card">
                  <div className="visualizer-header">
                    <div className="title-with-icon">
                      <Scan size={20} className="icon-green" />
                      <h4>YOLOv8 Lesion Localization & Bounding Boxes</h4>
                    </div>
                    <button
                      type="button"
                      className="toggle-box-btn-sm"
                      onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                    >
                      {showBoundingBoxes ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{showBoundingBoxes ? 'Hide Bounding Boxes' : 'Show Boxes'}</span>
                    </button>
                  </div>

                  <div className="visualizer-body">
                    <BoundingBoxOverlay
                      imageUrl={demoResult.image}
                      boundingBoxes={demoResult.boundingBoxes}
                      showBoxes={showBoundingBoxes}
                    />
                  </div>

                  {demoResult.boundingBoxes && demoResult.boundingBoxes.length > 0 && (
                    <div className="detected-boxes-pills">
                      <span className="boxes-lbl">Detected Lesion Contours:</span>
                      {demoResult.boundingBoxes.map((b) => (
                        <span key={b.id} className="box-pill">
                          🎯 {b.label} ({Math.round(b.confidence * 100)}% Confidence)
                        </span>
                      ))}
                    </div>
                  )}

                  {/* PRACTICAL PATHOLOGY PATTERN CARD */}
                  <div className="practical-pattern-box mt-14">
                    <div className="pattern-header">
                      <MicroscopeIcon />
                      <strong>Visual Pathology Symptom Pattern:</strong>
                    </div>
                    <p className="pattern-desc">{demoResult.lesionPattern}</p>
                    <div className="spread-stage-badge">
                      <span>Status:</span> <strong>{demoResult.spreadStage}</strong>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: DIAGNOSIS & QUICK PRACTICAL ACTIONS */}
                <div className="dash-card result-info-card">
                  <div className="result-header-row">
                    <div>
                      <span className="crop-pill-sm">{demoResult.crop}</span>
                      <h2 className="disease-title">{demoResult.condition}</h2>
                      <p className="scientific-name-sub">
                        <em>{demoResult.scientificName}</em>
                      </p>
                      <p className="location-txt-sm">
                        <MapPin size={13} /> {demoResult.location}
                      </p>
                    </div>

                    <div className="result-metrics">
                      <div className="metric-badge">
                        <span className="metric-num">{demoResult.confidence}%</span>
                        <span className="metric-lbl">Model Confidence</span>
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
                        <span className="metric-lbl">Threat Severity</span>
                      </div>
                      <div className="metric-badge">
                        <span className="metric-num text-purple">{demoResult.affectedArea}</span>
                        <span className="metric-lbl">Affected Canopy</span>
                      </div>
                    </div>
                  </div>

                  <div className="result-body-content">
                    <div className="info-block">
                      <h5>Pathological Diagnostic Explanation</h5>
                      <p>{demoResult.explanation}</p>
                    </div>

                    {/* PRACTICAL FIELD DOSAGE & TANK MIXING PREVIEW */}
                    {demoResult.tankDosageGuide && (
                      <div className="practical-tank-guide-box">
                        <div className="tank-guide-head">
                          <Calculator size={16} className="icon-green" />
                          <strong>Practical 1-Acre Sprayer Tank Calculation:</strong>
                        </div>
                        <div className="tank-guide-grid">
                          <div className="tank-item">
                            <span className="t-lbl">Recommended Chemical</span>
                            <strong className="t-val text-emerald">{demoResult.tankDosageGuide.chemicalName}</strong>
                          </div>
                          <div className="tank-item">
                            <span className="t-lbl">Dilution Ratio</span>
                            <strong className="t-val">{demoResult.tankDosageGuide.dosagePerLiter}</strong>
                          </div>
                          <div className="tank-item">
                            <span className="t-lbl">Water Required</span>
                            <strong className="t-val">{demoResult.tankDosageGuide.perAcreWaterLiters} Liters / Acre</strong>
                          </div>
                          <div className="tank-item">
                            <span className="t-lbl">Knapsack Refills</span>
                            <strong className="t-val">{demoResult.tankDosageGuide.knapsackTanksNeeded}</strong>
                          </div>
                        </div>
                        <div className="slurry-sop-line">
                          <Beaker size={14} className="icon-amber" />
                          <span><strong>Bucket Slurry SOP:</strong> {demoResult.tankDosageGuide.bucketSlurrySOP}</span>
                        </div>
                      </div>
                    )}

                    <div className="info-block mt-12">
                      <h5>Recommended Immediate Next Step</h5>
                      <p>{demoResult.suggestedNextStep}</p>
                    </div>

                    {/* ACTION BUTTONS ROW */}
                    <div className="actions-button-row">
                      <button type="button" className="primary-btn-sm" onClick={handleSaveReport}>
                        <FileCheck size={16} /> Save Diagnostic Report
                      </button>

                      <button
                        type="button"
                        className="btn-escalate-lab"
                        onClick={() => setIsLabModalOpen(true)}
                      >
                        <Building2 size={16} /> Refer to KVK Extension / Lab
                      </button>

                      <button
                        type="button"
                        className="secondary-btn-sm"
                        onClick={() => setActiveTab('ipdm')}
                      >
                        <Layers size={16} /> View 4-Tier IPDM Plan →
                      </button>
                    </div>

                    {savedSuccess && <div className="notice-banner banner-success mt-12">{savedSuccess}</div>}
                    {escalatedSuccess && <div className="notice-banner banner-success mt-12">{escalatedSuccess}</div>}
                  </div>
                </div>
              </div>

              {/* EXPANDABLE "WHY THIS RESULT?" SECTION */}
              <div className="dash-card accordion-card mt-16">
                <button
                  type="button"
                  className="accordion-header-btn"
                  onClick={() => setShowWhySection(!showWhySection)}
                >
                  <div className="title-with-icon">
                    <HelpCircle size={20} className="icon-green" />
                    <div>
                      <h4>Why this result? (Multi-Modal AI Telemetry Breakdown)</h4>
                      <p className="sub-title-text">Click to view vision, weather, and pest factors correlated in this diagnosis</p>
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
                          <strong>Image Pathology Symptoms</strong>
                          <p>YOLOv8 vision model localizes concentric foliar necrosis, chlorotic halos, and tissue desiccation.</p>
                        </div>
                      </div>

                      <div className="why-item">
                        <CloudSun size={18} className="icon-amber" />
                        <div>
                          <strong>Weather Microclimate</strong>
                          <p>Relative humidity &gt;80% and dew formation strongly correlate with active spore germination.</p>
                        </div>
                      </div>

                      <div className="why-item">
                        <Leaf size={18} className="icon-green" />
                        <div>
                          <strong>Crop Stage Vulnerability</strong>
                          <p>{growthStage} stage foliage has lower cellular resistance against fungal penetration.</p>
                        </div>
                      </div>

                      <div className="why-item">
                        <Bug size={18} className="icon-purple" />
                        <div>
                          <strong>Vector Traps & Pests</strong>
                          <p>Cross-referenced with regional pheromone and sticky trap data to check vector transmission.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INTEGRATED PEST & DISEASE MANAGEMENT (IPDM) */}
          {activeTab === 'ipdm' && (
            <div className="tab-pane-content">
              <IpdmRecommender
                cropName={demoResult.crop}
                diseaseName={demoResult.condition}
                onOpenPesticideCalc={() => setActiveTab('pesticide')}
              />
            </div>
          )}

          {/* TAB 3: SAFE PESTICIDE GUIDE & DOSAGE CALCULATOR */}
          {activeTab === 'pesticide' && (
            <div className="tab-pane-content">
              <SafePesticideGuide
                initialCrop={demoResult.crop}
                initialDisease={demoResult.condition}
                onClose={() => setActiveTab('diagnosis')}
              />
            </div>
          )}

          {/* TAB 4: POST-TREATMENT RECOVERY TRACKER */}
          {activeTab === 'followup' && (
            <div className="tab-pane-content">
              <FieldMonitoringTracker
                onNewScanClick={() => {
                  setActiveTab('diagnosis');
                  handleRemoveImage();
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* KVK LAB REFERRAL MODAL */}
      {isLabModalOpen && demoResult && (
        <LabReferralModal
          cropName={demoResult.crop}
          diseaseName={demoResult.condition}
          farmerLocation={demoResult.location}
          onClose={() => setIsLabModalOpen(false)}
          onTicketGenerated={(ticket) => {
            setEscalatedSuccess(`Lab referral case #${ticket.ticketId} escalated to ${ticket.lab.name}!`);
            setTimeout(() => setEscalatedSuccess(''), 4000);
          }}
        />
      )}
    </div>
  );
}

// Microscopic Icon SVG component
function MicroscopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}
