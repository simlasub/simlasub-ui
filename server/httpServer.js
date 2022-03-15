#!/bin/nodejs

// import dependencies
var express = require("express");

// create servers
var app = express(); 

// setup webserver
app.use(express.static(__dirname + "/../public"));
console.log("public folder set to: " + __dirname + "/../public");
app.listen(8080, ()=>{
	console.log("webserver started on http://localhost:8080");
});
