const BSON = require('bson');

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const sharedsession = require("express-socket.io-session");
const { body, validationResult } = require('express-validator');
const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');

const http = require('http').Server(app);
const io = require('socket.io')(http);

const hostname = '127.0.0.1';
const port = 3002;

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

app.use(express.static(__dirname + '/front/'));
app.use(urlencodedparser);
app.use(session);



http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

async function main() {
    // we'll add code here soon
    const uri = "mongodb+srv://admin:12345@cluster0.r7qlx.mongodb.net/test?retryWrites=true&w=majority"
    const client = new MongoClient(uri);
    try {

        await client.connect();

        await listDatabases(client);
        //await signUp(client,{email:"fds",password:"fdns"})
        /*await newReservation(client,{
            name : "C401",
            reservations : {
                start: 12345,
                end : 54321,
                idClient: "fnjdjnfsd",
                _id: new BSON.ObjectId()
        }})*/
        //console.log(await getLevelData(client,"1"))
        //await getDataUser(client,"fnjdjnfsd")
        //await removeReservation(client,"C401",un id que tu prends avec getDataUser)
        await filterData(client,{capacity:40,projector:1})
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function getLevelData(client, level,date){
    const room = [];
    const cursor =  await client.db("Projet-Info").collection("Rooms").find({level:level});
    const result  = await cursor.toArray();
    if(result.isEmpty()) return -1;

    for(let i of result){
        let occupied = false;
        for(let j of i.reservations){
            if(j.start <= date && j.end >= date) {
                occupied = true;
                break;
            }
        }
        if(!occupied) room.push(i.name);
    }

    return room;
}

async function getDataUser(client,idClient){
    const cursor = await client.db("Projet-Info").collection("Rooms").find({'reservations.idClient': idClient});
    const arrayRoom = await cursor.toArray();
    if(arrayRoom.isEmpty()) return -1;

    arrayRoom.forEach(obj=>obj.reservations = obj.reservations.filter(e=>e.idClient==idClient));
    return arrayRoom
}

async function getDataRoom(client, roomNumber){
    return await client.db("Projet-Info").collection("Rooms").findOne({ name:roomNumber});
}

async function newReservation(client, data){
    const roomData = await client.db("Projet-Info").collection("Rooms").findOne({ name: data.name});
    roomData.reservations.push(data.reservations);
    if(!roomData) return -1;
    const result  = await client.db("Projet-Info").collection("Rooms").updateOne({number:data.number},{$set:roomData});
    return 0;
}

async function removeReservation(client, nameRoom,idReservations){
    await client.db("Projet-Info").collection("Rooms").updateOne({ name : nameRoom },{$pull : {reservations: {_id:new BSON.ObjectID(idReservations)}}});
}

async function signIn(client,data){
    const user = await client.db("Projet-Info").collection("Users").findOne({ email : data.email});
    const match = await bcrypt.compare(data.password, user.password);
    if(!match) return -1;
    return 0;
}

async function signUp(client,data){
    data.password = await bcrypt.hash(data.password,10);
    const result = await client.db("Projet-Info").collection("Users").findOne({ email : data.email});
    if(result) return -1;
    await client.db("Projet-Info").collection("Users").insertOne(data);
    return 0;
}

async function filterData(client, {capacity: capacity =20,level:level = 1,projector:projector = 0}){
    const cursor = await client.db("Projet-Info").collection("Rooms").find({capacity:{$gte : capacity},level:level,projector:{$gte : projector}});
    return await cursor.toArray();
}

async function createRoom(client,data){
    const result = await client.db("Projet-Info").collection("Rooms").insertOne(data)
}