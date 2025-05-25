import React, { useState, useEffect } from "react";
import BaseBuildingForm from "./BaseBuildingForm";

const DEFAULT_ALLIANCE = "[WKL]";  // change this to whatever your “default” should be

export default function TrapForm({ mode, cell, onClose ,type}) {
    const [alliance, setAlliance] = useState(DEFAULT_ALLIANCE);
   useEffect(() => {
      if (mode === "edit" && cell?.add1?.building?.extraData) {
        setAlliance(cell.add1.building.extraData.alliance || DEFAULT_ALLIANCE);
      } else if (mode === "add") {
        setAlliance(DEFAULT_ALLIANCE);
      }
    }, [mode, cell]);
  const extraFields = (
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
  );

  const getExtraData = () => ({ alliance });

  return (
    <BaseBuildingForm
      mode={mode}
      cell={cell}
      onClose={onClose}
      type={type}
      title={type}
      size={[2, 2]}
      extraFields={extraFields}
      getExtraData={getExtraData}
    />
  );
}
