async function addGuild() {
    const Nom = document.getElementById('guildName').value;
    const acronym = document.getElementById('guildAcronym').value;
    const color = document.getElementById('guildColor').value;

    const token = getCookie("authToken");
    if (!Nom || !acronym || !color) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }

    try {
        const response = await fetch('/api/guilds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ Nom, acronym, color }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Guild ajoutée avec succès : ' + JSON.stringify(result.guild));
        } else {
            alert('Erreur lors de l\'ajout de la guild : ' + result.message);
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
        alert('Erreur réseau lors de l\'ajout de la guild.');
    }

    showGuilds();
}


async function fetchGuilds() {
    const token = getCookie("authToken");
    try {
        const response = await fetch('/api/guilds', { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Guilds fetched:', result.guilds);
            return result.guilds;
        } else {
            console.error('Erreur lors de la récupération des guilds:', result.message);
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
    }
}


async function deleteGuild(id) {
    const token = getCookie("authToken");
    try {
        const response = await fetch(`/api/guilds/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            console.log('Guild supprimée');
        } else {
            const result = await response.json();
            console.error('Erreur lors de la suppression de la guild:', result.message);
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
    }

    showGuilds();
}
