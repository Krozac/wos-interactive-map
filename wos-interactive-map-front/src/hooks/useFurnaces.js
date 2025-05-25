// src/hooks/useFurnaces.js

import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { convertLocalToWorld } from '../three/helpers.js';
import { getCookie } from '../utils/cookies.js';
import { showBuildings } from '../three/building.js';

export function useFurnaces() {
  const [furnaces, setFurnaces] = useState([]);
  const token = getCookie('authToken');
  const username = JSON.parse(getCookie('playerData') || '{}').nickname;

  // Load from server, update both React state and the 3D scene
  const fetchFurnaces = useCallback(async () => {
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
        const allF = data.buildings.filter((b) => b.type === 'Furnace');
        setFurnaces(allF);
        showBuildings();     // ← redraw the map
      } else {
        console.error('Fetch error:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }, [token]);

  const addFurnace = useCallback(async ({ name, xLocal, yLocal, alliance }) => {
    const pointWorld = convertLocalToWorld(new THREE.Vector3(xLocal, yLocal, 0), window.plane);
    const body = {
      location: { x: pointWorld.x, y: pointWorld.y },
      size: { w: 2, h: 2 },
      type: 'Furnace',
      addedBy: username,
      extraData: { name, alliance },
    };
    try {
      const res = await fetch('/api/buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) await fetchFurnaces();
    } catch (error) {
      console.error('Add error:', error);
    }
  }, [fetchFurnaces, token, username]);

  const updateFurnace = useCallback(async ({ id, name, xLocal, yLocal, alliance }) => {
    const pointWorld = convertLocalToWorld(new THREE.Vector3(xLocal, yLocal, 0), window.plane);
    const body = {
      location: { x: pointWorld.x, y: pointWorld.y },
      size: { w: 2, h: 2 },
      type: 'Furnace',
      addedBy: username,
      extraData: { name, alliance },
    };
    try {
      const res = await fetch(`/api/buildings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) await fetchFurnaces();
    } catch (error) {
      console.error('Update error:', error);
    }
  }, [fetchFurnaces, token, username]);

  const deleteFurnace = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/buildings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) await fetchFurnaces();
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [fetchFurnaces, token]);

  useEffect(() => {
    fetchFurnaces();
  }, [fetchFurnaces]);

  return {
    furnaces,
    fetchFurnaces,
    addFurnace,
    updateFurnace,
    deleteFurnace,
  };
}
