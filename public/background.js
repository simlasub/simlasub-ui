/**
 * Draws the background with correct aspect ration and padding.
 * Updates pixelsPerDegree
 * @param {canvas context} vh
 */

const Background = class {
	pixelPerDegree;

	/**
	 * 
	 * @param {canvas context} can 
	 */
	constructor(can){
		this.c = can;
	}

	/**
	 * initializes the Background rendering
	 * and updates pixelPerDegree
	 */
	initialize(dim){
		// recalculate
		this.pixelPerDegree = dim[0]/90;
		
	}

	/**
	 * renders the background will be replaced with video stream
	 */
	render(){
		//clearCanvas(b);
		this.c.fillStyle = "transparent";
		this.c.fillRect(0, 0, dim[0], dim[1]);
		this.c.fillStyle = "#106050";
		this.c.fillRect(0,(dim[1] - 9/16 * dim[0])/2 , dim[0], 9/16 * dim[0]);
	}
}
