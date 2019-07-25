let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let gs = 32;



function drawLine(a, b, c, d) {
	ctx.strokeStyle = "yellow";
	ctx.beginPath();
	ctx.moveTo(a * gs, b * gs); // Move the pen to (30, 50)
	ctx.lineTo(c * gs, d * gs); // Draw a line to (150, 100)
	ctx.stroke();
	ctx.closePath();

}

function drawMovingBlock(a, b, c, d) {
	a *= gs;
	b *= gs;
	c *= gs;
	d *= gs;
	let w1 = w * gs;
	let h1 = h * gs;

	ctx.strokeStyle = "#ff0";

	ctx.beginPath();
	ctx.rect(a, b, w1, h1);
	ctx.rect(c, d, w1, h1);

	ctx.moveTo(a, b);
	ctx.lineTo(c, d);

	ctx.moveTo(a + w1, b);
	ctx.lineTo(c + w1, d);

	ctx.moveTo(a, b + h1);
	ctx.lineTo(c, d + h1);

	ctx.moveTo(a + w1, b + h1);
	ctx.lineTo(c + w1, d + h1);
	ctx.stroke();
	ctx.closePath();


	ctx.beginPath();

	ctx.strokeStyle = "#0f0";
	ctx.moveTo(a + (a < c) * w1, b + (b < d) * h1);
	ctx.lineTo(c + (a < c) * w1, d + (b < d) * h1);

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

function drawTile(i, j, id_){
	ctx.beginPath(); // Start a new path

	ctx.rect(i * gs, j * gs, gs, gs);
	drawText(i * gs, j * gs, id_||++id);

	ctx.strokeStyle = "#f00";
	ctx.stroke();
	ctx.closePath();

}

let callback = drawTile;
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
//rasterize(a,b,a+c,b+d);

/**/

/**/