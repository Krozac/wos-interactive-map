import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fitText } from "../../utils/fitText";
import BuildingItem from "../BuildingItem";
export const buildings = [
  {
    id: "Banner",
    value: "Banner",
    className: "Building mythic",
    height: 1,
    width: 1,
    imgSrc: "img/alliance/banner.png",
    labelKey: "buildings.alliance.banner",
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
    labelKey: "buildings.alliance.hq",
  },
  {
    id: "Trap",
    value: "Trap",
    className: "Building legendary",
    height: 3,
    width: 3,
    imgSrc: "img/alliance/trap.png",
    labelKey: "buildings.alliance.trap",
  },
    {
    id: "Iron",
    value: "Iron",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/iron.png",
    labelKey: "buildings.alliance.iron",
  },
    {
    id: "Coal",
    value: "Coal",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/coal.png",
    labelKey: "buildings.alliance.coal",
  },
    {
    id: "Farm",
    value: "Farm",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/farm.png",
    labelKey: "buildings.alliance.farm",
  },
    {
    id: "Wood",
    value: "Wood",
    className: "Building common",
    height: 2,
    width: 2,
    imgSrc: "img/alliance/wood.png",
    labelKey: "buildings.alliance.wood",
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
        const label = t(b.labelKey);

        return (
          <BuildingItem
            key={b.id}
            building={b}
            label={label}
            isSelected={isSelected}
            onSelect={(building) => {
              if (isSelected) {
                onSelect(null);
                window.buildingTypeSelected = null;
              } else {
                onSelect(building);
                window.buildingTypeSelected = building;
              }
            }}
          />
        );
      })}
    </div>
  );
}


