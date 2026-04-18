import { useEffect, useState } from 'react';
import i18n from '../i18n';
import Cookies from 'js-cookie';
import '../styles/languageSelector.css'; // adjust path if needed

export default function LanguageMenu() {
    const [languages, setLanguages] = useState([]);
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [open, setOpen] = useState(false);
  
    useEffect(() => {
      const supportedLangs = ['fr_FR','en_GB', 'de_DE', 'sv_SE'];
  
      Promise.all(
        supportedLangs.map(async (lang) => {
          const res = await fetch(`/locales/${lang}.json`);
          const data = await res.json();
          return { code: lang, name: data['language-name'], flag: data['language-flag'] };
        })
      ).then(setLanguages);
    }, []);
  
    const changeLanguage = (lang) => {
      i18n.changeLanguage(lang);
      setCurrentLang(lang);
      Cookies.set('i18next', lang, { expires: 365 });
      setOpen(false);
    };
  
    const current = languages.find((l) => l.code === currentLang);
  
    return (
      <div className="lang-menu">
        <button id="languageButton" onClick={() => setOpen(!open)}>
          <i class="fas fa-globe-europe"></i>
          {current && (
            <img id="selected-flag" src={current.flag} alt={current.name} />
          )}
        </button>
        {open && (
          <ul className="lang-dropdown">
            {languages.map((lang) => (
              <li key={lang.code} onClick={() => changeLanguage(lang.code)} className="lang-option">
                <img src={lang.flag} alt={lang.name} className="lang-flag" />
                {lang.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
