const express = require('express');
const router = express.Router();
const db_info = require('../db_info');
const mysql = require('mysql');
const connection = mysql.createConnection(db_info.local);


router.get('/chat/create', (req, res) => {


    let query = 'select * from `user` where `nickname` = ?';
    let nickname = req.query.nickname;
    let requestNickname = req.query.reqnickname;

    connection.query(query, nickname, (err, result) => {

        if (err) {
            res.send(JSON.stringify({msg: 'select-error'}));
        }
        if (result.length >= 1) {
            let nowDate = new Date(); // data함수 toJSON때문에 포맷 변경안


            let data1 = [requestNickname, "", 0, nowDate, nickname];
            let data2 = [nickname, "", 0, nowDate, requestNickname];
            let insertQuery = 'insert into chatroom(chatName,lastMessage,unreadcount,lastDate,nickname) values(?,?,?,?,?)';
            let queryRes;

            connection.query(insertQuery, data1, (err, rows, fields) => {
                if (err) {
                    // res.send(JSON.stringify({msg: "db-fail"}));
                    console.log(err);
                }

                queryRes = rows.insertId; // 내 채팅방 입력 정보 , 클라이언트에 전송
                connection.query(insertQuery, data2, (err, rows, fields) => {
                    if (err) {
                        //res.send(JSON.stringify({msg: "db-fail"}));
                    }

                    connection.query('update user set modify = ? where nickname = ?', [nowDate, nickname], (error, results, fields) => {
                        if (error) {

                        }
                        res.send(JSON.stringify({
                            msg: 'success',
                            insertId: queryRes,
                            talkperson: nickname,
                            date: nowDate.toJSON()
                        }));

                    });

                });
            });


        }
        else {
            console.log("채팅방 생성오류");
            res.send(JSON.stringify({msg: 'fail-error'}));
        }
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


