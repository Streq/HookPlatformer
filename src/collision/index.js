import {Math2} from "../utils/index.js"

import
	{	default as boxPoint
	,	closed as boxPointClosed
	} from "./box/point.js"
import
	{	default as boxBox
	,	closed as boxBoxClosed
	,	containsClosed as boxContainsBoxClosed
	,	contains as boxContainsBox
	,	coords as boxBoxCoords
	} from "./box/box.js"
import
	{	default as boxLineNew
	,	data as boxLineData
	} from "./box/line.js"
import
	{	default as lineLine
	,	closed as lineLineClosed
	,	lambda as lineLineLambda
	} from "./line/line.js"



function rangeRange(x0, w0, x1, w1) {
	return (
		(x0 + w0 > x1) &&
		(x1 + w1 > x0)
	);
}
function rangeContainsRange(x0, w0, x1, w1) {
	return (
		(x0 <= x1) &&
		(x0 + w0 >= x1 + w1)
	);
}



function boxContainsHSegment(x0, y0, w0, h0, x1, y1, w1) {
	return (
		(x0 <= x1) &&
		(x0 + w0 >= x1 + w1) &&
		(y0 <= y1) &&
		(y0 + h0 >= y1)
	)
}
function boxContainsVSegment(x0, y0, w0, h0, x1, y1, h1) {
	return (
		(x0 <= x1) &&
		(x0 + w0 >= x1) &&
		(y0 <= y1) &&
		(y0 + h0 >= y1 + h1)
	)
}


function boxLineClosed(x, y, w, h, a, b, c, d) {
	if (boxPointClosed(x, y, w, h, a, b) || boxPointClosed(x, y, w, h, c, d)) {
		return true;
	}
	return (
		lineLineClosed(a, b, c, d, x, y, x + w, y) || //top
		lineLineClosed(a, b, c, d, x + w, y, x + w, y + h) || //right
		lineLineClosed(a, b, c, d, x, y + h, x + w, y + h) || //bot
		lineLineClosed(a, b, c, d, x, y, x, y + h) //left
	);
}

function boxLineLambda(x, y, w, h, a, b, c, d) {
	return (
		Math.min(
			lineLineLambda(a, b, c, d, x, y, x + w, y), //top
			lineLineLambda(a, b, c, d, x + w, y, x + w, y + h), //right
			lineLineLambda(a, b, c, d, x, y + h, x + w, y + h), //bot
			lineLineLambda(a, b, c, d, x, y, x, y + h) //left
		)
	);
}



function boxBoxMovingBroad(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy) {
	return boxBoxCoords //check the bounding box of the moving box
	(x0 + Math.min(0, dx), y0 + Math.min(0, dy), x0 + w0 + Math.max(0, dx), y0 + h0 + Math.max(0, dy), x1, y1, x1 + w1, y1 + h1);
}

function getBoundingBox(x, y, w, h, dx, dy) {
	return {
		x: x + Math.min(0, dx),
		y: y + Math.min(0, dy),
		w: w + Math.abs(dx),
		h: h + Math.abs(dy)
	}
}

function getBoundingRange(x, y, w, h, dx, dy) {
	return {
		x0: x + Math.min(0, dx),
		y0: y + Math.min(0, dy),
		x1: x + w + Math.max(0, dx),
		y1: y + h + Math.max(0, dy)
	}
}
/**
 * Checks collision between 2 boxes when one of them is moving a (dx,dy) distance relative to the other
 * @function
 * @param {number} x0 - initial x coord of the first box
 * @param {number} y0 - initial y coord of the first box
 * @param {number} w0 - width of the first box
 * @param {number} h0 - height of the first box
 * @param {number} x1 - initial x coord of the second box
 * @param {number} y1 - initial y coord of the second box
 * @param {number} w1 - width of the second box
 * @param {number} h1 - height of the second box
 * @param {number} dx - distance the first box would move relative to the second box, on the x axis
 * @param {number} dy - distance the first box would move relative to the second box, on the y axis
 */
