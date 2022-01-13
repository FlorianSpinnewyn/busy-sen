function addPlan(level) { //ajout du plan et init des salle sur index
    let string = ""
 
    string = "<div><img src='../images/" + level + ".png' usemap='#image-map'> <map name='image-map'>";

    for(let i = 0; i<rooms[level+1].length;i++) {
        string = string + "<area shape='rect' class='occuped' href='#!' title='rect' alt='rect' coords='" + rooms[level+1][i][1] + "' shape='rect' id='A" + rooms[level+1][i][0] + "'>";
        console.log(rooms[level+1][i])
        

    }
    
    string = string + "</map></div>";

    document.getElementById("plan").innerHTML=string;

    var mh = new MapHighlight(document.getElementsByTagName('img')[0], true, true, true);
    mh.highlight();

    console.log(document.getElementById("C401"))


    for(let i = 0; i<rooms[level+1].length;i++) {
        var sheet = window.document.styleSheets[3];
        sheet.insertRule('#' + rooms[level+1][i][0] + ' { transform: rotate( ' + rooms[level+1][i][2] + 'deg); }', sheet.cssRules.length);
        document.getElementById("A" + rooms[level+1][i][0]).addEventListener("click", e => {
            document.getElementById('emploie').hidden=false;
            document.getElementById('SelectRoom').innerHTML=rooms[level+1][i][0];
            socket.emit("getDataRoom", rooms[level+1][i][0]);
        });
    }


}

function actuPlan(date, level) {
    socket.emit("actuPlan", date, level);
}

function displayDate(date){
    var nodeDate = document.getElementById("today");

    let dateLocale = date.toLocaleString('fr-FR',{
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'});

    nodeDate.innerHTML = dateLocale;
}



function afficheDate(date){
    var nodeDate = document.getElementById("today");

    let dateLocale = date.toLocaleString('fr-FR',{
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'});

    nodeDate.innerHTML = dateLocale;
}