/**
 * CropShield AI - Pathogen Severity & Risk Assessment Engine
 * 
 * Computes disease severity (Low, Moderate, High), affected foliar area percentage,
 * and regional risk tier.
 * 
 * Logic Architecture:
 * 1. Region-based calculation: If model or detection bounding boxes / segmentation masks
 *    are present, computes spatial leaf coverage ratio.
 * 2. Rule-based fallback: For classification-only outputs, maps known pathogen virulence,
 *    etiology, and model confidence into standardized Low/Moderate/High severity tiers.
 * 3. Future-proof interface: Cleanly decoupled for easy replacement with dedicated
 *    YOLOv8-Seg leaf lesion segmentation models in upcoming phases.
 */

// Known high-virulence crop pathogens requiring aggressive intervention
const HIGH_SEVERITY_PATHOGENS = [
  'late blight',
  'blast',
  'bacterial blight',
  'leaf curl virus',
  'mosaic virus',
  'black rot',
  'yellow rust',
  'stripe rust',
  'anthracnose',
];

// Moderate virulence pathogens with progressive chlorosis / foliar spotting
const MODERATE_SEVERITY_PATHOGENS = [
  'early blight',
  'leaf mold',
  'septoria',
  'bacterial spot',
  'spider mites',
  'common rust',
  'northern leaf blight',
  'scab',
];

/**
 * Calculates severity, affected area %, and risk tier.
 * @param {object} params
 * @param {string} params.disease - Detected disease string
 * @param {number} params.confidence - Model confidence score (0 - 100)
 * @param {string} params.crop - Crop name
 * @param {Array} [params.boundingBoxes] - Optional bounding boxes [{x, y, width, height}, ...]
 * @param {number} [params.imageWidth] - Optional image width
 * @param {number} [params.imageHeight] - Optional image height
 * @returns {{severity: 'Low' | 'Moderate' | 'High', risk: 'Low' | 'Medium' | 'High', affectedArea: string, method: string, description: string}}
 */
export const calculateDiseaseSeverity = ({
  disease = '',
  confidence = 0,
  crop = 'Crop',
  boundingBoxes = [],
  imageWidth = 100,
  imageHeight = 100,
}) => {
  const lowerDisease = (disease || '').toLowerCase();

  // 1. Healthy foliage handling
  if (lowerDisease.includes('healthy') || lowerDisease.includes('no disease')) {
    return {
      severity: 'Low',
      risk: 'Low',
      affectedArea: '0%',
      method: 'botanical_baseline',
      description: 'Foliage exhibits normal chlorophyll density without significant necrotic lesions.',
    };
  }

  // 2. Bounding Box Area Calculation (When spatial localization is available)
  if (Array.isArray(boundingBoxes) && boundingBoxes.length > 0) {
    let totalAreaRatio = 0;

    for (const box of boundingBoxes) {
      // If normalized percentage coordinates (0-100)
      if (box.width <= 100 && box.height <= 100 && box.width > 1 && box.height > 1) {
        const boxArea = (box.width * box.height) / (100 * 100);
        totalAreaRatio += boxArea;
      } else if (imageWidth > 0 && imageHeight > 0) {
        // Absolute pixel coordinates
        const boxArea = (box.width * box.height) / (imageWidth * imageHeight);
        totalAreaRatio += boxArea;
      }
    }

    // Clamp coverage percentage
    const coveragePct = Math.min(85, Math.max(8, Math.round(totalAreaRatio * 100)));

    let calculatedSeverity = 'Moderate';
    let calculatedRisk = 'Medium';

    if (coveragePct >= 35) {
      calculatedSeverity = 'High';
      calculatedRisk = 'High';
    } else if (coveragePct < 18) {
      calculatedSeverity = 'Low';
      calculatedRisk = 'Low';
    }

    return {
      severity: calculatedSeverity,
      risk: calculatedRisk,
      affectedArea: `${coveragePct}%`,
      method: 'spatial_bounding_box_coverage',
      description: `Estimated ~${coveragePct}% foliar lesion spread from ${boundingBoxes.length} detected pathogen zone(s).`,
    };
  }

  // 3. Pathogen Rule-Based Severity Mapping (Classification fallback)
  const isHighVirulence = HIGH_SEVERITY_PATHOGENS.some((p) => lowerDisease.includes(p));
  const isModerateVirulence = MODERATE_SEVERITY_PATHOGENS.some((p) => lowerDisease.includes(p));

  if (isHighVirulence) {
    const affectedAreaEst = confidence > 88 ? '35% - 45%' : '25% - 35%';
    return {
      severity: 'High',
      risk: 'High',
      affectedArea: affectedAreaEst,
      method: 'pathogen_virulence_rule',
      description: 'Aggressive systemic pathogen with high rate of foliar transmission.',
    };
  }

  if (isModerateVirulence) {
    const affectedAreaEst = confidence > 85 ? '20% - 30%' : '15% - 22%';
    return {
      severity: 'Moderate',
      risk: 'Medium',
      affectedArea: affectedAreaEst,
      method: 'pathogen_virulence_rule',
      description: 'Moderate localized infection; timely fungicide/bio-agent spray can halt spread.',
    };
  }

  // General or low virulence default
  return {
    severity: 'Low',
    risk: 'Low',
    affectedArea: '10% - 15%',
    method: 'pathogen_virulence_rule',
    description: 'Early stage foliar spotting or minor nutrient/pest symptom.',
  };
};
