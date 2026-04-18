import { useState, useEffect, useCallback } from 'react';
import { getCookie } from '../utils/cookies';

export function useGuilds() {
  const [guilds, setGuilds] = useState([]);
  const token = getCookie('authToken');

  // Fetch all guilds
  const fetchGuilds = useCallback(async () => {
    try {
      const res = await fetch('/api/guilds', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setGuilds(data.guilds);
      else console.error('Error fetching guilds:', data.message);
    } catch (err) {
      console.error('Network error:', err);
    }
  }, [token]);

  // Add a new guild
  const addGuild = useCallback(async ({ Nom, acronym, color }) => {
    try {
      const res = await fetch('/api/guilds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Nom, acronym, color }),
      });
      if (res.ok) await fetchGuilds();
      else console.error('Error adding guild');
    } catch (err) {
      console.error('Network error:', err);
    }
  }, [token, fetchGuilds]);

  // Update an existing guild
  const updateGuild = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`/api/guilds/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) await fetchGuilds();
      else console.error('Error updating guild');
    } catch (err) {
      console.error('Network error:', err);
    }
  }, [token, fetchGuilds]);

  // Delete a guild
  const deleteGuild = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/guilds/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) await fetchGuilds();
      else console.error('Error deleting guild');
    } catch (err) {
      console.error('Network error:', err);
    }
  }, [token, fetchGuilds]);

  // Initial fetch
  useEffect(() => {
    fetchGuilds();
  }, [fetchGuilds]);

  return { guilds, fetchGuilds, addGuild, updateGuild, deleteGuild };
}
