/**
 * Search a user from database by 
 * username or email or firstname and lastname.
 */

//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");
const FormData = require("form-data");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;


var router = express.Router();
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());

router.post('/', (req, res) => {
    let username = req.body['username'];
    let email = req.body['email'];
    let first = req.body['firstname'];
    let last = req.body['lastname'];

    if (username)  {
        db.manyOrNone('SELECT Memberid, Firstname, Lastname, Username FROM Members WHERE Username=$1', [username])
        .then((data) => {
            if (data.length == 0) {
                res.send({
                    success: false,
                });
            } else {
                res.send({
                    success: true,
                    data: data
                });
            }
            
        }).catch((err) => {
            res.send({
                success: false
            });
        });
    } else if (email) {
        db.manyOrNone('SELECT Memberid, Firstname, Lastname, Username FROM Members WHERE Email=$1', [email])
        .then((data) => {
            if (data.length == 0) {
                res.send({
                    success: false,
                });
            } else {
                res.send({
                    success: true,
                    data: data
                });
            }
            
        }).catch((err) => {
            res.send({
                success: false
            });
        });
    } else if (first && last) {
        db.manyOrNone('SELECT Memberid, Firstname, Lastname, Username FROM Members WHERE Firstname=$1 AND Lastname=$2', [first, last])
        .then((data) => {
            if (data.length == 0) {
                res.send({
                    success: false,
                });
            } else {
                res.send({
                    success: true,
                    data: data
                });
            }
            
        }).catch((err) => {
            res.send({
                success: false
            });
        });
    } else {
        res.send({
            success: false,
            message: 'missing search information'
        });
    }
});

module.exports = router;