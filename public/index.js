// global variable
const dim = [1920,1080];
const colors = ["#e88300", "#e80000"];
const lineWidth = 2;
const fontSize = 25;
const font = fontSize + "px Roboto Mono";

var pixelPerDegree = 20;

var b,cp; // for canvas elements

var roll = pitch = heading = 0;
var xSpeed = ySpeed = zSpeed = 0;
var depth = 0;
var mode = "disarmed";
var armed = false;
var battery = 10;
var maxBattery = 14;
var minBattery = 6;
var resBattery = 8;
var lastError = "NO ERROR";

var animationFrameTime = 1000/15;

// this function is called after everything is loaded
function onStart(){
	// get canvas elements from html
	b = document.getElementById("background").getContext("2d");
	cp = document.getElementById("centerPanel").getContext("2d");

	window.addEventListener('resize', onResize);
	onResize();

	// render background
	renderBackground();

	// render virtual Horizon
	initializeCenterPanel();
	renderCenterPanel();

	// start Animation
	setInterval(renderAnimation, animationFrameTime);
}

function renderAnimation(){
	const d = animationFrameTime *0.02;
	const f = animationFrameTime *0.00001;

	roll += (Math.random() - 0.5)*d - roll*f;
	pitch += (Math.random() - 0.5)*d- pitch*f;
	heading += (Math.random() - 0.5)*d - heading*f;

	renderCenterPanel();
}

// called on a window resize
function onResize(){
	console.log("window resized");

	// get window resolution
	dim[0] = window.innerWidth;
	dim[1] = window.innerHeight;
	
	// get canvas elements
	var background = document.getElementById("background");
	var virtualHorizon = document.getElementById("centerPanel");

	// update canvas resolution
	background.width = dim[0];
	virtualHorizon.height = dim[1];
	background.width = dim[0];
	virtualHorizon.height = dim[1];

	// redraw canvas
	renderBackground();
	initializeCenterPanel();
	renderCenterPanel();
}

// render the background will be replaced with video stream
function renderBackground(){
	//clearCanvas(b);
	b.fillStyle = "#106050";
	b.fillRect(0, 0, dim[0], dim[1]);
}

function degToRad (deg) { return deg / (180/Math.PI); }
function radToDeg (rad) { return rad * (180/Math.PI); }