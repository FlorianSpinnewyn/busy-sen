// Redirection
document.getElementById("GoHome").addEventListener("click", event => {
    socket.emit("Redirection","/index", false);
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