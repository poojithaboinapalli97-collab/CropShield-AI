import React from 'react';

/**
 * BoundingBoxOverlay Component
 * Renders YOLOv8 computer vision detection bounding boxes, confidence tags,
 * and label badges over crop sample images.
 */
export default function BoundingBoxOverlay({ imageUrl, boundingBoxes = [], showBoxes = true }) {
  return (
    <div className="relative-container">
      <img src={imageUrl} alt="Crop sample" className="bbox-image" />
      {showBoxes &&
        boundingBoxes.map((box) => (
          <div
            key={box.id}
            className="bbox-rect"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          >
            <span className="bbox-label">
              <span className="bbox-name">{box.label}</span>
              <span className="bbox-conf">{(box.confidence * 100).toFixed(0)}%</span>
            </span>
          </div>
        ))}
    </div>
  );
}
