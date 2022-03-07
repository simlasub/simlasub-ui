/**
 * Draws Depth scale and vSpeed indicator.
 * @param {canvas context} c
 * @param {Number} vhSize[1]
 */

// global variables
var depthSize = [80,vhSize[1]];


// initializes the depth gauge
function initializeDepth(){
	depthSize = [80,vhSize[1]];
}

/**
 * renders the depth scale and vSpeed indicator
 * @param {Number} mode
 * mode 
 *	1: Full
 * 	2: Number and vSpeed indicator
 * 	3: only number
 */
function renderDepth(mode){
	const offset = [ vhOffset[0]+vhSize[0], vhOffset[1] ];
	const depthScaleExtend = 8;
	const vSpeedScaleExtend = 1;
	const vSpeedIndicator = 15;
	const framed = false;

	if(mode<=1){
		drawDepthScale(offset, depthScaleExtend);
	}
	if(mode<=2){
		// draw line for Scales between virtual Horizon #######################
		c.beginPath();
		c.moveTo(offset[0], offset[1]);
		c.lineTo(offset[0], offset[1]+depthSize[1]);
		// if framed draw box
		if(framed){	c.rect(offset[0],offset[1],depthSize[0],depthSize[1]);}
		c.stroke();
	}

	// draw depth number ######################################################
	// clear under text
	c.clearRect(offset[0], 
		offset[1] + depthSize[1]/2 - fontSize/2-4, 
		depthSize[0], fontSize+4);
	// draw text
	c.textAlign = "right";
	c.fillText(depth.toFixed(1), 
		offset[0]+depthSize[0]-5, 
		offset[1] + depthSize[1]/2 + fontSize/2-fontOffset, depthSize[0]-5);
	// draw rectangle around
	if(mode < 3){
		c.rect(offset[0], 
			offset[1] + depthSize[1]/2 - fontSize/2-4, 
			depthSize[0], fontSize+4);
		c.stroke();
	}

	// draw vSpeed ############################################################
	if(mode<=2){
		drawVSpeed(offset, vSpeedIndicator, vSpeedScaleExtend, mode);
	}
}

function drawDepthScale(offset, depthScaleExtend){
	// calculate depth Scale
	const depthScale = depthSize[1] / depthScaleExtend;

	// depth Lines ############################################################
	var i = depth%1; // transpose by difference ie. 12.25m => 0.25m 
	// loop over top lines
	while(i*depthScale < depthSize[1]/2){
		drawDepthIndicator(offset, depthScale, i);
		i += 1;
	}
	// loop over bottom lines
	var i = depth%1-1;
	while(i*depthScale > -depthSize[1]/2){
		drawDepthIndicator(offset, depthScale, i);
		i = i-1;
	}
}

/**
 * Draw the vSpeed scale and Indicator.
 * @param {Number[2]} offset 
 * @param {Number} vSpeedIndicator Size of indicator
 * @param {Number} vSpeedScaleExtend
 * @param {Number} mode
 */
function drawVSpeed(offset, vSpeedIndicator, vSpeedScaleExtend, mode){
	const vSpeedScale = depthSize[1] / vSpeedScaleExtend;
	
	// small strokes
	for(var i=0; i*vSpeedScale <= depthSize[1]/2; i+= 0.1){
		drawDepthVSpeedTick(offset,vSpeedScale,i, 8);
	}
	// main Strokes
	for(var i=0; i*vSpeedScale <= depthSize[1]/2; i+= 0.5){
		drawDepthVSpeedTick(offset,vSpeedScale,i, 15);
	}
	// draw vSpeed Indicator
	c.beginPath();
	const y = clamp(vSpeed*vSpeedScale, -vSpeedScale*depthSize[1]/2, vSpeedScale*depthSize[1]/2);
	c.moveTo(offset[0], offset[1] + depthSize[1]/2 + y);
	c.lineTo(offset[0]-vSpeedIndicator, 
		offset[1] + depthSize[1]/2 + y+vSpeedIndicator/1.2);
	c.lineTo(offset[0]-vSpeedIndicator, 
		offset[1] + depthSize[1]/2 + y-vSpeedIndicator/1.2);
	c.lineTo(offset[0], offset[1] + depthSize[1]/2 + y);
	c.fill();
	// draw vSpeed Text
	if(mode<=1){
		c.textAlign = "right";
		c.fillText(vSpeed.toFixed(2), offset[0]+depthSize[0], offset[1] -6, depthSize[0]);
	}	
}

/**
 * Draw all depth lines in one direction
 * @param {Number[2]} offset 
 * @param {Number} depthScale 
 * @param {BigInt} i // TypeScript doesn't have a Integers Interface 
 */
function drawDepthIndicator(offset,depthScale, i){
	// parameter
	const depthScaleLength = 20;

	if(depth-i > 0){ // recognise of surface
		// draw line
		c.beginPath();
		c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*depthScale);
		c.lineTo(offset[0]+depthScaleLength, offset[1] + depthSize[1]/2 - i*depthScale);
		c.stroke();	
		// draw text
		c.textAlign = "left";
		c.fillText((depth-i).toFixed(0), 
			offset[0]+depthScaleLength,  // x
			offset[1] + depthSize[1]/2 - i*depthScale + fontSize/2-fontOffset,  // y
			 depthSize[0]-depthScaleLength); // width
	} else if(depth-i == 0){
		// rectangle for surface
		c.rect(offset[0], 
			offset[1] + depthSize[1]/2 - i*depthScale, 
			depthSize[0], i*depthScale -depthSize[1]/2 );
		c.stroke();
	}
}

/**
 * 
 * @param {Number[2]} offset 
 * @param {Number} vSpeedScale 
 * @param {BigInt} i 
 * @param {Number} size 
 */
function drawDepthVSpeedTick(offset,vSpeedScale, i, size){
	// draw upper line
	c.beginPath();
	c.moveTo(offset[0], offset[1] + depthSize[1]/2 + i*vSpeedScale);
	c.lineTo(offset[0]-size, offset[1] + depthSize[1]/2 + i*vSpeedScale);
	c.stroke();

	// draw lower line
	c.beginPath();
	c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*vSpeedScale);
	c.lineTo(offset[0]-size, offset[1] + depthSize[1]/2 - i*vSpeedScale);
	c.stroke();
}