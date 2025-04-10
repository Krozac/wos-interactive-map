function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Exemple de mise à jour du contenu de la section "Head"
document.addEventListener('DOMContentLoaded', () => {
    const authToken = getCookie('authToken');
    const playerData = getCookie('playerData') ? JSON.parse(getCookie('playerData')) : null;
    if (playerData) {
        // Remplir les données dans le DOM
        const avatar = document.querySelector('#Head .avatar');
        const name = document.querySelector('#Head .name');
        const stoveLevel = document.querySelector('#Head .furnace');
        const region = document.querySelector('#Head .server');

        // Vérifiez si les éléments existent avant de les mettre à jour
        if (avatar) avatar.src = playerData.avatar_image || "default-avatar.png";
        if (name) name.textContent = playerData.nickname || "Nom non défini";
        if (stoveLevel) stoveLevel.textContent = `${playerData.stove_lv || "Inconnu"}`;
        if (region) region.textContent = `${playerData.kid || "Inconnue"}`;
    } else {
        console.log("Aucune donnée d'utilisateur trouvée dans les cookies.");
    }
});