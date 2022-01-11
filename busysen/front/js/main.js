// Redirection
document.getElementById("GoProfil").addEventListener("click", event => {
    socket.emit("Redirection","../html/profil.html", false);
});
document.getElementById("GoReservation").addEventListener("click", event => {
  socket.emit("Redirection","../html/reservation.html", false);
});

document.getElementById('cancel').addEventListener("click", event => 
{
    document.getElementById('emploie').hidden=true;
});

document.getElementById('option').addEventListener("click", event => 
{
    document.getElementById('emploie').hidden=false;
});

socket.on("Redirection2", data => {
  document.location.href=data; 
});



window.onload = function(){

  $.getJSON("https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json", function(data){
    let wifi = (data["members"][0]["age"]);
    document.getElementById("wifi").innerHTML = wifi;
  });
  }
