const express = require('express');
const router = express.Router();
const db_info = require('../db_info');
const mysql = require('mysql');
const connection = mysql.createConnection(db_info.local);
const tokenHelper = require('../utils/tokenHelper');

router.use((req, res, next) => {
    next();
});

router.get('/', (req, res) => {
    res.send("채팅 테스트용 서버입니다");

});

router.post('/login', (req, res) => {

    let nickname = req.body.nickname;
    let accessToken = req.body.accessToken;
    let query = 'select * from `user` where `nickname` = ?';
    let nowDate = new Date();


    //DB에서 닉네임 검색
    connection.query(query, nickname, (err, result) => {
        if (err) { // 쿼리 오류
            console.log('쿼리오류 err : ' + err);
        } else if (accessToken === 'null') { // 토큰어 없다 -> 다시로그인 or 회원가입

            if (result.length === 0) {  // 회원가입이 안되어있다면
                let data = [nickname, nowDate.toMysqlFormat()];
                connection.query('insert into user values (?,?)', data, (err, result) => {
                    if (err) {
                        console.log('회원가입 오류 ' + err);
                    }

                    let token = tokenHelper.tokenGenerator(nickname);
                    let resObj = {
                        msg: "join success",
                        accessToken: token.toString(),
                        modify: new Date().toJSON()

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


        } else { //유효한 토큰 값일 시 로그인fail-error
            tokenHelper.isValid(accessToken, nickname, res, result);
        }
    });


});


router.post('/login/modify', (req, res) => {

    let nickname = req.body.nickname;
    let modify = req.body.modify; // localDatetime


    let convertModify = new Date(modify).toMysqlFormat();
    // let chatRoomQuery = 'select * from chatroom';
    let chatRoomQuery = 'select * from chatroom where lastDate >= ? AND nickname = ?';
    let messageQuery = 'select * from message where date >= ? AND (sender = ? OR receiver =?)';

    console.log('시간 ' + convertModify);

    connection.query(chatRoomQuery, [convertModify, nickname], (err, result1) => {
        if (err) {
            console.log('1차에러' + err);
        }


        connection.query(messageQuery, [convertModify, nickname, nickname], (err, result2) => {
            if (err) {
                console.log('2차에러 ' + err);
            }
            res.send(JSON.stringify({
                chatroomlist: result1,
                messagelist: result2
            }))
        });


    });


});

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}


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
