// ToggleButton.jsx
import React from 'react';

export default function ToggleButton({ onClick }) {
  return <button id="toggleButton" onClick={onClick}> <i id="eyeIcon" class="fas fa-eye"></i></button>;
}

