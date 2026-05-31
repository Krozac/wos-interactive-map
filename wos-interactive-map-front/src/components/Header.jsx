import React from 'react';
import '../styles/header.css';
import User from './User';
import LanguageSelector from './LanguageSelector';
import LogoutButton from '../components/LogoutButton';
import ScreenshotButton from './ScreenshotButton';

export default function Header({ user, onEdit }) {
  return (
    <div id="Head">
      <LanguageSelector />
      <ScreenshotButton />
      <LogoutButton onLogout={() => {}} />
      <User user={user} onEdit={onEdit} />
    </div>
  );
}
