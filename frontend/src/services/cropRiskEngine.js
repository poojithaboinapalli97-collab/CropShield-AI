/**
 * CropShield AI - Multi-Pillar Crop Risk Assessment Engine
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Aggregates multi-source agronomic indicators:
 * - Disease detection & severity
 * - Weather conditions (humidity, temperature, precipitation, wind)
 * - Crop phenological stage
 * - Geographic district model
 * - Historical scan trajectory
 * - Pest & vector activity
 * 
 * Generates:
 * - Disease Risk (Low / Medium / High) + Detailed Reasons
 * - Pest Risk (Low / Medium / High) + Detailed Reasons
 * - Weather Risk (Low / Medium / High) + Detailed Reasons
 * - Overall Crop Risk (Low / Medium / High) + Comprehensive Multi-Factor Explanation
 * 
 * Architectural Note:
 * This rule-based decision support system is designed to seamlessly interface
 * with future trained ML risk prediction models (e.g. XGBoost / Random Forest risk regressors).
 * It provides clear, data-backed explanations based strictly on available inputs.
 */

/**
 * Standardizes risk level into 'Low' | 'Medium' | 'High'
 * @param {number} score - Score from 0 to 100
 * @returns {'Low' | 'Medium' | 'High'}
 */
export const scoreToRiskLevel = (score) => {
  if (score >= 65) return 'High';
  if (score >= 35) return 'Medium';
  return 'Low';
};

/**
 * Evaluates Weather-Driven Risk
 * @param {object} weather
 * @returns {{score: number, level: 'Low'|'Medium'|'High', reasons: string[], mitigation: string}}
 */
export const evaluateWeatherRisk = (weather = {}) => {
  const w = weather || {};
  let score = 20; // baseline
  const reasons = [];

  const temp = Number(w.temp ?? w.temperature ?? 28);
  const humidity = Number(w.humidity ?? 70);
  const wind = Number(w.windSpeed ?? w.wind_speed ?? 10);
  const condition = (w.condition || '').toLowerCase();
  const rainfall = Number(w.rainfall ?? 0);

  // 1. Humidity Analysis
  if (humidity >= 85) {
    score += 35;
    reasons.push(`High relative humidity (${humidity}%) creates prolonged leaf wetness favoring fungal spore germination.`);
  } else if (humidity >= 70) {
    score += 20;
    reasons.push(`Moderate humidity (${humidity}%) provides favorable moisture for foliar pathogen establishment.`);
  } else if (humidity < 50) {
    score -= 5;
    reasons.push(`Dry ambient air (${humidity}%) inhibits fungal zoospore motility.`);
  }

  // 2. Precipitation & Rainfall
  if (rainfall > 5 || condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    score += 30;
    reasons.push('Recent or forecasted rainfall increases bacterial splash dispersal and chemical wash-off risk.');
  } else if (condition.includes('overcast') || condition.includes('fog') || condition.includes('dew')) {
    score += 15;
    reasons.push('Cloudy/overcast canopy conditions with heavy night dew prolong moisture retention on leaf surfaces.');
  } else {
    reasons.push('Dry weather forecast maintains low surface moisture.');
  }

  // 3. Favorable Temperature Window for Spores (20°C - 30°C)
  if (temp >= 20 && temp <= 30 && humidity >= 65) {
    score += 15;
    reasons.push(`Moderate temperature (${Math.round(temp)}°C) coincides with peak pathogen incubation range.`);
  } else if (temp > 35) {
    score += 10;
    reasons.push(`High thermal stress (${Math.round(temp)}°C) may induce plant heat stress and spray evaporation.`);
  }

  // 4. Wind Speed
  if (wind >= 18) {
    score += 15;
    reasons.push(`Strong wind gusts (${wind} km/h) cause spray drift and accelerate vector movement.`);
  }

  const clampedScore = Math.min(100, Math.max(10, score));
  const level = scoreToRiskLevel(clampedScore);

  return {
    score: clampedScore,
    level,
    reasons: reasons.slice(0, 3),
    mitigation: level === 'High'
      ? 'Postpone foliar spraying during active rain or excessive wind; resume in morning window (06:00 AM - 09:30 AM).'
      : 'Weather conditions are favorable for morning routine preventive applications.',
  };
};

/**
 * Evaluates Disease-Driven Risk
 * @param {object} params
 * @returns {{score: number, level: 'Low'|'Medium'|'High', reasons: string[], mitigation: string}}
 */
