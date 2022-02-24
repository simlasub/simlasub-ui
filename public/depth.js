var depthSize = [80,vhSize[1]];


// intitializes the depth gauge
function initializeDepth(){
	depthSize = [80, vhSize[1]]
}

function renderDepth(){
	// constants
	const offset = [ vhOffset[0]+vhSize[0], vhOffset[1] ];
	const framed = false;
	const depthScale = depthSize[1]/8;

	// draw line for Scales
	c.beginPath();
	c.moveTo(offset[0], offset[1]);
	c.lineTo(offset[0], offset[1]+depthSize[1]);
	if(framed){	c.rect(offset[0],offset[1],depthSize[0],depthSize[1]);}
	c.stroke();

	// depth Lines
	var i = depth%1;
	while(i*depthScale < depthSize[1]/2){
		drawDepthIndicator(offset, depthScale, i);
		i += 1;
	}
	var i = depth%1-1;
	while(i*depthScale > -depthSize[1]/2){
		drawDepthIndicator(offset, depthScale, i);
		i = i-1;
	}

	// draw depth number
	c.clearRect(offset[0], offset[1] + depthSize[1]/2 - fontSize/2-4, depthSize[0], fontSize+4);
	c.textAlign = "right";
	c.fillText(depth.toFixed(1), offset[0]+depthSize[0]-5, offset[1] + depthSize[1]/2 + fontSize/2-fontOffset, depthSize[0]-5);
	c.rect(offset[0], offset[1] + depthSize[1]/2 - fontSize/2-4, depthSize[0], fontSize+4);
	c.stroke();
	
	depthRenderVSpeed(offset);
}

function depthRenderVSpeed(offset){
	const vSpeedScale = depthSize[1]/1;
	const vSpeedIndicator = 15;

	// draw vSpeed scale
	// small strokes
	var i = 0;
	while(i*vSpeedScale <= depthSize[1]/2){
		drawDepthVSpeedTick(offset,vSpeedScale,i, 8);
		i += 0.1;
	}
	// main Strokes
	var i = 0;
	while(i*vSpeedScale <= depthSize[1]/2){
		drawDepthVSpeedTick(offset,vSpeedScale,i, 15);
		i += 0.5
	}
	// draw vSpeed Indicator
	c.beginPath();
	c.moveTo(offset[0], offset[1] + depthSize[1]/2 + vSpeed*vSpeedScale);
	c.lineTo(offset[0]-vSpeedIndicator, offset[1] + depthSize[1]/2 + vSpeed*vSpeedScale+vSpeedIndicator/1.2);
	c.lineTo(offset[0]-vSpeedIndicator, offset[1] + depthSize[1]/2 + vSpeed*vSpeedScale-vSpeedIndicator/1.2);
	c.lineTo(offset[0], offset[1] + depthSize[1]/2 + vSpeed*vSpeedScale);
	c.fill();
	// draw vSpeed Text
	c.textAlign = "right";
	c.fillText(vSpeed.toFixed(2), offset[0]+depthSize[0], offset[1] -6, depthSize[0]);
}

function drawDepthIndicator(offset,depthScale, i){
	const depthScaleLength = 20;

	if(depth-i > 0){
		c.beginPath();
		c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*depthScale);
		c.lineTo(offset[0]+depthScaleLength, offset[1] + depthSize[1]/2 - i*depthScale);
		c.stroke();	
		c.textAlign = "left";
		c.fillText((depth-i).toFixed(0), offset[0]+depthScaleLength, offset[1] + depthSize[1]/2 - i*depthScale + fontSize/2-fontOffset,  depthSize[0]-depthScaleLength);
	} else if(depth-i == 0){
		c.rect(offset[0], offset[1] + depthSize[1]/2 - i*depthScale, depthSize[0], i*depthScale -depthSize[1]/2 );
		c.stroke();
	}
}


function drawDepthVSpeedTick(offset,vSpeedScale, i, size){
	c.beginPath();
	c.moveTo(offset[0], offset[1] + depthSize[1]/2 + i*vSpeedScale);
	c.lineTo(offset[0]-size, offset[1] + depthSize[1]/2 + i*vSpeedScale);
	c.stroke();
	c.beginPath();
	c.moveTo(offset[0], offset[1] + depthSize[1]/2 - i*vSpeedScale);
	c.lineTo(offset[0]-size, offset[1] + depthSize[1]/2 - i*vSpeedScale);
	c.stroke();
}