const express = require('express');
const router = express.Router();
const db_info = require('../db_info');
const mysql = require('mysql');
const connection = mysql.createConnection(db_info.local);
const tokenHelper = require('../utils/tokenHelper');
const jwt = require('jsonwebtoken');


router.use((req, res, next) => {
    console.log('Time : ', Date.now());
    next();
});

router.get('/', (req, res) => {
    res.send("채팅 테스트용 서버입니다");

});

router.post('/login', (req, res) => {

    let nickname = req.body.nickname;
    let accessToken = req.body.accessToken;

    if (accessToken === 'null') {
        //TODO 다시 로그인 요망

    } else {
        //TODO 토큰으로 다시 로그인

    }


    connection.query('select * from `user` where `nickname` = ?', nickname, (err, result) => {
        if (err) {
            console.log('err : ' + err);
        } else {
            if (result.length === 0) {
                //TODO 회원가입로직
            }

            let token = tokenHelper.tokenGenerator(nickname);
            let resObj = {
                msg: "success",
                token: token.toString()
            };

            res.send(JSON.stringify(resObj))

        }

    });


});

module.exports = router;


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
