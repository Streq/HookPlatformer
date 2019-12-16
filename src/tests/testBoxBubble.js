import * as Collision from "../collision/index.js"
import {DoubleArrayGrid} from "../utils/grid.js"
import {getMousePos} from "../utils/dom.js"

let	box = 
	{	x:0
	,	y:0
	,	w: 0.5
	,	h: 0.5
	}
,	b=(x,y,w,h)=>(
		{	x:x
		,	y:y
		,	w:w||1
		,	h:h||1
		}
	)
	
,	blocks = 
	[	b(1,1)
	,	b(2,1)
	,	b(2,2)

	,	b(4,1)

	,	b(4,5)
	,	b(5,4)
	,	b(3,4)
	,	b(4,3)

	,	b(4,7)
	,	b(1,10)
	,	b(3,10)
	,	b(5,10)
	,	b(7,10)
	,	b(9,10)
	]
,	bubbles = 
	[	b(1.25,1.25)
	
	,	b(4,1)
	
	,	b(4,4)

	,	b(4,7.1)
	//,	b(2,10,1.8)
	//,	b(4,10,1.8)
	//,	b(6,10,1.8)
	,	b(8,10,1.8)
	,	b(10,10,1.8)
	]
,	lastFrame = 
	{	x0:0
	,	y0:0
	,	x1:0
	,	y1:0
	,	stops:[{x:0,y:0},{x:0,y:0}]
	,	collisions:[]
	,	touched:[]
	}
,	collisions = []
,	touched = []
,	mousedown = false
;

//ctx.globalCompositeOperation = "difference";

function render(frame) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	blocks.forEach((e) => {
		ctx.fillStyle = "#00f";
		ctx.fillRect(e.x*gs, e.y*gs, e.w*gs, e.h*gs);
		ctx.strokeStyle="#0ff";
		ctx.strokeRect(e.x*gs, e.y*gs, e.w*gs, e.h*gs)
		/*ctx.fillStyle = "#0ff";
		e = Collision.minkowskiDiff(box.x, box.y, box.w, box.h, e.x, e.y, e.w, e.h);
		ctx.fillRect(e.x*gs, e.y*gs, e.w*gs, e.h*gs);*/
		
	});
	bubbles.forEach(e=>{
		ctx.fillStyle="#0707";
		ctx.fillRect(e.x*gs, e.y*gs, e.w*gs, e.h*gs)
		
		ctx.strokeStyle="#0f0";
		ctx.strokeRect(e.x*gs, e.y*gs, e.w*gs, e.h*gs)
	});
	frame.touched.forEach((e) => {
		ctx.fillStyle = "#f00";
		ctx.fillRect(e.x*gs, e.y*gs, e.w*gs, e.h*gs);
	})
	let i = 0;
	frame.stops.forEach((e,i,a)=>{
		let next = a[i+1];
		if(next){
			drawMovingBox(e.x, e.y, box.w, box.h, next.x, next.y);
		}
	});
	
}


/*
for all static tiles touched ->
	check if collision happens inside a bubble ->
		if yes -> 	
			store bubble
			ignore collision
		if no ->
			stop checking static tiles and store t, side, position at time of impact, and collided tile/s
for all bubbles stored -> 
	check if there's an inner side collision -> 
		check if it happens outside any solid tiles
			if yes ->
				stop checking bubble tiles and store t, side, position at time of impact, and collided tile/s
*/



