
let form = document.getElementById('loginForm');
let input = document.getElementById('username');
let inputMp = document.getElementById('mp');

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    logger.sendLogin(input.value,inputMp.value);
});

