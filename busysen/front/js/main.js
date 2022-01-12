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
let level = parseInt(window.location.href[window.location.href.length - 1]);

addPlan(level)
socket.emit("actuPlan", day, level);

//Actu du slider
slider.oninput = function() {
  output.innerHTML = this.value + "h";
  day.setHours(slider.value);
  actuPlan(day.getTime(), level);
}

//date en jour
displayDate(day)

document.getElementById("levelActu").innerHTML = level;


//Affichage des salle dispo
socket.on("actuPlan2", (freeRooms) => {
  for(let i = 0; i<rooms[level+1].length;i++) {
    document.getElementById(rooms[level+1][i][0]).style.borderColor ='red' ;
  }
  console.log("les salles libre a ", day ," sont ", freeRooms);
  console.log(freeRooms)
  for( let i = 0; i<freeRooms.length;i++) { 
    document.getElementById(freeRooms[i]).style.borderColor ='green' ;
  }
  for(let i = 0; i<rooms[level+1].length;i++) {
    document.getElementById(rooms[level+1][i][0]).style.transform = "rotate( " + rooms[level+1][i][2] + "deg)"
  }
});

socket.on("getDataRoom2", (freeRooms, nameRoom) => {
  console.log("les reservation de la salle ",nameRoom ," sont ", freeRooms);
});


/**  Change date with arrows */

weekday = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi','Samedi']
months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

document.getElementById('datePlus').addEventListener("click", event => {
  day.setDate(day.getDate() + 1);
  let d = weekday[day.getDay()];
  let today = new Date();
  document.getElementById("today").innerHTML = d + " " + (day.getDate()) + " " + months[day.getMonth()] + " " + day.getFullYear();
  if (day.getDay() == 6) {
    day.setDate(day.getDate() +1);
  }
  document.getElementById("dateMoins").disabled = false;
  if (day.getDate() == today.getDate() + 7) {
    document.getElementById("datePlus").disabled = true;
  }
  socket.emit("actuPlan", day, level);
});

document.getElementById('dateMoins').addEventListener("click", event => {
  day.setDate(day.getDate() - 1);
  let d = weekday[day.getDay()];
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  document.getElementById("today").innerHTML = d + " " + (day.getDate()) + " " + months[day.getMonth()] + " " + day.getFullYear();
  if (day.getDay() == 1) {
    day.setDate(day.getDate() -  1);
  }

  day.setHours(0);
  day.setMinutes(0);
  day.setSeconds(0);
  console.log("day", day);
  console.log(today);
  if (day.getDate() == today.getDate()) {
    document.getElementById("dateMoins").disabled = true;
  }
  document.getElementById("datePlus").disabled = false;
  socket.emit("actuPlan", day, level);
});

document.getElementById('niveauPlus').addEventListener("click", event => {
  document.location.href='/index/' + (level+1);
});



document.getElementById('niveauMoins').addEventListener("click", event => {
  document.location.href='/index/' + (level-1);
});