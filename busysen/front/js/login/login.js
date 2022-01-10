let form = document.getElementById('loginForm');
let input = document.getElementById('email');
let input_mdp = document.getElementById('mdp');

//Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    loggerLogin.sendLogin(input.value, input_mdp.value);
});