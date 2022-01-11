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
    secure: false
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

app.get('/register', body('register').isLength({ min: 3 }).trim().escape(), (req, res) => {
  res.sendFile(__dirname + '/front/html/register.html');
  req.session.username = undefined;
});

app.get('/login', body('register').isLength({ min: 3 }).trim().escape(), (req, res) => {
  res.sendFile(__dirname + '/front/html/login.html');
  req.session.username = undefined;
});


app.get('/index', body('register').isLength({ min: 3 }).trim().escape(), (req, res) => {
  let sessionData = req.session;
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/index.html');
  }
});

app.get('/reservation', body('register').isLength({ min: 3 }).trim().escape(), (req, res) => {
  let sessionData = req.session;
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/reservation.html');
  }
});

app.get('/profil', body('register').isLength({ min: 3 }).trim().escape(), (req, res) => {
  let sessionData = req.session;
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/profil.html');
  }
});


app.post('/login', body('login').isLength({ min: 3 }).trim().escape(), async (req, res) => {
  const login = req.body.login
  const passorwd = req.body.passorwd
  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    console.log(client)
    if(await signIn(client, {email: login, password: passorwd})) {
      console.log("Mauvais mdp");
    }else {
      console.log("Connexion : ", login, " ", passorwd)
      req.session.username = login;
      req.session.save()
      res.redirect('/');
    }
    
  }
});

app.post('/register', body('register').isLength({ min: 3 }).trim().escape(), (req, res) => {
  const login = req.body.login
  const passorwd = req.body.passorwd
  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    console.log("Inscription : ", login, " ", passorwd)
    req.session.username = login;
    req.session.save()
    res.redirect('/');
  }
});

io.on('connection', (socket) => {

  socket.on("login", () => {
    console.log("Etudiant connecté")
  });

  socket.on("Redirection", (data) => {
    socket.emit("Redirection2", data);
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
      await newReservation(client,{
          name : "C401",
          reservations : {
              start: 12345,
              end : 54321,
              idClient: "fnjdjnfsd",
              _id: new BSON.ObjectId()
      }})
      //await signUp(client, {email: "testazjaz@afbazf", password: "zjehfzek"});
      //console.log(await getLevelData(client,"1"))
      //console.log(await getDataUser(client,"fnjdjnfsd"))

  } catch (e) {
      console.error(e);
  }

}

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function getLevelData(client, level){
  const date = Date.now()
  //console.log(date)
  const room = [];
  const cursor =  await client.db("Projet-Info").collection("Rooms").find({level:level});
  const result  = await cursor.toArray();

  for(let i of result){
      let occupied = false;
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
  return await client.db("Projet-Info").collection("Rooms").findOne({ number:roomNumber});
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
  const result  = await client.db("Projet-Info").collection("Rooms").updateOne({number:data.number},{$set:roomData})
  return 0;
}

async function removeReservation(client, idRoom,idReservations){
  //const result = await client.db("Projet-Info").collection("Rooms").update({ _id : idRoom },{$pull : {reservations: {_id:idReservations}})
}

async function signIn(client,data){
  const user = await client.db("Projet-Info").collection("Users").findOne({ email : data.email});
  const match = await bcrypt.compare(data.password, user.password);
  if(!match) return -1;
  //se loger
  return 0;
}

async function signUp(client,data){
  data.password = await bcrypt.hash(data.password,10);
  const result = await client.db("Projet-Info").collection("Users").findOne({ email : data.email});
  if(result) return -1;
  await client.db("Projet-Info").collection("Users").insertOne(data);
  //se loger
  return 0;
}

