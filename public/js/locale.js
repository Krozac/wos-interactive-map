async function loadLanguageButtons() {
    const languages = ['en_GB', 'fr_FR', 'de_DE']; // List of available languages
    const buttonContainer = document.getElementById('language-buttons');

    for (const lang of languages) {
        try {
            const response = await fetch(`./locale/${lang}.json`);
            const data = await response.json();

            const button = document.createElement('button');
            button.innerHTML = `
                <img src="${data['language-flag']}" alt="${data['language-name']} flag">
                <p>${data['language-name']}</p>
            `;
            button.onclick = () => setLanguage(lang);
            buttonContainer.appendChild(button);
        } catch (error) {
            console.error(`Error loading language file for ${lang}:`, error);
        }
    }
}

// Function to set the language in a cookie
function setLanguage(lang) {
    // Créer une date d'expiration 400 jours dans le futur
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 400); // Ajouter 400 jours à la date actuelle

    // Définir le cookie avec la date d'expiration
    document.cookie = `language=${lang}; path=/; expires=${expiryDate.toUTCString()};`;
    // Recharger la page pour appliquer la nouvelle langue
    location.reload();
}

async function getString(key) {
    const lang = getCookie('language') || 'en_us'; // Default to 'en_us' if no language cookie is found
    try {
        const response = await fetch(`./locale/${lang}.json`);
        const data = await response.json();
        return data[key] || key; // Return the string or the key if not found
    } catch (error) {
        console.error(`Error retrieving string for ${key}:`, error);
        return key; // Fallback to the key if an error occurs
    }
}

// Helper function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Function to load and apply localized strings to HTML elements
async function applyLocalization() {
    const lang = getCookie('language') || 'en_us'; // Default to 'en_us' if no language cookie is found
    try {
        const response = await fetch(`./locale/${lang}.json`);
        const data = await response.json();

        // Find all elements with a data-i18n-key attribute and set their text content
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (data[key]) {
                element.textContent = data[key];
            }
        });

        const flagElement = document.getElementById('selected-flag');
        if (flagElement && data['language-flag']) {
            flagElement.src = data['language-flag'];
        }

    } catch (error) {
        console.error(`Error applying localization for ${lang}:`, error);
    }
}

// Helper function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


document.addEventListener('DOMContentLoaded', () => {
    loadLanguageButtons();
    applyLocalization();
});
