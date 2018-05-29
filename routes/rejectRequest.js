const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utilities/utils').db
const router = express.Router();

router.use(bodyParser.json());

//Method for rejecting a pending connection request
router.post("/", (req, res) => {
    let user = req.query['username'];
    let friend = req.query['sender'];
    let query = `DELETE FROM contacts
        WHERE memberid_a=(SELECT memberid FROM members WHERE username=$2)
            AND memberid_b=(SELECT memberid FROM members WHERE username=$1);`

    db.none(query, [user,friend])
    .then((rows) => {
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