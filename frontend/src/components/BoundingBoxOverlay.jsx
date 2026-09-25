import React from 'react';

/**
 * BoundingBoxOverlay Component
 * Renders YOLOv8 computer vision detection bounding boxes, confidence tags,
 * and label badges over crop sample images.
 */
export default function BoundingBoxOverlay({ imageUrl, boundingBoxes = [], showBoxes = true }) {
  return (
    <div className="relative-container" style={{ position: 'relative', width: '100%', display: 'inline-block' }}>
      <img src={imageUrl} alt="Crop leaf diagnosis" className="result-image bbox-image" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '12px' }} />
      {showBoxes &&
        boundingBoxes.map((box, idx) => {
          const x = typeof box.x === 'number' ? (box.x <= 1.0 ? box.x * 100 : box.x) : 10;
          const y = typeof box.y === 'number' ? (box.y <= 1.0 ? box.y * 100 : box.y) : 10;
          const width = typeof box.width === 'number' ? (box.width <= 1.0 ? box.width * 100 : box.width) : 40;
          const height = typeof box.height === 'number' ? (box.height <= 1.0 ? box.height * 100 : box.height) : 40;
          const conf = typeof box.confidence === 'number' ? (box.confidence <= 1.0 ? box.confidence * 100 : box.confidence) : 90;
          return (
            <div
              key={box.id || idx}
              className="bbox-rect"
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: `${width}%`,
                height: `${height}%`,
                border: '2.5px solid #ef4444',
                borderRadius: '6px',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.45)',
                pointerEvents: 'none'
              }}
            >
              <span className="bbox-label" style={{
                position: 'absolute',
                top: '-24px',
                left: '0',
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <span className="bbox-name">{box.label}</span>
                <span className="bbox-conf">{conf.toFixed(0)}%</span>
              </span>
            </div>
          );
        })}
    </div>
  );
}
