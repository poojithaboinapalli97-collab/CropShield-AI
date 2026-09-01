import React from 'react';
import './ActionCard.css';
/**
 * ActionCard component
 * Displays a recommendation or next step with an optional icon.
 * Props:
 *   - title: string
 *   - description: string
 *   - icon?: ReactNode
 */
export default function ActionCard({ title, description, icon }) {
  return (
    <div className="action-card">
      {icon && <div className="action-icon">{icon}</div>}
      <div className="action-content">
        <h4 className="action-title">{title}</h4>
        <p className="action-description">{description}</p>
      </div>
    </div>
  );
}
