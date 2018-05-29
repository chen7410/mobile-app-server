//express is the framework we're going to use to handle requests
const express = require('express');

const bodyParser = require("body-parser");

//Create connection to Heroku Database
let db = require('../utilities/utils').db;
let mailgun = require('../utilities/utils').mailgun;

var router = express.Router();
var Mailgun = require('mailgun').Mailgun;
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());


router.post('/', (req, res) => {
    var email = req.body['email'];
    var verification = req.body['verification'];

    if (email && verification) {
        let params = [email, verification];
        db.none("Update members SET verification= $2 where Email = $1", params)
            .then(() => {
                let from = 'Husky Mingle <forgetpassword@huskymingle.com>';
                let to = email;
                let subject = 'Verification PIN';
                let message = 'Your verification PIN: ' + (-verification);
                mailgun(from, to, subject, message);
                res.send({
                    success: true,
                });

            }).catch((err) => {
                console.log(err);
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