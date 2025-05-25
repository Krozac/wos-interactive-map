import React, { useState, useEffect } from "react";
import BaseBuildingForm from "./BaseBuildingForm";

// A simple map from alliance code → color
const ALLIANCE_COLORS = {
  "[WKL]": "#00BFFF",
  "[wkl]": "#FFFF00",
  "[Wkl]": "#40E0D0",
};

export default function BannerForm({ mode, cell, onClose }) {
  // Seed alliance (or default to the first key)
  const initialAlliance =
    mode === "edit"
      ? cell?.add1?.building?.extraData?.alliance
      : Object.keys(ALLIANCE_COLORS)[0];

  const [alliance, setAlliance] = useState(initialAlliance);

  // Color is derived, not controlled
  const color = ALLIANCE_COLORS[alliance] || "#FFFFFF";

  // If we switch modes or cells, re-seed alliance
  useEffect(() => {
    if (mode === "edit" && cell?.add1?.building?.extraData?.alliance) {
      setAlliance(cell.add1.building.extraData.alliance);
    } else if (mode === "add") {
      setAlliance(Object.keys(ALLIANCE_COLORS)[0]);
    }
  }, [mode, cell]);

  const extraFields = (
    <>
      <div className="input-group">
        <label htmlFor="inputalliancebanner">Alliance:</label>
        <select
          id="inputalliancebanner"
          required
          value={alliance}
          onChange={(e) => setAlliance(e.target.value)}
        >
          {/* Render options from the same map */}
          {Object.entries(ALLIANCE_COLORS).map(([code]) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Territory Color:</label>
        {/* read-only display */}
        <div
          className="color-preview"
          style={{
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: color,
            border: "1px solid #000",
          }}
          title={color}
        />
      </div>
    </>
  );

  const getExtraData = () => ({
    alliance,
    territory: { w: 15, h: 15, color },
  });

  return (
    <BaseBuildingForm
      mode={mode}
      cell={cell}
      onClose={onClose}
      type="Banner"
      title="Banner"
      size={[1, 1]}
      extraFields={extraFields}
      getExtraData={getExtraData}
    />
  );
}
