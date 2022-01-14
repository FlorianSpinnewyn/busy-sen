// Avertis socket io de l'arrivée dans le chat d'un user
socket.emit('login', '');

let tabTmp = []

// Redirection
document.getElementById("GoNew").addEventListener("click", e => {
  e.preventDefault();
  window.location.href = "/new";
});
document.getElementById("GoHome").addEventListener("click", e => {
  e.preventDefault();
  window.location.href = "/index/0";
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
    document.getElementById('emploie').style.removeProperty("display");
    document.getElementById('emploie').hidden=true;
});


//Variable
let day = new Date() //date en seconde lors l'ouverture de la page
day.setHours(slider.value);
day.setMinutes(0);
day.setSeconds(0);

//Creation de la page suivant l'étage
//let level = parseInt(window.location.href[window.location.href.length - 1]);
console.log(document.location.href[29])
let level = document.location.href[28];
if(document.location.href[29] &&  parseInt(document.location.href[29])+1 > 0){
  level += document.location.href[29];
}
level = parseInt(level)

console.log(level)

addPlan(level);
sleep(100).then(() => {

  let requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch("http://localhost:4202/levels?level="+level+"&date="+day.getTime(), requestOptions)
      .then(response => response.json())
      .then(result =>{
        sleep(1000).then(() => {
          settimer(result);
        });
      })
      .catch(error => console.log('error', error));
});


console.log(rooms)

//Actu du slider
slider.oninput = function() {
  output.innerHTML = this.value + "h";
  day.setHours(slider.value);
  let requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch("http://localhost:4202/levels/?level="+level+"&date="+day.getTime(), requestOptions)
      .then(response => response.json())
      .then(result => {
        sleep(100).then(() => {
          settimer(result);
        });
      })
      .catch(error => console.log('error', error));
}

//date en jour
afficheDate(day)

document.getElementById("levelActu").innerHTML = level;

function settimer(freeRooms) {
  try{
  if(level > 6) {level = 7}
  console.log("les salles libre a ", day ," sont ", freeRooms);
  console.log(document.getElementById("containerPlanning"));

  for(let i = 0; i<rooms[level].length;i++) {
    console.log(rooms[level][i][0]);
    document.getElementById(rooms[level][i][0]).style.borderColor ='red' ;
    document.getElementById(rooms[level][i][0]).style.background = '#ec8e8849';
  }
  for( let i = 0; i<freeRooms.length;i++) {
    document.getElementById(freeRooms[i]).style.borderColor ='green' ;
    document.getElementById(freeRooms[i]).style.background ='#89ee9f4d';
  }
  for(let i = 0; i<rooms[level].length;i++) {
    document.getElementById(rooms[level][i][0]).style.transform = "rotate( " + rooms[level][i][2] + "deg)"
  }
  } catch(e){}
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Affichage des salle dispo


let tmp;



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

  let requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch("http://localhost:4202/levels/?level="+level+"&date="+day.getTime(), requestOptions)
      .then(response => response.json())
      .then(result => {
        sleep(500).then(() => {
          settimer(result);
        });
      })
      .catch(error => console.log('error', error));
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



  let requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch("http://localhost:4202/levels/?level="+level+"&date="+day.getTime(), requestOptions)
      .then(response => response.json())
      .then(result => {
        sleep(100).then(() => {
          settimer(result);
        });
      })
      .catch(error => console.log('error', error));
});

document.getElementById('niveauPlus').addEventListener("click", event => {
  let level2 = document.location.href[28];
  if(document.location.href[29] &&  parseInt(document.location.href[29])+1 > 0){
    level2 += document.location.href[29];
  }
  level2 = parseInt(level2)
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch("http://localhost:4202/levels/max", requestOptions)
      .then(response => response.text())
      .then(result => {
        if(level2+1 == result){event.preventDefault();return}
        document.location.href='/index/' + (level2+1);
      })

});



