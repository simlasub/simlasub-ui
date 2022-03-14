/**
 * Draws the virtual Horizon.
 * @param {canvas context} vh
 */
const VirtualHorizon = class{
	offset;
	size;
	paraLength = 200; // half-length of horizon parallels
	centerSpace = 20; // half-length of center spacing

	/**
	 * 
	 * @param {canvas context} can 
	 */
		constructor(can){
		this.c = can;
	}

	/**
	 * initializes the virtual horizon needs canvas Context vh
	 */
	initialize(dim){
		// clear canvas
		this.c.strokeStyle = colors[0];
		this.c.fillStyle = colors[0];
		this.c.lineWidth = lineWidth;

		// update variables with new screen dimensions
		this.size = [dim[0]*0.7 - 160,dim[1] * 0.8];
		this.offset = [dim[0]/2-this.size[0]/2, dim[1]/2-this.size[1]/2];
		this.paraLength = 0.2*(this.size[0]-fontSize*3);
		this.centerSpace = 0.3 * this.paraLength;
	}

	/**
	 * renders the virtual horizon, the paralles and the horizon compass
	 */
	render(){
		// set parameters
		const parallelDistance = 10; // in degrees
		const clip = true;
		const framed = false;
		const vhCompassSize = 10;
		const vhDebug = false; // disables the transformation
		// resulting
		const y = dim[1]/2; // shortcut for readability

		// delete previous frame
		this.c.setTransform(1, 0, 0, 1, 0, 0);
		this.c.clearRect(0, 0, dim[0], dim[1]);
		this.c.beginPath();

		// Clip a rectangular area for virtual horizon ############################
		if(clip){
			//this.c.beginPath();
			this.c.rect(this.offset[0],this.offset[1], this.size[0], this.size[1]);
			if(framed){this.c.stroke();}
			this.c.clip();
		}

		// draw Center indicator ##################################################
		// airplane style 
		this.c.lineWidth = 1.0*lineWidth;
		this.c.beginPath();
		this.c.moveTo(dim[0]/2-this.centerSpace,dim[1]/2);
		this.c.lineTo(dim[0]/2-this.centerSpace/3,dim[1]/2);
		this.c.lineTo(dim[0]/2,dim[1]/2+this.centerSpace/3);
		this.c.lineTo(dim[0]/2+this.centerSpace/3,dim[1]/2);
		this.c.lineTo(dim[0]/2+this.centerSpace,dim[1]/2);
		this.c.stroke();
		this.c.lineWidth = lineWidth;



		// transform the canvas ###################################################
		if(!vhDebug){
			// roll transform
			this.c.translate(dim[0]/2,dim[1]/2);
			this.c.rotate(degToRad(roll));
			this.c.translate(-dim[0]/2,-dim[1]/2);
			// pitch transform
			this.c.translate(0,pitch*pixelPerDegree);
		}

		// draw horizon ###########################################################
		this.c.beginPath();
		this.c.moveTo(0,dim[1]/2);
		/*	//center cutout in horizon line
		this.c.lineTo(dim[0]/2-centerSpacing,dim[1]/2);
		this.c.stroke();
		this.c.beginPath();
		this.c.moveTo(dim[0]/2+centerSpacing,dim[1]/2);*/
		this.c.lineTo(dim[0],dim[1]/2);
		this.c.stroke();

		// draw compass ###########################################################
		for(let i = -360; i < 360; i+=10) {
			// translate by heading
			let j = i + heading;

			// draw ticks
			if(i%90==0){ // north, east, south and west
				this.c.beginPath();
				this.c.moveTo(dim[0]/2 - j*pixelPerDegree, y-vhCompassSize);
				this.c.lineTo(dim[0]/2 - j*pixelPerDegree, y+vhCompassSize);
				this.c.stroke();

			}else{ // all other 10° steps
				this.c.beginPath();
				this.c.moveTo(dim[0]/2 - j*pixelPerDegree, y-vhCompassSize);
				this.c.lineTo(dim[0]/2 - j*pixelPerDegree, y);
				this.c.stroke();
			}
			
			// draw text
			this.c.textAlign = "center";
			this.c.fillText(((360-i)%360).toFixed(0).padStart(3, '0'), 
				dim[0]/2 - j*pixelPerDegree, // x position
				y -vhCompassSize - fontSize/2 +fontOffset, 3* fontSize // y position
				);
		}

		// draw parallels #########################################################
		// draw top parallel
		for(var i = 1; i<18; i++){
			this.drawVirtualHorizon_Parallel(
				dim[1]/2 - i*parallelDistance*pixelPerDegree, // y coordinate
				this.centerSpace, this.paraLength);
			
			// draw text
			this.c.textAlign = "left";
			this.c.fillText(i*parallelDistance, 
				dim[0]/2+this.paraLength+10, // x
				dim[1]/2 - i*parallelDistance*pixelPerDegree + fontSize/2 -fontOffset, // y
				3* fontSize); // width
		}

		// draw bottom parallel
		this.c.setLineDash([15,10]);
		for(var i = 1; i<18; i++){
			this.drawVirtualHorizon_Parallel(
				dim[1]/2 + i*parallelDistance*pixelPerDegree, // y coordinate
				this.centerSpace, this.paraLength);
			
			// draw Text
			this.c.textAlign = "left";
			this.c.fillText(i*parallelDistance, 
				dim[0]/2+this.paraLength+10, // x
				dim[1]/2 + i*parallelDistance*pixelPerDegree + fontSize/2 -fontOffset, // y
				3* fontSize); // width
		}
		this.c.setLineDash([1,0]);
	}

	/**
	 * draw the lines for the horizon parallels
	 * @param {Number} y 
	 * @param {Number} centerSpacing 
	 * @param {Number} length 
	 */
	drawVirtualHorizon_Parallel(y,centerSpacing,length){
		this.c.beginPath();
		this.c.moveTo(dim[0]/2-length,y);
		this.c.lineTo(dim[0]/2-centerSpacing,y);
		this.c.stroke();
		this.c.beginPath();
		this.c.moveTo(dim[0]/2+centerSpacing,y);
		this.c.lineTo(dim[0]/2+length,y);
		this.c.stroke();
	}
}