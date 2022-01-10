let chatForm = document.getElementById('chatForm');
let inputMessage = document.getElementById('input');
//let messages = document.getElementById('messages');

// Avertis socket io de l'arrivée dans le chat d'un user
socket.emit('login', '');

// Gestion de l'envoi d'un message
chatForm.addEventListener('submit', event => {
    event.preventDefault(); //remember
    if (input.value) {
        socket.emit('message', inputMessage.value);
        inputMessage.value = '';
    }
});

// Affichage d'un message
socket.on('new-message', msg => {
    let item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
});




