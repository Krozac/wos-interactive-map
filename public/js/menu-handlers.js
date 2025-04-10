export function showMenu(menuId) {
    const menus = document.querySelectorAll('#InsideMenu > div');
    menus.forEach(menu => {
        if (menu.id === menuId) {
            menu.classList.toggle('visible');
        } else {
            menu.classList.remove('visible');
        }
    });
}
