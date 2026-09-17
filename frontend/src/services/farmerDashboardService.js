/**
 * CropShield AI - Farmer Dashboard Service Layer
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Provides clean asynchronous data access for:
 * - cropHealth
 * - riskSummary (integrated with CropRiskEngine)
 * - cropScans
 * - cropHistory
 * - alerts
 * 
 * Backed by localStorage state and cleanly decoupled to easily swap with Flask / FastAPI endpoints.
 */

import {
  mockCropHealth,
  mockRiskSummary,
  mockCropScans,
  mockCropHealthHistory,
  mockAlerts,
} from '../data/farmerData.js';
import { mockWeather } from '../data/mockData.js';
import { getStoredScans } from '../utils/scanHistory.js';
import { calculateCropRisk } from './cropRiskEngine.js';

const ALERTS_STORAGE_KEY = 'cropshield_farmer_alerts';

/**
 * Get comprehensive crop health status
 */
export const getCropHealth = (userCrop = 'Tomato', userStage = 'Fruiting', latestScan = null) => {
  if (latestScan) {
    const isHealthy = (latestScan.disease || '').toLowerCase().includes('healthy');
    const conf = Number(latestScan.confidence) || 82;
    const score = isHealthy ? Math.min(98, Math.max(88, conf)) : Math.max(45, Math.min(85, Math.round(100 - conf * 0.4)));
    const status = score >= 80 ? 'Good' : score >= 60 ? 'Moderate' : 'Critical';

    return {
      crop: latestScan.crop || userCrop,
      stage: userStage || 'Fruiting',
      healthStatus: status,
      healthPercentage: score,
      lastScanDate: latestScan.dateFormatted || latestScan.date || 'Today',
      latestDisease: latestScan.disease || 'Healthy Field',
    };
  }

  return {
    ...mockCropHealth,
    crop: userCrop || mockCropHealth.crop,
    stage: userStage || mockCropHealth.stage,
  };
};

/**
 * Get 4-pillar risk summary using the Crop Risk Engine
 */
export const getRiskSummary = (
  crop = 'Tomato',
  district = 'Guntur',
  stage = 'Fruiting',
  latestScan = null,
  weatherData = null
) => {
  const previousScans = getStoredScans();
  const effectiveScan = latestScan || (previousScans.length > 0 ? previousScans[0] : null);

  const currentWeather = weatherData || mockWeather.current || {
    temp: 29.4,
    humidity: 86,
    windSpeed: 14.5,
    condition: 'Overcast & High Moisture',
    rainfall: 0,
  };

  return calculateCropRisk({
    disease: effectiveScan ? effectiveScan.disease : 'Tomato - Early Blight',
    confidence: effectiveScan ? Number(effectiveScan.confidence) || 88 : 88,
    severity: effectiveScan ? effectiveScan.severity || 'Moderate' : 'Moderate',
    crop: crop || (effectiveScan ? effectiveScan.crop : 'Tomato'),
    cropStage: stage || 'Fruiting',
    location: { district, state: 'Andhra Pradesh' },
    weather: currentWeather,
    previousScans,
    pestInfo: {
      detectedPest: 'Whiteflies',
      pestCountLevel: 'Low',
    },
  });
};

/**
 * Get recent crop scans (aggregates real saved scans + historical records)
 */
export const getRecentCropScans = () => {
  const realScans = getStoredScans();
  
  if (realScans && realScans.length > 0) {
    const formattedRealScans = realScans.map((s, idx) => {
      const isHealthy = (s.disease || '').toLowerCase().includes('healthy');
      const conf = Number(s.confidence) || 90;
      return {
        id: s.id || `SCAN-USER-${idx}`,
        date: s.dateFormatted || s.date || 'Today',
        time: s.timeFormatted || '09:00 AM',
        crop: s.crop || 'Tomato',
        disease: s.disease || 'Undiagnosed',
        confidence: `${conf}%`,
        severity: s.severity || (isHealthy ? 'None' : conf > 85 ? 'Moderate' : 'Mild'),
        risk: s.risk || (isHealthy ? 'Low' : conf > 85 ? 'Medium' : 'Low'),
        affectedArea: s.affectedArea || (isHealthy ? '0%' : '20% - 30%'),
        recommendedAction: s.recommendedAction || '',
        image: s.image || null,
        field: s.village || 'Field 1',
        isExpertVerified: !!s.isExpertVerified,
        status: s.status || (s.isExpertVerified ? 'Verified by Expert' : (conf < 70 ? 'Pending Review' : 'AI Verified')),
        expertVerification: s.expertVerification || null,
        isLowConfidence: !!s.isLowConfidence || conf < 70,
      };
    });

    // Merge real scans with mock scans avoiding duplicate IDs
    const realIds = new Set(formattedRealScans.map((r) => r.id));
    const extraMock = mockCropScans.filter((m) => !realIds.has(m.id));
    return [...formattedRealScans, ...extraMock];
  }

  return [...mockCropScans];
};

/**
 * Get crop health trend history (Date -> Health Score)
 */
export const getCropHealthHistory = (crop = 'Tomato') => {
  const realScans = getStoredScans();
  if (realScans && realScans.length >= 2) {
    const sorted = [...realScans].reverse();
    return sorted.slice(-6).map((s) => {
      const isHealthy = (s.disease || '').toLowerCase().includes('healthy');
      const conf = Number(s.confidence) || 82;
      const score = isHealthy ? Math.min(98, Math.max(88, conf)) : Math.max(45, Math.min(85, Math.round(100 - conf * 0.4)));
      return {
        date: (s.dateFormatted || s.date || 'Today').replace(/ \d{4}$/, ''),
        score,
        stage: s.growthStage || 'Vegetative',
      };
    });
  }
  return [...mockCropHealthHistory];
};

/**
 * Get alerts from localStorage or fallback to mockAlerts
 */
export const getFarmerAlerts = () => {
  try {
    const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read alerts from storage', e);
  }
  return [...mockAlerts];
};

/**
 * Mark a specific alert as read / unread toggle
 */
export const toggleAlertReadStatus = (alertId) => {
  const current = getFarmerAlerts();
  const updated = current.map((a) => (a.id === alertId ? { ...a, read: !a.read } : a));
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
};

/**
 * Mark all alerts as read
 */
export const markAllAlertsAsRead = () => {
  const current = getFarmerAlerts();
  const updated = current.map((a) => ({ ...a, read: true }));
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
};
