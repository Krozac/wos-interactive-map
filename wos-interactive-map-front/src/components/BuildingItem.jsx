import React, { useEffect, useRef } from 'react';
import { fitText } from '../utils/fitText';

export default function BuildingItem({ building, label, onSelect, isSelected }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    fitText(textRef.current, 75, 12);
  }, [label]); // re-run when translated text changes

  return (
    <div
      className={`${building.className} ${isSelected ? "selected" : ""}`}
      data-height={building.height}
      data-width={building.width}
      onClick={() => onSelect(building)}
      style={{ cursor: "pointer" }}
    >
      <img src={building.imgSrc} alt={label} />
      <p ref={textRef}>{label}</p>
    </div>
  );
}