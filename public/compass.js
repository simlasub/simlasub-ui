/**
 * Draws the round compass at the bottom.
 * @param {canvas context} c
 */
const Compass = class {
	mode = 1;
	radius = 20*pixelRatio;
	offset;
	framed = false; // mostly for layout
	innerRad; 
	indicator = 10*pixelRatio; // size for top needle
	centerSize = 5*pixelRatio; // for north indicator

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
		this.radius = dim[1] * 0.08;
		this.offset = [ dim[0]/2, dim[1]*0.98 ];
		this.innerRad = this.radius * 0.8; 
	}

	/**
	 * renders the compass needs canvas Context c
	 */
	render(stat){
		if(this.mode<=1){
			// draw circular frame #################################################
			if(this.framed){
				this.c.beginPath();
				this.c.arc(this.offset[0], this.offset[1], this.radius, 0, 2*Math.PI);
				this.c.stroke();2
			}

			// draw center #########################################################
			this.c.beginPath();
			this.c.arc(this.offset[0], this.offset[1], this.centerSize, 0, 2*Math.PI);
			this.c.fill();

			// draw North indicator ################################################
			this.c.beginPath();
			this.c.lineTo(
				this.offset[0] - this.innerRad * Math.sin(degToRad(stat.heading)), 
				this.offset[1] - this.innerRad * Math.cos(degToRad(stat.heading)));
			this.c.lineTo(
				this.offset[0] - this.centerSize * Math.sin(degToRad(stat.heading+90)), 
				this.offset[1] - this.centerSize * Math.cos(degToRad(stat.heading+90)));
			this.c.lineTo(
				this.offset[0] - this.centerSize * Math.sin(degToRad(stat.heading-90)), 
				this.offset[1] - this.centerSize * Math.cos(degToRad(stat.heading-90)));
			this.c.lineTo(
				this.offset[0] - this.innerRad * Math.sin(degToRad(stat.heading)), 
				this.offset[1] - this.innerRad * Math.cos(degToRad(stat.heading)));
			this.c.fill();

			// draw indicators #####################################################
			for(let i = 0; i < 360; i+=10) {
				// rotate by stat.heading
				let j = i + stat.heading;

				if(i%90==0){ // For North, East, South, West
					// draw line
					this.c.beginPath();
					this.c.moveTo(this.offset[0], this.offset[1]);
					this.c.lineTo(
						this.offset[0] - this.radius * Math.sin(degToRad(j)), 
						this.offset[1] - this.radius * Math.cos(degToRad(j)));
					this.c.stroke();

				}else{
					// draw line
					this.c.beginPath();
					this.c.moveTo(
						this.offset[0] - this.innerRad * Math.sin(degToRad(j)), 
						this.offset[1] - this.innerRad * Math.cos(degToRad(j)));
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

			// stat.heading text ########################################################
			this.c.textAlign = "left";
			this.c.fillText(stat.heading.toFixed(0).padStart(3, '0'), 
				this.offset[0] + this.radius + 5, 
				this.offset[1]);
		}
		else if(this.mode==2){
			// stat.heading text ########################################################
			this.c.textAlign = "center";
			this.c.fillText(stat.heading.toFixed(0).padStart(3, '0'), 
				this.offset[0], 
				this.offset[1]);
		}
	}
}