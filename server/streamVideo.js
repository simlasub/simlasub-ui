 
const RtspServer = require('rtsp-streaming-server').default;
 
const server = new RtspServer({
    serverPort: 5554,
    clientPort: 6554,
    rtpPortStart: 10000,
    rtpPortCount: 10000
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
	const stream = fs.createReadStream(__dirname + "/../exampleData/example.h264",{highWaterMark:70000000}).pipe(
		new Throttle({rate: 780000})
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