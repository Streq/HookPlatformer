"use strict";
var Collision = (() => {
	var mod = {};

	function boxPoint(x, y, w, h, px, py) {
		return (
			(px > x) &&
			(py > y) &&
			(px < x + w) &&
			(py < y + h)
		);
	}

	function boxPointClosed(x, y, w, h, px, py) {
		return (
			(px >= x) &&
			(py >= y) &&
			(px <= x + w) &&
			(py <= y + h)
		);
	}

	function rangeRange(x0, w0, x1, w1) {
		return (
			(x0 + w0 > x1) &&
			(x1 + w1 > x0)
		);
	}

	function boxBox(x0, y0, w0, h0, x1, y1, w1, h1) {
		return (
			(x0 + w0 > x1) &&
			(x1 + w1 > x0) &&
			(y0 + h0 > y1) &&
			(y1 + h1 > y0)
		);
	}

	function boxBoxCoords(x0a, y0a, x1a, y1a, x0b, y0b, x1b, y1b) {
		return (
			(x1a > x0b) &&
			(x1b > x0a) &&
			(y1a > y0b) &&
			(y1b > y0a)
		);
	}

	function boxContainsBox(x0, y0, w0, h0, x1, y1, w1, h1) {
		return (
			(x0 + w0 < x1) &&
			(x1 + w1 > x0) &&
			(y0 + h0 < y1) &&
			(y1 + h1 > y0)
		)
	}

	function boxLine(x, y, w, h, a, b, c, d) {
		if (boxPoint(x, y, w, h, a, b) || boxPoint(x, y, w, h, c, d)) {
			return true;
		}
		return (
			lineLine(a, b, c, d, x, y, x + w, y) || //top
			lineLine(a, b, c, d, x + w, y, x + w, y + h) || //right
			lineLine(a, b, c, d, x, y + h, x + w, y + h) || //bot
			lineLine(a, b, c, d, x, y, x, y + h) //left
		);
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

	function lineLine(a, b, c, d, p, q, r, s) {
		var det, gamma, lambda;
		det = (c - a) * (s - q) - (r - p) * (d - b);
		if (det === 0) {
			return false;
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
			return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
		}
	}

	function lineLineClosed(a, b, c, d, p, q, r, s) {
		var det, gamma, lambda;
		det = (c - a) * (s - q) - (r - p) * (d - b);
		if (det === 0) {
			return false;
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
			return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
		}
	}

	function lineLineLambda(a, b, c, d, p, q, r, s) {
		var det, gamma, lambda;
		det = (c - a) * (s - q) - (r - p) * (d - b);
		if (det === 0) {
			return 1; //they are parallel
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
			return ((0 <= lambda && lambda < 1) && (0 <= gamma && gamma <= 1)) ?
				lambda :
				1;
		}
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
			boxLineClosed //actual calc thx to my man minkowski
			(x0 - x1 - w1 //minkdif x
				, y0 - y1 - h1 //minkdif y
				, w0 + w1 //minkdif w
				, h0 + h1 //minkdif h
				, 0, 0 //origin
				, -dx, -dy //opposite distance
			)
		);
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
	
	
	
	function rasterizeBoxMoving(x0, y0, w, h, x1, y1, callback){
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
		
		
		x0 += +(sx > 0)*w;//if moving right x is x+w
		x1 += +(sx > 0)*w;//if moving right x1 is x1+w
		y0 += +(sy > 0)*h;//if moving down y is y+h
		y1 += +(sy > 0)*h;//if moving down y1 is y1+h
		
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
				callback(i, j);
				let sy_ = Math.sign(j_h-j);
				for(let j_ = j; j_ != j_h;){
					j_ -= sy;
					callback(i, j_);
				}
			}
			j+=sy;
			x_ = x0 + Math.abs(j + pboy - y0)*m;
			let i_w = rtilex(x_ + w);
			callback(i, j);
			let sx_ = Math.sign(i_w-i);
			for(let i_ = i; i_ != i_w;){
				i_ -= sx;
				callback(i_, j);
			}
			//de (8.23, 3) a (13.605, 4)
			xb = xb + m;//xb crece el equivalente a 1 en y en x
		}
		while (i != i1) {
			i += sx;
			y_ = y0 + Math.abs(i + pbox - x0)*n;
			let j_h = rtiley(y_ + h);
			callback(i, j);
			let sy_ = Math.sign(j_h-j);
			for(let j_ = j; j_ != j_h;){
				j_ -= sy;
				callback(i, j_);
			}
		}

	}
	
	
	
	mod.boxPoint = boxPoint;
	mod.boxBox = boxBox;
	mod.lineLine = lineLine;
	mod.lineLineLambda = lineLineLambda;
	mod.boxLine = boxLine;
	mod.boxLineLambda = boxLineLambda
	mod.boxBoxMoving = boxBoxMoving;
	mod.boxBoxMovingLambda = boxBoxMovingLambda;
	mod.boxBoxSideOfCollision = boxBoxSideOfCollision;
	mod.boxContainsBox = boxContainsBox;
	mod.boxBoxIntersection = boxBoxIntersection;
	mod.getBoundingBox = getBoundingBox;
	mod.getBoundingRange = getBoundingRange;
	mod.rangeRange = rangeRange;
	
	mod.rasterizeLine = rasterizeLine;
	mod.rasterizeBoxMoving = rasterizeBoxMoving;
	
	return mod;
})();