import React, { useEffect, useState } from 'react';

import { centerCameraOn } from '../../three/camera';

import { useBuildings } from "../../hooks/useBuildings";

export default function TerritoryPanel( ) {
  const [searchTerm, setSearchTerm] = useState('');

  const { buildings } = useBuildings();
  
  const furnaces = buildings.filter(b => b.type === "Furnace");


    const filteredFurnaces = furnaces.filter(f => {
    const name = f.extraData?.name?.toLowerCase() || '';
    const alliance = f.extraData?.alliance?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return name.startsWith(search) || alliance.startsWith(search);
    });
    
  return (
    <div id="FurnacePanel">
      <input
        id="search-bar"
        type="text"
        placeholder="Search by name or alliance"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div id="furnace-list">
        {filteredFurnaces.map((building,i) => (
          <div key={`${building.location.x}-${building.location.y}-${i}`} className="building-card">
            <img
              src="/img/furnace.png"
              style={{ width: 50, height: 50, filter: 'brightness(0) invert(1)', float: 'left' }}
              alt="Furnace"
            />
            <h3 style={{ margin: '0 0 2px' }}>
              {building.extraData.name} {building.extraData.alliance}
            </h3>
            <p
              className="building-location"
              onClick={() => centerCameraOn(building.location.x, building.location.y)}
            >
              ({building.location.x}, {building.location.y})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
