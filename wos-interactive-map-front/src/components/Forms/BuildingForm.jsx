import BannerForm from "./BannerForm";
import FurnaceForm from "./FurnaceForm";
import HQForm from "./HQForm";
import TrapForm from "./TrapForm";
import FarmForm from "./FarmForm";
import React from "react";

// import HQForm, TrapForm, etc.

export default function BuildingForm({ mode, building, cell, onClose }) {
  console.log("BuildingForm mode:", mode);
  console.log("BuildingForm building:", building);
  switch (building.value) {
    case "Furnace":
      return <FurnaceForm mode={mode} cell={cell} onClose={onClose} />;
    case "HQ":
      return <HQForm mode={mode} cell={cell} onClose={onClose} />;
    case "Banner":
      return <BannerForm mode={mode} cell={cell} onClose={onClose} />;
    case "Trap":
      return <TrapForm mode={mode} cell={cell} onClose={onClose} />;
    case "Iron":
    case "Coal":
    case "Farm":
    case "Wood":
      return <FarmForm mode={mode} cell={cell} onClose={onClose} type={building.value} />;
    default:
      return null;
  }
}
