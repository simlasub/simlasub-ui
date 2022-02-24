var depthSize = [80,vhSize[1]];


// intitializes the depth gauge
function initializeDepth(){
	c.strokeStyle = colors[0];
	c.fillStyle = colors[0];
	c.lineWidth = lineWidth;
	c.font = font;

	depthSize = [80, vhSize[1]]
}

function renderDepth(){
	// constants
	const offset = [ vhOffset[0]+vhSize[0], vhOffset[1] ];
	const framed = false;
	const vSpeedScale = depthSize[1]/1;
	const vSpeedScaleLength = 8;
	const vSpeedIndicator = 15;
	const depthScale = depthSize[1]/8;
	const depthScaleLength = 20;

	// clear Old Frame
	c.clearRect(0, 0, dim[0], dim[1]);

	// draw line
	c.beginPath();
	c.moveTo(offset[0], offset[1]);
	c.lineTo(offset[0], offset[1]+depthSize[1]);
	if(framed){	c.rect(offset[0],offset[1],depthSize[0],depthSize[1]);}
	c.stroke();

	// draw vSpeed scale
	// small strokes
	var i = 0;
	while(i*vSpeedScale <= depthSize[1]/2){
		c.beginPath();
		c.moveTo(offset[0], offset[1] + depthSize[1]/2 + i*vSpeedScale);
		c.lineTo(offset[0]-vSpeedScaleLength, offset[1] + depthSize[1]/2 + i*vSpeedScale);
		c.stroke();
		c.beginPath();
		c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*vSpeedScale);
		c.lineTo(offset[0]-vSpeedScaleLength, offset[1] + depthSize[1]/2 - i*vSpeedScale);
		c.stroke();
		i += 0.1;
	}
	// main Strokes
	var i = 0;
	while(i*vSpeedScale <= depthSize[1]/2){
		c.beginPath();
		c.moveTo(offset[0], offset[1] + depthSize[1]/2 + i*vSpeedScale);
		c.lineTo(offset[0]-vSpeedIndicator, offset[1] + depthSize[1]/2 + i*vSpeedScale);
		c.stroke();
		c.beginPath();
		c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*vSpeedScale);
		c.lineTo(offset[0]-vSpeedIndicator, offset[1] + depthSize[1]/2 - i*vSpeedScale);
		c.stroke();
		i += 0.5
	}
	// draw vSpeed Indicator
	c.beginPath();
	c.moveTo(offset[0], offset[1] + depthSize[1]/2 + vSpeed*vSpeedScale);
	c.lineTo(offset[0]-vSpeedIndicator, offset[1] + depthSize[1]/2 + vSpeed*vSpeedScale+vSpeedIndicator);
	c.lineTo(offset[0]-vSpeedIndicator, offset[1] + depthSize[1]/2 + vSpeed*vSpeedScale-vSpeedIndicator);
	c.fill();
	// draw vSpeed Text
	c.textAlign = "right";
	c.fillText(vSpeed.toFixed(2), offset[0]+depthSize[0], offset[1] -6, depthSize[0]);

	// depth Lines
	var i = depth%1;
	while(i*depthScale < depthSize[1]/2){
		if(depth-i > 0){
			c.beginPath();
			c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*depthScale);
			c.lineTo(offset[0]+depthScaleLength, offset[1] + depthSize[1]/2 - i*depthScale);
			c.stroke();	
			c.textAlign = "left";
			c.fillText((depth-i).toFixed(0), offset[0]+depthScaleLength, offset[1] + depthSize[1]/2 - i*depthScale+7,  depthSize[0]-depthScaleLength);
		} else if(depth-i == 0){
			c.rect(offset[0], offset[1] + depthSize[1]/2 - i*depthScale, depthSize[0], i*depthScale -depthSize[1]/2 );
			c.fill();
		}
		i += 1;
	}
	var i = depth%1-1;
	while(i*depthScale > -depthSize[1]/2){
		if(depth-i > 0){
			c.beginPath();
			c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*depthScale);
			c.lineTo(offset[0]+depthScaleLength, offset[1] + depthSize[1]/2 - i*depthScale);
			c.stroke();	
			c.textAlign = "left";
			c.fillText((depth-i).toFixed(0), offset[0]+depthScaleLength, offset[1] + depthSize[1]/2 - i*depthScale+7,  depthSize[0]-depthScaleLength);
		} else if(depth-i == 0){
			c.rect(offset[0], offset[1] + depthSize[1]/2 - i*depthScale, depthSize[0], i*depthScale -depthSize[1]/2 );
			c.fill();
		}
		i = i-1;
	}

	// draw depth number
	c.clearRect(offset[0], offset[1] + depthSize[1]/2 - fontSize/2-4, depthSize[0], fontSize+4);
	c.textAlign = "right";
	c.fillText(depth.toFixed(1), offset[0]+depthSize[0], offset[1] + depthSize[1]/2 + fontSize/2-6, depthSize[0]);
	c.rect(offset[0], offset[1] + depthSize[1]/2 - fontSize/2-4, depthSize[0], fontSize+4);
	c.stroke();
}