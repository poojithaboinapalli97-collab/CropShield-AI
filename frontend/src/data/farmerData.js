/**
 * CropShield AI - Farmer Dashboard Data Models & Mock Datasets
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Cleanly decoupled data structures for Crop Health, Risk Summary, Recent Scans,
 * Health History Trends, and Field Alerts.
 */

// 1. Crop Health Mock Baseline
export const mockCropHealth = {
  crop: 'Tomato',
  stage: 'Fruiting',
  healthStatus: 'Good',
  healthPercentage: 82,
  lastScanDate: '16 Sep 2026',
  latestDisease: 'Early Blight',
};

// 2. 4-Pillar Risk Summary (Disease, Pest, Weather, Overall)
export const mockRiskSummary = {
  diseaseRisk: 'Medium',
  pestRisk: 'Low',
  weatherRisk: 'Medium',
  overallRisk: 'Medium',
  details: {
    diseaseReason: 'Warm humid night dew favoring Alternaria spore activity',
    pestReason: 'Low sucking pest threshold detected in sector A',
    weatherReason: '86% relative humidity with light morning precipitation chance',
    overallReason: 'Manageable with targeted morning spray & drip irrigation',
  },
};

// 3. Recent Crop Scans History
export const mockCropScans = [
  {
    id: 'SCAN-1094',
    date: '16 Sep 2026',
    time: '08:45 AM',
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: '91%',
    severity: 'Moderate',
    risk: 'Medium',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=400&q=80',
    field: 'North Plot A',
  },
  {
    id: 'SCAN-1082',
    date: '14 Sep 2026',
    time: '07:15 AM',
    crop: 'Tomato',
    disease: 'Healthy Foliage',
    confidence: '95%',
    severity: 'None',
    risk: 'Low',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=400&q=80',
    field: 'South Block 2',
  },
  {
    id: 'SCAN-1065',
    date: '12 Sep 2026',
    time: '09:30 AM',
    crop: 'Chilli',
    disease: 'Leaf Curl Virus',
    confidence: '88%',
    severity: 'Mild',
    risk: 'Medium',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=400&q=80',
    field: 'East Plot C',
  },
  {
    id: 'SCAN-1049',
    date: '10 Sep 2026',
    time: '06:50 AM',
    crop: 'Tomato',
    disease: 'Bacterial Spot',
    confidence: '84%',
    severity: 'Moderate',
    risk: 'Medium',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=400&q=80',
    field: 'North Plot A',
  },
  {
    id: 'SCAN-1031',
    date: '08 Sep 2026',
    time: '10:10 AM',
    crop: 'Cotton',
    disease: 'Healthy Crop',
    confidence: '96%',
    severity: 'None',
    risk: 'Low',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80',
    field: 'West Field 1',
  },
];

// 4. Crop Health History (Date -> Crop Health Score)
export const mockCropHealthHistory = [
  { date: '10 Sep', score: 76, stage: 'Vegetative' },
  { date: '12 Sep', score: 79, stage: 'Flowering' },
  { date: '14 Sep', score: 81, stage: 'Early Fruit' },
  { date: '16 Sep', score: 82, stage: 'Fruiting' },
];

// 5. Recent Alerts
export const mockAlerts = [
  {
    id: 'ALT-301',
    type: 'warning',
    icon: '⚠️',
    title: 'Disease Risk Increased',
    message: 'Disease risk increased: Tomato Early Blight spore count rising in Guntur district cluster.',
    dateTime: '16 Sep 2026, 08:30 AM',
    read: false,
    severity: 'High',
  },
  {
    id: 'ALT-302',
    type: 'weather',
    icon: '🌧️',
    title: 'High Humidity Window',
    message: 'Weather conditions may favor disease development: RH 86% with persistent morning fog.',
    dateTime: '15 Sep 2026, 06:15 PM',
    read: false,
    severity: 'Medium',
  },
  {
    id: 'ALT-303',
    type: 'expert',
    icon: '🧑‍🌾',
    title: 'Expert Validation Completed',
    message: 'Expert validation completed: Dr. K. Ramanjaneyulu (KVK Lam Farm) verified prescription.',
    dateTime: '14 Sep 2026, 11:00 AM',
    read: true,
    severity: 'Low',
  },
  {
    id: 'ALT-304',
    type: 'inspection',
    icon: '🌱',
    title: 'Crop Inspection Recommended',
    message: 'Crop inspection recommended: Scout lower foliage undersides for whitefly vectors before 10 AM.',
    dateTime: '13 Sep 2026, 09:45 AM',
    read: true,
    severity: 'Low',
  },
];
