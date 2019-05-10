let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled=false;
	let gs = 32;
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	}

	function drawLine(a,b,c,d){
		ctx.strokeStyle="yellow";
		ctx.beginPath();
		ctx.moveTo(a*gs, b*gs);    // Move the pen to (30, 50)
		ctx.lineTo(c*gs, d*gs);  // Draw a line to (150, 100)
		ctx.stroke();
		ctx.closePath();
		
	}

	let rasterizeFun = Collision.rasterizeLine;
	let drawFun = drawLine;
	
	function rasterize(a,b,c,d){
		ctx.beginPath();       // Start a new path

		rasterizeFun(a,b,c,d,(i,j)=>{
			ctx.rect(i*gs,j*gs,gs,gs);
		});
		ctx.fillStyle="blue";
		ctx.fill();
		ctx.strokeStyle="red";
		ctx.stroke();
		ctx.closePath();
		
		drawFun(a,b,c,d);
		
	}
	let a = Math.random();
	let b = Math.random();
	let c = Math.random()*10;
	let d = Math.random()*10;
	rasterize(a,b,a+c,b+d);

	let x0=0, y0=0;
	document.addEventListener("mousemove",(event)=>{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		let pos = getMousePos(canvas,event);
		let x = pos.x;
		let y = pos.y;
		rasterize(x0/gs,y0/gs,x/gs,y/gs);
	});
	document.addEventListener("click",(event)=>{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		let pos = getMousePos(canvas,event);
		x0 = pos.x;
		y0 = pos.y;

	});