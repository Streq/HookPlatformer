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
		
		let m = dx / Math.abs(dy); //= 5.375

		let yb = sy > 0 ? (Math2.ceil(y0) - y0) : (y0-Math.floor(y0));
		let xb = x0 + yb * m; // 3.4+0.9*5.375 // 8.2375

		let i = Math.floor(x0)
		let j = Math.floor(y0);

		let j1 = Math.floor(y1);
		let i1 = Math.floor(xb);
		while (j != j1) {
			//de (3.4, 2.1) a (8.23, 3) avanzamos de x=3 a x=8 y recien despues de eso de y=2 a y=3

			callback(i, j);
			i1 = Math.floor(xb);
			while (i != i1) {
				callback(i+=sx, j);
			}
			j+=sy;
			//de (8.23, 3) a (13.605, 4)
			xb = xb + m;
		}
		i1 = Math.floor(x1);
		callback(i, j);
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
		let dx = x1 - x0;
		let dy = y1 - y0;

		let m = dx / dy; //= 5.375

		let xb = x0 + (Math2.ceil(y0) - y0) * m; // 3.4+0.9*5.375 // 8.2375

		let i = Math.floor(x0)
		let j = Math.floor(y0);

		let j1 = Math.floor(y1);
		let i1 = Math.floor(xb);

		rasterizeBox(i,j,w,h,callback);
		
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