/**
 * Insert a chat name to the Chats table, returns a new chat id.
 */
const express = require('express');
const app = express();
let db = require('../utilities/utils').db;
const bodyParser = require("body-parser");

var router = express.Router();
router.use(bodyParser.json());

router.post("/", (req, res) => {
    // let memberAUsername = req.body['chatName'];
    let chatMemberB = req.body['chatMemberB'];
    let chatMemberA = req.body['chatMemberA'];


    if (chatMemberA && chatMemberB) {
        let dot = '.';
        let chatNameAB = chatMemberA + dot + chatMemberB;
        let chatNameBA = chatMemberB + dot + chatMemberA;

        //check if exist in ChatsTable
        let select = `SELECT ChatId FROM Chats WHERE Name = $1 OR Name = $2`
        db.manyOrNone(select, [chatNameAB, chatNameBA])
            .then((row) => {
                //no such chatName exist; insert, generate a chat id
                if (row.length == 0) {
                    let insertIntoChats = `INSERT INTO Chats(Name) VALUES($1)`
                    db.none(insertIntoChats, [chatNameAB, chatNameBA])
                        .then(() => {
                            let select = `SELECT MAX(ChatId) FROM Chats`
                            db.one(select)
                                .then(data => {
                                    res.send({
                                        success: true,
                                        chatid: data.max
                                    });
                                }).catch((err) => {
                                    res.send({
                                        success: false,
                                        error: err.message,
                                        message: "get max chat id fail"
                                    })
                                });
                        })
                        .catch((err) => {
                            res.send({
                                success: false,
                                error: err.message,
                                message: "insert fail"
                            });
                        });

                    //have such chatName; return the chatid
                } else {
                    res.send({
                        success: true,
                        chatid: row[0].chatid,
                        message: "chat Id exist"
                    });
                }
            })
            .catch((err) => {
                res.send({
                    success: false,
                    error: err.message,
                    message: "select fail"
                })
            })

    } else {
        res.send({
            success: false,
            input: req.body,
            error: "Missing required user information"
        });
    }


    // if (memberAusername) {

    //     //check if exist in ChatsTable
    //     let select = `SELECT ChatId FROM Chats WHERE Name = $1`
    //     db.manyOrNone(select, [memberAusername])
    //         .then((row) => {
    //             //no such chatName exist; insert, generate a chat id
    //             if (row.length == 0) {
    //                 let insertIntoChats = `INSERT INTO Chats(Name) VALUES($1)`
    //                 db.none(insertIntoChats, [memberAusername])
    //                     .then(() => {
    //                         let select = `SELECT MAX(ChatId) FROM Chats`
    //                         db.one(select)
    //                             .then(data => {
    //                                 res.send({
    //                                     success: true,
    //                                     chatid: data.max
    //                                 });
    //                             }).catch((err) => {
    //                                 res.send({
    //                                     success: false,
    //                                     error: err.message,
    //                                     message: "get max chat id fail"
    //                                 })
    //                             });
    //                     })
    //                     .catch((err) => {
    //                         res.send({
    //                             success: false,
    //                             error: err.message,
    //                             message: "insert fail"
    //                         });
    //                     });

    //                 //have such chatName; return the chatid
    //             } else {
    //                 res.send({
    //                     success: true,
    //                     chatid: row[0].chatid
    //                 });
    //             }
    //         })
    //         .catch((err) => {
    //             res.send({
    //                 success: false,
    //                 error: err.message,
    //                 message: "select fail"
    //             })
    //         })

    // } else {
    //     res.send({
    //         success: false,
    //         input: req.body,
    //         error: "Missing required user information"
    //     });
    // }
});

module.exports = router;