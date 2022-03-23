 
const RtspServer = require('rtsp-streaming-server').default;
 
const server = new RtspServer({
    serverPort: 5554,
    clientPort: 6554,
    rtpPortStart: 10000,
    rtpPortCount: 10000
});
 
 
try {
	server.start();
} catch (e) {
	console.error(e);
}