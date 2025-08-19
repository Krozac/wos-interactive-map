import React, { useEffect, useState } from "react";
import GuildForm from "../Forms/GuildForm"; // adjust path if needed
import { useGuilds } from "../../hooks/useGuilds";
import '../../styles/AlliancePanel.css';

export default function AlliancePanel() {
  const { guilds, fetchGuilds, addGuild, updateGuild, deleteGuild } = useGuilds();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [selectedGuild, setSelectedGuild] = useState(null);

  useEffect(() => {
    const loadGuilds = async () => {
      try {
        await fetchGuilds();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadGuilds();
  }, [fetchGuilds]);

  const handleAdd = () => {
    setSelectedGuild(null);
    setFormMode('add');
  };

  const handleEdit = (guild) => {
    setSelectedGuild(guild);
    setFormMode('edit');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this guild?")) {
      await deleteGuild(id);
      await fetchGuilds();
    }
  };

  const handleFormClose = () => {
    setFormMode(null);
    setSelectedGuild(null);
  };

  if (loading) return <div>Loading alliances...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div id="AlliancePanel">
      <button onClick={handleAdd} className="add-guild-btn">Add Guild</button>

      {formMode && (
        <GuildForm
          mode={formMode}
          guild={selectedGuild}
          onClose={handleFormClose}
        />
      )}

      {guilds.map(({ _id, Nom, acronym, color }) => (
        <div key={_id} className="alliance">
          <div
            className="alliance-color-box"
            style={{ background: `radial-gradient(110% 15% at bottom, transparent 50%, ${color} 51%)` }}
            title={Nom}>
            <img src="/img/flake.png" alt="Alliance Icon" />
          </div>

          <div className="alliance-info">
            <p className="alliance-name">{Nom}</p>
            <p className="alliance-acronym">{`[${acronym}]`}</p>
          </div>

          <div className="alliance-actions">
            <button onClick={() => handleEdit({ _id, Nom, acronym, color })}>Edit</button>
            <button onClick={() => handleDelete(_id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
