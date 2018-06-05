const mysql = require('mysql');
const db_info = require('../db_info');
const connection = mysql.createConnection(db_info.local);


module.exports = (io) => {
    io.on('connection', (socket) => {


        socket.on('requestCreateChatRoom', (data) => {


            let nickname = data.nickname;
            let requestNickname = data.requestNickname;

            let selectQuery = 'select * from user where nickname = ?';
            let selectQueryData = [nickname];


            connection.query(selectQuery, selectQueryData, (err, result) => {
                if (err) {
                    console.log('select error');
                }
                if (result.length >= 1) {
                    let insertId;
                    let nowDate = new Date();
                    let insertQuery = 'insert into chatroom(chatName,lastMessage,unreadcount,lastDate,nickname) values(?,?,?,?,?)';
                    let insertData1 = [requestNickname, "", 0, nowDate, nickname]; // responseUser
                    let insertData2 = [nickname, "", 0, nowDate, requestNickname]; // requestUser

                    connection.query(insertQuery, insertData1, (err, rows, field) => {
                        if (err) {
                            console.log("insert-err1");
                        }
                        insertId = rows.insertId;
                        connection.query(insertQuery, insertData2, (err, rows, filed) => {
                            if (err) {
                                console.log("insert-err2");
                            }

                            connection.query('update user set modify = ? where nickname = ?', [date, sender], (error1, results, fields) => {
                                connection.query('update user set modify = ? where nickname = ?', [date, receiver], (error2, results, fields) => {
                                    let jsondata = {
                                        'id': insertId,
                                        'chatName': requestNickname,
                                        'lastMessage': "",
                                        'unreadcount': 0,
                                        'lastDate': nowDate.toJSON(),
                                        'nickname': nickname,
                                    };
                                    io.of('/').emit('responseCreateChatRoom', jsondata);
                                });

                            })
                        });
                    });


                }

            });


        });


        socket.on('sendMessage', (data) => {

            let msg = data.msg;
            let unreadcount = data.unreadcount;
            let date = new Date().toMysqlFormat();
            let sender = data.sender;
            let receiver = data.receiver;
            let chatName = data.chatName;
            let insertid;

            let inputdata = [msg, unreadcount, date, sender, receiver, chatName];


            connection.query('insert into message(msg,unreadcount,date,sender,receiver) value (?,?,?,?,?)', inputdata, (err, rows, field) => {
                if (err) {
                    console.log('tag1 ' + err);
                }
                insertid = rows.insertId;
                let updateData1 = [date, msg, sender, receiver];
                connection.query('update chatroom set lastDate = ?,lastMessage = ? where chatName = ? AND nickname = ?', updateData1, (err, results, fileds) => {
                    if (err) {
                        console.log('update-err1 ' + err);
                    }
                    let updateData2 = [date, msg, receiver, sender];
                    connection.query('update chatroom set lastDate = ?,lastMessage = ? where chatName = ? AND nickname = ?', updateData2, (err, rows, fileds) => {
                        if (err) {
                            console.log('update-err2 ' + err);
                        }
                        // 양쪽 사용자 서버시간 설정
                        // 받는 사람은 클라이언트에서 소켓통신확인 후 변경
                        connection.query('update user set modify = ? where nickname = ?', [date, sender], (error1, results, fields) => {
                            connection.query('update user set modify = ? where nickname = ?', [date, receiver], (error2, results, fields) => {
                                let jsondata = {
                                    'id': insertid,
                                    'msg': msg,
                                    'unreadcount': unreadcount,
                                    'date': date,
                                    'sender': sender,
                                    'receiver': receiver,
                                };
                                io.of('/').emit('relayMessage', jsondata);
                            });

                        });
                    });
                });
            });
        });

        socket.on('requestUpdateModify', (data) => {

            let requsetNickName = data.nickname;
            let modify = data.modify;
            let convertModify = new Date(modify).toMysqlFormat();
            let query = 'update user set modify = ? where nickname = ?';

            connection.query(query, [convertModify, requsetNickName], (error, results, fields) => {
                if (error) {
                    console.log("socket.js err5", r)
                }

            })
        });


    });

};

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

