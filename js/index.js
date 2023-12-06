const pageTitle = document.getElementById('page-title');

window.addEventListener('load', windowLoad);

function windowLoad() {
    displayMenu();
    displayMenuCartTotal();

    loadPage('home');
}