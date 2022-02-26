var compassRadius = 10;

// intitializes the depth gauge
function initializeCompass(){
	compassRadius = dim[1] * 0.08;
}

function renderCompass(){
	// constants
	const offset = [ dim[0]/2, dim[1]*0.98 ]; // center of compass
	const framed = false;
	const innerRad = compassRadius * 0.8; 
	const indicator = 15;
	const centerSize = 10; // for north indicator

	// draw frame
	if(framed){
		c.beginPath();
		c.arc(offset[0], offset[1], compassRadius, 0, 2*Math.PI);
		c.stroke();
	}

	// draw center
	c.beginPath();
	c.arc(offset[0], offset[1], centerSize, 0, 2*Math.PI);
	c.fill();

	// draw North indicator
	c.beginPath();
	c.lineTo(offset[0] - innerRad * Math.sin(degToRad(heading)), offset[1] - innerRad * Math.cos(degToRad(heading)));
	c.lineTo(offset[0] - centerSize * Math.sin(degToRad(heading+90)), offset[1] - centerSize * Math.cos(degToRad(heading+90)));
	c.lineTo(offset[0] - centerSize * Math.sin(degToRad(heading-90)), offset[1] - centerSize * Math.cos(degToRad(heading-90)));
	c.lineTo(offset[0] - innerRad * Math.sin(degToRad(heading)), offset[1] - innerRad * Math.cos(degToRad(heading)));
	c.fill();

	// draw indicators
	for(let i = 0; i < 360; i+=10) {
		let j = i + heading;
		if(i%90==0){
			c.beginPath();
			c.moveTo(offset[0], offset[1]);
			c.lineTo(offset[0] - compassRadius * Math.sin(degToRad(j)), offset[1] - compassRadius * Math.cos(degToRad(j)));
			c.stroke();

		}else{
			c.beginPath();
			c.moveTo(offset[0] - innerRad * Math.sin(degToRad(j)), offset[1] - innerRad * Math.cos(degToRad(j)));
			c.lineTo(offset[0] - compassRadius * Math.sin(degToRad(j)), offset[1] - compassRadius * Math.cos(degToRad(j)));
			c.stroke();
		}
		
	}

	// draw indicator
	c.beginPath();
	c.moveTo(offset[0], offset[1]-compassRadius);
	c.lineTo(offset[0]+indicator/2, offset[1]-compassRadius-indicator);
	c.lineTo(offset[0]-indicator/2, offset[1]-compassRadius-indicator);
	c.lineTo(offset[0], offset[1]-compassRadius);
	c.fill();

	// heading text
	c.textAlign = "center";
	c.fillText(heading.toFixed(0).padStart(3, '0'), offset[0], offset[1] - compassRadius - indicator-5);
}