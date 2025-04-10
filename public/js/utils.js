export function handleLogout() {
    const logoutButton = document.getElementById('logoutButton');
    logoutButton?.addEventListener('click', () => {
        document.cookie = 'authToken=; path=/; max-age=0';
        window.location.href = '/login';
    });
}
