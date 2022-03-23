/**
 * Draws Depth scale and vSpeed indicator.
 * @param {canvas context} c
 * @param {Number} this.vhSize[1]
 */
const Depth = class {
	size;
	mode = 0;
	vhSize;
	offset;
	depthScaleExtend = 8;
	vSpeedScaleExtend = 1;
	vSpeedIndicator = 10*pixelRatio;
	framed = false;

	/**
	 * 
	 * @param {canvas context} can 
	 */
	constructor(can){
		this.c = can;
	}

	// initializes the depth gauge
	initialize(dim){
		// get size and pos. of Virtual Horizon
		this.vhSize = features.virtualHorizon.size;
		this.vhOffset = features.virtualHorizon.offset;

		// update Size and offset
		this.size = [80*pixelRatio, 0.8 * dim[1]];
		this.offset = [ 
			features.virtualHorizon.offset[0]+this.vhSize[0],
			features.virtualHorizon.offset[1] 
		];
	}

	/**
	 * renders the depth scale and vSpeed indicator
	*/
	render(stat){

		if(this.mode<=1){
			this.drawDepthScale();
		}
		if(this.mode<=2){
			// draw line for Scales between virtual Horizon #######################
			this.c.beginPath();
			this.c.moveTo(this.offset[0], this.offset[1]);
			this.c.lineTo(this.offset[0], this.offset[1]+this.size[1]);
			// if framed draw box
			if(this.framed){	this.c.rect(this.offset[0],this.offset[1],this.size[0],this.size[1]);}
			this.c.stroke();
		}

		// draw depth number ######################################################
		// clear under text
		this.c.clearRect(this.offset[0], 
			this.offset[1] + this.size[1]/2 - fontSize/2-4, 
			this.size[0], fontSize+4);
		// draw text
		this.c.textAlign = "right";
		this.c.fillText(stat.depth.toFixed(1), 
			this.offset[0]+this.size[0]-5, 
			this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset, this.size[0]-5);
		// draw rectangle around
		if(this.mode < 3){
			this.c.rect(this.offset[0], 
				this.offset[1] + this.size[1]/2 - fontSize/2-4, 
				this.size[0], fontSize + 4);
			this.c.stroke();
		}

		// draw vSpeed ############################################################
		if(this.mode<=2){
			this.drawVSpeed();
		}
	}

	drawDepthScale(){
		// calculate depth Scale
		const depthScale = this.size[1] / this.depthScaleExtend;

		// depth Lines ############################################################
		var i = stat.depth%1; // transpose by difference ie. 12.25m => 0.25m 
		// loop over top lines
		while(i*depthScale < this.size[1]/2){
			this.drawDepthIndicator(depthScale, i);
			i += 1;
		}
		// loop over bottom lines
		var i = stat.depth%1-1;
		while(i*depthScale > -this.size[1]/2){
			this.drawDepthIndicator(depthScale, i);
			i = i-1;
		}
	}

	/**
	 * Draw the vSpeed scale and Indicator.
	 */
	drawVSpeed(){
		const vSpeedScale = this.size[1] / this.vSpeedScaleExtend;
		
		// small strokes
		for(var i=0.1; i*vSpeedScale <= this.size[1]/2; i+= 0.1){
			this.drawDepthVSpeedTick(vSpeedScale,i, 8);
		}
		// main Strokes
		for(var i=0; i*vSpeedScale <= this.size[1]/2; i+= 0.5){
			this.drawDepthVSpeedTick(vSpeedScale,i, 15);
		}
		// draw vSpeed Indicator
		this.c.beginPath();
		const y = clamp(stat.vSpeed*vSpeedScale, -vSpeedScale*this.size[1]/2, vSpeedScale*this.size[1]/2);
		this.c.moveTo(this.offset[0], this.offset[1] + this.size[1]/2 + y);
		this.c.lineTo(this.offset[0]-this.vSpeedIndicator, 
			this.offset[1] + this.size[1]/2 + y+this.vSpeedIndicator/1.2);
		this.c.lineTo(this.offset[0]-this.vSpeedIndicator, 
			this.offset[1] + this.size[1]/2 + y-this.vSpeedIndicator/1.2);
		this.c.lineTo(this.offset[0], this.offset[1] + this.size[1]/2 + y);
		this.c.fill();
		// draw vSpeed Text
		if(this.mode<=1){
			this.c.textAlign = "right";
			this.c.fillText(stat.vSpeed.toFixed(2), this.offset[0]+this.size[0], this.offset[1] -6, this.size[0]);
		}	
	}

	/**
	 * Draw all depth lines in one direction
	 * @param {Number} depthScale 
	 * @param {BigInt} i // TypeScript doesn't have a Integers Interface 
	 */
	drawDepthIndicator(depthScale, i){
		// parameter
		const depthScaleLength = 20;

		if(stat.depth-i > 0){ // recognise of surface
			// draw line
			this.c.beginPath();
			this.c.moveTo(this.offset[0], this.offset[1] + this.size[1]/2 - i*depthScale);
			this.c.lineTo(this.offset[0]+depthScaleLength, this.offset[1] + this.size[1]/2 - i*depthScale);
			this.c.stroke();	
			// draw text
			this.c.textAlign = "left";
			this.c.fillText((stat.depth-i).toFixed(0), 
				this.offset[0]+depthScaleLength,  // x
				this.offset[1] + this.size[1]/2 - i*depthScale + fontSize/2-fontOffset,  // y
				this.size[0]-depthScaleLength); // width
		} else if(stat.depth-i == 0){
			// rectangle for surface
			this.c.rect(this.offset[0], 
				this.offset[1] + this.size[1]/2 - i*depthScale, 
				this.size[0], i*depthScale -this.size[1]/2 );
			this.c.stroke();
		}
	}

	/**
	 * 
	 * @param {Number[2]} this.offset 
	 * @param {Number} vSpeedScale 
	 * @param {BigInt} i 
	 * @param {Number} size 
	 */
	drawDepthVSpeedTick(vSpeedScale, i, size){
		// draw upper line
		this.c.beginPath();
		this.c.moveTo(this.offset[0], this.offset[1] + this.size[1]/2 + i*vSpeedScale);
		this.c.lineTo(this.offset[0]-size, this.offset[1] + this.size[1]/2 + i*vSpeedScale);
		this.c.stroke();

		// draw lower line
		this.c.beginPath();
		this.c.moveTo(this.offset[0], this.offset[1] + this.size[1]/2 - i*vSpeedScale);
		this.c.lineTo(this.offset[0]-size, this.offset[1] + this.size[1]/2 - i*vSpeedScale);
		this.c.stroke();
	}
}