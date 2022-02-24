var vhSize = [700,700]; // size of the virtual horizon
var vhOffset;
var vhParallelLength = 200;

// intitializes the virtual horizon
function initializeVirtualHorizon(){
	vh.strokeStyle = colors[0];
	vh.fillStyle = colors[0];
	vh.lineWidth = lineWidth;

	vhSize = [dim[0]*0.7 - 160,dim[1] * 0.8]
	vhOffset = [dim[0]/2-vhSize[0]/2, dim[1]/2-vhSize[1]/2];
	vhParallelLength = 0.4*(vhSize[0]-fontSize*3);
}

// renders the virtual horizon, the movement direction indicator and the paralles
function renderVirtualHorizon(){
	// set parameters
	const centerSpacing = 30; // only half
	const parallelDistance = 5; // in degrees
	const clip = true;
	const framed = false;
	const vhCompassSize = 10;

	// delete previous frame
	vh.setTransform(1, 0, 0, 1, 0, 0);
	vh.clearRect(0, 0, dim[0], dim[1]);
	vh.beginPath();

	// Clip a rectangular area for virtual horizon
	if(clip){	// for debug purposes
		//vh.beginPath();
		vh.rect(vhOffset[0],vhOffset[1], vhSize[0], vhSize[1]);
		if(framed){vh.stroke();}
		vh.clip();
	}

	// draw Center indicator
	vh.beginPath();
	vh.moveTo(dim[0]/2-centerSpacing,dim[1]/2);
	vh.lineTo(dim[0]/2-centerSpacing/3,dim[1]/2);
	vh.lineTo(dim[0]/2,dim[1]/2+centerSpacing/3);
	vh.lineTo(dim[0]/2+centerSpacing/3,dim[1]/2);
	vh.lineTo(dim[0]/2+centerSpacing,dim[1]/2);
	vh.stroke();

	// transform the canvas
	// roll transform
	vh.translate(dim[0]/2,dim[1]/2);
	vh.rotate(degToRad(roll));
	vh.translate(-dim[0]/2,-dim[1]/2);
	// pitch transform
	vh.translate(0,pitch*pixelPerDegree);

	// draw horizon
	const y = dim[1]/2;
	vh.beginPath();
	vh.moveTo(0,dim[1]/2);
	/*	//center cutout in horizon line
	vh.lineTo(dim[0]/2-centerSpacing,dim[1]/2);
	vh.stroke();
	vh.beginPath();
	vh.moveTo(dim[0]/2+centerSpacing,dim[1]/2);*/
	vh.lineTo(dim[0],dim[1]/2);
	vh.stroke();

    // draw compass
    for(let i = -360; i < 360; i+=10) {
		let j = i + heading;
		if(i%90==0){
			vh.beginPath();
			vh.moveTo(dim[0]/2 + j*pixelPerDegree, y-vhCompassSize);
			vh.lineTo(dim[0]/2 + j*pixelPerDegree, y+vhCompassSize);
			vh.stroke();

		}else{
			vh.beginPath();
			vh.moveTo(dim[0]/2 + j*pixelPerDegree, y-vhCompassSize);
			vh.lineTo(dim[0]/2 + j*pixelPerDegree, y);
			vh.stroke();
		}
		
	}

	// draw top parallel
	for(var i = 1; i<18; i++){
		drawVirtualHorizon_Parallel(dim[1]/2 - i*parallelDistance*pixelPerDegree, centerSpacing, vhParallelLength);
		vh.fillText(i*parallelDistance, dim[0]/2+vhParallelLength+fontSize/2, dim[1]/2 - i*parallelDistance*pixelPerDegree +5);
	}

	// draw bottom parallel
	vh.setLineDash([15,10]);
	for(var i = 1; i<18; i++){
		drawVirtualHorizon_Parallel(dim[1]/2 + i*parallelDistance*pixelPerDegree, centerSpacing, vhParallelLength);
		vh.fillText(i*parallelDistance, dim[0]/2+vhParallelLength+fontSize/2, dim[1]/2 + i*parallelDistance*pixelPerDegree +5);
	}
	vh.setLineDash([1,0]);
}

function drawVirtualHorizon_Parallel(y,centerSpacing,length){
	vh.beginPath();
	vh.moveTo(dim[0]/2-length,y);
	vh.lineTo(dim[0]/2-centerSpacing,y);
	vh.stroke();
	vh.beginPath();
	vh.moveTo(dim[0]/2+centerSpacing,y);
	vh.lineTo(dim[0]/2+length,y);
	vh.stroke();
}