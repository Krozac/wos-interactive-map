import React, { useState, useEffect } from "react";
import BaseBuildingForm from "./BaseBuildingForm";

export default function TrapForm({ mode, cell, onClose, type,addBuilding, updateBuilding }) {
  // If you need any Trap-specific fields, you can define them here
  // For now, no extra fields are needed
  const extraFields = null;

  const getExtraData = () => ({ /* add Trap-specific data here if needed */ });

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
      addBuilding={addBuilding} 
      updateBuilding={updateBuilding}
    />
  );
}
