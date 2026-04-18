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

import { useUsers } from "../../hooks/useUsers";

export default function UserPanel() {
  const { users } = useUsers();
  const [sortKey, setSortKey] = useState(null);

  let sortedUsers = [...users];
  if (sortKey === "power") {
    sortedUsers.sort((a, b) => (b.power || 0) - (a.power || 0));
  } else if (sortKey === "rallie") {
    sortedUsers.sort((a, b) => (b.rallie || 0) - (a.rallie || 0));
  }

  return (
    <div id="Users">
      <div className="user-panel-toolbar">
        <button onClick={() => setSortKey("power")}>Sort by Power</button>
        <button onClick={() => setSortKey("rallie")}>Sort by Rallie</button>
      </div>
      {sortedUsers.map((user) => (
        <UserCard key={user.id || user.nom} user={user} />
      ))}
    </div>
  );
}
