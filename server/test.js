#!/bin/nodejs

const Split = require("stream-split");

const splitter = new Split(new Buffer(
	"asdf"
	
));


splitter.on("data", function(data){
	console.log(data.toString());
  });
  
  
  splitter.write("ok");
  splitter.write("asdf"); //got chunk
  splitter.write("ok");
  splitter.write("asdf"); //got chunk
