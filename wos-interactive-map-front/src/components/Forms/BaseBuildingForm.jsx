import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { convertLocalToWorld } from "../../three/helpers";
import { useBuildings } from "../../hooks/useBuildings";
import { useGuilds } from "../../hooks/useGuilds";

export default function BaseBuildingForm({
  mode,
  cell,
  type,
  size,
  title,
  extraFields = null,
  getExtraData = () => ({}),
  onClose,
  addBuilding,   // <-- from props
  updateBuilding // <-- from props
}) {

  const { guilds } = useGuilds(); // <-- use the hook

  const [x, setX] = useState(cell?.x || 0);
  const [y, setY] = useState(cell?.y || 0);
  const [alliance, setAlliance] = useState(cell?.add1?.building?.alliance?._id || "");

  useEffect(() => {
    if (!alliance && guilds.length) setAlliance(guilds[0]._id);
  }, [guilds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pointLocal = new THREE.Vector3(x, y, 0);
    const pointWorld = convertLocalToWorld(pointLocal, window.plane);

    const extraData = getExtraData();

    if (mode === "edit") {
      const id = cell?.add1?.building?._id;
      await updateBuilding({
        id,
        type,
        xLocal: x,
        yLocal: y,
        size: { w: size[0], h: size[1] },
        alliance,
        extraData
      });
    } else {
      await addBuilding({
        type,
        xLocal: x,
        yLocal: y,
        size: { w: size[0], h: size[1] },
        alliance,
        extraData
      });
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="Form building-form">
      <h3>{mode === "add" ? `Ajouter un ${title}` : `Modifier un ${title}`}</h3>

      <div className="flex-row">
        <div className="input-group">
          <label htmlFor="inputx">x:</label>
          <input type="number" id="inputx" required value={x} onChange={(e) => setX(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label htmlFor="inputy">y:</label>
          <input type="number" id="inputy" required value={y} onChange={(e) => setY(Number(e.target.value))} />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="inputalliance">Alliance:</label>
        <select
          id="inputalliance"
          required
          value={alliance}
          onChange={(e) => setAlliance(e.target.value)}
        >
          <option value="">-- Sélectionner une alliance --</option>
          {guilds.map(g => (
            <option key={g._id} value={g._id}>{g.Nom} [{g.acronym}]</option>
          ))}
        </select>
        <div
          className="color-preview"
          style={{
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: guilds.find(g => g._id === alliance)?.color || "#fff",
            border: "1px solid #000",
          }}
        />
      </div>

      {extraFields}

      <div className="form-actions">
        <button type="submit">Envoyer</button>
        <button type="button" onClick={onClose}>X</button>
      </div>
    </form>
  );
}
