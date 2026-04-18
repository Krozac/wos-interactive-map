import React from "react";
import BaseBuildingForm from "./BaseBuildingForm";

export default function BannerForm({ mode, cell, onClose, addBuilding, updateBuilding}) {
  // If you need Banner-specific fields, add them here
  const extraFields = null;

  const getExtraData = () => ({
      territory: { w: 7, h: 7 },
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
      addBuilding={addBuilding} 
      updateBuilding={updateBuilding}
    />
  );
}
