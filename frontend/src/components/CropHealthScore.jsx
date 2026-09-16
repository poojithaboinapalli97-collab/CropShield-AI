import React from 'react';
import './CropHealthScore.css';

/**
 * CropHealthScore component
 * Displays a health score (0-100) as a progress bar with color gradient.
 * Props:
 *  - score: number (0-100)
 *  - label?: string (optional label)
 */
export default function CropHealthScore({ score = 0, label = 'Crop Health Score' }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const getColor = () => {
    if (clampedScore >= 80) return '#34d399'; // emerald
    if (clampedScore >= 50) return '#fbbf24'; // amber
    return '#f87171'; // red
  };
  return (
    <div className="crop-health-score">
      <div className="chs-label">{label}</div>
      <div className="chs-bar-bg">
        <div
          className="chs-bar-fg"
          style={{ width: `${clampedScore}%`, backgroundColor: getColor() }}
        />
      </div>
      <div className="chs-perc">{clampedScore}%</div>
    </div>
  );
}
