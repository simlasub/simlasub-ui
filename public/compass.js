/**
 * Draws the round compass at the bottom.
 * @param {canvas context} c
 */

// global variable, updated in initializeCompass()
var compassRadius = 10;

/**
 * initializes the depth gauge
 */
function initializeCompass(){
	compassRadius = dim[1] * 0.08;
}

/**
 * renders the compass needs canvas Context c
 */
function renderCompass(mode){
	// parameters
	const offset = [ dim[0]/2, dim[1]*0.98 ]; // center of compass
	const framed = false; // mostly for layout
	const innerRad = compassRadius * 0.8; 
	const indicator = 15; // size for top needle
	const centerSize = 5; // for north indicator

	if(mode<=1){
		// draw circular frame #################################################
		if(framed){
			c.beginPath();
			c.arc(offset[0], offset[1], compassRadius, 0, 2*Math.PI);
			c.stroke();2
		}

		// draw center #########################################################
		c.beginPath();
		c.arc(offset[0], offset[1], centerSize, 0, 2*Math.PI);
		c.fill();

		// draw North indicator ################################################
		c.beginPath();
		c.lineTo(
			offset[0] - innerRad * Math.sin(degToRad(heading)), 
			offset[1] - innerRad * Math.cos(degToRad(heading)));
		c.lineTo(
			offset[0] - centerSize * Math.sin(degToRad(heading+90)), 
			offset[1] - centerSize * Math.cos(degToRad(heading+90)));
		c.lineTo(
			offset[0] - centerSize * Math.sin(degToRad(heading-90)), 
			offset[1] - centerSize * Math.cos(degToRad(heading-90)));
		c.lineTo(
			offset[0] - innerRad * Math.sin(degToRad(heading)), 
			offset[1] - innerRad * Math.cos(degToRad(heading)));
		c.fill();

		// draw indicators #####################################################
		for(let i = 0; i < 360; i+=10) {
			// rotate by heading
			let j = i + heading;

			if(i%90==0){ // For North, East, South, West
				// draw line
				c.beginPath();
				c.moveTo(offset[0], offset[1]);
				c.lineTo(
					offset[0] - compassRadius * Math.sin(degToRad(j)), 
					offset[1] - compassRadius * Math.cos(degToRad(j)));
				c.stroke();

			}else{
				// draw line
				c.beginPath();
				c.moveTo(
					offset[0] - innerRad * Math.sin(degToRad(j)), 
					offset[1] - innerRad * Math.cos(degToRad(j)));
				c.lineTo(
					offset[0] - compassRadius * Math.sin(degToRad(j)), 
					offset[1] - compassRadius * Math.cos(degToRad(j)));
				c.stroke();
			}
			
		}

		// draw indicator needle ###############################################
		c.beginPath();
		c.moveTo(offset[0], offset[1]-compassRadius);
		c.lineTo(offset[0]+indicator/2, offset[1]-compassRadius-indicator);
		c.lineTo(offset[0]-indicator/2, offset[1]-compassRadius-indicator);
		c.lineTo(offset[0], offset[1]-compassRadius);
		c.fill();

		// heading text ########################################################
		c.textAlign = "left";
		c.fillText(heading.toFixed(0).padStart(3, '0'), 
			offset[0] + compassRadius + 5, 
			offset[1]);
	}
	else if(mode==2){
		// heading text ########################################################
		c.textAlign = "center";
		c.fillText(heading.toFixed(0).padStart(3, '0'), 
			offset[0], 
			offset[1]);
	}
}