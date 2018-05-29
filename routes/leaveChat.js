const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utilities/utils').db
const router = express.Router();

router.use(bodyParser.json());

//Method for rejecting a pending connection request
router.post("/", (req, res) => {
    let user = req.body['chatID'];
    let friend = req.body['username'];
    let query = `DElete from chatmembers where chatid = $1 and memberid = (select memberid from members where username = $2);`

    db.none(query, [user,friend])
    .then(() => {
        res.send({
            success: true
        })
    }).catch((err) => {
        res.send({
            success: false,
            error: err
        })
    });
});
module.exports = router;