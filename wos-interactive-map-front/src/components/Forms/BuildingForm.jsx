import BannerForm from "./BannerForm";
import FurnaceForm from "./FurnaceForm";
import HQForm from "./HQForm";
import TrapForm from "./TrapForm";
import FarmForm from "./FarmForm";
import React from "react";

// import HQForm, TrapForm, etc.

export default function BuildingForm({ mode, building, cell, onClose,  addBuilding, updateBuilding }) {
  console.log("BuildingForm mode:", mode);
  console.log("BuildingForm building:", building);
  switch (building.value) {
    case "Furnace":
      return <FurnaceForm mode={mode} cell={cell} onClose={onClose} addBuilding={addBuilding} updateBuilding={updateBuilding}/>;
    case "HQ":
      return <HQForm mode={mode} cell={cell} onClose={onClose} addBuilding={addBuilding} updateBuilding={updateBuilding}/>;
    case "Banner":
      return <BannerForm mode={mode} cell={cell} onClose={onClose} addBuilding={addBuilding} updateBuilding={updateBuilding}/>;
    case "Trap":
      return <TrapForm mode={mode} cell={cell} onClose={onClose} addBuilding={addBuilding} updateBuilding={updateBuilding}/>;
    case "Iron":
    case "Coal":
    case "Farm":
    case "Wood":
      return <FarmForm mode={mode} cell={cell} onClose={onClose} type={building.value} addBuilding={addBuilding} updateBuilding={updateBuilding}/>;
    default:
      return null;
  }
}
