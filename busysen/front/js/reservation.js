// Redirection
document.getElementById("GoProfil").addEventListener("click", event => {
  socket.emit("Redirection","../html/profil.html", false);
});
document.getElementById("GoHome").addEventListener("click", event => {
  socket.emit("Redirection","../html/index.html", false);
});


document.getElementById('cancel').addEventListener("click", event => 
{
    document.getElementById('supprReservation').hidden=true;
});

socket.on("Redirection2", data => {
document.location.href=data; 
});

days = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi','Samedi']
months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

function tabDates() {
    let tbody = document.getElementById("tabBody");
    let d = new Date();
    if(d.getDay() == 0){
        d.setDate(d.getDate()+1);
    }
    for(let i = 0; i < 7; i++){
        let row = document.createElement('tr'); 
        let rowData = document.createElement("td");
        rowData.innerHTML = days[d.getDay()]+' '+ d.getDate()+' '+months[d.getMonth()];
        row.appendChild(rowData);
        tbody.appendChild(row);
        row.hidden = true;
        row.setAttribute("id",days[d.getDay()]+d.getDate())
        rowData.className = "dateDay";
        rowData.setAttribute("colspan","3");
        d.setDate(d.getDate()+1);
        if(d.getDay() == 0){
            d.setDate(d.getDate()+1);
        }
    }
}
function createResTable(data1, data2, date) {
    let rowBefore = document.getElementById(date);
    let row = document.createElement("tr");
    let buttonCancel = document.createElement("button");
    let rowData1 = document.createElement('td');
    rowData1.innerHTML = data1;
    let rowData2 = document.createElement('td');
    let para = document.createElement("a");
    rowBefore.after(row);
    row.appendChild(rowData1);
    row.appendChild(rowData2);
    rowData2.appendChild(buttonCancel);
    para.innerHTML = data2;
    rowData2.appendChild(para);
    buttonCancel.setAttribute("class","buttonCancel");
    buttonCancel.innerHTML = "x";
    rowData1.setAttribute("class", "horaire");
    rowData2.setAttribute("class", "infos");

    rowBefore.hidden = false;

    buttonCancel.addEventListener("click", event => 
    {
        document.getElementById('supprReservation').hidden=false;
    });
}


tabDates();
createResTable("8h<br>-<br>10h", "2", "Mercredi12");
createResTable("8h<br>-<br>10h", "3", "Jeudi13");
createResTable("8h<br>-<br>10h", "4", "Vendredi14");
createResTable("8h<br>-<br>10h", "5", "Samedi15");
createResTable("8h<br>-<br>10h", "6", "Lundi17");
createResTable("8h<br>-<br>10h", "7", "Mardi18");
createResTable("8h<br>-<br>10h", "8", "Mercredi19");