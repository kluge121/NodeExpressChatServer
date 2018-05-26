const express = require('express');
const router = express.Router();
const db_info = require('../db_info');
const mysql = require('mysql');
const connection = mysql.createConnection(db_info.real);
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
    let query = 'select * from `user` where `nickname` = ?';


    //DB에서 닉네임 검색
    connection.query(query, nickname, (err, result) => {
        if (err) { // 쿼리 오류
            console.log('err : ' + err);
        } else if (accessToken === 'null') { // 토큰어 없다 -> 다시로그인 or 회원가입

            if (result.length === 0) {  // 회원가입이 안되어있다면
                let data = [nickname];
                connection.query('insert into user values (?)', data, (err, result) => {
                    if (err) {
                        console.log('회원가입 오류 ' + err);
                    }

                    let token = tokenHelper.tokenGenerator(nickname);
                    let resObj = {
                        msg: "success",
                        accessToken: token.toString()
                    };
                    res.send(JSON.stringify(resObj));
                })
            } else {
                let token = tokenHelper.tokenGenerator(nickname);
                let resObj = {
                    msg: "success",
                    accessToken: token.toString()
                };
                res.send(JSON.stringify(resObj));
            }


        } else { //유효한 토큰 값일 시 로그인
            tokenHelper.isValid(accessToken, nickname, res);


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
