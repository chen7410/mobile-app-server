const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utilities/utils').db
const router = express.Router();
router.use(bodyParser.json());


router.post("/", (req, res) => {
    let chatid = req.body['chatid'];
    let memberid = req.body['memberid'];
    // let query = `insert into Chatmembers(memberid,chatid) select memberid, 
    // (Select Chatid from chats where chatid = $1) from members where username = $2;`

    if (chatid && memberid) {
        var select = `SELECT ChatId, MemberId FROM ChatMembers Where ChatId=$1 AND MemberId=$2;`
        db.manyOrNone(select, [chatid, memberid])
        .then((row) => {
            if (row.length == 0) {
                // not such entry in the table, insert
                var insert = `INSERT INTO ChatMembers(ChatId, MemberId) VALUES($1, $2);`
                db.none(insert, [chatid, memberid])
                .then(() => {
                    res.send({
                        success: true,
                        message: "Member added"
                    });
                })
                .catch((err) => {
                    res.send({
                        success: false,
                        error: err
                    });
                })

            } else {
                res.send({
                    success: false,
                    message: "Member is already in the chat"
                });
            }
            
        })
        .catch((err) => {
            res.send({
                success: false,
                error: err
            });
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