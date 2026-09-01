import React from 'react';
import './AIExplanationPanel.css';
/**
 * AIExplanationPanel component
 * Shows AI generated explanation for a disease detection.
 * Props:
 *   - disease: string
 *   - confidence: number (0-100)
 *   - explanation: string
 */
export default function AIExplanationPanel({ disease, confidence, explanation }) {
  return (
    <div className="ai-explanation-panel">
      <h3 className="panel-title">AI Explanation</h3>
      <p className="disease-name"><strong>{disease}</strong> ({confidence}% confidence)</p>
      <p className="explanation-text">{explanation}</p>
    </div>
  );
}
