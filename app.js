const express = require('express');
const app = express();


const mysql = require('mysql');
const testQuery = 'Select * From User';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'NodeChat'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});


app.get('/', (req, res) => {
    res.send("dd");
});


app.listen(3000, () => {
    console.log("dd2");
    connection.query(testQuery, (err, rows) => {
        if (err) throw err;

        console.log('Data received from Db: \n');
        console.log(rows);
    });
});




