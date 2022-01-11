// Redirection
document.getElementById("GoProfil").addEventListener("click", event => {
    socket.emit("Redirection","../html/profil.html", false);
});
document.getElementById("GoHome").addEventListener("click", event => {
    socket.emit("Redirection","../html/index.html", false);
});

socket.on("Redirection2", data => {
  document.location.href=data; 
});

document.getElementById("logOut").addEventListener("click", e => {
  e.preventDefault();
  window.location.href="/login";
});