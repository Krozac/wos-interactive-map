import React, { useEffect, useRef } from 'react';
import { initScene } from '../three/main.js'; // adjust path as needed


export default function MapContainer({ onCellSelect }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      initScene(containerRef.current, onCellSelect);
    }
    return () => {
      // Optional cleanup logic if needed
    };
  }, [onCellSelect]); // include it in deps if it's ever dynamic

  return (
    <div
      id="three-container"
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: '0' }}
    />
  );
}