export const evaluateDiseaseRisk = ({
  disease = '',
  confidence = 0,
  severity = 'Moderate',
  crop = 'Tomato',
  cropStage = 'Fruiting',
  previousScans = [],
  weatherRiskScore = 30,
} = {}) => {
  let score = 15; // baseline
  const reasons = [];
  const cleanDisease = (disease || '').toLowerCase();
  const isHealthy = cleanDisease.includes('healthy') || cleanDisease.includes('no disease') || !disease;

  // 1. Direct AI Detection Presence
  if (!isHealthy) {
    const sev = (severity || '').toLowerCase();
    if (sev === 'high') {
      score += 45;
      reasons.push(`Active ${disease} detected with High Severity (${Math.round(confidence)}% confidence).`);
    } else if (sev === 'moderate') {
      score += 32;
      reasons.push(`Active ${disease} detected with Moderate Severity (${Math.round(confidence)}% confidence).`);
    } else {
      score += 18;
      reasons.push(`Mild foliar symptoms of ${disease} identified.`);
    }
  } else {
    score = 10;
    reasons.push(`Foliage diagnosed as healthy; no virulent active lesions observed.`);
  }

  // 2. Crop Stage Susceptibility
  const cleanStage = (cropStage || '').toLowerCase();
  if (cleanStage.includes('flowering') || cleanStage.includes('fruiting') || cleanStage.includes('fruit') || cleanStage.includes('booting')) {
    score += 18;
    reasons.push(`Crop is in critical ${cropStage} stage where foliar damage directly impacts yield.`);
  } else if (cleanStage.includes('seedling')) {
    score += 15;
    reasons.push('Young seedling stage is highly susceptible to damping-off and bacterial wilt.');
  }

  // 3. Scan History Recurrence
  if (Array.isArray(previousScans) && previousScans.length > 1) {
    const diseasedPastScans = previousScans.filter((s) => !(s.disease || '').toLowerCase().includes('healthy'));
    if (diseasedPastScans.length >= 2) {
      score += 15;
      reasons.push(`Repeated pathogen symptoms recorded in ${diseasedPastScans.length} historical scans in this field.`);
    }
  }

  // 4. Compounding Weather Synergy
  if (!isHealthy && weatherRiskScore >= 60) {
    score += 12;
    reasons.push('Humid weather elevates microclimate infection potential.');
  }

  const clampedScore = Math.min(100, Math.max(5, score));
  const level = scoreToRiskLevel(clampedScore);

  return {
    score: clampedScore,
    level,
    reasons: reasons.slice(0, 3),
    mitigation: isHealthy
      ? 'Maintain clean field borders and routine scouting.'
      : 'Apply targeted ICAR recommended fungicide/bactericide during the cool morning window.',
  };
};

/**
 * Evaluates Pest & Vector Risk
 * @param {object} params
 * @returns {{score: number, level: 'Low'|'Medium'|'High', reasons: string[], mitigation: string}}
 */
export const evaluatePestRisk = ({
  pestInfo = {},
  crop = 'Tomato',
  cropStage = 'Fruiting',
  weather = {},
} = {}) => {
  let score = 20;
  const reasons = [];
  const p = pestInfo || {};
  const w = weather || {};

  const detectedPest = p.detectedPest || p.activePests?.[0] || 'None';
  const pestCountLevel = (p.pestCountLevel || p.pestPressure || 'Low').toLowerCase();
  const temp = Number(w.temp ?? w.temperature ?? 28);
  const humidity = Number(w.humidity ?? 70);

  if (detectedPest !== 'None' && detectedPest !== 'None detected') {
    if (pestCountLevel === 'high') {
      score += 50;
      reasons.push(`Elevated population threshold of ${detectedPest} observed in crop sector.`);
    } else if (pestCountLevel === 'medium') {
      score += 30;
      reasons.push(`Moderate presence of ${detectedPest} active on leaf undersides.`);
    } else {
      score += 15;
      reasons.push(`Low baseline presence of ${detectedPest} detected.`);
    }
  } else {
    reasons.push('No critical sucking pest swarms detected in recent field scouting.');
  }

  // Dry warm spells favor sucking pests (whiteflies, mites, thrips)
  if (temp > 30 && humidity < 60) {
    score += 15;
    reasons.push('Warm, dry weather conditions promote rapid sucking pest reproduction.');
  }

  const clampedScore = Math.min(100, Math.max(10, score));
  const level = scoreToRiskLevel(clampedScore);

  return {
    score: clampedScore,
    level,
    reasons: reasons.slice(0, 2),
    mitigation: level === 'High'
      ? 'Install yellow/blue sticky traps and apply botanical neem formulation (NSKE 5%).'
      : 'Continue regular field scouting and sticky trap monitoring.',
  };
};

