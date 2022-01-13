// Redirection
document.getElementById("GoNew").addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "/new";
  });
document.getElementById("GoHome").addEventListener("click", event => {
    socket.emit("Redirection", "./index/0", false);
});


document.getElementById('cancel').addEventListener("click", event => {
    document.getElementById('supprReservation').hidden = true;
});

socket.on("Redirection2", data => {
    document.location.href = data;
});

days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

function tabDates() {
    let tbody = document.getElementById("tabBody");
    let d = new Date();
    if (d.getDay() == 0) {
        d.setDate(d.getDate() + 1);
    }
    for (let i = 0; i < 7; i++) {
        let row = document.createElement('tr');
        let rowData = document.createElement("td");
        rowData.innerHTML = days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
        row.appendChild(rowData);
        tbody.appendChild(row);
        row.hidden = true;
        row.setAttribute("id", days[d.getDay()] + d.getDate())
        rowData.className = "dateDay";
        rowData.setAttribute("colspan", "3");
        d.setDate(d.getDate() + 1);
        if (d.getDay() == 0) {
            d.setDate(d.getDate() + 1);
        }
    }
}
function createResTable(data1, data2, date, count) {
    let rowBefore = document.getElementById(date);
    let row = document.createElement("tr");
    let buttonCancel = document.createElement("button");
    let rowData1 = document.createElement('td');
    rowData1.innerHTML = data1;
    let rowData2 = document.createElement('td');
    let para = document.createElement("div");
    para.setAttribute("class", "infoAnnulation");
    rowBefore.after(row);
    row.appendChild(rowData1);
    row.appendChild(rowData2);
    rowData2.appendChild(buttonCancel);
    para.innerHTML = data2;
    rowData2.appendChild(para);
    buttonCancel.setAttribute("class", "buttonCancel");
    buttonCancel.setAttribute("id", count);

    buttonCancel.innerHTML = "Annuler sa réservation";
    rowData1.setAttribute("class", "horaire");
    rowData2.setAttribute("class", "infos");

    rowBefore.hidden = false;

    buttonCancel.addEventListener("click", event => {
        document.getElementById('supprReservation').hidden = false;
    });
}


//tabDates();
/*
createResTable("8h<br>-<br>10h", "2", "Mercredi12");
createResTable("8h<br>-<br>10h", "3", "Jeudi13");
createResTable("8h<br>-<br>10h", "4", "Vendredi14");
createResTable("8h<br>-<br>10h", "5", "Samedi15");
createResTable("8h<br>-<br>10h", "6", "Lundi17");
createResTable("8h<br>-<br>10h", "7", "Mardi18");
createResTable("8h<br>-<br>10h", "8", "Mercredi19");
*/

socket.emit('get_reservation');

socket.on('reservation_client', (data, user) => {
    tabReservationsUser = data;
    //console.log(data);
    let count = 0;
    for (let i = 0; i < tabReservationsUser.length; i++) {
        for (let j = 0; j < tabReservationsUser[i].reservations.length; j++) {
            let debut = tabReservationsUser[i].reservations[j].start;
            let fin = tabReservationsUser[i].reservations[j].end;
            let salle = tabReservationsUser[i].name;
            let etage = tabReservationsUser[i].level;
            let capacity = tabReservationsUser[i].capacity;
            let projector = tabReservationsUser[i].projector;

            let date = new Date(debut);
            let date2 = new Date(fin);

            if (projector == 1) {
                projector = "Oui";
            } else {
                projector = "Non";
            }

            let tbody = document.getElementById("tabBody");

            let row = document.createElement('tr');
            let rowData = document.createElement("td");
            rowData.innerHTML = days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()];
            row.appendChild(rowData);
            tbody.appendChild(row);
            row.hidden = true;
            row.setAttribute("id", days[date.getDay()] + date.getDate())
            rowData.className = "dateDay";
            rowData.setAttribute("colspan", "3");
            if(date.getMinutes() < 10 && date2.getMinutes() < 10 ){
                createResTable(date.getHours() + "h0" + date.getMinutes() + " - " + date2.getHours() + "h0" + date2.getMinutes(), "Etage : " + etage + " Salle : " + salle + " Capacité : " + capacity + " Projecteur : " + projector, days[date.getDay()] + date.getDate(), tabReservationsUser[i].reservations[j]._id);
            }
            else if(date.getMinutes() < 10 && date2.getMinutes() > 9 ){
                createResTable(date.getHours() + "h0" + date.getMinutes() + " - " + date2.getHours() + "h" + date2.getMinutes(), "Etage : " + etage + " Salle : " + salle + " Capacité : " + capacity + " Projecteur : " + projector, days[date.getDay()] + date.getDate(), tabReservationsUser[i].reservations[j]._id);
            }
            else if(date.getMinutes() > 9 && date2.getMinutes() < 10 ){
                createResTable(date.getHours() + "h" + date.getMinutes() + " - " + date2.getHours() + "h0" + date2.getMinutes(), "Etage : " + etage + " Salle : " + salle + " Capacité : " + capacity + " Projecteur : " + projector, days[date.getDay()] + date.getDate(), tabReservationsUser[i].reservations[j]._id);
            }
            else{
                createResTable(date.getHours() + "h" + date.getMinutes() + " - " + date2.getHours() + "h" + date2.getMinutes(), "Etage : " + etage + " Salle : " + salle + " Capacité : " + capacity + " Projecteur : " + projector, days[date.getDay()] + date.getDate(), tabReservationsUser[i].reservations[j]._id);
            }

        }
    }
    for (let i = 0; i < tabReservationsUser.length; i++) {
        for (let j = 0; j < tabReservationsUser[i].reservations.length; j++) {
            //console.log(tabReservationsUser[i]._id, tabReservationsUser[i].reservations[j]._id);
            let btn = document.getElementById(tabReservationsUser[i].reservations[j]._id);
            btn.addEventListener('click', () => {
                console.log(tabReservationsUser[i]);
                let btn2 = document.getElementById('validation');
                btn2.addEventListener('click', () => {
                    //console.log(tabReservationsUser[i]._id, tabReservationsUser[i].reservations[j]._id);

                    socket.emit('supp_reservation', tabReservationsUser[i].name, tabReservationsUser[i].reservations[j]._id);

                    window.location.href = './reservation';
                });

            })
        }
    }
});


