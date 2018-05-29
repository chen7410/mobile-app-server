//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;


var router = express.Router();
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());

router.post('/', (req, res) => {
    let username = req.body['username'];

    let query = `SELECT Verification
                 FROM Members
                 WHERE UserName=$1`
    db.one(query, [username])
    .then((row) => {
        res.send({
            success: true,
            messages: row
        })
    }).catch((err) => {
        res.send({
            success: false,
            messages: username,
            error: err
        })
    });
});

module.exports = router;