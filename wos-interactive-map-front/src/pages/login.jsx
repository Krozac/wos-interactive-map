import { useState } from 'react';
import '../styles/login.css';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

export default function Login() {
  const [id, setId] = useState('');
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      // Step 1: Validate ID with external API
      const res = await fetch('/validate-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Got a token and basic playerData.fid
      const { token, playerData: raw } = data;

      // Store token for subsequent calls
      localStorage.setItem('authToken', token);

      // Step 2: Fetch the “real” User document from your DB by ID
      const userRes = await fetch(`/api/users/byfid/${raw.fid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userJson = await userRes.json();

      if (!userRes.ok) {
        setError(userJson.message || 'Failed to load user data');
        return;
      }

      // Save the full user object
      localStorage.setItem('PlayerData', JSON.stringify(userJson.user));

      // Finally, redirect
      window.location.href = '/map';
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
    }
  };

  return (
    <>
      <LanguageSelector />
      <img
        src="img/home_logo.83ba690.png"
        alt="Logo"
        className="home_logo"
        draggable={false}
      />
      <div id="overlay">
        <div id="modal">
          <h2>{t('menu-login')}</h2>
          <form
            id="idForm"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <p>{t('menu-login-prompt')}</p>
            <input
              id="modalPlayerId"
              type="text"
              name="id" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={t('menu-login-preview')}
            />
            <button type="submit">{t('menu-login')}</button>
          </form>
          <p id="modalError" style={{ display: error ? 'block' : 'none' }}>
            {error}
          </p>
        </div>
      </div>
    </>
  );
}
