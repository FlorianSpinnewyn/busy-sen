
let search = document.getElementById('buttonSearch');
let count=0;

search.addEventListener("click", (e) =>{
    let date = document.getElementById('dateFiltre').value;
    let time = document.getElementById('timeFiltre').value;
    time=time.split(':');
    let capacity = document.getElementById('capacity').value;
    let projector = document.getElementById('vid').checked;
    e.preventDefault();

    if(capacity == '') {
        capacity=0;
    }
    socket.emit("filtrer",date,time[0],time[1],capacity,projector);

});

socket.on("filtered",result=>{
    let liste = document.getElementById('liste');

    if(count !=0){
        liste.removeChild(liste.children[0]);
    }
    let p = document.createElement("p");

    liste.appendChild(p);
    p.textContent = "Les salles disponibles correspondant à votre recherche sont : "
    for(let i=0; i<result.length-1; i++){
        p.textContent += result[i].name + ", ";
    }
    p.textContent += result[result.length-1].name;
    count++;
});