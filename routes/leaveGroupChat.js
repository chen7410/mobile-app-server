/**
 * Leave a group chat, delete a row from ChatMembers where chatid = current chat id and memberid = my member id
 */

const express = require('express');
const bodyPaser = require('body-parser');
const db = require('../utilities/utils').db;

const router = express.Router();
router.use(bodyPaser.json());

router.post('/', (req, res) => {
   let memberId = req.body['memberId'];
   let chatId = req.body['chatId'];

   if (memberId && chatId) {
       let params = [memberId, chatId];
       
       db.none("DELETE FROM ChatMembers WHERE MemberID=$1 AND ChatID=$2", params)
       .then(() => {
           res.send({//delete will indicate success even you try to delete data is not exist in the table
               success: true,
           });
       }).catch((err) => {
           //log the error possible not exist in the database
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