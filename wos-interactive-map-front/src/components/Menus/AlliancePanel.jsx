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


  return (
    <div id="AlliancePanel">
      {/* this doesnt look like a button TODO: make it look like a button */}
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
          <div className="alliance-banner">
            <img
              className="alliance-banner-shape-shadow"
              src="/img/banner/shapes/banner-1.png"
            />
            <div
              className="alliance-banner-shape"
              style={{ "--guild-color": color , WebkitMaskImage: "url('/img/banner/shapes/banner-1.png')", maskImage: "url('/img/banner/shapes/banner-1.png')", }}
            />
            <img className="alliance-banner-icon" src="/img/banner/icons/icon-deer.png" alt="Alliance Icon" />
          </div>

          <div className="alliance-info">
            <p className="alliance-name">{Nom}</p>
            <p className="alliance-acronym">{`[${acronym}]`}</p>
          </div>

          <div className="alliance-actions">
            <button onClick={() => handleEdit({ _id, Nom, acronym, color })}><i class="fas fa-edit"></i></button>
            <button onClick={() => handleDelete(_id)}><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      ))}
    </div>
  );
}
