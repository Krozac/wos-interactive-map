export default function LogoutButton() {
  const handleLogout = () => {
    // Clear stored auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('PlayerData');

    // Optional: clear cookies if needed
    // document.cookie = "authToken=; Max-Age=0; path=/;";

    // Redirect to login or home
    window.location.href = '/';
  };

  return (
    <button id="logoutButton" onClick={handleLogout}>
      <i className="fas fa-sign-out-alt"></i>
    </button>
  );
}