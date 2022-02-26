// global variables
var dim = [1920,1080];
const colors = ["#e88300", "#006198","#e80000"];
const lineWidth = 2.0;
const fontSize = 25;
const fontOffset = 6;
const font = fontSize + "px sans-serif";

var pixelPerDegree = 20;

var b, c, vh; // for canvas elements

// status variables, maybe store in dictionary?
/*var stat = {
	roll: 0, pitch:0, heading: 0,
	xSpeed: 0, ySpeed: 0, zSpeed: 0, 
	depth:0, vSpeed: 0,
	armed: true,
	battery: 10, maxBat: 14, minBat: 6, resBat: 8,
	lastError: "NO ERROR"
};*/
var roll = pitch = heading = 0;
var xSpeed = ySpeed = zSpeed = vSpeed = 0;
var depth = 0;
var mode = "disarmed";
var armed = false;
var battery = 10;
var maxBattery = 14;
var minBattery = 6;
var resBattery = 8;
var lastError = "NO ERROR";

// dictionary with features: lable: [init. Fkt., render Fkt.]
const featureFunctions = {
	background: [()=>initializeBackground(),()=>renderBackground()],
	virtualHorizon: [()=>initializeVirtualHorizon(),()=>renderVirtualHorizon()],
	depth: [()=>initializeDepth(),()=>renderDepth()],
	compass: [()=>initializeCompass(),()=>renderCompass()],
};
// array of features to handle (initialize and render)
var activeFeatures = ["background","virtualHorizon","depth","compass"];

/**
 * this function is called after everything is loaded
 */
function onStart(){
	// get canvas context from html
	b = document.getElementById("background").getContext("2d");
	c = document.getElementById("canvas").getContext("2d");
	vh = document.getElementById("virtualHorizon").getContext("2d");

	// setup resize function
	window.addEventListener('resize', onResize);
	onResize();

	// render all
	initializeAll();

	// start Animation
	startAnimation();
}

// called on a window resize
function onResize(){
	// get window resolution
	dim[0] = window.innerWidth;
	dim[1] = window.innerHeight;
	
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

	// setup vh canvas
	vh.strokeStyle = colors[0];
	vh.fillStyle = colors[0];
	vh.lineWidth = lineWidth;
	vh.font = font;
	
	// call initialization Functions with their feature names i in the active features list
	activeFeatures.map((i)=>featureFunctions[i][0]());	

	// render all
	renderAll();
}

/**
 * renders all active features
 */
function renderAll(){
	// clear all canvases
	c.clearRect(0, 0, dim[0], dim[1]);
	vh.clearRect(0, 0, dim[0], dim[1]);

	// call render Functions with their feature names i in the active features list
	activeFeatures.map((i)=>featureFunctions[i][1]());
}
