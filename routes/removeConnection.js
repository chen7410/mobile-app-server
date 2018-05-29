/**
 * Removes an existing connection from database
 */

 const express = require('express');
 const bodyPaser = require('body-parser');
 const db = require('../utilities/utils').db;

 const router = express.Router();
 router.use(bodyPaser.json());

 router.post('/', (req, res) => {
    let myUsername = req.query['myUsername'];
    let friendUsername = req.query['friendUsername'];
    let query = `DELETE FROM contacts
    WHERE (memberid_a=(SELECT memberid FROM members WHERE username=$2)
        AND memberid_b=(SELECT memberid FROM members WHERE username=$1))
        OR (memberid_a=(SELECT memberid FROM members WHERE username=$1)
        AND memberid_b=(SELECT memberid FROM members WHERE username=$2));`;

    if (myUsername && friendUsername) {
        let params = [myUsername, friendUsername];

        //"DELETE FROM Contacts WHERE MemberID_A=$1 AND MemberID_B=$2" Matthew's query
        db.none(query, params)
        .then(() => {
            res.send({//delete will indicate success even you try to delete data is not exist in the table
                success: true
            });
        }).catch((err) => {
            //log the errorm possible not exist in the database
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
            error: "Missing required information"
        });
    }
    
 });

 module.exports = router;