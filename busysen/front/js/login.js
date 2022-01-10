let form = document.getElementById('loginForm');
let input = document.getElementById('username');

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    logger.sendLogin(input.value);
});
