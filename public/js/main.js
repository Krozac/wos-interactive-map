import { setupEventListeners } from './event-listeners.js';
import { showMenu } from './menu-handlers.js';
import { showFormBuilding, closeForm } from './form-handlers.js';
import { handleLogout } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    window.showMenu = showMenu;
    window.showFormBuilding = showFormBuilding;
    window.closeForm = closeForm;
    setupEventListeners();
    handleLogout();
});
