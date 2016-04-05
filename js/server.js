#!/usr/bin/js
var express = require('express.io');
var http = require('http');
var io = require('socket.io');
const fs = require("fs");
 
var app = express();
/* start CORS setup */
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

app.use(express.static('../'));
//Specifying the public folder of the server to make the html accesible using the static middleware
 
var server = http.createServer(app).listen(8087);
//Server listens on the port 8124
console.log("starting server");
io = io.listen(server); 
/*initializing the websockets communication , server instance has to be sent as the argument */
 
io.sockets.on("connection",function(socket){
    /*Associating the callback function to be executed when client visits the page and 
      websocket connection is made */
      
      var message_to_client = {
        data:"Connection with the server established"
      }
      socket.send(JSON.stringify(message_to_client)); 
      /*sending data to the client , this triggers a message event at the client side */
    console.log('Socket.io Connection with the client established');
    socket.on("message",function(data){
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        try {
            data = JSON.parse(data);
        } catch (e) {
        }
        console.log((new Date).toLocaleString() +
            " message received:");
        console.log(data);
        if (data.username) {
        fs.writeFileSync("../.logs/" + data.username + ".json",
            JSON.stringify(data), "utf8");
        /*Printing the data */
        var ack_to_client = {
        data:"Server Received the message"
        }
      }
      socket.send(JSON.stringify(ack_to_client));
        /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/
    });
 
});
