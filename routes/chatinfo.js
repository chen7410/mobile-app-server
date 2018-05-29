//express is the framework we're going to use to handle requests
const express = require('express');

const FormData = require("form-data");

const bodyParser = require("body-parser");


//Create connection to Heroku Database
let db = require('../utilities/utils').db;

let getHash = require('../utilities/utils').getHash;

var router = express.Router();
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());

//app.get('/users') means accept http 'GET' requests at path '/users'
router.get("/getChatinfo", (req, res) => {
    let user = req.query['chatId'];

    let query = `select message 
                    from messages 
                    where Timestamp = (Select max(timestamp)
                    from messages as m 
                    where m.chatid  = $1); ` 
    db.manyOrNone(query, [user])
    .then((rows) => {
        res.send({
            success : true,
            Chats : rows
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: "cannot get"
        })
    });
});

module.exports = router;
