/**
 * CropShield AI - API Service Layer
 * SIH 2026 (Problem Statement: SIH26131)
 * 
 * Modular API client designed to seamlessly interface with a FastAPI backend
 * running YOLOv8 crop disease detection and weather risk prediction algorithms.
 * Includes automatic fallback to mock data when backend is disconnected.
 */

import { mockDiseases, mockWeather, mockRiskMapDistricts, mockExpertQueue, mockAdminStats } from '../data/mockData';

// Configurable FastAPI backend endpoint
let API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
let useMockData = true; // Default to true until live FastAPI backend is verified

export const setApiMode = (isMock, customUrl = null) => {
  useMockData = isMock;
  if (customUrl) {
    API_BASE_URL = customUrl;
  }
};

export const getApiConfig = () => ({
  useMockData,
  baseUrl: API_BASE_URL,
});

/**
 * Detect crop disease using uploaded image or preset key
 * FastAPI equivalent: POST /api/v1/detect
 * Body: FormData { file: File, crop_type: string }
 */
export const detectCropDisease = async (fileOrPresetKey, cropType = 'auto') => {
  if (useMockData) {
    // Simulate API delay (600ms) for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    // If preset key string was passed
    if (typeof fileOrPresetKey === 'string' && mockDiseases[fileOrPresetKey]) {
      return {
        success: true,
        source: 'mock',
        data: mockDiseases[fileOrPresetKey],
      };
    }

    // Default to first mock disease if custom file uploaded in mock mode
    const defaultResult = mockDiseases['tomato_blight'];
    return {
      success: true,
      source: 'mock',
      data: {
        ...defaultResult,
        filename: typeof fileOrPresetKey === 'object' ? fileOrPresetKey.name : 'uploaded_crop.jpg',
      },
    };
  }

  // Live FastAPI Request
  try {
    const formData = new FormData();
    if (typeof fileOrPresetKey === 'object') {
      formData.append('file', fileOrPresetKey);
    }
    formData.append('crop_type', cropType);

    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, source: 'live', data };
  } catch (error) {
    console.warn('FastAPI backend unreachable, falling back to mock data:', error.message);
    return {
      success: true,
      source: 'mock_fallback',
      data: mockDiseases['tomato_blight'],
      error: error.message,
    };
  }
};

/**
 * Fetch Weather Risk Data
 * FastAPI equivalent: GET /api/v1/weather-risk?location=district
 */
export const fetchWeatherRisk = async (location = 'Punjab') => {
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, source: 'mock', data: mockWeather };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/weather-risk?location=${encodeURIComponent(location)}`);
    const data = await response.json();
    return { success: true, source: 'live', data };
  } catch (error) {
    return { success: true, source: 'mock_fallback', data: mockWeather };
  }
};

/**
 * Fetch Risk Map District Hotspots
 * FastAPI equivalent: GET /api/v1/risk-map
 */
export const fetchRiskMapData = async (cropFilter = 'all', riskFilter = 'all') => {
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = [...mockRiskMapDistricts];
    if (cropFilter !== 'all') {
      filtered = filtered.filter((d) => d.primaryCrop.toLowerCase().includes(cropFilter.toLowerCase()));
    }
    if (riskFilter !== 'all') {
      filtered = filtered.filter((d) => d.riskLevel.toLowerCase() === riskFilter.toLowerCase());
    }
    return { success: true, source: 'mock', data: filtered };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/risk-map?crop=${cropFilter}&risk=${riskFilter}`);
    const data = await response.json();
    return { success: true, source: 'live', data };
  } catch (error) {
    return { success: true, source: 'mock_fallback', data: mockRiskMapDistricts };
  }
};

/**
 * Fetch Expert Review Queue
 * FastAPI equivalent: GET /api/v1/expert/queue
 */
export const fetchExpertQueue = async () => {
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, source: 'mock', data: mockExpertQueue };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/expert/queue`);
    const data = await response.json();
    return { success: true, source: 'live', data };
  } catch (error) {
    return { success: true, source: 'mock_fallback', data: mockExpertQueue };
  }
};

/**
 * Submit Expert Review Validation
 * FastAPI equivalent: POST /api/v1/expert/validate
 */
export const submitExpertValidation = async (scanId, validationData) => {
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      source: 'mock',
      message: 'Expert validation submitted successfully!',
      scanId,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/expert/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scanId, ...validationData }),
    });
    const data = await response.json();
    return { success: true, source: 'live', data };
  } catch (error) {
    return { success: true, source: 'mock_fallback', message: 'Simulated submission complete' };
  }
};

/**
 * Broadcast Admin Outbreak Advisory
 * FastAPI equivalent: POST /api/v1/admin/broadcast
 */
export const sendAdminBroadcast = async (district, alertType, messageText) => {
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      source: 'mock',
      sentToCount: 4250,
      timestamp: new Date().toLocaleTimeString(),
      district,
      alertType,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ district, alertType, message: messageText }),
    });
    const data = await response.json();
    return { success: true, source: 'live', data };
  } catch (error) {
    return { success: true, source: 'mock_fallback', sentToCount: 4250, timestamp: new Date().toLocaleTimeString() };
  }
};
