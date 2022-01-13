const BSON = require('bson');

/**** Import npm libs ****/

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session")({
  // CIR2-chat encode in sha256
  secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    secure: false,
    level : 0
  }
});
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = "mongodb+srv://admin:12345@cluster0.r7qlx.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri);
main().catch(console.error)

/**** Import project libs ****/

const states = require('./back/modules/states');
const Theoden = require('./back/models/Theoden');
const { cp } = require('fs');

/**** Project configuration ****/

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Init of express, to point our assets
app.use(express.static(__dirname + '/front/'));
app.use(urlencodedParser);
app.use(session);

// Configure socket io with session middleware
io.use(sharedsession(session, {
  // Session automatiquement sauvegardée en cas de modification
  autoSave: true
}));

// Détection de si nous sommes en production, pour sécuriser en https
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  session.cookie.secure = true // serve secure cookies
}

/**** Code ****/

app.get('/', (req, res) => {
  let sessionData = req.session;

  // Test des modules 
  states.printServerStatus();
  states.printProfStatus();
  let test = new Theoden();

  // Si l'utilisateur n'est pas connecté
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/index.html');
  }
});

app.get('/new', body('new').isLength({ min: 3 }).trim().escape(), (req, res) => {
  let sessionData = req.session;
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } 
  else if(!sessionData.admin) {
    res.sendFile(__dirname + '/front/html/login.html');
  }
  else{
    res.sendFile(__dirname + '/front/html/new.html');
  }
});

app.get('/register', body('register').isLength({ min: 3 }).trim().escape(), (req, res) => {
  res.sendFile(__dirname + '/front/html/register.html');
  req.session.destroy();
});

app.get('/login', body('login').isLength({ min: 3 }).trim().escape(), (req, res) => {
  res.sendFile(__dirname + '/front/html/login.html');
  req.session.destroy();
});

app.get('/index/:tagId', function(req, res) {
  res.sendFile(__dirname + '/front/html/index.html');
});

app.get('/index', body('index').isLength({ min: 3 }).trim().escape(), (req, res) => {
  let sessionData = req.session;
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/index.html');
  }
});

app.get('/reservation', body('reservation').isLength({ min: 3 }).trim().escape(), (req, res) => {
  let sessionData = req.session;
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/reservation.html');
  }
});

app.get('/profil', body('profil').isLength({ min: 3 }).trim().escape(), (req, res) => {
  let sessionData = req.session;
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/profil.html');
  }
});


app.post('/login', body('login').isLength({ min: 3 }).trim().escape(), async (req, res) => {
  const login = req.body.login
  const password = req.body.password
  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    const result = await signIn(client, { email: login, password: password });
    if (result == -2) {
      res.send('wrong_mdp');
    }
    else if(result == -1){
      res.send('wrong_email');
    }
    else {
      console.log("Connexion : ", login, " ", password)
      if(result == 1) req.session.admin = 1;
      req.session.username = login;
      req.session.save()
      res.redirect('/');
    }
    
  }
});

app.post('/register', body('login').isLength({ min: 3 }).trim().escape(), async (req, res) => {  
  const login = req.body.login
  const password = req.body.password

  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    
    const result = await signUp(client, { email: login, password: password });

    if (result == -1) {
      res.send('already_exist');
    }
    else {
      console.log("Inscription : ", login, " ", password)
      req.session.username = login;
      req.session.save()
      res.redirect('/');
    }
  }
});

let level = 0;

io.on('connection', (socket) => {

  socket.on("addlevel", () => {
    socket.emit("addlevel2", level);
  });

  socket.on("addlevelbtn", () => {
    socket.emit("addlevel", level++);
  });

  socket.on("login", () => {
    console.log("Etudiant connecté")
  });

  socket.on("Redirection", (data) => {
    socket.emit("Redirection2", data);
  });

  socket.on("actuPlan", async (date, level) => {
    let tab = await getLevelData(client, level,date);
    console.log(tab)
    socket.emit("actuPlan2", tab);
  });

  socket.on("getDataRoom", async(nameRoom) => {
    let object = await getDataRoom(client, nameRoom);
    console.log(object)
    socket.emit("getDataRoom2", object,nameRoom);
  });
  
  socket.on("Reservation", async (date1,date2,salle) => {
    //let object = {number : salle, reservations : { start : date1, end : date2, id : "test", _id: new BSON.ObjectId()}};
    //console.log(object)
    //await newReservation(client, object)
    console.log(salle);
    await newReservation(client,{
      name : salle,
      reservations : {
          start: date2,
          end : date1,
          idClient: socket.handshake.session.username,
          _id: new BSON.ObjectId()
    }});
  });

  socket.on("create_etage", async (salles) => {
    console.log(salles)
    for (let i = 0; i < salles.length; i++) {
      //console.log(salles[i])
      if(await createRoom(client, salles[i]) == -1) {
        //console.log(salles[i]);
        socket.emit('erreur_crea_etage',salles[i].name);
      }else {
        await createRoom(client, salles[i]);
        socket.emit('valid');
      }
    }
  });

  socket.on("get_reservation", async () => {
    socket.emit('reservation_client', await getDataUser(client, socket.handshake.session.username),socket.handshake.session.username);
  });

  socket.on("supp_reservation", async (name, idReservations) => {
    console.log("Suppresion Reservation", name, idReservations);
    await removeReservation(client, name, idReservations);
  });

  socket.on('image_serv', async (etage, image) => {
    if (await createLevel(client, { name: etage, img: image })) socket.emit('err_create_bdd');
    else await createLevel(client, { name: etage, img: image });

  });

  socket.on('get_img_etage', async (level) => {
    socket.emit('img-lvl', await getLevel(client, level));
    socket.emit('infos-rooms-custom', await getRoomCustom(client, level));
  });

  socket.on('recup_nb_lvl' , async (lvl) => {
        while(await getLevel(client,lvl)) {
          lvl++;
        }
        console.log(lvl);
        socket.emit('found-nb-lvl',lvl);
  })

  socket.on("filtrer",async (date,time,minutes,capacity,projector)=>{
    console.log(date)
    console.log(time)
    console.log(capacity)
    console.log(projector)
    console.log('time '+time);
    let date1 = new Date(date);
    date1.setHours(time)
    date1.setMinutes(minutes);
    date1 = date1.getTime();

    let date2 = new Date(date);

    date2.setDate(date2.getDate() +1);
    date2 = date2.getTime();
    console.log(date1,date2)
    projector = projector ? 1:0;
    let result = await filterData(client,{capacity:parseInt(capacity),projector:projector});
    result.forEach(obj=>obj.reservations = obj.reservations.filter(e=>e.start >= date1 && e.end <= date2));
    console.log(result)
    socket.emit("filtered",result)
  });

  socket.on("isAdmin", ()=>{
    console.log(socket.handshake.session.admin);
    if(socket.handshake.session.admin) {
      socket.emit('admin');
    }else {
      socket.emit('no-admin');
    }
  });

});

