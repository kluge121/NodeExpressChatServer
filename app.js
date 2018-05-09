var express = require('express');
var app = express();
var hostname = 'ec2-52-78-135-92.ap-northeast-2.compute.amazonaws.com';
var port = 3000;

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port, hostname, function () {
    console.log('Example app listening on port 3000!\n');
    console.log(hostname+":"+port);
});


