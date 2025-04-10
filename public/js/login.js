// Function to get a specific cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to delete a specific cookie by name
function deleteCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// Handle the form submission for login
document.getElementById('idForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const playerId = document.getElementById('modalPlayerId').value;
    const modalError = document.getElementById('modalError');

    // Make the request to validate the player ID with the server
    fetch('/validate-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: playerId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store the token and player data in cookies (expires in 1 hour)
            document.cookie = `authToken=${data.token}; path=/; max-age=3600; SameSite=Lax`; // Expire in 1 hour
            document.cookie = `playerData=${JSON.stringify(data.playerData)}; path=/; max-age=3600; SameSite=Lax`; // Expire in 1 hour

            // Now, instead of redirecting immediately, send a request to the map with the token
            const token = getCookie('authToken'); // Retrieve token from cookies

            // Make a request to /map with the token in the Authorization header
            fetch('/map', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                },
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/map';
                } else if (response.status === 401) {
                    deleteCookie('authToken'); // Token is no longer valid, delete it
                    deleteCookie('playerData'); // Optionally delete playerData
                    //window.location.href = '/login';
                } else {
                    console.error('Unexpected response:', response.statusText);
                    modalError.style.display = 'block';
                    modalError.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                deleteCookie('authToken'); // Ensure token is deleted on error
                deleteCookie('playerData');
                //window.location.href = '/login';
            });

        } else {
            modalError.style.display = 'block';
            modalError.textContent = data.message || 'Erreur de validation de l\'ID.';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        modalError.style.display = 'block';
        modalError.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('authToken'); // Retrieve the authToken from cookies
    if (token) {
       // Make a request to check if the token is still valid
       fetch('/map', {
           method: 'GET',
           headers: {
               'Authorization': `Bearer ${token}`,
           },
       })
       .then(response => {
           console.log('Response:', response); // Log the response for debugging
           // Redirection is handled server-side, no client-side redirection needed
       })
       .catch(error => {
           console.error('Error:', error);
           deleteCookie('authToken'); // Ensure token is deleted on error
           deleteCookie('playerData');
       });
    }
});
