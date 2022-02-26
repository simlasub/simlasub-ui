var animationFrameTime = 1/30;
var frame = 0;
var animaionSpeedFaktor = 1;

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
	const time = frame * animationFrameTime * animaionSpeedFaktor;
	roll = Math.sin(time * 0.2)*2.5 + Math.sin(time * 3)*0.5;
	pitch = Math.sin(time * 0.05)*20 + Math.sin(time * 0.1)*1 + Math.sin(time * 3.5)*0.2;

	heading = (360 + time*2)% 360;

	depth = 5 + 0.05*Math.cos(time) - 5*Math.cos(time * 0.08);
	vSpeed = - 0.05*Math.sin(time) + 0.08*5*Math.sin(time * 0.08);


	//console.time("rendering");
	renderAll();
	//console.timeEnd("rendering");
}