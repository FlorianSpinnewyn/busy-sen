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

                let requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };

                fetch("http://localhost:4202/rooms/"+rooms[level][i][0], requestOptions)
                    .then(response => response.json())
                    .then(obj => {
                        // Tente de rendre le planning responsive
                        let messageWidth = document.getElementById("emploie").offsetWidth;
                        let container = document.getElementById("containerPlanning");
                        let days = document.getElementById("events");
                        console.log("messageWidth: "+messageWidth);
                        container.style.width = 0.5*messageWidth+"px";
                        days.style.width = 0.5*messageWidth - 90 +"px";

                        let node = document.getElementsByClassName("event");
                        let leftPosition = document.getElementById("events").getBoundingClientRect().left;
                        console.log("leftpos: "+node.length);
                        for(let i = 0; i < node.length; i++){
                            node[i].setAttribute("id","event"+i);
                            console.log(node[i]);
                            let newNode = document.getElementById("event"+i);
                            console.log(i);
                            console.log(newNode);
                            newNode.style.width = 0.5*messageWidth - 90 +"px";
                            console.log((0.5*messageWidth) - 90 + "px");
                            newNode.style.left = leftPosition + "px";
                        }

                        // Met les infos de la salle
                        console.log("les reservation de la salle ",obj.name ," sont ", obj);
                        document.getElementById('SelectRoomPlace').innerHTML=obj.capacity;
                        document.getElementById('SelectRoomEtage').innerHTML=obj.level;
                        if(obj.projector==1){
                            document.getElementById('SelectRoomProj').src="../images/projector.png";
                        }
                        else{
                            document.getElementById('SelectRoomProj').src = "../images/noprojector.png";
                        }
                        tmp = obj.name;
                        let tabForCalend = [];
                        for(let o of obj.reservations) {
                            let dateTmp = new Date(+day);
                            dateTmp.setHours(0);
                            dateTmp.setMinutes(0);
                            dateTmp.setSeconds(0);
                            if((o.start-dateTmp.getTime())<100000000 && o.start > dateTmp.getTime()){
                                console.log("reservation pour cette salle ajd: ",o)
                                tabForCalend.push(o);
                            }
                        }
                        displayDate(tabForCalend)
                    })
                    .catch(error => console.log('error', error));
            });
        }
    } else {
        string = "<map name='image-map'>";

        socket.emit('get_img_etage', level);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        console.log(level)
        fetch("http://localhost:4202/levels/custom/"+level, requestOptions)
            .then(response => response.json())
            .then(result => {
                let data = result.level
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
                let data2 = result.room
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
                        let requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                        };

                        fetch("http://localhost:4202/rooms/"+rooms[level][i][0], requestOptions)
                            .then(response => response.json())
                            .then(obj => {
                                // Tente de rendre le planning responsive
                                let messageWidth = document.getElementById("emploie").offsetWidth;
                                let container = document.getElementById("containerPlanning");
                                let days = document.getElementById("events");
                                console.log("messageWidth: "+messageWidth);
                                container.style.width = 0.5*messageWidth+"px";
                                days.style.width = 0.5*messageWidth - 90 +"px";

                                let node = document.getElementsByClassName("event");
                                let leftPosition = document.getElementById("events").getBoundingClientRect().left;
                                console.log("leftpos: "+node.length);
                                for(let i = 0; i < node.length; i++){
                                    node[i].setAttribute("id","event"+i);
                                    console.log(node[i]);
                                    let newNode = document.getElementById("event"+i);
                                    console.log(i);
                                    console.log(newNode);
                                    newNode.style.width = 0.5*messageWidth - 90 +"px";
                                    console.log((0.5*messageWidth) - 90 + "px");
                                    newNode.style.left = leftPosition + "px";
                                }

                                // Met les infos de la salle
                                console.log("les reservation de la salle ",obj.name ," sont ", obj);
                                document.getElementById('SelectRoomPlace').innerHTML=obj.capacity;
                                document.getElementById('SelectRoomEtage').innerHTML=obj.level;
                                if(obj.projector==1){
                                    document.getElementById('SelectRoomProj').src="../images/projector.png";
                                }
                                else{
                                    document.getElementById('SelectRoomProj').src = "../images/noprojector.png";
                                }
                                tmp = obj.name;
                                let tabForCalend = [];
                                for(let o of obj.reservations) {
                                    let dateTmp = new Date(day);
                                    dateTmp.setHours(0);
                                    dateTmp.setMinutes(0);
                                    dateTmp.setSeconds(0);
                                    console.log(o.start)
                                    console.log(dateTmp)
                                    if((o.start-dateTmp.getTime())<100000000 && o.start > dateTmp.getTime()){
                                        console.log("reservation pour cette salle ajd: ",o)
                                        tabForCalend.push(o);
                                    }
                                }
                                displayDate(tabForCalend)
                            })
                            .catch(error => console.log('error', error));
                    });
                }
            })
            .catch(error => console.log('error', error));
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