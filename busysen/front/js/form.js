
let search = document.getElementById('buttonSearch');
let count = 0;

search.addEventListener("click", (e) => {
    let date = document.getElementById('dateFiltre').value;
    date = date.split('-');
    let time = document.getElementById('timeFiltre').value;
    time = time.split(':');
    let capacity = document.getElementById('capacity').value;
    let projector = document.getElementById('vid').checked;
    e.preventDefault();

    if (capacity == '') {
        capacity = 0;
    }

    let date_search = new Date();
    let month;
    switch (date_search.getMonth()) {
        case 0:
            month = '01';
            break;
        case 1:
            month = '02';
            break;
        case 2:
            month = '03';
            break;
        case 3:
            month = '04';
            break;
        case 4:
            month = '05';
            break;
        case 5:
            month = '06';
            break;
        case 6:
            month = '07';
            break;
        case 7:
            month = '08';
            break;
        case 8:
            month = '09';
            break;
        case 9:
            month = '10';
            break;
        case 10:
            month = '11';
            break;
        case 11:
            month = '12';
            break;
    }
    if (date[1] == month) {
        if (date[2] <= date_search.getDate() + 7) {
            if (time[0] != ['']) {
                if (8 <= time[0] && time[0] <= 20) {
                    document.getElementById('err_search').innerHTML = "";
                    socket.emit("filtrer", date, time[0], time[1], capacity, projector);
                }
                else document.getElementById('err_search').innerHTML = "Vous pouvez réserver une salle entre 8h & 20h";
            } else {
                socket.emit("filtrer", date, time[0], time[1], capacity, projector);
                document.getElementById('err_search').innerHTML = "";
            }
        } else document.getElementById('err_search').innerHTML = "Vous pouvez réserver une salle une semaine à l'avance maximum";
    } else document.getElementById('err_search').innerHTML = "Vous pouvez réserver une salle une semaine à l'avance maximum";


});

socket.on("filtered", result => {
    let liste = document.getElementById('liste');

    if (count != 0) {
        liste.removeChild(liste.children[0]);
    }

    let p = document.createElement("p");

    liste.appendChild(p);
    p.textContent = "Les salles disponibles correspondant à votre recherche sont : "
    for (let i = 0; i < result.length - 1; i++) {
        p.textContent += result[i].name + ", ";
    }
    p.textContent += result[result.length - 1].name;
    count++;
});