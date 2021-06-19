#!/bin/nodejs

// import dependencies
var express = require("express");
var WebSocket = require("ws");

// create servers
var app = express(); 
var wss = new WebSocket.Server({port: 1234});

// setup webserver
app.use(express.static(__dirname + "/public"));
console.log("public folder set to: " + __dirname + "/public");
app.listen(8080, ()=>{
	console.log("webserver started on port 8080");
});

// setup websocketserver
wss.on("connection", function connection(ws) {
    console.log("Client connected");
 
    ws.on("message", function incoming(data) {
        console.log("New Message: " + data);
        // echo data back
        ws.send(data);
    });

    ws.on("close", function close() {
        console.log("Client closed connection");
    });
 
});
console.log("websocket server started");



