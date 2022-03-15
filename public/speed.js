/**
 * Draws Speed vectors
 * @param {canvas context} c
 */
const Speed = class {
	topDownSpeedScale; // pixels for 1 m/s;
	topDownMaxSpeed = 2.5; 
	topDownMaxZSpeed = 0.4; 
	vectMinSpeed = 0.2;
	speedVecSize; 
	pixelPerDegree;
	size;
	offset;
	mode = 1;
	vecEn = true;

	/**
	 * 
	 * @param {canvas context} can 
	 */
	constructor(can){
		this.c = can;
	}

	// initializes the depth gauge
	initialize(dim){
		this.topDownSpeedScale = 2.0*features.virtualHorizon.center;
		this.speedVecSize = features.virtualHorizon.center * 0.7;
		this.size = features.depth.size;
		this.offset = [ 
			features.virtualHorizon.offset[0]-this.size[0],
			features.virtualHorizon.offset[1] 
		];

		// get ppD
		this.pixelPerDegree = features.background.pixelPerDegree;
	}

	/**
	 * renders the depth scale and vSpeed indicator
	*/
	render(stat){
		var speed = Math.sqrt(Math.pow(stat.xSpeed,2)+Math.pow(stat.ySpeed,2)+Math.pow(stat.zSpeed,2));

		// draw Top Down Speed vector ###############################################
		if(	speed<= this.topDownMaxSpeed &&	stat.zSpeed<= this.topDownMaxZSpeed && this.vecEn){
			this.c.beginPath();
			this.c.arc(
				dim[0]/2 + stat.ySpeed * this.topDownSpeedScale,
				dim[1]/2 - stat.xSpeed * this.topDownSpeedScale,
				3*pixelRatio, 0, 2 * Math.PI, true);
			this.c.stroke();
			this.c.beginPath();
			this.c.moveTo(dim[0]/2,dim[1]/2);
			this.c.lineTo(
				dim[0]/2 + stat.ySpeed * this.topDownSpeedScale,
				dim[1]/2 - stat.xSpeed * this.topDownSpeedScale
			);
			this.c.stroke();
		}

		// draw Speed vector ##########################################################
		if(speed >= this.vectMinSpeed && this.vecEn){
			// calculate x and y speed
			let y = this.pixelPerDegree * radToDeg(Math.asin(stat.zSpeed/speed));
			let x = this.pixelPerDegree * radToDeg(Math.atan2(stat.ySpeed, stat.xSpeed));

			// circle
			this.c.beginPath();
			this.c.arc(
				dim[0]/2 + x,
				dim[1]/2 - y,
				this.speedVecSize*0.2, 0, 2 * Math.PI, true);
			this.c.stroke();
			// left
			this.c.beginPath();
			this.c.moveTo(
				dim[0]/2 + x - this.speedVecSize*0.2,
				dim[1]/2 - y);
			this.c.lineTo(
				dim[0]/2 + x - this.speedVecSize*0.5,
				dim[1]/2 - y);
			this.c.stroke();
			//right
			this.c.beginPath();
			this.c.moveTo(
				dim[0]/2 + x + this.speedVecSize*0.2,
				dim[1]/2 - y);
			this.c.lineTo(
				dim[0]/2 + x + this.speedVecSize*0.5,
				dim[1]/2 - y);
			this.c.stroke();
			//top
			this.c.beginPath();
			this.c.moveTo(
				dim[0]/2 + x,
				dim[1]/2 - y - this.speedVecSize*0.2);
			this.c.lineTo(
				dim[0]/2 + x,
				dim[1]/2 - y - this.speedVecSize*0.4);
			this.c.stroke();
		}

		// draw speed number ######################################################
		// clear under text
		this.c.clearRect(this.offset[0], 
			this.offset[1] + this.size[1]/2 - fontSize/2-4, 
			this.size[0], fontSize+4);
		// draw text
		this.c.textAlign = "right";
		this.c.fillText(speed.toFixed(1), 
			this.offset[0]+this.size[0]-5, 
			this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset,
			this.size[0]-5
		);
		// draw rectangle around
		if(this.mode <= 1){
			this.c.rect(this.offset[0], 
			this.offset[1] + this.size[1]/2 - fontSize/2-4, 
			this.size[0], fontSize + 4);
			this.c.stroke();
		}

		// draw detailed numbers ########################################################
		if(this.mode <= 1){
			// x Speed
			this.c.textAlign = "left";
			this.c.fillText("x:", 
				this.offset[0] + 5, 
				this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset + (fontSize+fontOffset),
				fontSize
			);
			this.c.textAlign = "right";
			this.c.fillText(stat.xSpeed.toFixed(1), 
				this.offset[0] + this.size[0]-5, 
				this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset + (fontSize+fontOffset),
				this.size[0]-5 - fontSize
			);
			// y Speed
			this.c.textAlign = "left";
			this.c.fillText("y:", 
				this.offset[0] + 5, 
				this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset + 2*(fontSize+fontOffset),
				fontSize
			);
			this.c.textAlign = "right";
			this.c.fillText(stat.ySpeed.toFixed(1), 
				this.offset[0] + this.size[0]-5, 
				this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset + 2*(fontSize+fontOffset),
				this.size[0]-5 - fontSize
			);
			// z Speed
			this.c.textAlign = "left";
			this.c.fillText("z:", 
				this.offset[0] + 5, 
				this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset + 3*(fontSize+fontOffset),
				fontSize
			);
			this.c.textAlign = "right";
			this.c.fillText(stat.zSpeed.toFixed(1), 
				this.offset[0] + this.size[0]-5, 
				this.offset[1] + this.size[1]/2 + fontSize/2-fontOffset + 3*(fontSize+fontOffset),
				this.size[0]-5 - fontSize
			);
		}
	}
}