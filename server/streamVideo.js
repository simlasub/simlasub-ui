#!/bin/nodejs

// import dependencies
const express = require("express");
const WebSocket = require("ws");
const fs = require("fs");
const rtc = require('node-webrtc');


// create servers
const app = express(); 
const wss = new WebSocket.Server({port: 1234});

// setup webserver
app.use(express.static(__dirname + "/../public"));
console.log("public folder set to: " + __dirname + "/../public");
app.listen(8080, ()=>{
	console.log("webserver started on http://localhost:8080");
});

// setup websocketserver
wss.on("connection", function connection(ws) {
    console.log("Client connected");
});

console.log("websocket server started");

rtc.Server();
