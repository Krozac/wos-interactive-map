import React, { useEffect, useState } from 'react';

import { centerCameraOn } from '../../three/camera';

export default function TerritoryPanel() {
  const [furnaces, setFurnaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchBuildings() {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      try {
        const response = await fetch('/api/buildings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          const filtered = result.buildings
            .filter(b => b.type === 'Furnace')
            .sort((a, b) => a.extraData.name.localeCompare(b.extraData.name));
          setFurnaces(filtered);
        } else {
          console.error('Error fetching buildings:', result.message);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    }

    fetchBuildings();
  }, []);

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
        {filteredFurnaces.map(building => (
          <div key={`${building.location.x}-${building.location.y}`} className="building-card">
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
