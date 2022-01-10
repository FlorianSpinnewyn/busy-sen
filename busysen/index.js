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


app.post('/login', body('login').isLength({ min: 3 }).trim().escape(), (req, res) => {
  const login = req.body.login
  const passorwd = req.body.passorwd
  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    console.log("Connexion : ", login," ", passorwd)
    req.session.username = login;
    req.session.save()
    res.redirect('/');
  }
});

app.post('/register', body('login').isLength({ min: 3 }).trim().escape(), (req, res) => {
  const login = req.body.login
  const passorwd = req.body.passorwd
  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    console.log("Inscription : ", login," ", passorwd)
    req.session.username = login;
    req.session.save()
    res.redirect('/');
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
    console.log("Connexion : ", login," ", passorwd)
    req.session.username = login;
    req.session.save()
    res.redirect('/');
  }
});

io.on('connection', (socket) => {

});

http.listen(4201, () => {
  console.log('Serveur lancé sur le port 4201');
});

