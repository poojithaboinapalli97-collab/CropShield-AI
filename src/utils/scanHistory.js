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
      id: 'SCAN-' + Date.now(),
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeFormatted: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      crop: scan.crop || 'Crop',
      scientificName: scan.scientificName || '',
      disease: scan.disease || 'Unknown',
      confidence: Number(scan.confidence) || 0,
      image: scan.image || null,
      district: scan.district && scan.district !== 'Not provided' ? scan.district : (localStorage.getItem('selectedDistrict') || 'Ludhiana'),
      village: scan.village && scan.village !== 'Not provided' ? scan.village : 'Plot 1',
      growthStage: scan.growthStage || 'Vegetative',
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
