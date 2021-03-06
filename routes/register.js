//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");


//We use this create the SHA256 hash
const crypto = require("crypto");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;

let getHash = require('../utilities/utils').getHash;

let sendEmail = require('../utilities/utils').sendEmail;
let mailgun = require('../utilities/utils').mailgun;

var router = express.Router();
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());
//var Mailgun = require('mailgun').Mailgun;
router.post('/', (req, res) => {
    res.type("application/json");

    //Retrieve data from query params
    var first = req.body['first'];
    var last = req.body['last'];
    var username = req.body['username'];
    var email = req.body['email'];
    var password = req.body['password'];
    var verification = req.body['verification'];
    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if (first && last && username && email && password && verification) {
        //We're storing salted hashes to make our application more secure
        //If you're interested as to what that is, and why we should use it
        //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
        let salt = crypto.randomBytes(32).toString("hex");
        let salted_hash = getHash(password, salt);
        let params = [first, last, username, email, salted_hash, salt, verification];

        //Use .none() since no result gets returned from an INSERT in SQL
        //We're using placeholders ($1, $2, $3) in the SQL query string to avoid SQL Injection
        //If you want to read more: https://stackoverflow.com/a/8265319

        db.none("INSERT INTO MEMBERS(FirstName, LastName, Username, Email, Password, Salt, Verification) VALUES ($1, $2, $3, $4, $5, $6, $7)", params)
            .then(() => {
                //We successfully added the user, let the user know
                
                let from = 'Husky Mingle <registration@huskymingle.com>';
                let to = email;
                let subject = 'Verification PIN';
                let message = 'Your verification PIN: ' + verification;
                mailgun(from, to, subject, message);
                
                res.send({
                    success: true
                });

            }).catch((err) => {
                //log the error
                console.log(err);
                //If we get an error, it most likely means the account already exists
                //Therefore, let the requester know they tried to create an account that already exists
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