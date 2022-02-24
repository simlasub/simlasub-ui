function initializeBackground(){
	
}

// render the background will be replaced with video stream
function renderBackground(){
	//clearCanvas(b);
	b.fillStyle = "black";
	b.fillRect(0, 0, dim[0], dim[1]);
	b.fillStyle = "#106050";
	b.fillRect(0,(dim[1] - 9/16 * dim[0])/2 , dim[0], 9/16 * dim[0]);
}