http.listen(4201, () => {
  console.log('Serveur lancé sur le port 4201');
});

async function main() {
  // we'll add code here soon
  
  try {
      await client.connect();
      //console.log(client)
      await listDatabases(client);
      //console.log(await getLevelData(client,'1'));
      //console.log(await getDataUser(client,'fnjdjnfsd'));
      //console.log(await getDataRoom(client,'C401'));

      /*
      await newReservation(client,{
          name : "C401",
          reservations : {
              start: 12345,
              end : 54321,
              idClient: "fnjdjnfsd",
              _id: new BSON.ObjectId()
      }})*/
      //console.log(await signUp(client, {email: "testazjaz@afbazf", password: "zjehfzek"}));

  } catch (e) {
      console.error(e);
  }

}

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function getLevelData(client, level, date){
  const room = [];
  const cursor =  await client.db("Projet-Info").collection("Rooms").find({level:level});
  const result  = await cursor.toArray();
  for(let i of result){
      let occupied = false;
      console.log("test")
      for(let j of i.reservations){
          console.log("test")
          console.log(i)
          if(j.start <= date && j.end >= date) {
              occupied = true;
              break;
          }
      }
      if(!occupied) room.push(i.name)
  }

  return room;
}

async function getDataUser(client,idClient){
  const cursor = await client.db("Projet-Info").collection("Rooms").find({'reservations.idClient': idClient});
  return await cursor.toArray();
}

async function getDataRoom(client, roomNumber){
  return await client.db("Projet-Info").collection("Rooms").findOne({ name:roomNumber});
}

async function newReservation(client, data){
  /*
  data : {
  number : "C956",
  reservation : {
      start: 12345,
      end : 54321,
      id: ObjectId("61dd4152058f9c92376dea7b")         // id utilisateur
  }
  */
  const roomData = await client.db("Projet-Info").collection("Rooms").findOne({ name: data.name});
  //console.log(roomData)
  roomData.reservations.push(data.reservations);
  //console.log(roomData)
  if(!roomData) return -1;
  const result  = await client.db("Projet-Info").collection("Rooms").updateOne({name:data.name},{$set:roomData})
  return 0;
}

async function removeReservation(client, nameRoom, idReservations) {
  await client.db("Projet-Info").collection("Rooms").updateOne({ name: nameRoom }, { $pull: { reservations: { _id: new BSON.ObjectID(idReservations) } } });
}

async function signIn(client,data){
  const user = await client.db("Projet-Info").collection("Users").findOne({ email : data.email});
  //const match = await bcrypt.compare(data.password, user.password);
  if(!user) return -1;
  if(data.password != user.password) return -2;
  //se loger
  if(user.admin) return 1;
  return 0;
}

async function signUp(client,data){
  const result = await client.db("Projet-Info").collection("Users").findOne({ email : data.email});
  if(result) return -1;
  await client.db("Projet-Info").collection("Users").insertOne(data);
  //se loger
  return 0;
}

async function createRoom(client, data) {
  const test = await client.db("Projet-Info").collection("Rooms").findOne({ name: data.name });
  console.log(test);
  if (test) return -1;
  const result = await client.db("Projet-Info").collection("Rooms").insertOne(data);
  return 0;
}

async function filterData(client, {capacity: capacity =20,projector:projector = 0}){
  const cursor = await client.db("Projet-Info").collection("Rooms").find({capacity:{$gte : capacity},projector:{$gte : projector}});
  return await cursor.toArray()

}

async function createLevel(client, data) {
  const test = await client.db("Projet-Info").collection("CustomLevels").findOne({ name: data.name });
  if (test) return -1;
  const result = await client.db("Projet-Info").collection("CustomLevels").insertOne(data);
  //console.log(result);
  return 0;
}

async function getLevel(client, level) {
  return await client.db("Projet-Info").collection("CustomLevels").findOne({ name: level });
}

async function getRoomCustom(client, level) {
  const cursor = await client.db("Projet-Info").collection("Rooms").find({ level: level });
  return await cursor.toArray();
}