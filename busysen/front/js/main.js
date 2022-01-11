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


document.getElementById('cancel').addEventListener("click", event => 
{
    document.getElementById('emploie').hidden=true;
});


//Variable
let day = new Date() //date en seconde lors l'ouverture de la page
day.setHours(slider.value);
day.setMinutes(0);
day.setSeconds(0);

//Creation de la page suivant l'étage
let level = 1;
addPlan(level)

//Actu du slider
slider.oninput = function() {
  output.innerHTML = this.value + "h";
  day.setHours(slider.value);
  actuPlan(day.getTime(), level);
}

//date en jour
displayDate(day)


//Affichage des salle dispo
socket.on("actuPlan2", (freeRooms) => {
  console.log("les salles libre a ", day ," sont ", freeRooms);
});

socket.on("getDataRoom2", (freeRooms, nameRoom) => {
  console.log("les reservation de la salle ",nameRoom ," sont ", freeRooms);
});
