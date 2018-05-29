//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;

let getHash = require('../utilities/utils').getHash;

var router = express.Router();
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());

router.get("/", (req, res) => {
    let memberId = req.query['memberId'];

    let after = req.query['after'];

    let query = `SELECT ChatMembers, Messages.Message, 
                 to_char(Messages.Timestamp AT TIME ZONE 'PDT', 'YYYY-MM-DD HH24:MI:SS.US' ) AS Timestamp
                 FROM Messages
                 INNER JOIN ChatMembers ON Messages.ChatId=ChatMembers.ChatId
                 WHERE 
                 Timestamp  AT TIME ZONE 'PDT' > $1
                 ORDER BY Timestamp ASC`
    db.manyOrNone(query, [after, memberId])
    .then((rows) => {
        res.send({
            messages: rows,
            id:memberId
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});

module.exports = router;
