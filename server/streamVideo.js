#!/bin/nodejs

// import dependencies
var express = require("express");
var WebSocket = require("ws");
var fs = require("fs");
const Splitter = require("stream-split");
const Throttle     = require('stream-throttle').Throttle;

const NAL_SEPERATOR = Buffer.from([0,0,0,1]);

// create servers
var app = express(); 
var wss = new WebSocket.Server({port: 1234});

// setup webserver
app.use(express.static(__dirname + "/../public"));
console.log("public folder set to: " + __dirname + "/../public");
app.listen(8080, ()=>{
	console.log("webserver started on http://localhost:8080");
});

// setup websocketserver
wss.on("connection", function connection(ws) {
    console.log("Client connected");

	setTimeout(startStream, 100);

});
console.log("websocket server started");

function startStream(){
	/* generate video file with:
	 * ffmpeg -i example.mp4 -vcodec libx264 -profile:v baseline -b:v 2M -pass 1 -bf 0  -g 30 -keyint_min 60 -bsf:v h264_mp4toannexb example.h264
	 * ffmpeg -i example.mp4 -vcodec libx264 -b:v 2M -pass 1 -bf 0 -g 30 -keyint_min 30 example.h264
	 */
	const stream = fs.createReadStream("example.h264",{highWaterMark:70000000}).pipe(
		new Throttle({rate: 50000})
	).pipe(
		new Splitter(NAL_SEPERATOR)
	);

stream.on("data",(data)=>{
	wss.clients.forEach((viewer)=>{
		if(viewer!=null && viewer.readyState === WebSocket.OPEN){
			viewer.send(Buffer.concat([data, NAL_SEPERATOR]));
			console.log(data);
		}
	});
});

stream.on("close", ()=> console.log("stream closed"));
stream.on("end", ()=> console.log("stream ended"));
stream.on("error", (error)=> {throw error;});
}