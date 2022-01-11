// Avertis socket io de l'arrivée dans le chat d'un user
socket.emit('login', '');

// Redirection
document.getElementById("GoProfil").addEventListener("click", event => {
    socket.emit("Redirection","/profil", false);
});
document.getElementById("GoReservation").addEventListener("click", event => {
  socket.emit("Redirection","/reservation", false);
});

socket.on("Redirection2", data => {
  document.location.href=data; 
});

document.getElementById("logOut").addEventListener("click", e => {
    e.preventDefault();
    window.location.href="/login";
});