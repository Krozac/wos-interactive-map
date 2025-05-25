import React, { useState, useEffect } from "react";
import BaseBuildingForm from "./BaseBuildingForm";
import "../../styles/FurnaceForm.css";

const DEFAULT_ALLIANCE = "[WKL]";  // change this to whatever your “default” should be

export default function FurnaceForm({ mode, cell, onClose }) {
  // Always start with the default alliance...
  const [name, setName] = useState("");
  const [alliance, setAlliance] = useState(DEFAULT_ALLIANCE);

  useEffect(() => {
    if (mode === "edit" && cell?.add1?.building?.extraData) {
      // …but if we're editing, override with the building’s actual alliance
      setName(cell.add1.building.extraData.name || "");
      setAlliance(cell.add1.building.extraData.alliance || DEFAULT_ALLIANCE);
    } else if (mode === "add") {
      // Reset everything for “add”
      setName("");
      setAlliance(DEFAULT_ALLIANCE);
    }
  }, [mode, cell]);

  const extraFields = (
    <>
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

      <div className="input-group">
        <label htmlFor="inputalliancefurnace">Alliance:</label>
        <select
          id="inputalliancefurnace"
          required
          value={alliance}
          onChange={(e) => setAlliance(e.target.value)}
        >
          <option value="[WKL]">[WKL] Wankil</option>
          <option value="[wkl]">[wkl] Wankilfarm</option>
          <option value="[Wkl]">[Wkl] WankiL (Aca)</option>
        </select>
      </div>
    </>
  );

  const getExtraData = () => ({ name, alliance });

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
    />
  );
}
