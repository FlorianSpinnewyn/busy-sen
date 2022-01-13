function addPlan(level) { //ajout du plan et init des salle sur index

    let string = ""

    if (level <= 6) {
        string = "<div><img src='../images/" + level + ".png' usemap='#image-map'> <map name='image-map'>";

        for (let i = 0; i < rooms[level].length; i++) {
            string = string + "<area shape='rect' class='occuped' href='#!' title='rect' alt='rect' coords='" + rooms[level][i][1] + "' shape='rect' id='A" + rooms[level][i][0] + "'>";
            console.log(rooms[level][i])


        }

        string = string + "</map></div>";

        document.getElementById("plan").innerHTML = string;

        var mh = new MapHighlight(document.getElementsByTagName('img')[0], true, true, true);
        mh.highlight();

        for (let i = 0; i < rooms[level].length; i++) {
            var sheet = window.document.styleSheets[3];
            sheet.insertRule('#' + rooms[level][i][0] + ' { transform: rotate( ' + rooms[level][i][2] + 'deg); }', sheet.cssRules.length);
            document.getElementById("A" + rooms[level][i][0]).addEventListener("click", e => {
                document.getElementById('emploie').hidden = false;
                document.getElementById('SelectRoom').innerHTML = rooms[level][i][0];
                socket.emit("getDataRoom", rooms[level][i][0]);
            });
        }
    } else {
        string = "<map name='image-map'>";

        socket.emit('get_img_etage', level);
        socket.on('img-lvl', (data) => {
            console.log(data);

            const img = new Image();
            // change image type to whatever you use, or detect it in the backend 
            // and send it if you support multiple extensions
            img.src = `data:image/jpg;base64,${data.img}`;
            img.setAttribute('usemap','#image-map');
            // Insert it into the DOM
            let div = document.createElement("div");
            div.appendChild(img);
            div.id = 'test';
            document.getElementById('plan').appendChild(div);

            socket.on('infos-rooms-custom', (data2) => {
                console.log(data2);

                for (let i = 0; i < data2.length; i++) {
                    string = string + "<area shape='rect' class='occuped' href='#!' title='rect' alt='rect' coords='" + data2[i].coords[0] +"'shape='rect' id='A" + data2[i].name + "'>";
                }
                string = string + "</map>";
                console.log(string)
                document.getElementById("test").innerHTML += string;

                let mh = new MapHighlight(document.getElementsByTagName('img')[0], true, true, true);
                mh.highlight();

                //Data dans rooms
                let etageTmp = [];
                console.log(data2)
                for(let i = 0; i< data2.length ; i++) {
                    etageTmp.push([data2[i].name, data2[i].coords[0], 0 ]);
                }
                level = 7;
                rooms.push(etageTmp);
                console.log(rooms)
                console.log(level)
                for (let i = 0; i < rooms[level].length; i++) {
                    document.getElementById("A" + rooms[level][i][0]).addEventListener("click", e => {
                        document.getElementById('emploie').hidden = false;
                        document.getElementById('SelectRoom').innerHTML = rooms[level][i][0];
                        socket.emit("getDataRoom", rooms[level][i][0]);
                    });
                }


                
            });
        });
        
    }


}

function actuPlan(date, level) {
    socket.emit("actuPlan", date, level);
}

function displayDate(date) {
    var nodeDate = document.getElementById("today");

    let dateLocale = date.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    nodeDate.innerHTML = dateLocale;
}



function afficheDate(date) {
    var nodeDate = document.getElementById("today");

    let dateLocale = date.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    nodeDate.innerHTML = dateLocale;
}