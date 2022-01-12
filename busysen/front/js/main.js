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

let tmp;

socket.on("getDataRoom2", (obj, nameRoom) => {
  console.log("les reservation de la salle ",nameRoom ," sont ", obj);
  document.getElementById('SelectRoomPlace').innerHTML=obj.capacity;
  document.getElementById('SelectRoomEtage').innerHTML=obj.level;
  document.getElementById('SelectRoomProj').innerHTML=obj.projector;
  tmp = nameRoom;
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

document.getElementById('buttonReservation').addEventListener("click", event => {
  let firstDateReservee = new Date(+day);
  let secondDateReservee = new Date(+firstDateReservee);
  firstDateReservee.setHours(heuredebut.value[0] + heuredebut.value[1])
  firstDateReservee.setMinutes(heuredebut.value[3] + heuredebut.value[4])
  secondDateReservee.setHours(heureFin.value[0] + heureFin.value[1])
  secondDateReservee.setMinutes(heureFin.value[3] + heureFin.value[4])
  console.log(heuredebut.value,heureFin.value)
  console.log(firstDateReservee,secondDateReservee,day)

  if(secondDateReservee > firstDateReservee){
    socket.emit("Reservation", secondDateReservee.getTime(),firstDateReservee.getTime(), tmp)
    window.location.href='/index/' + level;
  }
  else
    console.log('erreur');
});

const containerHeight = 400;
const containerWidth = 620;
const minutesinDay = 60 * 12;
let collisions = [];
let width = [];
let leftOffSet = [];


// ------ code du calendrier basé sur https://www.cssscript.com/day-view-calendar-vanilla-javascript/
// append one event to calendar
var createEvent = (height, top, left, units) => {

  let node = document.createElement("DIV");
  node.className = "event";
  node.innerHTML = 
  "<span class='title'> Réservé - </span><span class='location'> Nom Prénom </span>";

  // Customized CSS to position each event
  
  node.style.width = (containerWidth/units) + "px";
  node.style.height = height + "px";
  node.style.top = top + 85 + "px";
  node.style.left = 500 + left + "px";

  document.getElementById("events").appendChild(node);
}

/* 
collisions is an array that tells you which events are in each 30 min slot
- each first level of array corresponds to a 30 minute slot on the calendar 
  - [[0 - 30mins], [ 30 - 60mins], ...]
- next level of array tells you which event is present and the horizontal order
  - [0,0,1,2] 
  ==> event 1 is not present, event 2 is not present, event 3 is at order 1, event 4 is at order 2
*/

function getCollisions (events) {

  //resets storage
  collisions = [];

  for (var i = 0; i < 24; i ++) {
    var time = [];
    for (var j = 0; j < events.length; j++) {
      time.push(0);
    }
    collisions.push(time);
  }

  events.forEach((event, id) => {
    let end = event.end;
    let start = event.start;
    let order = 1;

    while (start < end) {
      timeIndex = Math.floor(start/30);

      while (order < events.length) {
        if (collisions[timeIndex].indexOf(order) === -1) {
          break;
        }
        order ++;
      }

      collisions[timeIndex][id] = order;
      start = start + 30;
    }

    collisions[Math.floor((end-1)/30)][id] = order;
  });
};

/*
find width and horizontal position

width - number of units to divide container width by
horizontal position - pixel offset from left
*/
function getAttributes (events) {

  //resets storage
  width = [];
  leftOffSet = [];

  for (var i = 0; i < events.length; i++) {
    width.push(0);
    leftOffSet.push(0);
  }

  collisions.forEach((period) => {

    // number of events in that period
    let count = period.reduce((a,b) => {
      return b ? a + 1 : a;
    })

    if (count > 1) {
      period.forEach((event, id) => {
        // max number of events it is sharing a time period with determines width
        if (period[id]) {
          if (count > width[id]) {
            width[id] = count;
          }
        }

        if (period[id] && !leftOffSet[id]) {
          leftOffSet[id] = period[id];
        }
      })
    }
  });
};

var layOutDay = (events) => {

// clear any existing nodes
var myNode = document.getElementById("events");
myNode.innerHTML = '';

  getCollisions(events);
  getAttributes(events);

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let units = width[id];
    if (!units) {units = 1};
    let left = (containerWidth / width[id]) * (leftOffSet[id] - 1) + 110;
    if (!left || left < 0) {left = 20};
    createEvent(height, top, left, units);
  });
}

//default events given
const events = [ {start: 30, end: 150}, {start: 610, end: 670} ];

layOutDay(events);

//function to generate mock events for testing
function generateMockEvents (n) {
  let events = [];
  let minutesInDay = 60 * 12;

  while (n > 0) {
    let start = Math.floor(Math.random() * minutesInDay)
    let end = start + Math.floor(Math.random() * (minutesInDay - start));
    events.push({start: start, end: end})
    n --;
  }

  return events;
}