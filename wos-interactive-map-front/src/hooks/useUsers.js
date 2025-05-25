import { useState, useEffect, useCallback } from 'react';
import { getCookie } from '../utils/cookies';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const token = getCookie('authToken');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else console.error('Error fetching users:', data.message);
    } catch (err) {
      console.error('Network error:', err);
    }
  }, [token]);

  const updateUser = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) await fetchUsers();
      else console.error('Error updating user');
    } catch (err) {
      console.error('Network error:', err);
    }
  }, [token, fetchUsers]);

  const updatePowerRallie = useCallback(async (id, power, rallie) => {
    try {
      const res = await fetch(`/api/users/${id}/power`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ power, rallie }),
      });

      if (res.ok) {
        await fetchUsers();
        return true;  // success
      } else {
        console.error('Error updating power and rallie');
        return false;
      }
    } catch (err) {
      console.error('Network error:', err);
      return false;
    }
  }, [token, fetchUsers]);


  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { users, fetchUsers, updateUser, updatePowerRallie };
}
