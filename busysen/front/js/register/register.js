let form = document.getElementById('InscritpionForm');
let input = document.getElementById('email');
let input_mdp = document.getElementById('mdp');

//Envoi de l'inscription via le module
form.addEventListener('submit', event => {
    event.preventDefault();
    ajax_inscritpion.sendInscription(input.value, input_mdp.value);
});