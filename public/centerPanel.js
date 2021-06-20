

const vhSize = [700,700]; // size of the virtual horizon


// intitializes the virtual horizon
function initializeCenterPanel(){
	cp.strokeStyle = colors[0];
	cp.fillStyle = colors[0];
	cp.lineWidth = lineWidth;
	cp.font = font;
}

function renderCenterPanel(){
	// delete previous frame
	cp.setTransform(1, 0, 0, 1, 0, 0);
	cp.clearRect(0, 0, dim[0], dim[1]);
	cp.beginPath();


	//renderText();
	renderVirtualHorizon();
}

function renderText(){
	console.log(new Date().toTimeString(navigator.language, { 
		hour: '2-digit', 
		minute: '2-digit',
		hour12: false 
	}));
}

// renders the virtual horizon, the movement direction indicator and the paralles
function renderVirtualHorizon(){
	// set parameters
	const offset = [dim[0]/2-vhSize[0]/2, dim[1]/2-vhSize[1]/2];
	const centerSpacing = 80; // only half
	const parallelDistance = 5; // in degrees
	const parallelLength = 200; // from center
	const clip = true;
	const framed = true;

	// Clip a rectangular area for virtual horizon
	if(clip){	// for debug purposes
		cp.beginPath();
		cp.rect(offset[0],offset[1], vhSize[0], vhSize[1]);
		if(framed){cp.stroke();}
		cp.clip();
	}

	// draw Center indicator
	cp.beginPath();
	cp.moveTo(dim[0]/2-centerSpacing,dim[1]/2);
	cp.lineTo(dim[0]/2-centerSpacing/4,dim[1]/2);
	cp.lineTo(dim[0]/2,dim[1]/2+centerSpacing/4);
	cp.lineTo(dim[0]/2+centerSpacing/4,dim[1]/2);
	cp.lineTo(dim[0]/2+centerSpacing,dim[1]/2);
	cp.stroke();

	// transform the canvas
	// roll transform
	cp.translate(dim[0]/2,dim[1]/2);
	cp.rotate(degToRad(roll));
	cp.translate(-dim[0]/2,-dim[1]/2);
	// pitch transform
	cp.translate(0,pitch*pixelPerDegree);

	// draw horizon
	const y = dim[1]/2;
	cp.beginPath();
	cp.moveTo(0,dim[1]/2);
	cp.lineTo(dim[0]/2-centerSpacing,dim[1]/2);
	cp.stroke();
	cp.beginPath();
	cp.moveTo(dim[0]/2+centerSpacing,dim[1]/2);
	cp.lineTo(dim[0],dim[1]/2);
	cp.stroke();

    // draw kompass
    

	// draw top parallel
	for(var i = 1; i<18; i++){
		drawVirtualHorizon_Parallel(dim[1]/2 - i*parallelDistance*pixelPerDegree, centerSpacing, parallelLength);
		cp.fillText(i*parallelDistance, dim[0]/2+parallelLength+fontSize/2, dim[1]/2 - i*parallelDistance*pixelPerDegree +5);
	}

	// draw bottom parallel
	cp.setLineDash([15,10]);
	for(var i = 1; i<18; i++){
		drawVirtualHorizon_Parallel(dim[1]/2 + i*parallelDistance*pixelPerDegree, centerSpacing, parallelLength);
		cp.fillText(i*parallelDistance, dim[0]/2+parallelLength+fontSize/2, dim[1]/2 + i*parallelDistance*pixelPerDegree +5);
	}
	cp.setLineDash([1,0]);
}

function drawVirtualHorizon_Parallel(y,centerSpacing,length){
	cp.beginPath();
	cp.moveTo(dim[0]/2-length,y);
	cp.lineTo(dim[0]/2-centerSpacing,y);
	cp.stroke();
	cp.beginPath();
	cp.moveTo(dim[0]/2+centerSpacing,y);
	cp.lineTo(dim[0]/2+length,y);
	cp.stroke();
}