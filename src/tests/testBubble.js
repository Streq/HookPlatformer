import * as Collision from "../collision/index.js"
import {DoubleArrayGrid} from "../utils/grid.js"
import {getMousePos} from "../utils/dom.js"

let box = {
		x:0,
		y:0,
		w:.75,
		h:.75
	},
	lastFrame = {
		x0:0,
		y0:0,
		x1:0,
		y1:0,
		stops:[{x:0,y:0},{x:0,y:0}],
		collisions:[],
		touched:[]
	},
	blocks = [
		[2, 9],
		[2, 11],

		[14, 10],
		[15, 10],
		[16, 10],
		[17, 10],
		[18, 10],
		[19, 10],
		[20, 10],
		[17, 7],
		[17, 8],
		[17, 9],
		[17, 11],
		[17, 12],
		[17, 13],

		[4, 10],
		[5, 10],
		[6, 10],
		[8, 10],
		[9, 10],
		[10, 10],
		[7, 7],
		[7, 8],
		[7, 9],
		[7, 11],
		[7, 12],
		[7, 13],
	],
	bubbles = [
		[4.2,5.1,13.4,14.5],
		[20,0,1,20],
		
	],
	grid = new DoubleArrayGrid(),
	collisions = [],
	touched = [],
	mousedown = false;

blocks.forEach((e)=>{
	grid.set(e[0]  ,e[1],1);
	grid.set(e[0]+5,e[1]+2,1);
	grid.set(e[0]  ,e[1]+2,1);
	grid.set(e[0]-5,e[1]-2,1);
});

function render(frame) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	grid.forEach((e,x,y) => {
		ctx.fillStyle = "blue";
		if(!e)return;
		ctx.fillRect(x * gs, y * gs, gs, gs);
	});
	
	bubbles.forEach(e=>{
		ctx.strokeStyle="#0f0";
		ctx.strokeRect(e[0]*gs,e[1]*gs,e[2]*gs,e[3]*gs)
		ctx.fillStyle="#0707";
		ctx.fillRect(e[0]*gs,e[1]*gs,e[2]*gs,e[3]*gs)
	})
	frame.touched.forEach((e) => {
		ctx.fillStyle = "red";
		ctx.fillRect(e[0] * gs, e[1] * gs, gs, gs);
	})
	let i = 0;
	frame.collisions.forEach((e) => {
		drawTile(e[0], e[1], ++i);
	});
	frame.stops.forEach((e,i,a)=>{
		let next = a[i+1];
		if(next){
			drawMovingBox(e.x, e.y, box.w, box.h, next.x, next.y);
		}
	})
	
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





function step(x_, y_) {
	let collisions = [],
		touched = [],
		stops = [],
		x0 = box.x,
		y0 = box.y,
		x1 = box.x,
		y1 = box.y,
		targetx = x_,
		targety = y_;
	stops.push({x:x0,y:y0});
	
	
	let col;
	do{
		let dx = x_ - x1;
		let dy = y_ - y1;
		//get all inner collisions with bubbles
		//TODO
		let col_bubbles_outer = bubbles.filter(e=>{
			return Collision.boxBoxMoving(x1, y1, box.w, box.h, e[0],e[1],e[2],e[3],dx,dy);
		});
		let col_bubbles_inner = null;
		col_bubbles_outer.forEach(e=>{
			let collision = Collision.boxBoxMovingFromInside(x1, y1, box.w, box.h, e[0],e[1],e[2],e[3],dx,dy);
			if(collision && (!col_bubbles_inner || col_bubbles_inner.t < collision.t)) {
				let ix = Math.max(collision.x,collision.x0);
				let iy = Math.max(collision.y,collision.y0);
				let iw = Math.min(collision.x+box.w,collision.x1)-ix;
				let ih = Math.min(collision.y+box.h,collision.y1)-iy;
				let wall = false;
				Collision.rasterizeBox(ix,iy,iw,ih,(i,j)=>{wall = wall||grid.get(i,j)})
				col_bubbles_inner = wall && collision || col_bubbles_inner;;
			}
		})
		//get first outer collision with tiles
		let col_;
		col = Collision.boxGridSubstep(x1, y1, box.w, box.h, x_, y_, 
			(i,j, row)=>{
				let x = row.pos.x, 
					y = row.pos.y, 
					g = grid.get(i,j),
					dx = x_-x1,
					dxt = x-x1,
					t = dxt/dx,
					collision = g;
				if(g){
					col_bubbles_outer.forEach(e=>{
						if(Collision.boxBox(e[0],e[1],e[2],e[3],i,j,1,1)){
							//get intersection between box and tile
							//which will be a box with width = 0 or height = 0
							//representing the collision surface
							let ix = Math.max(x,i);
							let iy = Math.max(y,j);
							let iw = Math.min(x+box.w,i+1)-ix;
							let ih = Math.min(y+box.h,j+1)-iy;
							//if the collided surface is entirely inside the bubble ignore
							if(Collision.boxContainsBox(e[0],e[1],e[2],e[3],ix,iy,iw,ih)){
								collision = false;
							}
							
						}
					})
				}
				let ret = [i,j];
				ret.t = t;
				if(collision){
					col_ = ret;
					return ret;
				}return null;
			}
		);
		col_ = col;
		if(!col_ || col_bubbles_inner&&col_bubbles_inner.t<col.t){
			col_ = col_bubbles_inner;
		}

		collisions = collisions.concat(col.gridtiles||[]);
		touched = col.touched.concat(touched||[]);
		if(col_.side){
			if(col_.side.x){
				x_=col_.x;
			}
			if(_col.side.y){
				y_=col_.y;
			}
		}
		x1 = col_.x;
		y1 = col_.y;
		
		stops.push({x:x1,y:y1});
		
	}while(x_!=x1 || y_!=y1);
	box.x = x1;
	box.y = y1;
	return {
		x0:x0,
		y0:y0,
		x1:targetx,
		y1:targety,
		stops:stops,
		touched:touched,
		collisions:collisions,
	}
	
}





render(lastFrame);

let pos;
const dothething = (e) => {
	pos = getMousePos(canvas, e);
};
document.body.addEventListener("mousemove", dothething);
var movermouse = true;
document.body.addEventListener("keypress", () => {
	if (movermouse=!movermouse) {
		document.body.removeEventListener("mousemove", dothething);
		document.body.addEventListener("click", dothething);
	} else {
		document.body.removeEventListener("click", dothething);
		document.body.addEventListener("mousemove", dothething);
	}
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