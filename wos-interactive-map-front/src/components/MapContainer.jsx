import React, { use, useEffect, useRef } from 'react';
import { initScene, renderObstacles, syncBuildings } from '../three/main.js'; // adjust path as needed


export default function MapContainer({buildings, onCellSelect,setLoading }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      initScene(containerRef.current, onCellSelect);
    }
    return () => {
      // Optional cleanup logic if needed
    };
  }, [onCellSelect]); // include it in deps if it's ever dynamic

  useEffect(()=>{
    if (buildings) {
      if (!buildings || buildings.length === 0) return;
      syncBuildings(buildings, setLoading);
    }
  },[buildings])

  useEffect(()=>{
    renderObstacles(setLoading);
  },[])
  
  return (
    <div
      id="three-container"
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: '0' }}
    />
  );
}
