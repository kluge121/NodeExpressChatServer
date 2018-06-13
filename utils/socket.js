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
                    let insertQuery = 'insert into chatroom(chatName,lastMessage,unreadcount,lastDate,nickname,lastCheckDate) values(?,?,?,?,?,?)';
                    let insertData1 = [requestNickname, "", 0, nowDate, nickname, nowDate]; // responseUser
                    let insertData2 = [nickname, "", 0, nowDate, requestNickname, nowDate]; // requestUser

                    connection.query(insertQuery, insertData1, (err, rows, field) => {
                        if (err) {
                            console.log(err+"insert-err1");
                        }
                        console.log(rows);
                        insertId = rows.insertId;
                        connection.query(insertQuery, insertData2, (err, rows, filed) => {
                            if (err) {
                                console.log("insert-err2");
                            }

                            connection.query('update user set modify = ? where nickname = ?', [nowDate, nickname], (error1, results, fields) => {
                                if (err) {
                                    console.log("update-err1" + error1);
                                }
                                connection.query('update user set modify = ? where nickname = ?', [nowDate, requestNickname], (error2, results, fields) => {
                                    if (err) {
                                        console.log("update-err2" + error2);
                                    }
                                    let jsondata = {
                                        'id': insertId,
                                        'receiver': nickname,
                                        'sender': requestNickname,
                                        'lastMessage': "",
                                        'unreadcount': 0,
                                        'lastDate': nowDate.toMysqlFormat(),
                                        'lastCheckDate': nowDate.toMysqlFormat()
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
                    console.log("socket.js err5")
                }

            })
        });

        socket.on('unReadCountReadRequest', (data, ackFn) => {


            let nickname = data.myNickname;
            let otherNickname = data.otherNickname;


            connection.query('update message set unreadcount = ? where sender = ? and receiver = ?', [0, otherNickname, nickname], (err, result, field) => {
                if (err) {
                    console.log('unReadCountReadRequest-1 ' + err);

                }
                connection.query('select * from message where sender = ? and receiver = ?', [otherNickname, nickname], (err, results) => {
                    if (err) {
                        console.log('unReadCountReadRequest-2 ' + err);

                    }


                    io.of('/').emit('unReadCountReadResponse', results);
                });


            });


            // connection.query('select * from chatroom where nickname = ? and chatName = ?', [nickname, otherNickname], (err, results) => {
            //     if (err) {
            //         console.log('unReadCountReadRequest-1 ' + err);
            //
            //     }
            //     serverLastCheckDate = new Date(results[0].lastCheckDate).toMysqlFormat();
            //
            //     //채팅방 체크시간이 서버보다 로컬이 더 크다 >> 아직 로컬업데이트가 안됐다.
            //     // 무조건 서버시간이 더 커야 최신상태이지unReadCountReadResponse
            //
            //     if (serverLastCheckDate <= localLastCheckDate) {
            //         connection.query('update message set unreadcount = ? where (sender = ? and receiver = ?)', [0, otherNickname, nickname, localLastCheckDate], (err, result, field) => {
            //             if (err) {
            //                 console.log('unReadCountReadRequest-2 ' + err);
            //             }
            //
            //             connection.query('select * from message where (date >= ?) and ((sender = ? and receiver = ?) or(sender = ? and receiver = ?))', [localLastCheckDate, nickname, otherNickname, otherNickname, nickname],
            //                 (err, resultsResponse) => {
            //                     if (err) {
            //                         console.log('unReadCountReadRequest-3 ' + err);
            //                     }
            //                     connection.query('update chatroom set lastCheckDate = ? where chatname = ? and nickname = ?', [localLastCheckDate, otherNickname, nickname], (err, result, field) => {
            //                         if (err) {
            //                             console.log('unReadCountReadRequest-4 ' + err);
            //                         }
            //                     });
            //
            //
            //                     socket.emit('unReadCountReadResponse', resultsResponse);
            //
            //
            //                 });
            //
            //         });
            //     }
            //
            //
            // });
            //내가 채팅방에 들어가면 상대방 채팅을 수정해야한다.
            //(클라이언트에 저장된 마지막체크시간)체크시간과 서버의 체크시간을 비교해서


        });

        socket.on('requestAddFriend', (data) => {

            let nickname = data.nickname;
            let whoFriend = data.whoFriend;

            let selectQuery = 'select * from Friend where nickname = ? and whoFriend = ?';
            let insetQuery = 'insert into Friend (nickname,whoFriend) values (?, ?)';

            connection.query(selectQuery, [nickname, whoFriend], (err, result) => {
                if (err) {
                    console.log('err requestAddFriend tag 1');
                }
                if (result.length === 0) {
                    connection.query(insetQuery, [nickname, whoFriend], (err, result) => {
                        if (err) {
                            console.log('err requestAddFriend tag 2');
                        }
                        let resObj = {
                            msg: "success",
                            nickname: nickname,
                            whoFriend: whoFriend
                        };

                        io.of('/').emit('responseAddFriend', resObj);
                    });
                } else {
                    let resObj = {
                        msg: "fail",
                    };
                    io.of('/').emit('responseAddFriend', resObj);
                }


            });

        });

        socket.on('requestRemoveFriend', (data) => {
            console.log('접근1');
            let nickname = data.nickname;
            let whoFriend = data.whoFriend;
            connection.query('delete from Friend where nickname = ? and whoFriend = ?', [nickname, whoFriend], (err, result) => {
                if (err) {
                    console.log("err requestRemoveFriend - 1")
                }

                let resObj = {
                    nickname: nickname,
                    whoFriend: whoFriend
                };
                io.of('/').emit('responseRemoveFriend', resObj);
            });

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

