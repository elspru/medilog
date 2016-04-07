#!/usr/bin/js
var express = require('express.io'),
    http = require('http'),
    io = require('socket.io'),
    sjcl = require('sjcl'),
    fs = require("fs"),
    salt, 
    authFileName = "../.logs/auth.json",
    authFile = fs.readFileSync(authFileName, "utf8"),
    authObj = JSON.parse(authFile);
 
/* start CORS setup */
function enableCORS(app) {
    var enableCORS = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');
    
            // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        } else {
            next();
        };
    };
    
    app.configure(function() {
        // enable CORS!
        app.use(enableCORS);
    
    });
    app.http().io();
    app.io.set('origins', '*:*');
    /* finished CORS setup */
}

/* array equals  start */
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
/* array equals end */

function getSalt() {
    var stuff = sjcl.encrypt("hello", "Stuff");
    return JSON.parse(stuff).salt;
}

function manageConnection(socket){
    "use strict";
    function manageMessage(data){
        var clientAck = {},
            user,
            salt;
        /*This event is triggered at the server side when client
            sends the data using socket.send() method */
        try {
            data = JSON.parse(data);
        } catch (e) {
        }
        console.log((new Date).toLocaleString() +
            " message received:");
        console.log(data);
        if (data.data === "key") {
            console.log("key detected");
            user = data.username.toLowerCase();
            if (!authObj[user].key) {
                authObj[user].key = data.key;
                salt = getSalt();
                authObj[user].session = salt;
                clientAck.session = salt;
                clientAck.data = "password accepted";
                console.log("key recorded");
            } else if (authObj[user].key.equals(data.key)) {
                    if (!authObj[user].session) {
                        salt = getSalt();
                        authObj[user].session = salt;
                    } else {
                        salt = authObj[user].session;
                    }
                    clientAck.session = salt;
                    clientAck.data = "password accepted";
                if (fs.existsSync("../.logs/" + user + ".json")){
                clientAck.logObj = fs.readFileSync("../.logs/" +
                    user + ".json", "utf8");
                } else {
                    console.log("user log does not exist");
                }
                console.log("key acknowledged");
            } else {
                clientAck.data = "password denied";
                console.log("key denied");
            }
            fs.writeFileSync(authFileName,
                JSON.stringify(authObj), "utf8");
        }
        if (data.username && data.request === "salt") {
            user = data.username.toLowerCase();
            console.log("U "+ user);
            if (authObj[user] && authObj[user].salt) {
                clientAck.salt = authObj[user].salt;
                clientAck.data = "salt";
            } else {
                authObj[user] = {};
                salt = getSalt();
                authObj[user].salt = salt;
                clientAck.salt = salt;
                clientAck.data = "salt";
                fs.writeFileSync(authFileName,
                    JSON.stringify(authObj), "utf8");
            }
        } else if (data.request === "upload" && data.username) {
            user = data.username && data.username.toLowerCase();
            if (data.session === (authObj[user].session)) {
                fs.writeFileSync("../.logs/" + user + ".json",
                    JSON.stringify(data), "utf8");
                clientAck.data = "Server Received the logs";
            } else {
                clientAck.data = "Wrong session key";
            }
        }
      if (clientAck.data) {
        socket.send(JSON.stringify(clientAck));
      }
        /*Sending the Acknowledgement back to the client, this
            will trigger "message" event on the clients side*/
    }
    /*Associating the callback function to be executed when 
        client visits the page and websocket connection is made */
    var message_to_client = {
        data:"Connection with the server established"
    }
    socket.send(JSON.stringify(message_to_client)); 
    /*sending data to the client, this triggers a message 
        event at the client side */
    console.log('Socket.io Connection with the client established');
    socket.on("message", manageMessage);
}


function init() {
    var app = express();
    enableCORS(app);
    app.use(express.static('../'));
    //Specifying the public folder of the server to make the
    //    html accesible using the static middleware
    var server = http.createServer(app).listen(8087);
    //Server listens on the port 8087
    console.log("starting server");
    io = io.listen(server); 
    /*initializing the websockets communication, server instance
        has to be sent as the argument */
    io.sockets.on("connection", manageConnection);
}

init();