function boxBoxMoving(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy) {
	return (
		boxBoxMovingBroad.apply(null, arguments) && //if bounding box doesn't collide it don't matter
		boxLineNew //actual calc thx to my man minkowski
			(x0 - x1 - w1 //minkdif x
			, y0 - y1 - h1 //minkdif y
			, w0 + w1 //minkdif w
			, h0 + h1 //minkdif h
			, 0, 0 //origin
			, -dx, -dy //opposite distance
			)
	);
}


/**
@typedef {
{	t:	number
	,	is_horizontal_collision:	boolean
	,	surface:	{x:number,y:number,w:number,h:number}
	,	box0: 
		{	x_at_t:	number
		,	y_at_t:	number
		,	is_lower_side:	boolean
		,	surface:	{x:number,y:number,w:number,h:number}
		}
	,	box1: 
		{	x_at_t:	number
		,	y_at_t:	number
		,	is_lower_side:	boolean
		,	surface:	{x:number,y:number,w:number,h:number}
		}
	}
} CollisionData
*/

/**
 * @param {number} x0 
 * @param {number} y0 
 * @param {number} w0 
 * @param {number} h0 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} w1 
 * @param {number} h1 
 * @param {number} dx 
 * @param {number} dy
 * @returns {CollisionData} 
 */
export function collisionData(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy) {
	let
		mink = minkowskiDiff(x0, y0, w0, h0, x1, y1, w1, h1)
	,	data = boxLineData(mink.x, mink.y, mink.w, mink.h, 0, 0, dx, dy)
	,	there_is_a_collision = data.tmin >=0 && data.tmin < 1 && data.tmax > data.tmin
	,	is_horizontal = data.side_tmin.x
	;
	return there_is_a_collision && (
		is_horizontal
		&& horizontalCollisionData(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy, data.tmin)
		|| verticalCollisionData(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy, data.tmin)
	)
}

export function horizontalCollisionData(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy, t){
	let	
		is_higher_side_of_box1 = (dx<0)
	,	dyt = t*dy
	,	y_at_t = y0 + dyt
	,	surface_x = x1 + (is_higher_side_of_box1) * w1
	,	surface_y = Math.max(y_at_t, y1)
	;
	return {
			is_horizontal_collision: true
		,	t: t
		,	box0:
			{	is_higher_side:	!is_higher_side_of_box1
			,	x_at_t:	is_higher_side_of_box1 
				?	x1 + w1 
				:	x1 - w0
			,	y_at_t:	y_at_t
			,	surface:
				{	x:	surface_x
				,	w:	0
				,	y:	y_at_t
				,	h:	h0
				}
			}
		,	box1:
			{	is_higher_side:	is_higher_side_of_box1
			,	x_at_t:	x1
			,	y_at_t:	y1
			,	surface:
				{	x:	surface_x
				,	w:	0
				,	y:	y1
				,	h:	h1
				}
			}
		,	surface: 
			{	x:	surface_x
			,	w:	0
			,	y:	surface_y
			,	h:	Math.min(y_at_t+h0, y1+h1) - surface_y
			}
		};
}


export function verticalCollisionData(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy, t){
	let	is_higher_side_of_box1 = (dy<0)
	,	dxt = t*dx
	,	x_at_t = x0 + dxt
	,	surface_x = Math.max(x_at_t, x1)
	,	surface_y = y1 + is_higher_side_of_box1 * h1
	;
	return {
			is_horizontal_collision: false
		,	t: t
		,	box0:
			{	is_higher_side:	!is_higher_side_of_box1
			,	x_at_t:	x_at_t
			,	y_at_t:	is_higher_side_of_box1
				?	y1 + h1 
				:	y1 - h0
			,	surface:
				{	x:	x_at_t
				,	w:	w0
				,	y:	surface_y
				,	h:	0
				}
			}
		,	box1:
			{	is_lower_side:	is_higher_side_of_box1
			,	x_at_t:	x1
			,	y_at_t:	y1
			,	surface:
				{	x:	x1
				,	w:	w1
				,	y:	surface_y
				,	h:	0
				}
			}
		,	surface: 
			{	x:	surface_x
			,	w:	Math.min(x_at_t+w0, x1+w1) - surface_x
			,	y:	surface_y
			,	h:	0
			}
		};
}

