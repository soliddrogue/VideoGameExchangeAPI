

// Function to retrieve the currently logged-in user ID
function getCurrentUserId(req) {
    // Check if there is a user session in the request
    if (req.session && req.session.user) {
        // If a user session is present, return the user ID
        return req.session.user.id;
    }

    // If no user session or unable to retrieve user ID, return null or handle accordingly
    return null;
}

// Function to retrieve games associated with a user
async function getUserGames(userId) {
    const response = await fetch(`/games/user/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user games');
    }
    return response.json();
}

// Function to display user's games on the page
function displayUserGames(userGames) {
    const list_el = document.querySelector("#games");
    userGames.forEach(gameData => {
        const game_el = createGameElement(gameData);
        list_el.appendChild(game_el);
    });
}


async function saveGameInfo(gameData) {
    // Ensure that the 'user' field is present in the gameData object
    if (!gameData.user) {
        throw new Error('User ID is required');
    }

    const response = await fetch('/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
    });

    if (!response.ok) {
        throw new Error('Failed to save game');
    }
}
