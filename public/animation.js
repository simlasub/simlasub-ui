var animationFrameTime = 1/30;
var frame = 0;

function startAnimation(){
	setInterval(renderAnimation, animationFrameTime*1000);
}

function renderAnimation(){
	/*const d = animationFrameTime *0.002;
	const f = animationFrameTime *0.0001;

	roll += (Math.random() - 0.5)*d*0.5 - roll*f;
	pitch += (Math.random() - 0.5)*d- pitch*f;
	heading += (Math.random() - 0.5)*d - heading*f;*/

	frame++;
	const time = frame * animationFrameTime;
	roll = Math.sin(time * 0.2)*2.5 + Math.sin(time * 3)*0.5;
	pitch = Math.sin(time * 0.05)*20 + Math.sin(time * 0.1)*1 + Math.sin(time * 3.5)*0.2;
	heading = Math.sin(time * 0.05)*0.5 + Math.sin(time * 4)*0.1;

	depth = 0.8 + Math.sin(time * 0.3);
	vSpeed = 0.3 *Math.cos(time * 0.3);

	//console.time("rendering");
	renderAll();
	//console.timeEnd("rendering");
}