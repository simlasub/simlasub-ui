/**
 * Draws the virtual Horizon.
 * @param {canvas context} vh
 */

// global variable, updated in initializeVirtualHorizon()!
var vhSize = [700,700]; // size of the virtual horizon
var vhOffset;
var vhParallelLength = 200; // half-length of horizon parallels
var vhCenterSpacing = 20; // half-length of center spacing

/**
 * initializes the virtual horizon needs canvas Context vh
 */
function initializeVirtualHorizon(){
	// clear canvas
	vh.strokeStyle = colors[0];
	vh.fillStyle = colors[0];
	vh.lineWidth = lineWidth;

	// update variables with new screen dimensions
	vhSize = [dim[0]*0.7 - 160,dim[1] * 0.8];
	vhOffset = [dim[0]/2-vhSize[0]/2, dim[1]/2-vhSize[1]/2];
	vhParallelLength = 0.2*(vhSize[0]-fontSize*3);
	vhCenterSpacing = 0.3 * vhParallelLength;
}

/**
 * renders the virtual horizon, the paralles and the horizon compass
 */
function renderVirtualHorizon(){
	// set parameters
	const parallelDistance = 10; // in degrees
	const clip = true;
	const framed = false;
	const vhCompassSize = 10;
	const vhDebug = false; // disables the transformation
	// resulting
	const y = dim[1]/2; // shortcut for readability

	// delete previous frame
	vh.setTransform(1, 0, 0, 1, 0, 0);
	vh.clearRect(0, 0, dim[0], dim[1]);
	vh.beginPath();

	// Clip a rectangular area for virtual horizon ############################
	if(clip){
		//vh.beginPath();
		vh.rect(vhOffset[0],vhOffset[1], vhSize[0], vhSize[1]);
		if(framed){vh.stroke();}
		vh.clip();
	}

	// draw Center indicator ##################################################
	/*
	// airplane style 
	vh.beginPath();
	vh.moveTo(dim[0]/2-vhCenterSpacing,dim[1]/2);
	vh.lineTo(dim[0]/2-vhCenterSpacing/3,dim[1]/2);
	vh.lineTo(dim[0]/2,dim[1]/2+vhCenterSpacing/3);
	vh.lineTo(dim[0]/2+vhCenterSpacing/3,dim[1]/2);
	vh.lineTo(dim[0]/2+vhCenterSpacing,dim[1]/2);
	vh.stroke();*/
	vh.lineWidth = 1.0*lineWidth;
	vh.beginPath();
	vh.moveTo(dim[0]/2-vhCenterSpacing,dim[1]/2);
	vh.lineTo(dim[0]/2+vhCenterSpacing,dim[1]/2);
	vh.stroke();
	vh.beginPath();
	vh.moveTo(dim[0]/2,dim[1]/2);
	vh.lineTo(dim[0]/2,dim[1]/2-vhCenterSpacing/1.5);
	vh.stroke();
	vh.lineWidth = lineWidth;



	// transform the canvas ###################################################
	if(!vhDebug){
		// roll transform
		vh.translate(dim[0]/2,dim[1]/2);
		vh.rotate(degToRad(roll));
		vh.translate(-dim[0]/2,-dim[1]/2);
		// pitch transform
		vh.translate(0,pitch*pixelPerDegree);
	}

	// draw horizon ###########################################################
	vh.beginPath();
	vh.moveTo(0,dim[1]/2);
	/*	//center cutout in horizon line
	vh.lineTo(dim[0]/2-centerSpacing,dim[1]/2);
	vh.stroke();
	vh.beginPath();
	vh.moveTo(dim[0]/2+centerSpacing,dim[1]/2);*/
	vh.lineTo(dim[0],dim[1]/2);
	vh.stroke();

    // draw compass ###########################################################
    for(let i = -360; i < 360; i+=10) {
		// translate by heading
		let j = i + heading;

		// draw ticks
		if(i%90==0){ // north, east, south and west
			vh.beginPath();
			vh.moveTo(dim[0]/2 - j*pixelPerDegree, y-vhCompassSize);
			vh.lineTo(dim[0]/2 - j*pixelPerDegree, y+vhCompassSize);
			vh.stroke();

		}else{ // all other 10° steps
			vh.beginPath();
			vh.moveTo(dim[0]/2 - j*pixelPerDegree, y-vhCompassSize);
			vh.lineTo(dim[0]/2 - j*pixelPerDegree, y);
			vh.stroke();
		}
		
		// draw text
		vh.textAlign = "center";
		vh.fillText(((360-i)%360).toFixed(0).padStart(3, '0'), 
			dim[0]/2 - j*pixelPerDegree, // x position
			y -vhCompassSize - fontSize/2 +fontOffset, 3* fontSize // y position
			);
	}

	// draw parallels #########################################################
	// draw top parallel
	for(var i = 1; i<18; i++){
		drawVirtualHorizon_Parallel(
			dim[1]/2 - i*parallelDistance*pixelPerDegree, // y coordinate
			vhCenterSpacing, vhParallelLength);
		
		// draw text
		vh.textAlign = "left";
		vh.fillText(i*parallelDistance, 
			dim[0]/2+vhParallelLength+10, // x
			dim[1]/2 - i*parallelDistance*pixelPerDegree + fontSize/2 -fontOffset, // y
			3* fontSize); // width
	}

	// draw bottom parallel
	vh.setLineDash([15,10]);
	for(var i = 1; i<18; i++){
		drawVirtualHorizon_Parallel(
			dim[1]/2 + i*parallelDistance*pixelPerDegree, // y coordinate
			vhCenterSpacing, vhParallelLength);
		
		// draw Text
		vh.textAlign = "left";
		vh.fillText(i*parallelDistance, 
			dim[0]/2+vhParallelLength+10, // x
			dim[1]/2 + i*parallelDistance*pixelPerDegree + fontSize/2 -fontOffset, // y
			3* fontSize); // width
	}
	vh.setLineDash([1,0]);
}

/**
 * draw the lines for the horizon parallels
 * @param {Number} y 
 * @param {Number} centerSpacing 
 * @param {Number} length 
 */
function drawVirtualHorizon_Parallel(y,centerSpacing,length){
	vh.beginPath();
	vh.moveTo(dim[0]/2-length,y);
	vh.lineTo(dim[0]/2-centerSpacing,y);
	vh.stroke();
	vh.beginPath();
	vh.moveTo(dim[0]/2+centerSpacing,y);
	vh.lineTo(dim[0]/2+length,y);
	vh.stroke();
}