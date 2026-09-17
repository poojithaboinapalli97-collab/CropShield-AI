/**
 * CropShield AI - Early-Warning System Service
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Analyzes real-time or simulated meteorological telemetry, crop phenology,
 * and pathogen history to generate actionable, prioritized early-warning alerts:
 * 
 * Alerts Generated:
 * 1. High disease-risk weather conditions
 * 2. Heavy rainfall & waterlogging risk
 * 3. High humidity & prolonged leaf wetness
 * 4. Sudden weather changes & spray drift warnings
 * 5. Crop inspection & scouting recommendations
 */

import { evaluateWeatherRisk } from './cropRiskEngine.js';
import { getFarmerAlerts } from './farmerDashboardService.js';

/**
 * Generate Dynamic Early-Warning Alerts based on agronomic inputs
 * 
 * @param {object} params
 * @param {object} params.weather - Current weather telemetry {temp, humidity, rainfall, windSpeed, condition}
 * @param {string} [params.crop] - Crop Name (e.g. 'Tomato')
 * @param {string} [params.stage] - Phenological Stage (e.g. 'Flowering')
 * @param {object} [params.latestScan] - Most recent leaf diagnosis record
 * @param {string} [params.district] - District Name (e.g. 'Guntur')
 * @returns {Array<object>} Array of early-warning alerts
 */
export const generateEarlyWarnings = ({
  weather = {},
  crop = 'Tomato',
  stage = 'Fruiting',
  latestScan = null,
  district = 'Guntur',
} = {}) => {
  const alerts = [];
  const now = new Date();
  const dateFormatted = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  const temp = Number(weather.temp ?? 28);
  const humidity = Number(weather.humidity ?? 75);
  const rainfall = Number(weather.rainfall ?? 0);
  const wind = Number(weather.windSpeed ?? 10);
  const condition = (weather.condition || '').toLowerCase();

  const isDiseased = latestScan && !(latestScan.disease || '').toLowerCase().includes('healthy');
  const diseaseName = latestScan ? latestScan.disease : 'Foliar Blight';

  // 1. High Disease-Risk Weather Conditions Alert
  if (humidity >= 80 && temp >= 20 && temp <= 30) {
    alerts.push({
      id: 'EW-DIS-RISK',
      type: 'disease',
      severity: 'High',
      icon: '🍄',
      title: 'High Disease-Risk Weather Conditions',
      message: `Prolonged leaf wetness with ${humidity}% humidity at ${temp}°C creates optimal microclimate for spore incubation in ${district}.`,
      action: `Apply preventive bio-fungicide (Trichoderma / Copper Oxychloride) during early morning hours.`,
      dateTime: dateFormatted,
      read: false,
    });
  }

  // 2. Heavy Rainfall / Splash Dispersal Alert
  if (rainfall > 5 || condition.includes('rain') || condition.includes('thunder') || condition.includes('shower')) {
    alerts.push({
      id: 'EW-HEAVY-RAIN',
      type: 'rain',
      severity: rainfall > 15 ? 'High' : 'Medium',
      icon: '🌧️',
      title: 'Heavy Rainfall & Waterlogging Alert',
      message: `Precipitation (${rainfall} mm / ${weather.condition || 'Rain'}) increases risk of bacterial splash dispersal and root waterlogging.`,
      action: 'Ensure field drainage trenches are clear; pause all chemical foliar spray applications until leaves dry.',
      dateTime: dateFormatted,
      read: false,
    });
  }

  // 3. High Humidity Alert
  if (humidity >= 85 && !alerts.some((a) => a.id === 'EW-DIS-RISK')) {
    alerts.push({
      id: 'EW-HIGH-HUMID',
      type: 'humidity',
      severity: 'Medium',
      icon: '💧',
      title: 'High Humidity Window',
      message: `Atmospheric moisture is high (${humidity}% RH). High moisture retention on foliage accelerates mildew and rot pathogens.`,
      action: 'Avoid overhead sprinkler watering; switch to drip irrigation to keep canopy dry.',
      dateTime: dateFormatted,
      read: false,
    });
  }

  // 4. Sudden Weather Changes / High Wind Drift Alert
  if (wind >= 16 || temp > 35) {
    alerts.push({
      id: 'EW-WEATHER-CHANGE',
      type: 'sudden_change',
      severity: 'Medium',
      icon: '💨',
      title: 'Sudden Weather & Spray Drift Warning',
      message: `Wind gusts (${wind} km/h) and thermal stress (${temp}°C) risk severe spray drift and accelerated sucking pest mobility.`,
      action: 'Suspend foliar spraying during midday wind peaks; resume during calm morning window (06:00 AM – 09:30 AM).',
      dateTime: dateFormatted,
      read: false,
    });
  }

  // 5. Crop Inspection & Scouting Recommendation
  if (isDiseased || stage.toLowerCase().includes('flower') || stage.toLowerCase().includes('fruit') || stage.toLowerCase().includes('seedling')) {
    alerts.push({
      id: 'EW-SCOUT-REC',
      type: 'inspection',
      severity: isDiseased ? 'High' : 'Low',
      icon: '🔍',
      title: 'Crop Inspection Recommended',
      message: isDiseased
        ? `Active ${diseaseName} diagnosed in field. Inspect surrounding 5-meter radius for secondary lesion spread.`
        : `Crop is in critical ${stage} stage. Scout lower canopy undersides for early signs of yellowing or vector pests.`,
      action: 'Conduct morning field walk and upload new leaf photo if new spots appear.',
      dateTime: dateFormatted,
      read: false,
    });
  }

  return alerts;
};

/**
 * Combines dynamic early warnings with stored farmer notifications
 */
export const getAggregatedEarlyWarnings = ({
  weather = {},
  crop = 'Tomato',
  stage = 'Fruiting',
  latestScan = null,
  district = 'Guntur',
} = {}) => {
  const dynamicWarnings = generateEarlyWarnings({ weather, crop, stage, latestScan, district });
  const storedAlerts = getFarmerAlerts();

  // Merge unique by ID
  const dynamicIds = new Set(dynamicWarnings.map((d) => d.id));
  const filteredStored = storedAlerts.filter((s) => !dynamicIds.has(s.id));

  return [...dynamicWarnings, ...filteredStored];
};