export function boxBoxMovingFromInside(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy) {
	let
		vertical_segment_x_t = x1 - x0 - (dx>0 && (w0 - w1))
	,	vertical_segment_y0 = y1 - h0
	,	vertical_segment_y1 = y1 + h1
	,	n = 1/dx
	,	vertical_t = vertical_segment_x_t*n
	,	y_at_vertical_intersection = y0+dy*vertical_t
	,	vertical_intersection = 
			vertical_t >= 0
		&&	vertical_t < 1
		&&	y_at_vertical_intersection > vertical_segment_y0 
		&&	y_at_vertical_intersection < vertical_segment_y1

	,	horizontal_segment_y_t = y1 - y0 - (dy>0 && (h0 - h1))
	,	horizontal_segment_x0 = x1 - w0
	,	horizontal_segment_x1 = x1 + w1
	,	m = 1/dy
	,	horizontal_t = (horizontal_segment_y_t)*m
	,	x_at_horizontal_intersection = x0+dx*horizontal_t
	,	horizontal_intersection = 
			horizontal_t >= 0 
		&&	horizontal_t < 1 
		&&	x_at_horizontal_intersection > horizontal_segment_x0 
		&&	x_at_horizontal_intersection < horizontal_segment_x1

	,	intersection = vertical_intersection || horizontal_intersection
	,	is_horizontal_segment = horizontal_intersection && (!vertical_intersection || horizontal_t < vertical_t)
	;

	return intersection && (
		is_horizontal_segment 
		&&	verticalCollisionData(x0, y0, w0, h0, x1, y1 + (dy>0 && h1), w1, 0, dx, dy, horizontal_t)
		||	horizontalCollisionData(x0, y0, w0, h0, x1 + (dx>0 && w1), y1, 0, h1, dx, dy, vertical_t)
	)
}

function minkowskiDiff(x0,y0,w0,h0,x1,y1,w1,h1){
	return{
		x: x1 - x0 - w0, //minkdif x
		y: y1 - y0 - h0, //minkdif y
		w: w0 + w1, //minkdif w
		h: h0 + h1 //minkdif h
	}
}

function minkowskiInside(x0,y0,w0,h0,x1,y1,w1,h1){
	return{
		x: - x0 + x1, //minkdif x
		y: - y0 + y1, //minkdif y
		w: w1 - w0, //minkdif w
		h: h1 - h0//minkdif h
	}
}


function boxBoxIntersection(x0, y0, w0, h0, x1, y1, w1, h1) {
	var x = Math.max(x0, x1);
	var y = Math.max(y0, y1)
	return !boxBox.apply(null, arguments) ? null : {
		x: x,
		y: y,
		w: Math.min(x0 + w0, x1 + w1) - x,
		h: Math.min(y0 + h0, y1 + h1) - y
	}
}

function segmentDistance(x0, w0, x1, w1) {
	return (
		+(x1 > x0 + w0) * (x1 - x0 - w0) -
		(x0 > x1 + w1) * (x0 - x1 - w1)
	);
}

function boxBoxShortestWay(x0, y0, w0, h0, x1, y1, w1, h1) {
	return {
		x: segmentDistance(x0, w0, x1, w1),
		y: segmentDistance(y0, h0, y1, h1)
	};

}

