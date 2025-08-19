import React, { useState, useEffect } from "react";
import BaseBuildingForm from "./BaseBuildingForm";
import "../../styles/FurnaceForm.css";

export default function FurnaceForm({ mode, cell, onClose , addBuilding, updateBuilding}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (mode === "edit" && cell?.add1?.building?.extraData) {
      setName(cell.add1.building.extraData.name || "");
    } else if (mode === "add") {
      setName("");
    }
  }, [mode, cell]);

  const extraFields = (
    <div className="input-group">
      <label htmlFor="inputnamefurnace">Nom Joueur:</label>
      <input
        type="text"
        id="inputnamefurnace"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );

  const getExtraData = () => ({ name });

  return (
    <BaseBuildingForm
      mode={mode}
      cell={cell}
      type="Furnace"
      title="Furnace"
      size={[2, 2]}
      extraFields={extraFields}
      getExtraData={getExtraData}
      onClose={onClose}
      addBuilding={addBuilding} 
      updateBuilding={updateBuilding}
    />
  );
}
