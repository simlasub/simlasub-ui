
// global 
const mediaSrc = new MediaSource();
const mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
var video;


function mediaSrc_OnOpen(){
	// setup websocket client
	const ws = new WebSocket("ws://" + location.hostname + ":1234");
	ws.binaryType = "arraybuffer";

	ws.onmessage = function(event) {
		var data = new Uint8Array(event.data);

		if(event.data.length === 0) {	
			console.warn("empty packet received");
			return;
		} 

		console.log(data);

		const srcBuff = mediaSrc.addSourceBuffer(mimeType);
		srcBuff.addEventListener("updateend",()=>{
			video.play();
		});

		srcBuff.appendBuffer(data);
		
	}
}

function onStart(){
	// add media source to player
	var video = document.getElementById("video");
	video.src = URL.createObjectURL(mediaSrc);

	// create and configure media source
	if(! MediaSource.isTypeSupported(mimeType)){console.warn("mimeType not supported");}
	mediaSrc.addEventListener('sourceopen', mediaSrc_OnOpen);
}