/**
 * Checks the side of collision between 2 boxes when one of them is moving a (dx,dy) distance relative to the other.
 * It assumes that 1) a collision doesn't exist before displacement 2) a collision exists after displacement
 * @function
 * @param {number} x0 - initial x coord of the first box
 * @param {number} y0 - initial y coord of the first box
 * @param {number} w0 - width of the first box
 * @param {number} h0 - height of the first box
 * @param {number} x1 - initial x coord of the second box
 * @param {number} y1 - initial y coord of the second box
 * @param {number} w1 - width of the second box
 * @param {number} h1 - height of the second box
 * @param {number} dx - distance the first box moves relative to the second box, on the x axis
 * @param {number} dy - distance the first box moves relative to the second box, on the y axis
 */
function boxBoxSideOfCollision(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy) {
	let x, y;
	if (rangeRange(x0, w0, x1, w1)) {
		y = dy;
	} else if (rangeRange(y0, h0, y1, h1)) {
		x = dx;
	} else {
		let shortest = boxBoxShortestWay.apply(null, arguments);
		let horizontal_collision = shortest.x / dx > shortest.y / dy;
		x = horizontal_collision * dx;
		y = !horizontal_collision * dy;
	}
	return {
		x: x,
		y: y
	};
}

function boxBoxMovingLambda(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy) {
	return boxLineLambda(x0 - x1 - w1 //minkdif x
		, y0 - y1 - h1 //minkdif y
		, w0 + w1 //minkdif w
		, h0 + h1 //minkdif h
		, 0, 0 //origin
		, -dx, -dy //opposite distance
	);
}

//la cosa va de (3.4,2.1) a (16.3,4.5)
//(12.9,2.4)

//primer octante (dx y dy positivos, dx > dy)
function rasterizeLineOld(x0, y0, x1, y1, callback) {
	let dx = x1 - x0;
	let dy = y1 - y0;

	let m = dx / dy; //= 5.375

	let xb = x0 + (Math2.ceil(y0) - y0) * m; // 3.4+0.9*5.375 // 8.2375

	let i = Math.floor(x0)
	let j = Math.floor(y0);

	let j1 = Math.floor(y1);
	let i1 = Math.floor(xb);
	while (j < j1) {
		//de (3.4, 2.1) a (8.23, 3) avanzamos de x=3 a x=8 y recien despues de eso de y=2 a y=3

		callback(i, j);
		i1 = Math.floor(xb);
		while (i < i1) {
			callback(++i, j);
		}
		++j;
		//de (8.23, 3) a (13.605, 4)
		xb = xb + m;
	}
	i1 = Math.floor(x1);
	callback(i, j);
	while (i < i1) {
		callback(++i, j);
	}

}

function rasterizeLine(x0, y0, x1, y1, callback) {
	let dx = x1 - x0;
	let dy = y1 - y0;
	let sx = Math.sign(dx);
	let sy = Math.sign(dy);

	//baldoza inicial
	let i = Math.floor(x0);
	let j = Math.floor(y0);
	callback(i, j);//se cubre la baldoza actual

	//baldoza final en y
	let j1 = sy>0? Math2.floor(y1):Math.floor(y1);
	let i1 = sx>0? Math2.floor(x1):Math.floor(x1);

	if(i==i1 || sx==0){
		while(j != j1){
			callback(i,j+=sy);
		}
	}

	let m = dx / Math.abs(dy); //= 5.375

	//lo que falta avanzar para la proxima baldoza en y
	let yb = sy > 0 ? (Math2.ceil(y0) - y0) : (y0-Math.floor(y0));
	//lo que se avanza en x al avanzar yb en y
	let xb = x0 + yb * m; // 3.4+0.9*5.375 // 8.2375
	//baldoza final en x antes de llegar a la proxima baldoza en y
	let ib = Math.floor(xb);

	while (j != j1) {
		//de (3.4, 2.1) a (8.23, 3) avanzamos de x=3 a x=8 y recien despues de eso de y=2 a y=3

		ib = Math.floor(xb);
		while (i != ib) {//se cubren todas las baldozas en x antes de la proxima en y
			callback(i+=sx, j);
		}
		callback(i, j+=sy);
		//de (8.23, 3) a (13.605, 4)
		xb = xb + m;//xb crece el equivalente a 1 en y en x
	}
	while (i != i1) {
		callback(i+=sx, j);
	}


}


