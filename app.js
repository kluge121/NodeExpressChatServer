const express = require('express');
const http = require('http');
const app = express();
const route = require('./route/index');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/* router */
const index = require('./route/index');
app.use('/', index);


const server = http.createServer(app).listen(3000, () => {
    console.log("Http server listening on port " + 3000);
});




