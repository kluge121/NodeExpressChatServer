const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');


// view
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//세션 미들웨어 등록
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave: false, //
    saveUninitialized: true //초기화 되지 않은 세션을 강제로 저장
}));


const users = [
    {
        user_id: 'minsu',
        user_nickname: '민수',
        user_pwd: '123123'
    }
];


const findUser = (user_id, user_pwd) => {
    return users.find(v => (v.user_id === user_id && user_pwd === user_pwd));
};

const findUserIndex = (user_id, user_pwd) => {
    return users.findIndex(v => (v.user_id === user_id && v.user_pwd === user_pwd));

};

app.get('/', (req, res) => {
    const sess = req.session; // 세션 객체에 접근
    res.render('index', {
        nickname: sess.user_uid + 1 ? users[sess.user_uid]['user_nickname'] : ''
    });
});

app.listen(3000, () => {

});


// DB 세팅

// const mysql = require('mysql');
// const testQuery = 'Select * From user';

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123123',
//     database: 'NodeChat'
// });


// DB 접근
//    connection.query(testQuery, (err, rows) => {
//         if (err) throw err;
//
//         console.log('Data received from Db: \n');
//         console.log(rows);
//     });




