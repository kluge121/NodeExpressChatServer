const express = require('express');
const app = express();
const host = 'ubuntu@ec2-52-78-135-92.ap-northeast-2.compute.amazonaws.com';
const config = require('db_info').local;
const testQuery = 'Select * From User';


app.get('/', (req, res) => {
    res.send("dd");
});


app.listen(3000, host, () => {
    console.log("dd2");
    console.log(config);
});


function callback(err, result) {
    if (err) {
        throw err
    }
    console.log("Selsect Complete");
    console.log(query.sql);

}


