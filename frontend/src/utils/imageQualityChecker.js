/**
 * CropShield AI - Image Quality Assessment Utility
 * Evaluates image resolution, illumination, blur/contrast, and uniformity
 * before submitting to the AI diagnostic model.
 */

/**
 * Validates image quality from an HTML Image or base64/URL source.
 * @param {string} imageSrc - Base64 DataURL or Object URL of image
 * @param {File} file - Original uploaded file object
 * @returns {Promise<{isAcceptable: boolean, qualityScore: number, message?: string, details?: object}>}
 */
export const checkImageQuality = (imageSrc, file = null) => {
  return new Promise((resolve) => {
    // 1. File size check
    if (file && file.size < 4096) {
      resolve({
        isAcceptable: false,
        qualityScore: 10,
        message: 'Image quality is low. Please upload a clear image of the affected leaf.',
        reason: 'File size is too small for accurate AI leaf pathogen diagnostics.',
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // 2. Minimum resolution check (must be at least 150x150px)
        if (width < 120 || height < 120) {
          resolve({
            isAcceptable: false,
            qualityScore: 20,
            message: 'Image quality is low. Please upload a clear image of the affected leaf.',
            reason: `Resolution (${width}x${height}px) is too low for disease detection.`,
          });
          return;
        }

        // 3. Offscreen canvas analysis for brightness, contrast, and edge sharpness
        const sampleSize = 100;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        let totalLuminance = 0;
        const luminances = [];

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          // Standard ITU-R BT.601 perceived luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;
          luminances.push(lum);
        }

        const totalPixels = sampleSize * sampleSize;
        const avgLuminance = totalLuminance / totalPixels;

        // Calculate standard deviation of luminance (contrast measure)
        let varianceSum = 0;
        for (let i = 0; i < luminances.length; i++) {
          const diff = luminances[i] - avgLuminance;
          varianceSum += diff * diff;
        }
        const stdDev = Math.sqrt(varianceSum / totalPixels);

        // 4. Edge energy / Sharpness estimate via adjacent pixel gradient
        let edgeEnergy = 0;
        for (let y = 0; y < sampleSize - 1; y++) {
          for (let x = 0; x < sampleSize - 1; x++) {
            const idx = y * sampleSize + x;
            const diffX = Math.abs(luminances[idx] - luminances[idx + 1]);
            const diffY = Math.abs(luminances[idx] - luminances[idx + sampleSize]);
            edgeEnergy += diffX + diffY;
          }
        }
        const avgEdgeEnergy = edgeEnergy / ((sampleSize - 1) * (sampleSize - 1));

        // Evaluate conditions
        const isTooDark = avgLuminance < 22; // Extreme darkness
        const isTooBright = avgLuminance > 248; // Blown out whites
        const isLowContrast = stdDev < 9.0; // Completely flat/monochrome
        const isExtremelyBlurry = avgEdgeEnergy < 3.2 && stdDev < 18.0; // Flat blur

        if (isTooDark || isTooBright || isLowContrast || isExtremelyBlurry) {
          console.warn('[CropShield Quality Check] Poor quality detected:', {
            avgLuminance: avgLuminance.toFixed(1),
            stdDev: stdDev.toFixed(1),
            avgEdgeEnergy: avgEdgeEnergy.toFixed(1),
            isTooDark,
            isTooBright,
            isLowContrast,
            isExtremelyBlurry,
          });

          resolve({
            isAcceptable: false,
            qualityScore: 35,
            message: 'Image quality is low. Please upload a clear image of the affected leaf.',
            reason: isTooDark
              ? 'Photo is too dark. Ensure adequate natural daylight or flash illumination.'
              : isTooBright
              ? 'Photo is overexposed/glare. Avoid direct flash glare on the leaf.'
              : 'Photo is blurry or lacks detail. Hold camera steady and focus on leaf surface.',
          });
          return;
        }

        // Acceptable image
        const qualityScore = Math.min(100, Math.round(40 + stdDev * 0.6 + avgEdgeEnergy * 1.5));
        resolve({
          isAcceptable: true,
          qualityScore,
          details: {
            resolution: `${width}x${height}`,
            avgLuminance: Math.round(avgLuminance),
            contrastScore: Math.round(stdDev),
          },
        });
      } catch (err) {
        console.warn('Image quality calculation error:', err);
        resolve({ isAcceptable: true, qualityScore: 75 });
      }
    };

    img.onerror = () => {
      resolve({
        isAcceptable: false,
        qualityScore: 0,
        message: 'Image quality is low. Please upload a clear image of the affected leaf.',
      });
    };

    img.src = imageSrc;
  });
};