function check_collision(x0, y0, w0, h0, x1, y1){
	let collision = null;
	blocks.forEach(e=>{
		let col = Collision.collisionData(x0, y0, w0, h0, e.x, e.y, e.w, e.h, x1 - x0, y1 - y0);
		if(col){
			let contained_in_bubble = false;
			bubbles.forEach(b=>{
				let s = col.surface;
				contained_in_bubble = contained_in_bubble || (
						Collision.boxContainsBoxClosed(b.x, b.y, b.w, b.h, s.x, s.y, s.w, s.h)
				);
			});
			if(!contained_in_bubble){
				collision = (collision && (collision.t<col.t))?collision:col;
			}
		}
	});
	
	//get bubble collisions
	let 
		dx = x1 - x0
	,	dy = y1 - y0
	bubbles.forEach(e=>{
		let col = Collision.boxBoxMovingFromInside(x0, y0, w0, h0, e.x, e.y, e.w, e.h, dx, dy);
		if(col){
			let touches_block = false
			,	sidex = col.is_horizontal_collision&&dx
			,	sidey = !col.is_horizontal_collision&&dy
			,	s = col.surface
			;
			blocks.forEach(b=>{
				touches_block = touches_block || (
						Collision.boxBoxClosed(b.x, b.y, b.w, b.h, s.x, s.y, s.w, s.h)
					&&	wouldTouchBlockOnExit(b.x, b.y, b.w, b.h, s.x, s.y, sidex, sidey)
				);
				
			});
			if(touches_block){
				collision = (collision && (collision.t<col.t))?collision:col;
			}
		}
	});

	return collision;
}

function wouldTouchBlockOnExit(x,y,w,h,sx,sy,dx,dy){
	return (
		(	dx
		&&	((dx>0 && x+w>sx) || (dx<0 && x<sx))
		)
	||	
		(	dy
		&&	((dy>0 && y+h>sy) || (dy<0 && y<sy))
		)
	)
}
function step(x, y) {
	let collisions = []
	,	touched = []
	,	stops = []
	,	x0 = box.x
	,	y0 = box.y
	,	w0 = box.w
	,	h0 = box.h
	,	x1 = x
	,	y1 = y
	;
	stops.push({x:x0,y:y0});
	
	//get box collisions
	/**@type {import("../collision/index.js").CollisionData} */
	let collision = null;
	
	while(x0 != x1 || y0 != y1){
		collision = check_collision(x0,y0,h0,w0,x1,y1);
		if(collision){
			x0 = collision.box0.x_at_t;
			y0 = collision.box0.y_at_t;
			x1 = (collision.is_horizontal_collision) ? x0:x1;
			y1 = (!collision.is_horizontal_collision) ? y0:y1;
		}else{
			x0 = x1;
			y0 = y1;
		}
		stops.push({x:x0,y:y0});
		
	}
	
	stops.push({x:x1,y:y1});
	box.x = x1;
	box.y = y1;
		

	

	return (
		{	x0:x0
		,	y0:y0
		,	x1:x
		,	y1:y
		,	stops:stops
		,	touched:touched
		,	collisions:collisions
		}
	);
}





render(lastFrame);

let pos;
const dothething = (e) => {
	pos = getMousePos(canvas, e);
};
document.body.addEventListener("mousemove", dothething);


var 
	spawnx = 0
,	spawny = 0
;
document.body.addEventListener("click", (e)=>{
	let pos = getMousePos(canvas, e);
	spawnx = pos.x/gs-(box.w*0.5);
	spawny = pos.y/gs-(box.h*0.5);

});
document.body.addEventListener("keypress", () => {
	box.x=spawnx;box.y=spawny;
});

let frame = (x,y)=>{
	lastFrame = step(x, y);
	
	render(lastFrame);
	
}
let repeatThat = ()=>{
	box.x = lastFrame.x0;
	box.y = lastFrame.y0;
	frame(lastFrame.x1,lastFrame.y1);
}
let repeatThatButInReverse = ()=>{
	box.x = lastFrame.x1;
	box.y = lastFrame.y1;
	frame(lastFrame.x0,lastFrame.y0);
}

//document.body.addEventListener("mousemove",

setInterval(
	()=>{
		let dx = (pos.x/gs-(box.w*0.5)-box.x)//*0.1;
		let dy = (pos.y/gs-(box.h*0.5)-box.y)//*0.1;
		frame(box.x+dx, box.y+dy);
	}
,1000/60);