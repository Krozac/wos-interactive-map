import React, { useState, useEffect } from "react";
import { useGuilds } from "../../hooks/useGuilds"; // your hook

export default function GuildForm({ mode, guild, onClose }) {
  const { addGuild, updateGuild } = useGuilds();

  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [color, setColor] = useState("#ff0000"); // default red

  useEffect(() => {
    if (mode === "edit" && guild) {
      setName(guild.Nom || "");
      setAcronym(guild.acronym || "");
      setColor(guild.color || "#ff0000");
    } else {
      setName("");
      setAcronym("");
      setColor("#ff0000");
    }
  }, [mode, guild]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const extraData = { Nom: name, acronym, color };

    if (mode === "edit" && guild?._id) {
      await updateGuild(guild._id, extraData);
    } else {
      await addGuild(extraData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="Form guild-form">
      <h3>{mode === "add" ? "Ajouter une Guild" : "Modifier la Guild"}</h3>

      <div className="input-group">
        <label htmlFor="guild-name">Nom:</label>
        <input
          type="text"
          id="guild-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="guild-acronym">Acronyme:</label>
        <input
          type="text"
          id="guild-acronym"
          required
          value={acronym}
          onChange={(e) => setAcronym(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="guild-color">Couleur:</label>
        <input
          type="color"
          id="guild-color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit">Envoyer</button>
        <button type="button" onClick={onClose}>X</button>
      </div>
    </form>
  );
}
