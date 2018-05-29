const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utilities/utils').db
const router = express.Router();

router.use(bodyParser.json());

//Method for viewing all the existing connections or pending connection requests a user has
router.post("/", (req, res) => {
    let user = req.query['username'];
    let query = `SELECT *
        FROM contacts
        LEFT JOIN members ON contacts.memberid_a=members.memberid
        WHERE memberid_b=(SELECT memberid FROM members WHERE username=$1) AND verified=0;`
        

    db.manyOrNone(query, [user])
    .then((rows) => {
        res.send({
            success: true,
            requests:rows
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});
module.exports = router;