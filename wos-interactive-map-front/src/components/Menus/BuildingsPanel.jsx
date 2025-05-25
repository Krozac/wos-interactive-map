import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const buildings = [
  {
    id: "Banner",
    value: "Banner",
    className: "Building mythic",
    height: 1,
    width: 1,
    imgSrc: "img/alliance/banner.png",
    labelKey: "buildings.banner",
  },
  {
    id: "Furnace",
    value: "Furnace",
    className: "Building mythic",
    height: 2,
    width: 2,
    imgSrc: "img/furnace.png",
    labelKey: "buildings.furnace",
  },
  {
    id: "HQ",
    value: "HQ",
    className: "Building legendary",
    height: 3,
    width: 3,
    imgSrc: "img/alliance/hq.png",
    labelKey: "buildings.hq",
  },
  {
    id: "Trap",
    value: "Trap",
    className: "Building legendary",
    height: 3,
    width: 3,
    imgSrc: "img/alliance/trap.png",
    labelKey: "buildings.trap",
  },
    {
    id: "Iron",
    value: "Iron",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/iron.png",
    labelKey: "buildings.iron",
  },
    {
    id: "Coal",
    value: "Coal",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/coal.png",
    labelKey: "buildings.coal",
  },
    {
    id: "Farm",
    value: "Farm",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/farm.png",
    labelKey: "buildings.farm",
  },
    {
    id: "Wood",
    value: "Wood",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/wood.png",
    labelKey: "buildings.wood",
  },
];

export default function BuildingsPanel({
  onSelect,
  selectedBuildingType
}) {
  const { t } = useTranslation();

  const handleClick = (building) => {
    if (selectedBuildingType?.value === building.value) {
      onSelect(null);
      window.buildingTypeSelected = null; 
    } else {
      onSelect(building);
      window.buildingTypeSelected = building; 
    }
  };

  return (
    <div id="Buildings">
      {buildings.map((b) => {
        const isSelected = selectedBuildingType?.value === b.value;
        return (
          <div
            key={b.id}
            className={`${b.className} ${isSelected ? "selected" : ""}`}
            data-height={b.height}
            data-width={b.width}
            onClick={() => handleClick(b)}
            style={{ cursor: "pointer" }}
          >
            <img src={b.imgSrc} alt={t(b.labelKey)} />
            <p>{t(b.labelKey)}</p>
          </div>
        );
      })}
    </div>
  );
}


