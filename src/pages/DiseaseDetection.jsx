import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  UploadCloud,
  Scan,
  Leaf,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Languages,
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8001';

const reportTranslations = {
  en: {
    resultTitle: 'AI Diagnosis Result',
    resultSubtitle: 'Complete report returned by the CropShield AI model.',
    reportLanguage: 'Report Language',
    crop: 'Crop',
    scientificName: 'Scientific Name',
    condition: 'Detected Condition',
    confidence: 'Confidence',
    confidenceLevel: 'Confidence Level',
    modelType: 'Model Type',
    cropStage: 'Crop Stage',
    location: 'Location',
    high: 'High',
    moderate: 'Moderate',
    low: 'Low',
    modelOutput: 'Real AI Model Output',
    modelOutputText:
      'Disease and confidence values shown above come directly from the CropShield AI FastAPI classification model.',
    newScan: 'Start New Scan',
  },

  hi: {
    resultTitle: 'एआई रोग निदान परिणाम',
    resultSubtitle: 'CropShield AI मॉडल द्वारा दिया गया पूरा विवरण।',
    reportLanguage: 'रिपोर्ट की भाषा',
    crop: 'फसल',
    scientificName: 'वैज्ञानिक नाम',
    condition: 'पहचानी गई बीमारी',
    confidence: 'विश्वसनीयता',
    confidenceLevel: 'विश्वसनीयता स्तर',
    modelType: 'मॉडल प्रकार',
    cropStage: 'फसल अवस्था',
    location: 'स्थान',
    high: 'उच्च',
    moderate: 'मध्यम',
    low: 'कम',
    modelOutput: 'वास्तविक एआई मॉडल परिणाम',
    modelOutputText:
      'ऊपर दिखाए गए बीमारी और विश्वसनीयता के मान CropShield AI FastAPI मॉडल से सीधे प्राप्त हुए हैं।',
    newScan: 'नया स्कैन शुरू करें',
  },

  mr: {
    resultTitle: 'एआय रोग निदान निकाल',
    resultSubtitle: 'CropShield AI मॉडेलने दिलेला संपूर्ण अहवाल.',
    reportLanguage: 'अहवालाची भाषा',
    crop: 'पीक',
    scientificName: 'शास्त्रीय नाव',
    condition: 'आढळलेला रोग',
    confidence: 'विश्वास पातळी',
    confidenceLevel: 'विश्वास स्तर',
    modelType: 'मॉडेल प्रकार',
    cropStage: 'पिकाची अवस्था',
    location: 'स्थान',
    high: 'उच्च',
    moderate: 'मध्यम',
    low: 'कमी',
    modelOutput: 'वास्तविक एआय मॉडेल निकाल',
    modelOutputText:
      'वरील रोग आणि विश्वासाचे मूल्य CropShield AI FastAPI मॉडेलमधून थेट मिळाले आहे.',
    newScan: 'नवीन स्कॅन सुरू करा',
  },

  pa: {
    resultTitle: 'ਏਆਈ ਬਿਮਾਰੀ ਜਾਂਚ ਨਤੀਜਾ',
    resultSubtitle: 'CropShield AI ਮਾਡਲ ਵੱਲੋਂ ਪੂਰੀ ਰਿਪੋਰਟ।',
    reportLanguage: 'ਰਿਪੋਰਟ ਦੀ ਭਾਸ਼ਾ',
    crop: 'ਫਸਲ',
    scientificName: 'ਵਿਗਿਆਨਕ ਨਾਮ',
    condition: 'ਪਛਾਣੀ ਗਈ ਬਿਮਾਰੀ',
    confidence: 'ਭਰੋਸਾ',
    confidenceLevel: 'ਭਰੋਸੇ ਦਾ ਪੱਧਰ',
    modelType: 'ਮਾਡਲ ਕਿਸਮ',
    cropStage: 'ਫਸਲ ਦੀ ਅਵਸਥਾ',
    location: 'ਸਥਾਨ',
    high: 'ਉੱਚਾ',
    moderate: 'ਦਰਮਿਆਨਾ',
    low: 'ਘੱਟ',
    modelOutput: 'ਅਸਲ ਏਆਈ ਮਾਡਲ ਨਤੀਜਾ',
    modelOutputText:
      'ਉੱਪਰ ਦਿੱਤੀ ਬਿਮਾਰੀ ਅਤੇ ਭਰੋਸੇ ਦੀ ਜਾਣਕਾਰੀ CropShield AI FastAPI ਮਾਡਲ ਤੋਂ ਸਿੱਧੀ ਆਈ ਹੈ।',
    newScan: 'ਨਵਾਂ ਸਕੈਨ ਸ਼ੁਰੂ ਕਰੋ',
  },

  te: {
    resultTitle: 'AI వ్యాధి నిర్ధారణ ఫలితం',
    resultSubtitle: 'CropShield AI మోడల్ అందించిన పూర్తి నివేదిక.',
    reportLanguage: 'నివేదిక భాష',
    crop: 'పంట',
    scientificName: 'శాస్త్రీయ పేరు',
    condition: 'గుర్తించిన వ్యాధి',
    confidence: 'నమ్మక స్థాయి',
    confidenceLevel: 'నమ్మక స్థాయి',
    modelType: 'మోడల్ రకం',
    cropStage: 'పంట దశ',
    location: 'ప్రదేశం',
    high: 'అధికం',
    moderate: 'మధ్యస్థం',
    low: 'తక్కువ',
    modelOutput: 'నిజమైన AI మోడల్ ఫలితం',
    modelOutputText:
      'పైన చూపిన వ్యాధి మరియు నమ్మక విలువలు CropShield AI FastAPI మోడల్ నుండి నేరుగా వచ్చాయి.',
    newScan: 'కొత్త స్కాన్ ప్రారంభించండి',
  },

  ta: {
    resultTitle: 'AI நோய் கண்டறிதல் முடிவு',
    resultSubtitle: 'CropShield AI மாதிரி வழங்கிய முழுமையான அறிக்கை.',
    reportLanguage: 'அறிக்கை மொழி',
    crop: 'பயிர்',
    scientificName: 'அறிவியல் பெயர்',
    condition: 'கண்டறியப்பட்ட நோய்',
    confidence: 'நம்பிக்கை',
    confidenceLevel: 'நம்பிக்கை நிலை',
    modelType: 'மாதிரி வகை',
    cropStage: 'பயிர் நிலை',
    location: 'இடம்',
    high: 'அதிகம்',
    moderate: 'மிதமானது',
    low: 'குறைவு',
    modelOutput: 'உண்மையான AI மாதிரி முடிவு',
    modelOutputText:
      'மேலே காட்டப்பட்ட நோய் மற்றும் நம்பிக்கை மதிப்புகள் CropShield AI FastAPI மாதிரியிலிருந்து நேரடியாக பெறப்பட்டவை.',
    newScan: 'புதிய ஸ்கேன் தொடங்கவும்',
  },

  bn: {
    resultTitle: 'এআই রোগ নির্ণয়ের ফলাফল',
    resultSubtitle: 'CropShield AI মডেল থেকে পাওয়া সম্পূর্ণ রিপোর্ট।',
    reportLanguage: 'রিপোর্টের ভাষা',
    crop: 'ফসল',
    scientificName: 'বৈজ্ঞানিক নাম',
    condition: 'শনাক্ত রোগ',
    confidence: 'নির্ভরযোগ্যতা',
    confidenceLevel: 'নির্ভরযোগ্যতার স্তর',
    modelType: 'মডেলের ধরন',
    cropStage: 'ফসলের পর্যায়',
    location: 'অবস্থান',
    high: 'উচ্চ',
    moderate: 'মাঝারি',
    low: 'কম',
    modelOutput: 'আসল এআই মডেলের ফলাফল',
    modelOutputText:
      'উপরে দেখানো রোগ এবং নির্ভরযোগ্যতার মান CropShield AI FastAPI মডেল থেকে সরাসরি এসেছে।',
    newScan: 'নতুন স্ক্যান শুরু করুন',
  },

  gu: {
    resultTitle: 'AI રોગ નિદાન પરિણામ',
    resultSubtitle: 'CropShield AI મોડેલ દ્વારા આપવામાં આવેલ સંપૂર્ણ અહેવાલ.',
    reportLanguage: 'અહેવાલની ભાષા',
    crop: 'પાક',
    scientificName: 'વૈજ્ઞાનિક નામ',
    condition: 'ઓળખાયેલ રોગ',
    confidence: 'વિશ્વસનીયતા',
    confidenceLevel: 'વિશ્વસનીયતા સ્તર',
    modelType: 'મોડેલ પ્રકાર',
    cropStage: 'પાકનો તબક્કો',
    location: 'સ્થાન',
    high: 'ઉચ્ચ',
    moderate: 'મધ્યમ',
    low: 'ઓછું',
    modelOutput: 'વાસ્તવિક AI મોડેલ પરિણામ',
    modelOutputText:
      'ઉપર દર્શાવેલ રોગ અને વિશ્વસનીયતાના મૂલ્યો CropShield AI FastAPI મોડેલમાંથી સીધા આવ્યા છે.',
    newScan: 'નવું સ્કેન શરૂ કરો',
  },

  kn: {
    resultTitle: 'AI ರೋಗ ಪತ್ತೆ ಫಲಿತಾಂಶ',
    resultSubtitle: 'CropShield AI ಮಾದರಿಯಿಂದ ಬಂದ ಸಂಪೂರ್ಣ ವರದಿ.',
    reportLanguage: 'ವರದಿ ಭಾಷೆ',
    crop: 'ಬೆಳೆ',
    scientificName: 'ವೈಜ್ಞಾನಿಕ ಹೆಸರು',
    condition: 'ಪತ್ತೆಯಾದ ರೋಗ',
    confidence: 'ನಂಬಿಕೆ',
    confidenceLevel: 'ನಂಬಿಕೆ ಮಟ್ಟ',
    modelType: 'ಮಾದರಿ ಪ್ರಕಾರ',
    cropStage: 'ಬೆಳೆಯ ಹಂತ',
    location: 'ಸ್ಥಳ',
    high: 'ಹೆಚ್ಚು',
    moderate: 'ಮಧ್ಯಮ',
    low: 'ಕಡಿಮೆ',
    modelOutput: 'ನಿಜವಾದ AI ಮಾದರಿ ಫಲಿತಾಂಶ',
    modelOutputText:
      'ಮೇಲೆ ತೋರಿಸಿರುವ ರೋಗ ಮತ್ತು ನಂಬಿಕೆಯ ಮೌಲ್ಯಗಳು CropShield AI FastAPI ಮಾದರಿಯಿಂದ ನೇರವಾಗಿ ಬಂದಿವೆ.',
    newScan: 'ಹೊಸ ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ',
  },
};

