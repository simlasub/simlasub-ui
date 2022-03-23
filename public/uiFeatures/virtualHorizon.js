/**
 * Draws the virtual Horizon.
 * @param {canvas context} vh
 */
const VirtualHorizon = class{
	offset;
	size;
	paraLength; // half-length of horizon parallels
	center; // half-length of center spacing
	pixelPerDegree;
	clip = true;
	framed = false;
	compSize = 10*pixelRatio;
	transform = true; // disables the transformation
	compass = true;
	enable = true;

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
		this.size = [dim[0]*0.7 - 160*pixelRatio,dim[1] * 0.6];
		this.offset = [dim[0]/2-this.size[0]/2, dim[1]/2-this.size[1]/2 - dim[1]*0.1];
		this.paraLength = 0.15*(this.size[0]-fontSize*3);
		this.center = 0.75 * this.paraLength;

		// get ppD
		this.pixelPerDegree = features.background.pixelPerDegree;
	}

	/**
	 * renders the virtual horizon, the paralles and the horizon compass
	 */
	render(stat){
		// delete previous frame
		this.c.setTransform(1, 0, 0, 1, 0, 0);
		this.c.clearRect(0, 0, dim[0], dim[1]);
		this.c.beginPath();

		// check if enabled
		if(!this.enable){return;}

		// Clip a rectangular area for virtual horizon ############################
		if(this.clip){
			//this.c.beginPath();
			this.c.rect(this.offset[0],this.offset[1], this.size[0], this.size[1]);
			if(this.framed){this.c.stroke();}
			this.c.clip(); 
		}

		// draw Center indicator ##################################################
		// airplane style 
		this.c.lineWidth = 1.0*lineWidth;
		// left
		this.c.beginPath();
		this.c.moveTo(dim[0]/2-this.center,dim[1]/2);
		this.c.lineTo(dim[0]/2-this.center/5,dim[1]/2);
		this.c.stroke();
		// right
		this.c.beginPath();
		this.c.moveTo(dim[0]/2+this.center/5,dim[1]/2);
		this.c.lineTo(dim[0]/2+this.center,dim[1]/2);
		this.c.stroke();
		// top
		this.c.beginPath();
		this.c.moveTo(dim[0]/2,dim[1]/2-this.center/5);
		this.c.lineTo(dim[0]/2,dim[1]/2-this.center*0.5);
		this.c.stroke();
		this.c.lineWidth = lineWidth;
		// center dot
		this.c.beginPath();
		this.c.arc(dim[0]/2,dim[1]/2, 3*pixelRatio, 0, 2 * Math.PI, true);
		this.c.fill();


		// this.transform the canvas ###################################################
		if(this.transform){
			// roll this.transform
			this.c.translate(dim[0]/2,dim[1]/2);
			this.c.rotate(degToRad(stat.roll));
			this.c.translate(-dim[0]/2,-dim[1]/2);
			// pitch this.transform
			this.c.translate(0,stat.pitch*this.pixelPerDegree);
		}

		// draw horizon ###########################################################
		this.c.beginPath();
		this.c.moveTo(0,dim[1]/2);
		/*	//center cutout in horizon line
		this.c.lineTo(dim[0]/2-this.center,dim[1]/2);
		this.c.stroke();
		this.c.beginPath();
		this.c.moveTo(dim[0]/2+this.center,dim[1]/2);*/
		this.c.lineTo(dim[0],dim[1]/2);
		this.c.stroke();

		// draw compass ###########################################################
		if(this.compass){
			const y = dim[1]/2; // shortcut for readability
			for(let i = -360; i < 360; i+=10) {
				// translate by heading
				let j = i + stat.heading;

				// draw ticks
				if(i%90==0){ // north, east, south and west
					this.c.beginPath();
					this.c.moveTo(dim[0]/2 - j*this.pixelPerDegree, y-this.compSize);
					this.c.lineTo(dim[0]/2 - j*this.pixelPerDegree, y+this.compSize);
					this.c.stroke();

				}else{ // all other 10° steps
					this.c.beginPath();
					this.c.moveTo(dim[0]/2 - j*this.pixelPerDegree, y-this.compSize);
					this.c.lineTo(dim[0]/2 - j*this.pixelPerDegree, y);
					this.c.stroke();
				}
				
				// draw text
				if(i%30==0){
					this.c.textAlign = "center";
					this.c.fillText(((360-i)%360).toFixed(0)/*.padStart(3, '0')*/, 
						dim[0]/2 - j*this.pixelPerDegree, // x position
						y -this.compSize - fontSize/2 +fontOffset, 3* fontSize // y position
						);
				}
			}
		}

		// draw parallels #########################################################
		// draw top parallel
		for(var i = 2.5; i<180; i+=2.5){
			this.drawParallel(i);
		}

		// draw bottom parallel
		this.c.setLineDash([15,10]);
		for(var i = -2.5; i> -180; i-=2.5){
			this.drawParallel(i);
		}
		this.c.setLineDash([1,0]);
	}

	/**
	 * draw the lines for the horizon parallels
	 * @param {Integer} i
	 */
	drawParallel(i){
		let y = dim[1]/2 - i*this.pixelPerDegree;
		let length;

		if(i%20 == 0){
			// draw text
			this.c.textAlign = "left";
			this.c.fillText(i, 
				dim[0]/2+this.paraLength+10, // x
				dim[1]/2 - i*this.pixelPerDegree + fontSize/2 -fontOffset, // y
				3* fontSize); // width
			// set length
			length = this.paraLength;
		} else if(i%10 == 0){
			// set length
			length = this.paraLength * 1.0;
		}
		else if(i%5 == 0){
			// set length
			length = 0;
		}

		this.c.beginPath();
		this.c.moveTo(dim[0]/2-length,y);
		this.c.lineTo(dim[0]/2+length,y);
		this.c.stroke();
	}
}