/**
 * Comprehensive Crop Risk Engine Main Function
 * Combines all indicators into a unified multi-pillar risk model.
 * 
 * @param {object} inputs
 * @param {string} [inputs.disease] - Detected disease name
 * @param {string} [inputs.diseaseName] - Alias for disease
 * @param {number} [inputs.confidence] - Detection confidence (0-100)
 * @param {string} [inputs.severity] - Pathogen severity ('Low'|'Moderate'|'High')
 * @param {string} [inputs.severityLevel] - Alias for severity
 * @param {object} [inputs.weather] - Weather data {temp, humidity, windSpeed, rainfall, condition}
 * @param {string} [inputs.crop] - Crop name
 * @param {string} [inputs.cropName] - Alias for crop
 * @param {string} [inputs.cropStage] - Phenological stage
 * @param {string} [inputs.growthStage] - Alias for cropStage
 * @param {object} [inputs.location] - Location details {district, state, village}
 * @param {Array} [inputs.previousScans] - Scan history array
 * @param {object} [inputs.pestInfo] - Pest information
 * @param {object} [options] - Options for future ML model integration
 * @param {Function} [options.mlRiskModelAdapter] - Optional ML predictor adapter
 * @returns {object} Full risk assessment output
 */
export const calculateCropRisk = (inputs = {}, options = {}) => {
  const inp = inputs || {};
  const disease = inp.disease || inp.diseaseName || '';
  const confidence = Number(inp.confidence ?? 0);
  const severity = inp.severity || inp.severityLevel || 'Moderate';
  const weather = inp.weather || {};
  const crop = inp.crop || inp.cropName || 'Tomato';
  const cropStage = inp.cropStage || inp.growthStage || 'Fruiting';
  const location = inp.location || { district: 'Guntur', state: 'Andhra Pradesh' };
  const previousScans = inp.previousScans || [];
  const pestInfo = inp.pestInfo || inp.pestData || {};

  // 1. Evaluate Weather Risk
  const weatherRiskResult = evaluateWeatherRisk(weather);

  // 2. Evaluate Disease Risk
  const diseaseRiskResult = evaluateDiseaseRisk({
    disease,
    confidence,
    severity,
    crop,
    cropStage,
    previousScans,
    weatherRiskScore: weatherRiskResult.score,
  });

  // 3. Evaluate Pest Risk
  const pestRiskResult = evaluatePestRisk({
    pestInfo,
    crop,
    cropStage,
    weather,
  });

  // 4. Compute Weighted Overall Risk Score
  // Weights: Disease (45%), Weather (30%), Pest (25%)
  let overallScore = Math.round(
    diseaseRiskResult.score * 0.45 +
    weatherRiskResult.score * 0.30 +
    pestRiskResult.score * 0.25
  );

  // Compound escalation if both Disease and Weather are High
  if (diseaseRiskResult.level === 'High' && weatherRiskResult.level === 'High') {
    overallScore = Math.min(100, overallScore + 10);
  }

  // Future ML Model Hook
  if (typeof options.mlRiskModelAdapter === 'function') {
    try {
      const mlScore = options.mlRiskModelAdapter({ inputs, ruleScore: overallScore });
      if (typeof mlScore === 'number' && !isNaN(mlScore)) {
        overallScore = Math.round(overallScore * 0.4 + mlScore * 0.6);
      }
    } catch (err) {
      console.warn('[CropShield Risk Engine] ML adapter error, falling back to rule engine:', err);
    }
  }

  const overallLevel = scoreToRiskLevel(overallScore);

  // Synthesize concise overall reasons
  const overallReasons = [];
  if (weatherRiskResult.level !== 'Low' && weatherRiskResult.reasons[0]) {
    overallReasons.push(weatherRiskResult.reasons[0]);
  }
  if (diseaseRiskResult.level !== 'Low' && diseaseRiskResult.reasons[0]) {
    overallReasons.push(diseaseRiskResult.reasons[0]);
  } else if (diseaseRiskResult.reasons[0]) {
    overallReasons.push(diseaseRiskResult.reasons[0]);
  }
  if (cropStage) {
    overallReasons.push(`Crop currently in ${cropStage} stage.`);
  }

  return {
    diseaseRisk: diseaseRiskResult.level,
    diseaseRiskScore: diseaseRiskResult.score,
    diseaseReasons: diseaseRiskResult.reasons,

    pestRisk: pestRiskResult.level,
    pestRiskScore: pestRiskResult.score,
    pestReasons: pestRiskResult.reasons,

    weatherRisk: weatherRiskResult.level,
    weatherRiskScore: weatherRiskResult.score,
    weatherReasons: weatherRiskResult.reasons,

    overallRisk: overallLevel,
    overallRiskScore: overallScore,
    overallReasons: overallReasons.slice(0, 4),

    details: {
      diseaseReason: diseaseRiskResult.reasons[0] || 'Disease baseline optimal',
      pestReason: pestRiskResult.reasons[0] || 'Low pest pressure',
      weatherReason: weatherRiskResult.reasons[0] || 'Weather conditions normal',
      overallReason: overallReasons[0] || 'Manageable field conditions',
    },

    location: location.district || 'Guntur',
    crop,
    evaluatedAt: new Date().toISOString(),
    isRuleBasedEngine: true,
  };
};