function rasterizeBox(x, y, w, h, callback){
	let i1 = Math2.floor(x+w);
	let j1 = Math2.floor(y+h); 
	for(let j = Math.floor(y); j <= j1; ++j)
		for(let i = Math.floor(x); i <= i1; ++i)
			callback(i,j);
}



/*
returns a data structure like this one:
{
	side_x: 1,
	side_y: 1,
	tiles:[
		{
			horizontal: false,
			i: 2,
			j0: 3,
			j1: 6
		},
		{
			horizontal: true,
			j: 7,
			i0 : 0
			i1 : 2 
		}
	]
}
*/
function boxGridSweepTest(x0, y0, w, h, x1, y1, callback){
	const dx = x1-x0;
	const dy = y1-y0;
	const sx = Math.sign(dx)||1;
	const sy = Math.sign(dy)||1;

	//when touching a tile while moving to left or up the side touched is actually x+tw, we need to subtract tw
	const tw = Math.min(sx,0);//tile width offset
	const th = Math.min(sy,0);//tile height offset

	//store the division to avoid dividing in the loop
	const nx = 1/dx;
	const ny = 1/dy;

	//coords of vertex that will be touching sides first both in x and y
	const vertex_x0 = sx<0? x0 : x0+w;
	const vertex_y0 = sy<0? y0 : y0+h;

	//the offsets to get adjacent vertices
	const vertex_offset_x = -sx*w;
	const vertex_offset_y = -sy*h;

	//x and y are going to store the coords updates
	let x = vertex_x0;
	let y = vertex_y0;

	// closest tile in x and y
	let next_tile_x = sx<0 ? Math.floor(vertex_x0) : Math.ceil(vertex_x0);
	let next_tile_y = sy<0 ? Math.floor(vertex_y0) : Math.ceil(vertex_y0);

	let rows = [];
	//aux
	let row;

	let posx;
	let posxw;
	let posy;
	let posyh;
	let yh;
	let j0;
	let j1;
	let xw;
	let i0;
	let i1;

	while(true){
		//x(t) = x0 + dx*t
		//so the equation for t is
		//(x(t) - x0)/dx = t

		//get t to next X
		let tx = dx? (next_tile_x - vertex_x0)*nx : Infinity;

		//get t to next Y
		let ty = dy? (next_tile_y - vertex_y0)*ny : Infinity;
		if(tx>=1 && ty>=1)
			break;

		if (tx<ty){
			x = next_tile_x;
			y = vertex_y0 + dy*tx;
			yh = y + vertex_offset_y;
			posy = Math.min(y,yh);
			posyh = Math.max(y,yh);

			j0 = Math.floor(posy);
			j1 = Math2.floor(posyh);

			row = {
				horizontal: false,
				i : x+tw,
				y0: posy,
				y1: posyh,
				j0: j0,
				j1: j1,
				s: sx,
				pos:{
					y: posy,
					x: Math.min(x,x+vertex_offset_x)
				}
			};
			next_tile_x += sx;
		} else {
			y = next_tile_y;
			x = vertex_x0 + dx*ty;
			xw = x + vertex_offset_x;
			posx = Math.min(x,xw);
			posxw = Math.max(x,xw);

			i0 = Math.floor(posx);
			i1 = Math2.floor(posxw);
			row = {
				horizontal: true,
				j : y+th,
				x0: posx,
				x1: posxw,
				i0: i0,
				i1: i1,
				s: sy,
				pos:{
					y: Math.min(y,y+vertex_offset_y),
					x: posx
				}
			};
			next_tile_y += sy;
		}
		rows.push(row);
		//debugger;
		if(callback && callback(row)){
			break;
		}
	}
	return {
		sx: sx,
		sy: sy,
		rows: rows,
	}
}