document.getElementById('niveauMoins').addEventListener("click", event => {
  let level2 = document.location.href[28];
  if(document.location.href[29] &&  parseInt(document.location.href[29])+1 > 0){
    level2 += document.location.href[29];
  }
  level2 = parseInt(level2)
  if(level2 ==0){event.preventDefault();return}
  document.location.href='/index/' + (level2-1);
});

let heuredebut = document.getElementById('debut');
let heureFin = document.getElementById('fin');

document.getElementById('buttonReservation').addEventListener("click", event => {
  event.preventDefault();
  //if(obj.admin  && !admin){this.target.hidden =true;}
  //this.target.hidden =false;
  let firstDateReservee = new Date(+day);
  if (firstDateReservee.getDay() == 0) {
    firstDateReservee.setDate(firstDateReservee.getDate() - 1);
  }
  let secondDateReservee = new Date(+firstDateReservee);
  firstDateReservee.setHours(heuredebut.value[0] + heuredebut.value[1]);
  firstDateReservee.setMinutes(heuredebut.value[3] + heuredebut.value[4]);
  secondDateReservee.setHours(heureFin.value[0] + heureFin.value[1]);
  secondDateReservee.setMinutes(heureFin.value[3] + heureFin.value[4]);
  console.log(heuredebut.value, heureFin.value)
  console.log(firstDateReservee, secondDateReservee, day)
  if (firstDateReservee.getHours(heuredebut.value[0] + heuredebut.value[1]) > 7 && ((secondDateReservee.getHours(heureFin.value[0] + heureFin.value[1]) < 20) || (secondDateReservee.getHours(heureFin.value[0] + heureFin.value[1]) == 20 && secondDateReservee.getMinutes(heureFin.value[3] + heureFin.value[4]) == 0))) {
    console.log("jour " + firstDateReservee.getDay())
    if (firstDateReservee.getDay() != 6 || (firstDateReservee.getDay() == 6 && ((secondDateReservee.getHours(heureFin.value[0] + heureFin.value[1]) < 12) || (secondDateReservee.getHours(heureFin.value[0] + heureFin.value[1]) == 12 && secondDateReservee.getMinutes(heureFin.value[3] + heureFin.value[4]) == 0)))) {
      console.log(ReserveOnReserve(tabTmp, firstDateReservee.getTime(), secondDateReservee.getTime()));
      if(ReserveOnReserve(tabTmp, firstDateReservee.getTime(), secondDateReservee.getTime())){
        secondDateReservee.setSeconds(0);
        secondDateReservee.setMilliseconds(0);
        firstDateReservee.setSeconds(0);
        firstDateReservee.setMilliseconds(0);
        if (secondDateReservee > firstDateReservee) {
          var requestOptions = {
            method: 'POST',
            redirect: 'follow'
          };
      
          fetch("http://localhost:4202/rooms/"+tmp+"/reservations?date1="+firstDateReservee.getTime()+"&date2="+secondDateReservee.getTime(), requestOptions)
              .then(response => response.json())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
          window.location.href='/index/' + level;
      }
      else {
        alert("La salle est déja reservée.");
      }
      }
      else alert("L'heure de début doit être inférieure à l'heure de fin.");
    }
    else {
      alert("La réservation doit être comprise entre 8h00 et 12h00.");
    }
  }
  else {
    if (firstDateReservee.getDay() != 6) {
      alert("La réservation doit être comprise entre 8h00 et 20h00.");
    } else alert("La réservation doit être comprise entre 8h00 et 12h00.");
  }
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




function ReserveOnReserve(tabTmp, debut, fin) {
  console.log(tabTmp);
  for (let i = 0; i < tabTmp.length; i++) {
    if ((debut >= tabTmp[i].start) && (debut <= tabTmp[i].end)) {
      return 0;
    }
    else if ((fin >= tabTmp[i].start) && (fin <= tabTmp[i].end)) {
      return 0;
    }
    else if ((debut <= tabTmp[i].start) && (fin >= tabTmp[i].end)) {
      return 0;
    }
  }
  return 1;
}