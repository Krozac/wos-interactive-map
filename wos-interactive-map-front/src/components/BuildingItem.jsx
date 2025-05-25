import React from 'react';

export default function BuildingItem({ building, onSelect }) {
  return (
    <div className="building-item" onClick={() => onSelect(building)}>
      <img src={building.icon} alt={building.name} />
      <p>{building.name}</p>
    </div>
  );
}