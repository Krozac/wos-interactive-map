import React from 'react';
import '../styles/header.css';
import User from './User';
import LanguageSelector from './LanguageSelector';
import LogoutButton from '../components/LogoutButton';

export default function Header({ user, onEdit }) {
  return (
    <div id="Head">
      <LanguageSelector />
      <LogoutButton onLogout={() => {}} />
      <User user={user} onEdit={onEdit} />
    </div>
  );
}