const languageNames = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  pa: 'ਪੰਜਾਬੀ',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  bn: 'বাংলা',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
};

export default function DiseaseDetection() {
  const { lang } = useLanguage();

  const reportText =
    reportTranslations[lang] ||
    reportTranslations.en;

  const selectedLanguageName =
    languageNames[lang] ||
    'English';

  // -----------------------------
  // FORM STATE
  // -----------------------------
  const [selectedCrop, setSelectedCrop] =
    useState('Tomato');

  const [growthStage, setGrowthStage] =
    useState('Fruiting');

  const [village, setVillage] =
    useState('');

  const [district, setDistrict] =
    useState('');

  // -----------------------------
  // IMAGE STATE
  // -----------------------------
  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [fileName, setFileName] =
    useState('');

  const [fileSize, setFileSize] =
    useState('');

  // -----------------------------
  // AI STATE
  // -----------------------------
  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState('');

  // -----------------------------
  // CROP OPTIONS
  // -----------------------------
  const cropOptions = [
    'Tomato',
    'Wheat',
    'Rice / Paddy',
    'Cotton',
    'Maize / Corn',
    'Chilli / Pepper',
  ];

  const growthOptions = [
    'Seedling / Germination Stage',
    'Vegetative Growth Stage',
    'Flowering & Booting Stage',
    'Fruiting / Grain Fill Stage',
    'Maturity / Pre-Harvest Stage',
  ];

  // -----------------------------
  // FORMAT DISEASE NAME
  // -----------------------------
  const formatDiseaseName = (name) => {
    if (!name) return 'Unknown';

    return name
      .replace(/___/g, ' - ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // -----------------------------
  // SCIENTIFIC NAME
  // -----------------------------
  const getScientificName = (crop) => {
    const names = {
      Tomato: 'Solanum lycopersicum',
      Wheat: 'Triticum aestivum',
      'Rice / Paddy': 'Oryza sativa',
      Cotton: 'Gossypium hirsutum',
      'Maize / Corn': 'Zea mays',
      'Chilli / Pepper': 'Capsicum annuum',
    };

    return names[crop] || '';
  };

  // -----------------------------
  // HANDLE FILE
  // -----------------------------
  const processFile = (file) => {
    setErrorMessage('');
    setResult(null);

    if (!file) return;

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        'Unsupported file format. Please upload JPG, JPEG, PNG or WEBP.'
      );

      return;
    }

    const sizeInMB =
      (file.size / (1024 * 1024)).toFixed(2);

    setImageFile(file);

    setFileName(file.name);

    setFileSize(`${sizeInMB} MB`);

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setImagePreview(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  // -----------------------------
  // FILE INPUT
  // -----------------------------
  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  // -----------------------------
  // REMOVE IMAGE
  // -----------------------------
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFileName('');
    setFileSize('');
    setResult(null);
    setErrorMessage('');
  };

  // -----------------------------
  // RUN AI PREDICTION
  // -----------------------------
  const handleDiagnosis = async () => {
    if (!imageFile) {
      setErrorMessage(
        'Please upload a crop leaf image first.'
      );

      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');
    setResult(null);

    try {
      const formData =
        new FormData();

      formData.append(
        'file',
        imageFile
      );

      console.log(
        'Sending image to:',
        `${API_URL}/predict`
      );

      console.log(
        'File:',
        imageFile.name
      );

      const response =
        await fetch(
          `${API_URL}/predict`,
          {
            method: 'POST',
            body: formData,
          }
        );

      console.log(
        'API Status:',
        response.status
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          'API Error:',
          errorText
        );

        throw new Error(
          `API request failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        'CropShield AI Result:',
        data
      );

      const rawDisease =
        data.disease ||
        'Unknown';

      const confidence =
        Number(
          data.confidence
        ) || 0;

      const readableDisease =
        formatDiseaseName(
          rawDisease
        );

      const finalResult = {
        disease:
          readableDisease,

        rawDisease:
          rawDisease,

        confidence:
          confidence,

        crop:
          selectedCrop,

        growthStage:
          growthStage,

        village:
          village ||
          'Not provided',

        district:
          district ||
          'Not provided',

        scientificName:
          getScientificName(
            selectedCrop
          ),

        image:
          imagePreview,

        modelType:
          data.type ||
          'classification',

        boxes:
          data.boxes ||
          [],
      };

      setResult(
        finalResult
      );

    } catch (error) {
      console.error(
        'Prediction error:',
        error
      );

      setErrorMessage(
        'Unable to connect to CropShield AI backend. Make sure FastAPI is running on http://127.0.0.1:8001'
      );

    } finally {
      setIsAnalyzing(false);
    }
  };

  // -----------------------------
  // CONFIDENCE LEVEL
  // -----------------------------
  const getConfidenceLevel = (
    confidence
  ) => {
    if (confidence >= 80)
      return reportText.high;

    if (confidence >= 50)
      return reportText.moderate;

    return reportText.low;
  };

  // -----------------------------
  // RETURN UI
  // -----------------------------
  return (
    <div className="disease-detection-page">

      {/* HEADER */}
      <div className="page-header-clean">

        <div className="title-area">

          <span className="sih-badge-inline">
            SIH26131 • PRECISION AGRI-VISION
          </span>

          <h1 className="page-title">
            Practical AI Crop Disease Diagnosis
          </h1>

          <p className="page-subtitle">
            Upload a crop leaf photo for AI-powered
            disease classification and agricultural
            guidance.
          </p>

        </div>

      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="notice-banner banner-danger mb-16">

          <AlertTriangle size={20} />

          <span>
            {errorMessage}
          </span>

        </div>
      )}

      {/* MAIN CARD */}
      <div className="dash-card">

        <div className="section-heading">

          <div className="title-with-icon">

            <Scan
              size={22}
              className="icon-green"
            />

            <div>

              <h2>
                AI Disease Detection
              </h2>

              <p className="sub-title-text">
                Upload a clear image of the crop leaf.
              </p>

            </div>

          </div>

        </div>

        {/* UPLOAD AREA */}
        {!imagePreview ? (

          <label
            className="upload-area"
            htmlFor="leaf-image-upload"
          >

            <UploadCloud
              size={48}
              className="icon-green"
            />

            <h3>
              Upload Crop Leaf Image
            </h3>

            <p>
              JPG, JPEG, PNG or WEBP
            </p>

            <input
              id="leaf-image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              hidden
            />

          </label>

        ) : (

          <div className="image-preview-section">

            <div className="preview-header">

              <div>

                <strong>
                  Selected crop leaf
                </strong>

                <p>
                  {fileName} ({fileSize})
                </p>

              </div>

              <button
                type="button"
                className="secondary-btn-sm"
                onClick={handleRemoveImage}
              >

                <X size={16} />

                Remove

              </button>

            </div>

            <div className="image-preview-wrapper">

              <img
                src={imagePreview}
                alt="Selected crop leaf"
                className="leaf-preview"
              />

            </div>

          </div>

        )}

        {/* FORM */}
        <div className="form-grid mt-16">

          {/* CROP */}
          <div className="form-group">

            <label>
              Crop Plant Type
            </label>

            <select
              value={selectedCrop}
              onChange={(event) =>
                setSelectedCrop(
                  event.target.value
                )
              }
            >

              {cropOptions.map(
                (crop) => (
                  <option
                    key={crop}
                    value={crop}
                  >
                    {crop}
                  </option>
                )
              )}

            </select>

          </div>

          {/* GROWTH STAGE */}
          <div className="form-group">

            <label>
              Crop Phenological Stage
            </label>

            <select
              value={growthStage}
              onChange={(event) =>
                setGrowthStage(
                  event.target.value
                )
              }
            >

              {growthOptions.map(
                (stage) => (
                  <option
                    key={stage}
                    value={stage}
                  >
                    {stage}
                  </option>
                )
              )}

            </select>

          </div>

          {/* VILLAGE */}
          <div className="form-group">

            <label>
              Village Name
            </label>

            <input
              type="text"
              placeholder="Enter village name"
              value={village}
              onChange={(event) =>
                setVillage(
                  event.target.value
                )
              }
            />

          </div>

          {/* DISTRICT */}
          <div className="form-group">

            <label>
              District
            </label>

            <input
              type="text"
              placeholder="Enter district"
              value={district}
              onChange={(event) =>
                setDistrict(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* DIAGNOSIS BUTTON */}
        <div className="action-area mt-16">

          <button
            type="button"
            className="primary-btn"
            onClick={handleDiagnosis}
            disabled={
              !imageFile ||
              isAnalyzing
            }
          >

            {isAnalyzing ? (

              <>
                <Loader2
                  size={20}
                  className="spin"
                />

                Analyzing...

              </>

            ) : (

              <>
                <Scan size={20} />

                Run Practical AI Diagnosis

              </>

            )}

          </button>

        </div>

      </div>

      {/* RESULT */}
      {result && (

        <div className="dash-card mt-16">

          <div className="section-heading">

            <div className="title-with-icon">

              <CheckCircle
                size={24}
                className="icon-green"
              />

              <div>

                <h2>
                  {reportText.resultTitle}
                </h2>

                <p className="sub-title-text">
                  {reportText.resultSubtitle}
                </p>

              </div>

            </div>

          </div>

          <div className="report-language-box">

            <Languages size={18} />

            <span>
              {reportText.reportLanguage}
            </span>

            <strong>
              {selectedLanguageName}
            </strong>

          </div>

          <div className="result-grid">

            {/* IMAGE */}
            <div className="result-image-container result-box">

              <img
                src={result.image}
                alt="Analyzed crop leaf"
                className="result-image"
              />

            </div>

            {/* RESULT DETAILS */}
            <div className="result-details">

              <div className="result-item">

                <span>
                  {reportText.crop}
                </span>

                <strong>
                  {result.crop}
                </strong>

              </div>

              <div className="result-item">

                <span>
                  {reportText.scientificName}
                </span>

                <strong>
                  {result.scientificName}
                </strong>

              </div>

              <div className="result-item result-item-highlight">

                <span>
                  {reportText.condition}
                </span>

                <strong className="disease-name">
                  {result.disease}
                </strong>

              </div>

              <div className="result-item result-item-highlight confidence-item">

                <span>
                  {reportText.confidence}
                </span>

                <strong>
                  {result.confidence.toFixed(2)}%
                </strong>

              </div>

              <div className="result-item">

                <span>
                  {reportText.confidenceLevel}
                </span>

                <strong>
                  {getConfidenceLevel(
                    result.confidence
                  )}
                </strong>

              </div>

              <div className="result-item">

                <span>
                  {reportText.modelType}
                </span>

                <strong>
                  {result.modelType}
                </strong>

              </div>

              <div className="result-item">

                <span>
                  {reportText.cropStage}
                </span>

                <strong>
                  {result.growthStage}
                </strong>

              </div>

              <div className="result-item">

                <span>
                  {reportText.location}
                </span>

                <strong>
                  {result.village}, {result.district}
                </strong>

              </div>

            </div>

          </div>

          {/* MODEL OUTPUT */}
          <div className="result-notice mt-16">

            <Leaf size={20} />

            <div>

              <strong>
                {reportText.modelOutput}
              </strong>

              <p>
                {reportText.modelOutputText}
              </p>

            </div>

          </div>

          {/* NEW SCAN */}
          <button
            type="button"
            className="secondary-btn-sm mt-16"
            onClick={handleRemoveImage}
          >

            <RefreshCw size={16} />

            {reportText.newScan}

          </button>

        </div>
      )}

      {/* FOOTER INFO */}
      <div className="dash-card mt-16">

        <div className="title-with-icon">

          <Leaf
            size={20}
            className="icon-green"
          />

          <div>

            <h3>
              CropShield AI
            </h3>

            <p className="sub-title-text">
              SIH 2026 • Problem Statement SIH26131
            </p>

          </div>

        </div>

        <p className="mt-12">
          AI-powered crop health diagnostic platform
          designed for early disease identification.
          AI screening results should be confirmed with
          appropriate agricultural expertise before
          important treatment decisions.
        </p>

      </div>

    </div>
  );
}