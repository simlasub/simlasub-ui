// global variables
const pixelRatio = window.devicePixelRatio || 1; // get screen scale factor (or 1 if unavailable)
var dim = [1920 * pixelRatio, 1080 * pixelRatio];

var b, c, vh; // for canvas elements

// object for status
var stat = {
	roll: 0, pitch:0, heading: 0, turnSpeed: 0,
	xSpeed: 5.0, ySpeed: 0.2, zSpeed: 0.3, 
	depth:0, vSpeed: 0,
	armed: true,
	battery: 10, maxBat: 14, minBat: 6, resBat: 8,
	lastError: "NO ERROR",
	time: 0
};
// object to store all global Settings
var settings = {
	opacity: 1.0,
	fontSize: 25 * pixelRatio,
	lineWidth: 1. * pixelRatio,
	colors: ["#e88300", "#006198","#e80000"],
	font: "px sans-serif",
	fontOffset: 6*pixelRatio,
	depth:{	mode: 1 },
	compass:{ mode: 2 },
	speed:{	mode: 2 },
	virtualHorizon:{
		enable: true,
		compass: true
	}
}
// array of all active features
var features = {};
// save variables for toggle functions
var lastOpacity;

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
	features.speed = new Speed(c);
	features.compass = new Compass(c);
	features.depth = new Depth(c);

	// update Settings
	writeSettingsHTML();
	applySettings();

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

	// setup s to deactivate symbology
	document.addEventListener("keydown", function(e) {
		if (e.key === "s") {
			if(document.getElementById("ranOpa").value == 0){
				document.getElementById("ranOpa").value = lastOpacity;
				settings.opacity = lastOpacity;
			} else{
				lastOpacity = settings.opacity;
				settings.opacity = 0;
			}
			writeSettingsHTML();
			applySettings();			
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
	readSettingsHTML();

	// initialize all features
	features.virtualHorizon.initialize(dim); // other features reference the vH
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
 * apply settings from the settings object to the features
 */
function applySettings(){
	// canvas settings
	c.strokeStyle = settings.colors[0];
	c.fillStyle = settings.colors[0];
	c.font = settings.fontSize + settings.font;
	c.globalAlpha = settings.opacity;
	// virtual horizon canvas Settings
	vh.strokeStyle = settings.colors[0];
	vh.fillStyle = settings.colors[0];
	vh.font = settings.fontSize + settings.font;
	vh.globalAlpha = settings.opacity;

	// assign settings
	Object.assign(features.background, settings.background);
	Object.assign(features.virtualHorizon, settings.virtualHorizon);
	Object.assign(features.speed, settings.speed);
	Object.assign(features.compass, settings.compass);
	Object.assign(features.depth, settings.depth);

	// re-initialize all features
	Object.values(features).map(obj => obj.initialize(dim));
}

/**
 * reads the settings from the HTML and updates the settings object
 */
function readSettingsHTML(){
	// opacity
	settings.opacity = Math.pow(parseFloat(document.getElementById("ranOpa").value),1/2.2);
	// font Size
	settings.fontSize = parseFloat(document.getElementById("ranFontSize").value) * pixelRatio;
	// line Width
	settings.lineWidth = parseFloat(document.getElementById("ranLineWith").value) * pixelRatio;

	// color
	settings.colors[0] = document.getElementById("colMain").value;
	// feature Settings
	settings.depth.mode = document.getElementById("selDepthMode").value;
	settings.compass.mode = document.getElementById("selCompMode").value;
	settings.speed.mode = document.getElementById("selSpeedMode").value;
	
	settings.virtualHorizon.enable = document.getElementById("chkVhEn").checked;
	settings.virtualHorizon.compass = document.getElementById("chkVhComp").checked;

	// apply the changes
	applySettings();
}

/**
 * write settings from the object to the HTML
 */
function writeSettingsHTML(){
	// opacity
	document.getElementById("ranOpa").value = Math.pow(settings.opacity,2.2);
	// font Size
	document.getElementById("ranFontSize").value = settings.fontSize / pixelRatio;
	// line Width
	document.getElementById("ranLineWith").value = settings.lineWidth / pixelRatio;

	// color
	document.getElementById("colMain").value = settings.colors[0];
	// feature Settings
	document.getElementById("selDepthMode").value = settings.depth.mode;
	document.getElementById("selCompMode").value = settings.compass.mode;
	document.getElementById("selSpeedMode").value = settings.speed.mode;
	
	document.getElementById("chkVhEn").checked = settings.virtualHorizon.enable;
	document.getElementById("chkVhComp").checked = settings.virtualHorizon.compass;
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
