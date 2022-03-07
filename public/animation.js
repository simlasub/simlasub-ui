/**
* This file is for demonstration and testing purposes only!
* It generates testing data for UI testing.
*/

// global variables
var animationFrameTime = 1/30;
var frame = 0;
var animationSpeedFaktor = 1;

/**
 * start the Animation
 */
function startAnimation(){
	setInterval(renderAnimation, animationFrameTime*1000);
}

/**
 * callback for animation Interval (don't call manually!)
 */
function renderAnimation(){
	// increment frame number and calculate time 
	// not memory efficient but this is no production code
	frame++;
	const time = frame * animationFrameTime * animationSpeedFaktor;

	// calculate roll and pitch for virtual Horizon with added sin curves
	roll = Math.sin(time * 0.2)*2.5 + Math.sin(time * 3)*0.5;
	pitch = Math.sin(time * 0.05)*20 + Math.sin(time * 0.1)*1 + Math.sin(time * 3.5)*0.2;

	// rotate the heading linearly (2 °/s) the 360 is there to cap the value between 0-360
	heading = (360 + time*2)% 360;

	// generate depth and vSpeed as second derivative of depth
	depth = 5 + 0.05*Math.cos(time) - 5*Math.cos(time * 0.08);
	vSpeed = - 0.05*Math.sin(time) + 0.08*5*Math.sin(time * 0.08);

	// render all
	// and optionally log the evaluation time
	//console.time("rendering");
	renderAll();
	//console.timeEnd("rendering");
}