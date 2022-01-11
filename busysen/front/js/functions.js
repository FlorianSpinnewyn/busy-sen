function addPlan(level) {
    let string = ""
 
    string = "<div><img src='../images/" + level + ".png' usemap='#image-map'> <map name='image-map'>";

    for(let i = 0; i<rooms[level].length;i++) {
        string = string + "<area shape='rect' class='rect' href='#!' title='rect' alt='rect' coords='" + rooms[level][i][1] + "' shape='rect' id='" + rooms[level][i][0] + "'>";
        console.log(rooms[level][i])
        

    }
    
    string = string + "</map></div>";

    document.getElementById("plan").innerHTML=string;

    var mh = new MapHighlight(document.getElementsByTagName('img')[0], true, true, true);
    mh.highlight();

    console.log(document.getElementById("C401"))


    for(let i = 0; i<rooms[level].length;i++) {
        var sheet = window.document.styleSheets[3];
        sheet.insertRule('#' + rooms[level][i][0] + ' { transform: rotate( ' + rooms[level][i][2] + 'deg); }', sheet.cssRules.length);
        document.getElementById(rooms[level][i][0]).addEventListener("click", e => {
            alert("tu as cliqué sur la salle " + rooms[level][i][0])
        });
    }


  }
