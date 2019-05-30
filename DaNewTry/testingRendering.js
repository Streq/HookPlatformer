let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let gs = 32;

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function drawLine(a, b, c, d) {
	ctx.strokeStyle = "yellow";
	ctx.beginPath();
	ctx.moveTo(a * gs, b * gs); // Move the pen to (30, 50)
	ctx.lineTo(c * gs, d * gs); // Draw a line to (150, 100)
	ctx.stroke();
	ctx.closePath();

}

function drawText(x, y, text) {
	ctx.font = '12px serif';
	ctx.fillStyle = "white";
	ctx.fillText(text, x, y + 10);
}

let rasterizeFun = Collision.rasterizeLine;
let drawFun = drawLine;

function callback(i, j){
	ctx.beginPath(); // Start a new path

	ctx.rect(i * gs, j * gs, gs, gs);
	drawText(i * gs, j * gs, ++id);

	ctx.strokeStyle = "#f00";
	ctx.stroke();
	ctx.closePath();

}
var id = 0;
	
function rasterize(a, b, c, d) {
	ctx.beginPath(); // Start a new path
	id = 0;
	ctx.strokeStyle = "yellow";
	drawFun(a, b, c, d);
	ctx.closePath();
	ctx.stroke();

	rasterizeFun(a, b, c, d, callback);


}
let a = Math.random();
let b = Math.random();
let c = Math.random() * 10;
let d = Math.random() * 10;
//rasterize(a,b,a+c,b+d);

let x0 = 0,
	y0 = 0;
/**/

/**/