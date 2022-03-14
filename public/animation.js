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

	stat.time = time;

	// calculate roll and pitch for virtual Horizon with added sin curves
	stat.roll = Math.sin(time * 0.2)*2.5 + Math.sin(time * 3)*0.5;
	stat.pitch = Math.sin(time * 0.05)*20 + Math.sin(time * 0.1)*1 + Math.sin(time * 3.5)*0.2;

	// rotate the heading linearly (2 °/s) the 360 is there to cap the value between 0-360
	stat.heading = (360 + time*2 + Math.sin(time * 0.2)*2.5)% 360;
	stat.turnSpeed = 2 + Math.cos(time * 0.2)*2.5*0.2

	// generate depth and vSpeed as second derivative of depth
	stat.depth = 5 + 0.05*Math.cos(time) - 5*Math.cos(time * 0.08);
	stat.vSpeed = - 0.05*Math.sin(time) + 0.08*5*Math.sin(time * 0.08);

	// render all
	// and optionally log the evaluation time
	//console.time("rendering");
	renderAll();
	//console.timeEnd("rendering");
}