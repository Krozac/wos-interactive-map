import React from "react";
import BaseBuildingForm from "./BaseBuildingForm";

export default function HQForm({ mode, cell, onClose , addBuilding, updateBuilding }) {

  const getExtraData = () => ({
    territory: { w: 15, h: 15},
  });

  return (
    <BaseBuildingForm
      mode={mode}
      cell={cell}
      onClose={onClose}
      type="HQ"
      title="HQ"
      size={[3, 3]}
      extraFields={null}
      getExtraData={getExtraData}
      addBuilding={addBuilding} 
      updateBuilding={updateBuilding}
    />
  );
}
