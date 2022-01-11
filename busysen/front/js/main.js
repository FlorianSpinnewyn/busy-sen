console.log("llzefdze")
// Avertis socket io de l'arrivée dans le chat d'un user
socket.emit('login', '');




// Redirection
document.getElementById("GoProfil").addEventListener("click", event => {
    socket.emit("Redirection","../html/profil.html", false);
});
document.getElementById("GoReservation").addEventListener("click", event => {
  socket.emit("Redirection","../html/reservation.html", false);
});

socket.on("Redirection2", data => {
  document.location.href=data; 
});

document.getElementById("logOut").addEventListener("click", e => {
    e.preventDefault();
    window.location.href("./login");
});