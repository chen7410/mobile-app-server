//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();

const FormData = require("form-data");

const bodyParser = require("body-parser");

//We use this create the SHA256 hash
const crypto = require("crypto");

var addtoChat = require('./routes/addToChat.js');
app.use('/addToChat', addtoChat);

var leaveChat = require('./routes/leaveChat.js');
app.use('/leaveChat', leaveChat);

var reg = require('./routes/register.js');
app.use('/register', reg);

var verification = require('./routes/verification.js');
app.use('/verification', verification);

var verified = require('./routes/verified.js');
app.use('/verified', verified);

var login = require('./routes/login.js');
app.use('/login', login);

var search = require('./routes/search.js');
app.use('/search', search);

var sql = require('./routes/sql.js');
app.use('/sql', sql);

var viewConn = require('./routes/viewConnections.js');
app.use('/viewConnections', viewConn);

var viewReq = require('./routes/viewRequests.js');
app.use('/viewRequests', viewReq);

var acceptRequest = require('./routes/acceptRequest.js');
app.use('/acceptRequest', acceptRequest);

var rejectRequest = require('./routes/rejectRequest.js');
app.use('/rejectRequest', rejectRequest);

var removeConnection = require('./routes/removeConnection.js');
app.use('/removeConnection', removeConnection);

var msg = require('./routes/messages.js');
app.use('/', msg);

var chats = require('./routes/chats.js');
app.use('/', chats);

 var chatinfo = require('./routes/chatinfo.js');
 app.use('/', chatinfo);

 var sendFriendRequest = require('./routes/sendFriendRequest.js');
 app.use('/sendFriendRequest', sendFriendRequest);

 var newChatId = require('./routes/getChatId.js');
 app.use('/getChatId', newChatId);

 var createChatSession = require('./routes/createChatSession.js');
 app.use('/createChatSession', createChatSession);

 var forgotpassword  = require('./routes/forgotPassword.js');
 app.use('/forgotPassword', forgotpassword);

 var changepassword  = require('./routes/forgotpasswordchange.js');
 app.use('/postChangePass', changepassword);

 var leaveGroupChat = require('./routes/leaveGroupChat.js');
 app.use('/leaveGroupChat', leaveGroupChat);

 var getNotificationMessages = require('./routes/getNotificationMessages.js');
 app.use('/getNotificationMessages', getNotificationMessages);

/*
 * Return HTML for the / end point. 
 * This is a nice location to document your web service API
 * Create a web page in HTML/CSS and have this end point return it. 
 * Look up the node module 'fs' ex: require('fs');
 */
app.get("/", (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    for (i = 1; i < 7; i++) {
        //write a response to the client
        res.write('<h' + i + ' style="color:blue">Hello, This is Husky Mingle!</h' + i + '>'); 
    }
    res.end(); //end the response
});

/* 
* Heroku will assign a port you can use via the 'PORT' environment variable
* To accesss an environment variable, use process.env.<ENV>
* If there isn't an environment variable, process.env.PORT will be null (or undefined)
* If a value is 'falsy', i.e. null or undefined, javascript will evaluate the rest of the 'or'
* In this case, we assign the port to be 5000 if the PORT variable isn't set
* You can consider 'let port = process.env.PORT || 5000' to be equivalent to:
* let port; = process.env.PORT;
* if(port == null) {port = 5000} 
*/ 
app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});