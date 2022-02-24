// global variable
var dim = [1920,1080];
const colors = ["#e88300", "#006198","#e80000"];
const lineWidth = 1.3;
const fontSize = 25;
const font = fontSize + "px sans-serif";

var pixelPerDegree = 20;

var b, c, vh; // for canvas elements

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

// this function is called after everything is loaded
function onStart(){
	// get canvas elements from html
	b = document.getElementById("background").getContext("2d");
	c = document.getElementById("canvas").getContext("2d");
	vh = document.getElementById("virtualHorizon").getContext("2d");

	window.addEventListener('resize', onResize);
	onResize();

	// render all
	initializeAll();

	// start Animation
	startAnimation();
}

// called on a window resize
function onResize(){
	//console.log("window resized");

	// get window resolution
	dim[0] = window.innerWidth;
	dim[1] = window.innerHeight;
	
	// get canvas elements
	var background = document.getElementById("background");
	var canvas = document.getElementById("canvas");
	var virtualHorizon = document.getElementById("virtualHorizon");

	// update canvas resolution
	background.width = dim[0];
	background.height = dim[1];
	canvas.width = dim[0];
	canvas.height = dim[1];
	virtualHorizon.width = dim[0];
	virtualHorizon.height = dim[1];

	// recalculate
	pixelPerDegree = dim[0]/90;

	// redraw canvas
	initializeAll();
}

function initializeAll(){
	initializeBackground();
	initializeVirtualHorizon();
	initializeDepth();

	renderAll();	
}

function renderAll(){
	renderBackground();
	renderVirtualHorizon();
	renderDepth();
}
