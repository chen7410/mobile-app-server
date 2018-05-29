/**
 * Insert a chat id and member ids to the Chatmembers table.
 * start a new one to one chat.
 */
const express = require('express');
const app = express();
let db = require('../utilities/utils').db;
const bodyParser = require("body-parser");

var router = express.Router();
router.use(bodyParser.json());

router.post("/", (req, res) => {
    let chatid = req.body['chatid'];
    let chatMemberIDA = req.body['chatMemberA'];
    let chatMemberIDB = req.body['chatMemberB'];

    if (chatid && chatMemberIDA && chatMemberIDB) {

        let select = `SELECT ChatId FROM Chatmembers WHERE Chatid = $1`
        db.manyOrNone(select, [chatid])
            .then((row) => {
                console.log("row " + row);
                if (row.length === 0) { 
                    // start a new chat session if 
                    //chat id not exist in ChatMembers Table
                    console.log("row == 0" + row);
                    let insertIntoChatMembers =
                        `INSERT INTO ChatMembers(chatid, memberid) VALUES($1, $2), ($1, $3);`
                    db.none(insertIntoChatMembers, [chatid, chatMemberIDA, chatMemberIDB])
                        .then(() => {
                            res.send({
                                success: true,
                                chatid: chatid,
                                message: "chat id not exist"
                            });
                        })
                        .catch((err) => {
                            res.send({
                                success: false,
                                error: err.message,
                                message: "insert fail"
                            });
                        });

                } else { //return a exist chat id
                    console.log("row != 0");
                    res.send({
                        success: true,
                        chatid: row[0].chatid,
                        message: "chatid is already exist"
                    });
                }
            })
            .catch((err) => {
                success: false
                error: err.message
            });

    } else {
        res.send({
            success: false,
            input: req.body,
            error: "Missing required user information"
        });
    }
});

module.exports = router;