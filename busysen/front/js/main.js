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

addPlan(level);
socket.emit("actuPlan", day, level);

//Actu du slider
slider.oninput = function() {
  output.innerHTML = this.value + "h";
  day.setHours(slider.value);
  actuPlan(day.getTime(), level);
}

//date en jour
afficheDate(day)

document.getElementById("levelActu").innerHTML = level;


//Affichage des salle dispo
socket.on("actuPlan2",   (freeRooms) => {
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

let tmp;

socket.on("getDataRoom2", (obj, nameRoom) => {
  console.log("les reservation de la salle ",nameRoom ," sont ", obj);
  document.getElementById('SelectRoomPlace').innerHTML=obj.capacity;
  document.getElementById('SelectRoomEtage').innerHTML=obj.level;
  document.getElementById('SelectRoomProj').innerHTML=obj.projector;
  tmp = nameRoom;
  let tabForCalend = [];
  for(let o of obj.reservations) {
    let dateTmp = new Date(+day);
    dateTmp.setHours(0);
    dateTmp.setMinutes(0);
    dateTmp.setSeconds(0);
    if((o.start-dateTmp.getTime())<100000000){
      console.log("reservation pour cette salle ajd: ",o)
      tabForCalend.push(o);
    }
  }
  displayDate(tabForCalend)
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

let heuredebut = document.getElementById('debut');
let heureFin = document.getElementById('fin');

document.getElementById('formReservation').addEventListener("submit", event => {
  event.preventDefault();
  let firstDateReservee = new Date(+day);
  let secondDateReservee = new Date(+firstDateReservee);
  firstDateReservee.setHours(heuredebut.value[0] + heuredebut.value[1])
  firstDateReservee.setMinutes(heuredebut.value[3] + heuredebut.value[4])
  secondDateReservee.setHours(heureFin.value[0] + heureFin.value[1])
  secondDateReservee.setMinutes(heureFin.value[3] + heureFin.value[4])
  console.log(heuredebut.value,heureFin.value)
  console.log(firstDateReservee,secondDateReservee,day)
  secondDateReservee.setSeconds(0);
  secondDateReservee.setMilliseconds(0);
  firstDateReservee.setSeconds(0);
  firstDateReservee.setMilliseconds(0);
  if(secondDateReservee > firstDateReservee){
    socket.emit("Reservation", secondDateReservee.getTime(),firstDateReservee.getTime(), tmp)
    window.location.href='/index/' + level;
  }
  else
    console.log('erreur');
});

function displayDate(tabForCalend){
  let tab = [];
  for(let i = 0 ; i< tabForCalend.length ; i++) {
      console.log(tabForCalend[i]);
      let dateStart = new Date(tabForCalend[i].start)
      let dateEnd = new Date(tabForCalend[i].end)
      console.log(dateEnd)
      let totalStart = 0;
      totalStart = (dateStart.getHours() * 60 + dateStart.getMinutes()) - 480
      let totalEnd = 0;
      totalEnd = dateEnd.getHours() * 60 + dateEnd.getMinutes()- 480;
      console.log({start: totalStart, end: totalEnd})
      tab.push({start: totalStart, end: totalEnd, name : tabForCalend[i].idClient})
  }

  const events = [ { start: 360, end: 540, name: "test@test" }, { start: 30, end: 150, name: "test@test" } ];
  console.log(events, tab);
  layOutDay(tab);
}