/**/
function boxGridSubstep(x0, y0, w, h, x1, y1, filter) {
	let collisions_ = [];
	let touched_ = [];
	let ret = {}
	let dx = x1 - x0;
	let dy = y1 - y0;
	let x_=x1, y_=y1;

	boxGridSweepTest(x0, y0, w, h, x1, y1, (row) => {
		let touch = null;
		if(row.horizontal){
			let j = row.j;
			for(let i = row.i0; i <= row.i1; ++i){
				collisions_.push([i,j])
				let found = filter(i, j, row);
				if (found) {
					found.sx = 0;
					found.sy = row.s;
					touched_.push(found);
					touch = true;
				}
			}
		}else{
			let i = row.i;
			for(let j = row.j0; j <= row.j1; ++j){
				collisions_.push([i,j])
				let found = filter(i, j, row);
				if (found) {
					found.sx = row.s;
					found.sy = 0;
					touched_.push(found);
					touch = true;
				}
			}
		}
		return touch;
	});

	let tch = touched_[0];
	if (tch) {

		let m = dy / dx;
		let n = dx / dy;

		let i = tch[0];
		let j = tch[1];
		if (tch.sx) {
			if (tch.sx > 0) {
				x_ = i - w;
			} else {
				x_ = i + 1;
			}
			y1 = y0 + m * (x_ - x0);
			x1 = x_;

		}
		if (tch.sy) {
			if (tch.sy > 0) {
				y_ = j - h;
			} else {
				y_ = j + 1;
			}
			x1 = x0 + n * (y_ - y0);
			y1 = y_;
		}
	}else{
		x1 = x_;
		y1 = y_;
	}
	return{
		x:x1,
		y:y1,
		side: tch && {x:tch.sx, y:tch.sy},
		touched: touched_,
		gridtiles: collisions_
	}
}	


