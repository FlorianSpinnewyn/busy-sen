// Redirection

if (document.getElementById("GoHome")) {
  document.getElementById("GoHome").addEventListener("click", event => {
    socket.emit("Redirection", "/index", false);
  });
}

if (document.getElementById("GoReservation")) {
  document.getElementById("GoReservation").addEventListener("click", event => {
    socket.emit("Redirection", "/reservation", false);
  });
}


socket.on("Redirection2", data => {
  document.location.href = data;
});

if (document.getElementById("logOut")) {
  document.getElementById("logOut").addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "/login";
  });
}
