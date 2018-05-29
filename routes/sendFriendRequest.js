/**
 * Send a friend request, insert memberid a and b to Contacts table.
 */

//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;

var router = express.Router();
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());

router.post('/', (req, res) => {

    var memberA = req.body['memberA'];
    var memberB = req.body['memberB'];

    if (memberA && memberB) {
        var params = [memberA, memberB];
        var select = `SELECT * FROM Contacts WHERE MemberID_A = $1 AND MemberID_B = $2`
        db.manyOrNone(select, [memberA, memberB])
        .then(row => {
            if (row.length == 0) {
                db.none("INSERT INTO Contacts(MemberID_A, MemberID_B) VALUES ($1, $2)", params)
            .then(() => {
                //
                res.send({
                    success: true
                });
            }).catch((err) => {
                //log the error
                console.log(err);
                res.send({
                    success: false,
                    error: err
                });
            });
            } else {
                res.send({
                    success: false,
                    message: "You have already sent a request"
                });
            }
        })
        .catch((err) => {
            //log the error
            console.log(err);
            res.send({
                success: false,
                error: err
            });
        });

    } else {
        res.send({
            success: false,
            message: 'missing require information'
        });
    }

});

module.exports = router;