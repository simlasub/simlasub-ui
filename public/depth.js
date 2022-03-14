/**
 * Draws Depth scale and vSpeed indicator.
 * @param {canvas context} c
 * @param {Number} this.vhSize[1]
 */
const Depth = class {
	depthSize;
	mode = 0;
	vhSize;
	vhOffset;

	/**
	 * 
	 * @param {canvas context} can 
	 */
	constructor(can){
		this.c = can
	}

	// initializes the depth gauge
	initialize(dim){
		// get size and pos. of Virtual Horizon
		this.vhSize = features.virtualHorizon.size;
		this.vhOffset = features.virtualHorizon.offset;

		// update Size
		this.depthSize = [80,this.vhSize[1]];
	}

	/**
	 * renders the depth scale and vSpeed indicator
	*/
	render(){
		const offset = [ this.vhOffset[0]+this.vhSize[0], this.vhOffset[1] ];
		const depthScaleExtend = 8;
		const vSpeedScaleExtend = 1;
		const vSpeedIndicator = 15;
		const framed = false;

		if(this.mode<=1){
			this.drawDepthScale(offset, depthScaleExtend);
		}
		if(this.mode<=2){
			// draw line for Scales between virtual Horizon #######################
			this.c.beginPath();
			this.c.moveTo(offset[0], offset[1]);
			this.c.lineTo(offset[0], offset[1]+this.depthSize[1]);
			// if framed draw box
			if(framed){	this.c.rect(offset[0],offset[1],this.depthSize[0],this.depthSize[1]);}
			this.c.stroke();
		}

		// draw depth number ######################################################
		// clear under text
		this.c.clearRect(offset[0], 
			offset[1] + this.depthSize[1]/2 - fontSize/2-4, 
			this.depthSize[0], fontSize+4);
		// draw text
		this.c.textAlign = "right";
		this.c.fillText(depth.toFixed(1), 
			offset[0]+this.depthSize[0]-5, 
			offset[1] + this.depthSize[1]/2 + fontSize/2-fontOffset, this.depthSize[0]-5);
		// draw rectangle around
		if(this.mode < 3){
			this.c.rect(offset[0], 
				offset[1] + this.depthSize[1]/2 - fontSize/2-4, 
				this.depthSize[0], fontSize+4);
			this.c.stroke();
		}

		// draw vSpeed ############################################################
		if(this.mode<=2){
			this.drawVSpeed(offset, vSpeedIndicator, vSpeedScaleExtend);
		}
	}

	drawDepthScale(offset, depthScaleExtend){
		// calculate depth Scale
		const depthScale = this.depthSize[1] / depthScaleExtend;

		// depth Lines ############################################################
		var i = depth%1; // transpose by difference ie. 12.25m => 0.25m 
		// loop over top lines
		while(i*depthScale < this.depthSize[1]/2){
			this.drawDepthIndicator(offset, depthScale, i);
			i += 1;
		}
		// loop over bottom lines
		var i = depth%1-1;
		while(i*depthScale > -this.depthSize[1]/2){
			this.drawDepthIndicator(offset, depthScale, i);
			i = i-1;
		}
	}

	/**
	 * Draw the vSpeed scale and Indicator.
	 * @param {Number[2]} offset 
	 * @param {Number} vSpeedIndicator Size of indicator
	 * @param {Number} vSpeedScaleExtend
	 */
	drawVSpeed(offset, vSpeedIndicator, vSpeedScaleExtend){
		const vSpeedScale = this.depthSize[1] / vSpeedScaleExtend;
		
		// small strokes
		for(var i=0; i*vSpeedScale <= this.depthSize[1]/2; i+= 0.1){
			this.drawDepthVSpeedTick(offset,vSpeedScale,i, 8);
		}
		// main Strokes
		for(var i=0; i*vSpeedScale <= this.depthSize[1]/2; i+= 0.5){
			this.drawDepthVSpeedTick(offset,vSpeedScale,i, 15);
		}
		// draw vSpeed Indicator
		this.c.beginPath();
		const y = clamp(vSpeed*vSpeedScale, -vSpeedScale*this.depthSize[1]/2, vSpeedScale*this.depthSize[1]/2);
		this.c.moveTo(offset[0], offset[1] + this.depthSize[1]/2 + y);
		this.c.lineTo(offset[0]-vSpeedIndicator, 
			offset[1] + this.depthSize[1]/2 + y+vSpeedIndicator/1.2);
		this.c.lineTo(offset[0]-vSpeedIndicator, 
			offset[1] + this.depthSize[1]/2 + y-vSpeedIndicator/1.2);
		this.c.lineTo(offset[0], offset[1] + this.depthSize[1]/2 + y);
		this.c.fill();
		// draw vSpeed Text
		if(this.mode<=1){
			this.c.textAlign = "right";
			this.c.fillText(vSpeed.toFixed(2), offset[0]+this.depthSize[0], offset[1] -6, this.depthSize[0]);
		}	
	}

	/**
	 * Draw all depth lines in one direction
	 * @param {Number[2]} offset 
	 * @param {Number} depthScale 
	 * @param {BigInt} i // TypeScript doesn't have a Integers Interface 
	 */
	drawDepthIndicator(offset,depthScale, i){
		// parameter
		const depthScaleLength = 20;

		if(depth-i > 0){ // recognise of surface
			// draw line
			this.c.beginPath();
			this.c.moveTo(offset[0], offset[1] + this.depthSize[1]/2 - i*depthScale);
			this.c.lineTo(offset[0]+depthScaleLength, offset[1] + this.depthSize[1]/2 - i*depthScale);
			this.c.stroke();	
			// draw text
			this.c.textAlign = "left";
			this.c.fillText((depth-i).toFixed(0), 
				offset[0]+depthScaleLength,  // x
				offset[1] + this.depthSize[1]/2 - i*depthScale + fontSize/2-fontOffset,  // y
				this.depthSize[0]-depthScaleLength); // width
		} else if(depth-i == 0){
			// rectangle for surface
			this.c.rect(offset[0], 
				offset[1] + this.depthSize[1]/2 - i*depthScale, 
				this.depthSize[0], i*depthScale -this.depthSize[1]/2 );
			this.c.stroke();
		}
	}

	/**
	 * 
	 * @param {Number[2]} offset 
	 * @param {Number} vSpeedScale 
	 * @param {BigInt} i 
	 * @param {Number} size 
	 */
	drawDepthVSpeedTick(offset,vSpeedScale, i, size){
		// draw upper line
		this.c.beginPath();
		this.c.moveTo(offset[0], offset[1] + this.depthSize[1]/2 + i*vSpeedScale);
		this.c.lineTo(offset[0]-size, offset[1] + this.depthSize[1]/2 + i*vSpeedScale);
		this.c.stroke();

		// draw lower line
		this.c.beginPath();
		this.c.moveTo(offset[0], offset[1] + this.depthSize[1]/2 - i*vSpeedScale);
		this.c.lineTo(offset[0]-size, offset[1] + this.depthSize[1]/2 - i*vSpeedScale);
		this.c.stroke();
	}
}