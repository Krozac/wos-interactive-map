import React, { useState, useEffect } from "react";
import BaseBuildingForm from "./BaseBuildingForm";


export default function TrapForm({ mode, cell, onClose , addBuilding, updateBuilding }) {

  const getExtraData = () => ({}); // no extra fields specific to Trap


  return (
    <BaseBuildingForm
      mode={mode}
      cell={cell}
      onClose={onClose}
      type="Trap"
      title="Trap"
      size={[3, 3]}
      extraFields={null}
      getExtraData={getExtraData}
      addBuilding={addBuilding} 
      updateBuilding={updateBuilding}
    />
  );
}
