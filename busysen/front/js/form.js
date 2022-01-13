let form = document.getElementById('formFiltre');
let search = document.getElementById('buttonSearch');


form.addEventListener("submit", (e) =>{
    let date = document.getElementById('date').value;
    let time = document.getElementById('time').value;
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
    console.log(result);
    let liste = document.getElementById('liste');
    console.log(liste);
    let p = document.createElement("p");
    console.log(p);
    liste.appendChild(p);
    p.textContent = "Les salles disponibles correspondant à votre recherche sont : "
    for(let i=0; i<result.length-1; i++){
        p.textContent += result[i].name + ", ";
    }
    p.textContent += result[result.length-1].name;
});