function rasterizeBoxMoving(x0, y0, w, h, x1, y1, callback){
	let ret;
	rasterizeBox(x0,y0,w,h,callback);//se cubre la baldoza actual

	let dx = x1 - x0;//distancia x
	let dy = y1 - y0;//distancia y
	let sx = Math.sign(dx)||-1;//signo distancia x
	let sy = Math.sign(dy)||-1;//signo distancia y

	const currentTilePos = Math2.floor;
	const currentTileNeg = Math.floor;
	let tilex = sx<0?currentTileNeg:currentTilePos;
	let tiley = sy<0?currentTileNeg:currentTilePos;
	let rtilex = sx>=0?currentTileNeg:currentTilePos;
	let rtiley = sy>=0?currentTileNeg:currentTilePos;

	//positive border offset
	let pbox = Math.max(0,-sx);
	let pboy = Math.max(0,-sy);

	let dw = +(sx > 0)*w;
	let dh = +(sy > 0)*h;

	x0 += dw;//if moving right x is x+w
	x1 += dw;//if moving right x1 is x1+w
	y0 += dh;//if moving down y is y+h
	y1 += dh;//if moving down y1 is y1+h

	w *= -sx||-1;
	h *= -sy||-1;

	//baldoza inicial
	let i0 = tilex(x0);
	let j0 = tiley(y0);

	let i = i0;
	let j = j0;


	//baldoza final en y
	let i1 = tilex(x1);
	let j1 = tiley(y1);


	let m = dx / Math.abs(dy); //= 5.375
	let n = dy / Math.abs(dx); //= 5.375

	//lo que falta avanzar para la proxima baldoza en y
	let ty = tiley(y0);
	let yb = sy > 0 ? (ty+1  - y0) : (y0 - ty);
	//la posicion en x al avanzar yb en y
	let xb = x0 + yb * m; // 3.4+0.9*5.375 // 8.2375
	//la baldoza en x al avanzar yb en y
	let ib = tilex(xb);

	let y_;//offset en y dentro de la baldoza actual;
	let x_;

	while (j != j1) {
		//de (3.4, 2.1) a (8.23, 3) avanzamos de x=3 a x=8 y recien despues de eso de y=2 a y=3

		ib = tilex(xb);//baldoza en la que terminar en x
		//se cubren todas las baldozas en x antes de la proxima en y
		while (i != ib) {//mientras i sea diferente a la baldoza final en x
			i += sx;//crecer baldoza
			//i + (sx<0): ultimo borde superado
			//si es retroceso es i+1, si es avance es i
			y_ = y0 + Math.abs(i  + pbox  - x0)*n;
			let j_h = rtiley(y_ + h);//get baldoza rear en y
			ret = callback(i, j_h, sx, 0, i-dw, y_-dh);
			if(ret!=null)return ret;
			let sy_ = Math.sign(j_h-j);
			for(let j_ = j_h; j_ != j;){
				j_ += sy;
				ret = callback(i, j_, sx, 0, i-dw, y_-dh);
				if(ret!=null)return ret;
			}
		}
		j+=sy;
		x_ = x0 + Math.abs(j + pboy - y0)*m;
		let i_w = rtilex(x_ + w);
		ret = callback(i_w, j, 0, sy, x_-dw, j-dh);
		if(ret!=null)return ret;
		let sx_ = Math.sign(i_w-i);
		for(let i_ = i_w; i_ != i;){
			i_ += sx;
			ret = callback(i_, j, 0, sy, x_-dw, j-dh);
			if(ret!=null)return ret;
		}
		//de (8.23, 3) a (13.605, 4)
		xb = xb + m;//xb crece el equivalente a 1 en y en x
	}
	while (i != i1) {
		i += sx;
		y_ = y0 + Math.abs(i + pbox - x0)*n;
		let j_h = rtiley(y_ + h);
		ret = callback(i, j_h, sx, 0, i-dw, y_-dh);
		if(ret!=null)return ret;
		let sy_ = Math.sign(j_h-j);
		for(let j_ = j_h; j_ != j;){
			j_ += sy;
			ret = callback(i, j_, sx, 0, i-dw, y_-dh);
			if(ret!=null)return ret;
		}
	}

}



function rasterizeRange(x0,x1,y0,y1,callback){
	let dx = Math.sign(x1-x0),
		dy = Math.sign(y1-y0);
		i0,j0,i1,j1;
	if(dx<0){
		i0 = Math2.floor(x0);
		i1 = Math.floor(x1);
	}else{
		i0 = Math.floor(x0);
		i1 = Math2.floor(x1);
	}
	if(dy<0){
		j0 = Math2.floor(y0);
		j1 = Math.floor(y1);
	}else{
		j0 = Math.floor(y0);
		j1 = Math2.floor(y1);
	}

	for(let i = i0; i != i1; i+=dx){
		for(let j = j0; j != j1; j+=dy){
			callback(i,j);
		}
	}	
}





export {
	boxBox,
	boxBoxClosed,
	boxPoint,
	lineLine,
	lineLineLambda,
	boxLineNew as boxLine,
	boxLineData,
	boxLineLambda,
	boxBoxMoving,
	boxBoxMovingLambda,
	boxBoxSideOfCollision,
	boxContainsBoxClosed, 
	boxContainsBox,
	boxBoxIntersection,
	getBoundingBox,
	getBoundingRange,
	rangeRange,

	rasterizeLine,
	rasterizeBoxMoving,

	rasterizeBox,
	boxGridSubstep,
	boxGridSweepTest,

	minkowskiDiff,
	minkowskiInside,
	boxContainsHSegment,
	boxContainsVSegment,
}

