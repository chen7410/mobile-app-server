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
router.get("/getChats", (req, res) => {
    let user = req.query['username'];
    let after = req.query['after'];

    let query = `select chatmembers.chatID
                from chatmembers, members   
                where username = $1  
                and chatmembers.memberid = members.memberID` 
    db.manyOrNone(query, [user, after])
    .then((rows) => {
        res.send({
            user :user,
            success : true,
            Chats : rows
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: user
        })
    });
});

module.exports = router;
