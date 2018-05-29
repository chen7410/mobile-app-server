//Get the connection to Heroku Database
let db = require('./sql_conn.js');

//We use this create the SHA256 hash
const crypto = require("crypto");

const FormData = require("form-data");

// var api_key = process.env.MAIL_GUN_API_KEY;
var api_key = '4b91e511f7b75b5e2d7d75138fd2b613-115fe3a6-ca6f622c';
var domain = 'sandbox14b677fb1d104339931f4ef81a8ee20b.mailgun.org';
var mail = require('mailgun-js')({
    apiKey: api_key,
    domain: domain
});

function sendEmail(from, to, subject, message) {
    let form = new FormData();
    form.append("from", from);
    form.append("to", to);
    form.append("subject", subject);
    form.append("message", message);
    form.submit("http://cssgate.insttech.washington.edu/~cfb3/mail.php", (err, res) => {
        if(err) console.error(err);
        console.log(res);
    });
}

/**
 * Since this is free mailgun. To use it, the recipients must be authorized in 
 * https://app.mailgun.com/app/domains/sandbox14b677fb1d104339931f4ef81a8ee20b.mailgun.org
 * click Manage Authorized Recipients to add your email.
 * Example in forgotPassword.js
 * @param {*} from sender mail
 * @param {*} to 
 * @param {*} subject 
 * @param {*} message 
 */
function mailgun(from, to, subject, message) {
    var data = {
        from: from,
        to: to,
        subject: subject,
        text: message
    };
    mail.messages().send(data, function (error, body) {
        console.log(body);
    });
}

/**
 * Method to get a salted hash.
 * We put this in its own method to keep consistency
 * @param {string} pw the password to hash
 * @param {string} salt the salt to use when hashing
 */
function getHash(pw, salt) {
    return crypto.createHash("sha256").update(pw + salt).digest("hex");
}

module.exports = { 
    db, getHash, sendEmail, mailgun
};