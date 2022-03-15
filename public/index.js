// global variables
var colors = ["#e88300", "#006198","#e80000"];
const pixelRatio = window.devicePixelRatio || 1; // get screen scale factor (or 1 if unavailable)
var lineWidth = 1.0 * pixelRatio;
var fontSize = 25 * pixelRatio;
const fontOffset = 6 * pixelRatio;
var font;
var dim = [1920 * pixelRatio, 1080 * pixelRatio];
var opacity = 1.0; // overlay opacity

var b, c, vh; // for canvas elements

// status
var stat = {
	roll: 0, pitch:0, heading: 0, turnSpeed: 0,
	xSpeed: 5.0, ySpeed: 0.2, zSpeed: 0.3, 
	depth:0, vSpeed: 0,
	armed: true,
	battery: 10, maxBat: 14, minBat: 6, resBat: 8,
	lastError: "NO ERROR",
	time: 0
};
var features = {};

/**
 * this function is called after everything is loaded
 */
function onStart(){
	// get canvas context from html
	b = document.getElementById("background").getContext("2d");
	c = document.getElementById("canvas").getContext("2d");
	vh = document.getElementById("virtualHorizon").getContext("2d");

	// initialize features
	features.background = new Background(b);
	features.virtualHorizon = new VirtualHorizon(vh);
	features.compass = new Compass(c);
	features.depth = new Depth(c);
	features.speed = new Speed(c);

	// update Settings
	updateSettings();

	// setup resize function
	window.addEventListener("resize", onResize);
	document.getElementById("canvas-container").addEventListener("resize", onResize);
	document.getElementById("box-canvas").addEventListener("resize", onResize);
	document.addEventListener("fullscreenchange",onResize);
	onResize();

	// setup fullscreen
	document.addEventListener("keydown", function(e) {
		if (e.key === "f") {
		  toggleFullScreen();
		}
	  }, true);

	// render all
	initializeAll();

	// start Animation
	startAnimation();
}

/**
 * called on canvas resize (often multiple times)
 */
function onResize(){
	// get resolution off container
	const container = document.getElementById("canvas-container");

	// update canvas dimensions
	dim[0] = container.offsetWidth * pixelRatio;
	dim[1] = container.offsetHeight * pixelRatio;
	
	// get canvas elements
	var background = document.getElementById("background");
	var canvas = document.getElementById("canvas");
	var virtualHorizon = document.getElementById("virtualHorizon");

	// update resolution of canvases
	background.width = dim[0];
	background.height = dim[1];
	canvas.width = dim[0];
	canvas.height = dim[1];
	virtualHorizon.width = dim[0];
	virtualHorizon.height = dim[1];

	// redraw canvas
	initializeAll();
}

/**
 * initializes all active features and clears the canvases
 */
function initializeAll(){
	// setup canvas
	c.strokeStyle = colors[0];
	c.fillStyle = colors[0];
	c.lineWidth = lineWidth;
	c.font = font;
	c.globalAlpha = opacity;

	// setup vh canvas
	vh.strokeStyle = colors[0];
	vh.fillStyle = colors[0];
	vh.lineWidth = lineWidth;
	vh.font = font;
	vh.globalAlpha = opacity;

	// initialize all features
	Object.values(features).map(obj => obj.initialize(dim));

	// render all
	renderAll();
}

/**
 * renders all features with stat variable
 */
function renderAll(){
	// clear all canvases
	c.clearRect(0, 0, dim[0], dim[1]);
	vh.clearRect(0, 0, dim[0], dim[1]);

	// render all features
	Object.values(features).map(obj => obj.render(stat));
}

/**
 * reads the settings and updates the variables
 */
function updateSettings(){
	// opacity
	opacity = Math.pow(parseFloat(document.getElementById("ranOpa").value),1/2.2);
	// font Size
	fontSize = parseFloat(document.getElementById("ranFontSize").value) * pixelRatio;
	font = fontSize + "px sans-serif";
	// line Width
	lineWidth = parseFloat(document.getElementById("ranLineWith").value) * pixelRatio;

	// color
	colors[0] = document.getElementById("colMain").value;
	// feature Settings
	features.depth.mode = document.getElementById("selDepthMode").value;
	features.compass.mode = document.getElementById("selCompMode").value;
	features.speed.mode = document.getElementById("selSpeedMode").value;
	features.virtualHorizon.clip = document.getElementById("chkVhClip").checked;
	features.virtualHorizon.compass = document.getElementById("chkVhComp").checked;
	// update all
	onResize();
}


/**
 * toggles the fullscreen view of the canvas-container
 */
function toggleFullScreen() {
	// get container
	var container = document.getElementById("canvas-container");

	// check current fullscreen element
	if(document.fullscreenElement === container){
		document.exitFullscreen();
	}
	else{
		// set fullscreen (different browsers have different function names)
		if(container.requestFullScreen){
			container.requestFullScreen();}
		else if(container.webkitRequestFullScreen){
			container.webkitRequestFullScreen();}
		else if(container.mozRequestFullScreen){
			container.mozRequestFullScreen();
		}
	}

	// force redraw of css (only works in chrome)
	if(document.resize){
		document.resize();
	}
  }
