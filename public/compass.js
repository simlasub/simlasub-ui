/**
 * Draws the round compass at the bottom.
 * @param {canvas context} c
 */
const Compass = class {
	mode = 1;
	radius = 20*pixelRatio;
	offset;
	framed = false; // mostly for layout
	indicator = 10*pixelRatio; // size for top needle
	centerSize = 5*pixelRatio; // for north indicator
	textRad;

	/**
	 * @param {canvas context} can 
	 */
	 constructor(can){
		this.c = can;
	}

	/**
	 * initializes the depth gauge
	 */
	initialize(dim){
		this.radius = dim[1] * 0.2 - this.indicator;
		this.offset = [ dim[0]/2, dim[1]*0.9 ];
		this.textRad = this.radius * 0.6; 
	}

	/**
	 * renders the compass needs canvas Context c
	 */
	render(stat){
		if(this.mode<=2){
			// draw circular frame #################################################
			if(this.framed){
				this.c.beginPath();
				this.c.arc(this.offset[0], this.offset[1], this.radius, 0, 2*Math.PI);
				this.c.stroke();
			}

			// draw indicators #####################################################
			for(let i = 0; i < 360; i+=10) {
				// rotate by heading
				let j = 360 - i + stat.heading;

				if(i%90===0){ // For North, East, South, West
					// draw line
					this.c.beginPath();
					this.c.moveTo(
						this.offset[0] - this.radius*0.75 * Math.sin(degToRad(j)), 
						this.offset[1] - this.radius*0.75 * Math.cos(degToRad(j)));
					this.c.lineTo(
						this.offset[0] - this.radius * Math.sin(degToRad(j)), 
						this.offset[1] - this.radius * Math.cos(degToRad(j)));
					this.c.stroke();

				}else if(i%30===0){
					// draw line
					this.c.beginPath();
					this.c.moveTo(
						this.offset[0] - this.radius*0.82 * Math.sin(degToRad(j)), 
						this.offset[1] - this.radius*0.82 * Math.cos(degToRad(j)));
					this.c.lineTo(
						this.offset[0] - this.radius * Math.sin(degToRad(j)), 
						this.offset[1] - this.radius * Math.cos(degToRad(j)));
					this.c.stroke();
				}else{
					// draw line
					this.c.beginPath();
					this.c.moveTo(
						this.offset[0] - this.radius*0.9 * Math.sin(degToRad(j)), 
						this.offset[1] - this.radius*0.9 * Math.cos(degToRad(j)));
					this.c.lineTo(
						this.offset[0] - this.radius * Math.sin(degToRad(j)), 
						this.offset[1] - this.radius * Math.cos(degToRad(j)));
					this.c.stroke();
				}
				
			}

			// draw indicator needle ###############################################
			this.c.beginPath();
			this.c.moveTo(this.offset[0], this.offset[1]-this.radius);
			this.c.lineTo(this.offset[0]+this.indicator/1.5, 
				this.offset[1]-this.radius-this.indicator);
			this.c.lineTo(this.offset[0]-this.indicator/1.5, 
				this.offset[1]-this.radius-this.indicator);
			this.c.lineTo(this.offset[0], this.offset[1]-this.radius);
			this.c.fill();

			
			if(this.mode <=2){
				// draw radial text ####################################################
				this.c.textAlign = "center";
				for(let i = 0; i < 360; i+=30){
					// rotate by heading
					let j = 360 - i + stat.heading;

					// find correct text
					let text = "";
					switch(i) {
						case 0:
							text = "N"	
							break;
						case 90:
							text = "E"	
							break;
						case 180:
							text = "S"	
							break;
						case 270:
							text = "W"	
							break;
					
						default:
							if(this.mode<=1){
								text = (i/10).toFixed(0);
							}
							break;
					}

					// draw text
					this.c.fillText(
						text,
						this.offset[0] - this.textRad * Math.sin(degToRad(j)), 
						this.offset[1] - this.textRad * Math.cos(degToRad(j)) + fontSize/2 - fontOffset
					);
				}
			}

			// heading text ########################################################
			// clear under text
			this.c.clearRect(this.offset[0] - 1*fontSize, 
				this.offset[1] - fontSize/2 - fontOffset+3,
				fontSize*2, fontSize + 3);
			// draw text
			this.c.textAlign = "center";
			this.c.fillText(stat.heading.toFixed(0).padStart(3, '0'), 
				this.offset[0], 
				this.offset[1] + fontSize/2-fontOffset,
				fontSize * 2);
			// draw rectangle around
			if(this.mode < 3){
				this.c.rect(this.offset[0] - 1*fontSize, 
					this.offset[1] - fontSize/2-fontOffset+3,
					fontSize*2, fontSize + 3);
				this.c.stroke();
			}

			// turn Speed indicator ##################################################
			this.c.beginPath();
			this.c.arc(this.offset[0],this.offset[1], this.radius,
				-Math.PI*0.5, -Math.PI*0.5 + degToRad(stat.turnSpeed * 10) );
			this.c.stroke();

		}
		else if(this.mode>=3){
			// stat.heading text ########################################################
			this.c.textAlign = "center";
			this.c.fillText(stat.heading.toFixed(0).padStart(3, '0'), 
				this.offset[0], 
				this.offset[1] + fontSize/2-fontOffset);
		}
	}
}