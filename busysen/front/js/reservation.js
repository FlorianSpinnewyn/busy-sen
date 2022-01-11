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

days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

function tabDates() {
  let tbody = document.getElementById("tabBody");
  let d = new Date();
  if(d.getDay() == 0){
      d.setDate(d.getDate()+1);
  }
  if(d.getDay() == 6){
      d.setDate(d.getDate()+2);
  }
  for(let i = 0; i < 5; i++){
      let row = document.createElement('tr'); 
      let rowData = document.createElement("td");
      rowData.innerHTML = days[d.getDay()-1]+' '+ d.getDate()+' '+months[d.getMonth()];
      row.appendChild(rowData);
      tbody.appendChild(row);
      row.hidden = true;
      row.setAttribute("id",days[d.getDay()-1])
      rowData.className = "dateDay";
      rowData.setAttribute("colspan","3");
      d.setDate(d.getDate()+1);
      if(d.getDay() == 6){
          d.setDate(d.getDate()+2);
      }
  }
}
function createResTable(data1, data2, day) {
  let rowBefore = document.getElementById(days[day]);
  let row = document.createElement("tr");
  let rowData1 = document.createElement('td');
  rowData1.innerHTML = data1;
  let rowData2 = document.createElement('td');
  rowData2.innerHTML = data2;
  rowBefore.after(row);
  row.appendChild(rowData1);
  row.appendChild(rowData2);
  rowData1.setAttribute("class", "horaire");
  rowData2.setAttribute("class", "infos");

  rowBefore.hidden = false;
  
}
tabDates();
createResTable("8h<br>-<br>10h", "C804", 4);
createResTable("8h<br>-<br>10h", "C104", 3);
createResTable("8h<br>-<br>10h", "C104", 3);
createResTable("8h<br>-<br>10h", "C104", 1);
createResTable("8h<br>-<br>10h", "C104", 4);
createResTable("10h<br>-<br>12h30", "C204", 2);