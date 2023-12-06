const menuLogin = document.getElementById('menu-login');
const menuLogout = document.getElementById('menu-logout');
const menuProfile = document.getElementById('menu-profile');

function displayMenu() {
    if (isLogout())
        showLoginMenu();
    else
        hideLoginMenu();

    // Add 'click' event to all menu items.
    const excludedItems = ['menu-cart-total', 'menu-logout'];
    let menuItems = document.querySelectorAll(`[id^='menu-']`);
    menuItems = Array.from(menuItems).filter(element => !excludedItems.includes(element.id));

    for (let item of menuItems)
        item.addEventListener('click', navigate);

    menuLogout.addEventListener('click', logout);
}

function isLogout() {
    const user = getSessionLoginUser();
    return user === null;
}

function logout() {
    removeSessionLoginUser();
    location.reload();
}

function showLoginMenu() {
    menuLogin.classList.remove('d-none');

    menuLogout.classList.add('d-none');
    menuProfile.classList.add('d-none');
}

function hideLoginMenu() {
    menuLogin.classList.add('d-none');

    menuLogout.classList.remove('d-none');
    menuProfile.classList.remove('d-none');
}

function navigate(event) {
    const menuId = event.target.id;
    const pageName = menuId.substring(menuId.indexOf('-') + 1);

    loadPage(pageName);
}

function loadPage(pageName) {
    const currentPage = document.getElementById(pageName);

    if (!currentPage) {
        $('#page-content').load(`html/${pageName}.html`);

        removeMenuItemActive();
        setMenuItemActive(pageName);
    }
}

function setMenuItemActive(pageName) {
    const menuItem = document.getElementById(`menu-${pageName}`);

    if (menuItem)
        menuItem.classList.add('active');
}

function removeMenuItemActive() {
    if (document.querySelector('.nav-item a.active') !== null)
        document.querySelector('.nav-item a.active').classList.remove('active');
}