/**
 * CropShield AI - User Activity & Real Scan History Manager
 * Tracks actual user scans, diagnostic reports, and farmer field actions.
 */

export const getStoredScans = () => {
  try {
    const data = localStorage.getItem('cropshield_user_scans');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveScanRecord = (scan) => {
  try {
    if (!scan || scan.isInvalidSpecimen) return getStoredScans();

    const current = getStoredScans();
    const newRecord = {
      id: scan.id || ('SCAN-' + Date.now()),
      timestamp: scan.timestamp || new Date().toISOString(),
      dateFormatted: scan.dateFormatted || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeFormatted: scan.timeFormatted || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      crop: scan.crop || 'Crop',
      scientificName: scan.scientificName || '',
      disease: scan.disease || 'Unknown',
      rawDisease: scan.rawDisease || scan.disease || 'Unknown',
      confidence: Number(scan.confidence) || 0,
      severity: scan.severity || 'Moderate',
      risk: scan.risk || 'Medium',
      affectedArea: scan.affectedArea || '25%',
      recommendedAction: scan.recommendedAction || '',
      image: scan.image || null,
      district: scan.district && scan.district !== 'Not provided' ? scan.district : (localStorage.getItem('selectedDistrict') || 'Guntur, Andhra Pradesh'),
      village: scan.village && scan.village !== 'Not provided' ? scan.village : 'Plot 1',
      growthStage: scan.growthStage || 'Vegetative',
      status: scan.status || (Number(scan.confidence) < 70 ? 'Pending Expert Review' : 'AI Verified'),
      isLowConfidence: scan.isLowConfidence !== undefined ? scan.isLowConfidence : Number(scan.confidence) < 70,
      needsExpertReview: scan.needsExpertReview !== undefined ? scan.needsExpertReview : Number(scan.confidence) < 70,
      isExpertVerified: !!scan.isExpertVerified,
      expertVerification: scan.expertVerification || null,
    };

    const updated = [newRecord, ...current];
    localStorage.setItem('cropshield_user_scans', JSON.stringify(updated));

    // Update global scan count for instant reactive UI updates
    window.dispatchEvent(new Event('cropshield_scans_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save scan record', e);
    return [];
  }
};

/**
 * Update an existing scan record with expert verification or modified details
 */
export const updateScanRecord = (scanId, updateData = {}) => {
  try {
    const current = getStoredScans();
    const updated = current.map((s) => {
      if (s.id === scanId) {
        return {
          ...s,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });
    localStorage.setItem('cropshield_user_scans', JSON.stringify(updated));
    window.dispatchEvent(new Event('cropshield_scans_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to update scan record', e);
    return [];
  }
};

const EXPERT_QUEUE_KEY = 'cropshield_expert_queue';
const ALERTS_STORAGE_KEY = 'cropshield_farmer_alerts';

/**
 * Get Expert Review Queue (user escalated scans + default pending queue)
 */
export const getExpertReviewQueue = () => {
  try {
    const stored = localStorage.getItem(EXPERT_QUEUE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {}
  return [];
};

/**
 * Add a low-confidence or farmer-escalated scan to the Expert Review Queue
 */
export const addScanToExpertQueue = (scan) => {
  try {
    if (!scan) return getExpertReviewQueue();
    const currentQueue = getExpertReviewQueue();
    
    // Check if already in queue
    const exists = currentQueue.find((q) => q.scanId === scan.id || q.id === scan.id);
    if (exists) return currentQueue;

    const queueItem = {
      scanId: scan.id || 'SCAN-' + Date.now(),
      farmerName: localStorage.getItem('farmer_name') || 'Poojitha Boinapalli',
      location: scan.village && scan.district ? `${scan.village}, ${scan.district}` : (scan.district || 'Guntur, Andhra Pradesh'),
      crop: scan.crop || 'Tomato',
      cropStage: scan.growthStage || 'Fruiting Stage',
      aiPrediction: scan.disease || 'Undiagnosed Foliar Symptoms',
      confidence: Number(scan.confidence) || 58.5,
      urgency: Number(scan.confidence) < 60 ? 'High' : 'Medium',
      submittedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      imageUrl: scan.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80',
      status: 'Pending',
      expertNotes: '',
      isLowConfidence: Number(scan.confidence) < 70,
    };

    const updated = [queueItem, ...currentQueue];
    localStorage.setItem(EXPERT_QUEUE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cropshield_expert_queue_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to add scan to expert queue', e);
    return [];
  }
};

/**
 * Verify and certify a scan in the Expert Queue
 */
export const verifyScanInExpertQueue = (scanId, validationData = {}) => {
  try {
    const currentQueue = getExpertReviewQueue();
    const agronomistName = validationData.agronomistName || 'Dr. K. Ramanjaneyulu, Ph.D. (KVK Lead Pathologist)';
    const station = validationData.station || 'Krishi Vigyan Kendra (KVK) Lam Farm, Guntur';
    const verifiedDisease = validationData.confirmedDisease || 'Tomato - Early Blight (Alternaria solani)';
    const notes = validationData.agronomistNotes || 'Verified pathogen etiology. Prescribed targeted ICAR fungicide protocol.';

    // 1. Update Expert Queue
    const updatedQueue = currentQueue.map((item) => {
      if (item.scanId === scanId || item.id === scanId) {
        return {
          ...item,
          status: 'Validated',
          aiPrediction: verifiedDisease,
          expertNotes: notes,
          agronomistName,
          station,
          validatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    localStorage.setItem(EXPERT_QUEUE_KEY, JSON.stringify(updatedQueue));

    // 2. Update Scan Record in User Scans
    updateScanRecord(scanId, {
      disease: verifiedDisease,
      rawDisease: verifiedDisease,
      isExpertVerified: true,
      status: 'Verified by Expert',
      confidence: 100,
      severity: validationData.severity || 'Moderate',
      recommendedAction: notes,
      expertVerification: {
        name: agronomistName,
        station,
        verifiedDisease,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        prescription: notes,
      },
    });

    // 3. Post Notification Alert to Farmer Dashboard
    try {
      const storedAlerts = JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]');
      const newAlert = {
        id: 'ALT-EXP-' + Date.now(),
        type: 'expert',
        icon: '🧑‍🌾',
        title: 'Expert Validation Completed',
        message: `Expert validation completed: ${agronomistName} (${station}) verified your diagnosis as ${verifiedDisease}.`,
        dateTime: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        read: false,
        severity: 'High',
      };
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify([newAlert, ...storedAlerts]));
    } catch (err) {}

    window.dispatchEvent(new Event('cropshield_scans_updated'));
    window.dispatchEvent(new Event('cropshield_alerts_updated'));
    window.dispatchEvent(new Event('cropshield_expert_queue_updated'));

    return updatedQueue;
  } catch (e) {
    console.error('Failed to verify scan in expert queue', e);
    return [];
  }
};

export const getScanMetrics = () => {
  const scans = getStoredScans();
  const totalScans = scans.length;

  if (totalScans === 0) {
    return {
      totalScans: 0,
      avgConfidence: 0,
      districtsCount: 1,
      latestScan: null,
      scans: [],
    };
  }

  const sumConf = scans.reduce((acc, s) => acc + (Number(s.confidence) || 0), 0);
  const avgConfidence = (sumConf / totalScans).toFixed(1);

  const uniqueDistricts = new Set(scans.map((s) => s.district).filter(Boolean));

  return {
    totalScans,
    avgConfidence: parseFloat(avgConfidence),
    districtsCount: Math.max(uniqueDistricts.size, 1),
    latestScan: scans[0],
    scans,
  };
};

export const clearScanHistory = () => {
  try {
    localStorage.removeItem('cropshield_user_scans');
    window.dispatchEvent(new Event('cropshield_scans_updated'));
  } catch (e) {}
};
