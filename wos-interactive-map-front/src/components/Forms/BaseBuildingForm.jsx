import React, { useState } from "react";
import * as THREE from "three";
import { convertLocalToWorld } from "../../three/helpers";
import { useBuildings } from "../../hooks/useBuildings";


export default function BaseBuildingForm({
  mode,
  cell,
  type,
  size,
  title,
  extraFields = null,
  getExtraData = () => ({}),
  onClose
}) {
  // <-- pull add/update from the hook
  const { addBuilding, updateBuilding } = useBuildings(type);

  const [x, setX] = useState(cell?.x || 0);
  const [y, setY] = useState(cell?.y || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // world coordinates
    const pointLocal = new THREE.Vector3(x, y, 0);
    const pointWorld = convertLocalToWorld(pointLocal, window.plane);

    // shared extra data
    const extraData = getExtraData();
    console.log("Extra Data:", extraData);
    if (mode === "edit") {
      const id = cell?.add1?.building?._id;
      await updateBuilding({
        id,
        type,
        xLocal: x,
        yLocal: y,
        size: { w: size[0], h: size[1] },
        extraData:extraData
      });
    } else {
      await addBuilding({
        type,
        xLocal: x,
        yLocal: y,
        size: { w: size[0], h: size[1] },
        extraData:extraData
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
          <input
            type="number"
            id="inputx"
            required
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="inputy">y:</label>
          <input
            type="number"
            id="inputy"
            required
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
          />
        </div>
      </div>

      {extraFields}

      <div className="form-actions">
        <button type="submit">Envoyer</button>
        <button type="button" onClick={onClose}>X</button>
      </div>
    </form>
  );
}
