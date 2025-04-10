export async function fetchUsers() {
    const token = getCookie("authToken");
    try {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Users fetched:', result.users);
            return result.users;
        } else {
            console.error('Erreur lors de la récupération des utilisateurs:', result.message);
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
    }
}


function addUserToDiv(user) {
    const usersContainer = document.getElementById('Users');

    if (!usersContainer) {
        return;
    }

    // Create a new user card
    const userCard = document.createElement('div');
    userCard.classList.add('user-card'); // Add a CSS class for styling
    userCard.style.borderTop = '2px solid #ccc';
    userCard.style.borderRadius = '8px';
    userCard.style.margin = '10px';


    // Add user details
    const userContent = `
        <div class="user-avatar"><img src="${user.avatar}" alt="${user.nom}'s Avatar"></div>
        <div class="user-card-info">
            <h3 class="user-name">${user.nom}</h3>
            <div><img src="/img/buttons/stove.png"><p class="user-lvl">Lv. ${user.lvl}</p></div>
            <div><img src="/img/buttons/power.png"><p class="user-power">30 M</p></div>
        </div>
    `;

    userCard.innerHTML = userContent;
    // Add the user card to the container
    usersContainer.appendChild(userCard);

}

export function loadUsers(users) {
    console.log(users);
    users.forEach(user => {
        addUserToDiv(user);
    });
}

async function loginPlayer(user) {
    const loginUrl = "https://wos-giftcode-api.centurygame.com/api/player";
    const fid = user.id; // fid value from your example
    const time = Date.now().toString(); // Current timestamp

    // Concatenate parameters for the hash: sign + fid + time
    const secretKey = "tB87#kPtkxqOS2"; // Provided secret key
    const signString = `fid=${fid}&time=${time}${secretKey}`;

    // Generate the MD5 hash of the concatenated string
    const sign = CryptoJS.MD5(signString).toString(CryptoJS.enc.Hex);

    const data = new URLSearchParams();
    data.append('sign', sign);
    data.append('fid', fid);
    data.append('time', time);

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/plain, */*',
            },
            body: data.toString(),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Player logged in successfully:", result);
            return result;  // Return the result (e.g., any token or session data you need)
        } else {
            console.error("Failed to log in player:", response);
            return null;
        }
    } catch (error) {
        console.error("Error logging in player:", error);
        return null;
    }
}

async function sendGiftCodeToUsers(users, giftCode) {
    const url = "https://wos-giftcode-api.centurygame.com/api/gift_code";
    const secretKey = "tB87#kPtkxqOS2"; // Provided secret key

    const progressbar = document.getElementById("loading-bar");
    const lbstatus = document.getElementById("loading-label");
    const lbvalue = document.getElementById("loading-value");
    const timerDisplay = document.getElementById("timer-display"); // Element to show the timer

    let ct = 0;

    // Estimate time per user (e.g., 2 seconds including retries and API calls)
    const estimatedTimePerUser = 2 * 1000;
    let totalEstimatedTime = users.length * estimatedTimePerUser;

    // Helper function to pause execution for a specified duration
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let elapsedTime = 0;

    const updateTimer = () => {
        const remainingTime = totalEstimatedTime - elapsedTime;
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        timerDisplay.innerHTML = `Time remaining: ${minutes}m ${seconds}s`;

        if (remainingTime > 0) {
            setTimeout(() => {
                elapsedTime += 1000; // Increment elapsed time by 1 second
                updateTimer();
            }, 1000);
        }
    };

    const startTime = Date.now();

    // Start the timer update function
    updateTimer();

    // Loop through each user and send the gift code
    for (const user of users) {
        let loginResult = await loginPlayer(user); // Attempt to login the player
        let retries = 0;

        // Retry logic for 429 response
        while (!loginResult && retries < 3) {
            console.warn(`Login failed for user ${user.id} with 429. Retrying in 60 seconds...`);
            totalEstimatedTime += 60000; // Add 60 seconds to total estimated time
            await sleep(60000); // Wait for 60 seconds before retrying
            loginResult = await loginPlayer(user); // Retry login
            retries++;
        }

        if (!loginResult) {
            console.error(`Skipping user ${user.id} due to failed login after retries.`);
            continue;
        }

        ct++;
        const fid = user.id;
        const time = Date.now().toString();

        // Concatenate parameters for the hash: cdk + fid + time + secretKey
        const signString = `cdk=${giftCode}&fid=${fid}&time=${time}${secretKey}`;
        
        // Generate the MD5 hash of the concatenated string
        const sign = CryptoJS.MD5(signString).toString(CryptoJS.enc.Hex);

        const data = new URLSearchParams();
        data.append('sign', sign);
        data.append('fid', fid);
        data.append('cdk', giftCode);
        data.append('time', time);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json, text/plain, */*',
                },
                body: data.toString(),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`Gift code sent to user ${user.id}:`, result);
                progressbar.style.width = (ct / users.length) * 100 + "%";
                lbstatus.innerHTML = user.nom;
                lbvalue.innerHTML = result.msg;
                totalEstimatedTime = totalEstimatedTime - estimatedTimePerUser;
            } else {
                console.error(`Failed to send gift code to user ${user.id}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error sending gift code to user ${user.id}:`, error);
        }

        // Update elapsed time
        elapsedTime = Date.now() - startTime;
    }
}



export async function loadUsersAndSendGiftCode(giftcode){
        let users = await fetchUsers();
        sendGiftCodeToUsers(users, giftcode);
}


export async function updateUserClient(id, nom, avatar, lvl, power, rallie) {
    const token = getCookie("authToken");

    if (!nom || !avatar || !lvl || isNaN(power) || isNaN(rallie)) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }

    const updateData = { nom, avatar, lvl, power, rallie };

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(updateData),
        });

        const result = await response.json();
        if (response.ok) {
            //console.log('User updated:', result.user);
            //alert('Utilisateur mis à jour avec succès.');
        } else {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', result.message);
            alert('Erreur lors de la mise à jour de l\'utilisateur : ' + result.message);
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
        alert('Erreur réseau lors de la mise à jour de l\'utilisateur.');
    }

    // Refresh the user list or perform another action
    //showUsers(); // Assurez-vous d'avoir une fonction pour actualiser la liste des utilisateurs.
}