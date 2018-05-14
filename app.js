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

app.get('/login', (req, res) => {
    res.render('login'); // login.ejs 랜더링
});

app.post('/login', (req, res) => {
    const body = req.body; // body-parser 사용
    if( findUser( body.user_id, body.user_pwd ) ) {
        // 해당유저가 존재한다면
        req.session.user_uid = findUserIndex( body.user_id, body.user_pwd ); //유니크한 값 유저 색인 값 저장
        res.redirect('/');
    } else {
        res.send('유효하지 않습니다.');
    }
});

app.post('/join', (req, res) => {
    const body = req.body;
    if( !findUser(body.user_id, body.user_pwd) ) {
        // 아이디도 중복안되게 분기 해야는데 예제이므로..
        users.push({
            user_id: body.user_id,
            user_pwd: body.user_pwd,
            user_nickname: body.user_nickname
        });
        res.redirect('/login');
    } else {
        res.send('이미 존재함');
    }
});





app.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/');
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




