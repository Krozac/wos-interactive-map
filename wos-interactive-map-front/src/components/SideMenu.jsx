import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SideMenu({ onSelect, selectedKey }) {
  const items = [
    { key: 'Buildings', icon: '/img/buttons/buildings.png', labelKey: 'menu-buildings' },
    { key: 'Furnace-Placed', icon: '/img/buttons/territory.png', labelKey: 'menu-territory' },
    { key: 'Users', icon: '/img/buttons/players.png', labelKey: 'menu-members' },
    { key: 'Gift', icon: '/img/buttons/gift.png', labelKey: 'menu-gift' },
    { key: 'Alliance', icon: '/img/buttons/alliance.png', labelKey: 'menu-alliance' },  ];
  const { t } = useTranslation();

  const handleClick = (key) => {
    if (key === selectedKey) {
      onSelect(null); // deselect if same item clicked
    } else {
      onSelect(key);
    }
  };

  return (
    <div id="SideMenu">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => handleClick(item.key)}
          className={selectedKey === item.key ? 'active' : ''}
        >
          <img src={item.icon} alt={item.key} />
          <p>{t(item.labelKey)}</p>
        </button>
      ))}
    </div>
  );
}
