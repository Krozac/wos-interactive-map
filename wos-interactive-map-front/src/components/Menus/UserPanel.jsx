import React, { useEffect, useState } from 'react';
import '../../styles/userPanel.css'; // make sure you have styles for the toolbar/buttons

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function UserCard({ user }) {
  const isImage =
    user.lvl_content &&
    /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(user.lvl_content);

  return (
    <div className="user-card">
      <div className="user-avatar">
        <img src={user.avatar} alt={`${user.nom}'s Avatar`} />
      </div>
      <div className="user-card-info">
        <h3 className="user-name">{user.nom}</h3>
        <div>
          <img src="/img/buttons/stove.png" alt="Stove" />
          <p className="user-lvl">Lv. {user.lvl}</p>
          {isImage && (
            <img
              className="user-lvl-content"
              src={user.lvl_content}
              alt="level content"
            />
          )}
        </div>
        <div>
          <img src="/img/buttons/power.png" alt="Power" />
          <p className="user-power">
            {user.power != null ? numberWithSpaces(user.power) : '???'}
          </p>
        </div>
        <div>
          <img src="/img/buttons/rallie.png" alt="Rallie" />
          <p className="user-rallie">
            {user.rallie != null ? numberWithSpaces(user.rallie) : '???'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UserPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setUsers(result.users);
        } else {
          console.error('Error fetching users:', result.message);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    }
    fetchUsers();
  }, []);

  const sortByPower = () => {
    setUsers((prev) =>
      [...prev].sort((a, b) => (b.power || 0) - (a.power || 0))
    );
  };

  const sortByRallie = () => {
    setUsers((prev) =>
      [...prev].sort((a, b) => (b.rallie || 0) - (a.rallie || 0))
    );
  };

  return (
    <div id="Users">
      <div className="user-panel-toolbar">
        <button onClick={sortByPower}>Sort by Power</button>
        <button onClick={sortByRallie}>Sort by Rallie</button>
      </div>
      {users.map((user) => (
        <UserCard key={user.id || user.nom} user={user} />
      ))}
    </div>
  );
}
