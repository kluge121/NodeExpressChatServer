const express = require('express');
const http = require('http');
const app = express();
const route = require('./route/index');
const bodyParser = require('body-parser');
const socketEvents = require('./utils/socket');

// const moment = require('moment-timezone');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/* router */
const index = require('./route/index');

app.use('/', [index]);


const server = http.createServer(app);
const io = require('socket.io').listen(server);
socketEvents(io);


server.listen(3000, () => {
    console.log("Server Start : " + 3000);
});




