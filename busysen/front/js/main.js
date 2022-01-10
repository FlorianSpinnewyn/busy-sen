let chatForm = document.getElementById('chatForm');
let inputMessage = document.getElementById('input');
//let messages = document.getElementById('messages');

// Avertis socket io de l'arrivée dans le chat d'un user
socket.emit('login', '');