/**
 * Draws the background with correct aspect ration and padding.
 * Updates pixelsPerDegree
 * @param {canvas context} vh
 */

/**
 * initializes the Background rendering
 * and updates pixelPerDegree
 */
function initializeBackground(){
	// recalculate
	pixelPerDegree = dim[0]/90;
	
}

/**
 * renders the background will be replaced with video stream
 */
function renderBackground(){
	//clearCanvas(b);
	b.fillStyle = "transparent";
	b.fillRect(0, 0, dim[0], dim[1]);
	b.fillStyle = "#106050";
	b.fillRect(0,(dim[1] - 9/16 * dim[0])/2 , dim[0], 9/16 * dim[0]);
}
