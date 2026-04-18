// src/hooks/useBuildings.js
import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { convertLocalToWorld } from '../three/helpers.js';
import { getCookie } from '../utils/cookies.js';
import { showBuildings } from '../three/building.js';

export function useBuildings(typeFilter = null) {
  const [buildings, setBuildings] = useState([]);
  const token = getCookie('authToken');
  const username = JSON.parse(getCookie('playerData') || '{}').nickname;

  // Fetch & re-draw
  const fetchBuildings = useCallback(async () => {
    try {
      const res = await fetch('/api/buildings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const filtered = typeFilter
          ? data.buildings.filter((b) => b.type === typeFilter)
          : data.buildings;
        setBuildings(data.buildings);
        //showBuildings(); // update your 3D scene
      } else {
        console.error('Fetch error:', data.message);
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  }, [token, typeFilter]);

  // Generic create or update handler
  const submitBuilding = useCallback(
    async (payload) => {
      // convert local→world
      const { xLocal, yLocal, size, type,alliance, extraData = {}, id } = payload;
      const world = convertLocalToWorld(
        new THREE.Vector3(xLocal, yLocal, 0),
        window.plane
      );
      const body = {
        location: { x: world.x, y: world.y },
        size,
        type,
        alliance,
        addedBy: username,
        extraData,
      };

      console.log(body)

      const url = id ? `/api/buildings/${id}` : '/api/buildings';
      const method = id ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await fetchBuildings();
      } catch (err) {
        console.error(`${method} error:`, err);
      }
    },
    [fetchBuildings, token, username]
  );

  // Delete remains the same
  const deleteBuilding = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/buildings/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await fetchBuildings();
      } catch (err) {
        console.error('Delete error:', err);
      }
    },
    [fetchBuildings, token]
  );

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  return {
    buildings,
    fetchBuildings,
    addBuilding: (params) => submitBuilding(params),
    updateBuilding: (params) => submitBuilding(params),
    deleteBuilding,
  };
}
