define(function(){
	/** @typedef {Object} Box 
		@property {number} x - x coordinate
		@property {number} y - y coordinate
		@property {number} w - width
		@property {number} h - height
	*/
	
	/** @typedef {Object} Vector
		@property {number} x - x coordinate
		@property {number} y - y coordinate
	*/
	
	
	/** @param {Box} box1
		@param {Box} box2 */
	function boxBox(box1,box2){
		return (
			box1.x + box1.w > box2.x &&
			box2.x + box2.w > box1.x &&
			box1.y + box1.h > box2.y &&
			box2.y + box2.h > box1.y
		);
	}
	
	/** @param {Box} box 
		@param {Vector} point */
	function boxPoint(box,point){
		return (
			box.x < point.x &&
			box.x + box.w > point.x && 
			box.y < point.y &&
			box.y + box.h > point.y
		);
	}
	
	/** @param {Box} box 
		@param {Vector} point */
	function boxPointClosed(box,point){
		return (
			point.x >= box.x &&
			point.x <= box.x + box.w && 
			point.y >= box.y  &&
			point.y <= box.y + box.h
		);
	}
	
	/** @param {Vector} a0 
		@param {Vector} a1
		@param {Vector} b0
		@param {Vector} b1 */
	function lineLine(a0, a1, b0, b1){
		let a=a0.x,
			b=a0.y,
			c=a1.x,
			d=a1.y,
			p=b0.x,
			q=b0.y,
			r=b1.x,
			s=b1.y;
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
	
	/** @param {Box} box 
		@param {Vector} a 
		@param {Vector} b */
	function boxLine(box, a, b){
		if (boxPoint(box, a) || boxPoint(box, b))
		{
			return true;
		}
		let topleft = {x : box.x, y: box.y},
			topright = {x : box.x + box.w, y: box.y},
			botleft = {x : box.x, y: box.y + box.h},
			botright = {x : box.x + box.w, y: box.y + box.h};
		return (
			lineLine(a, b, topleft, topright) ||//top
			lineLine(a, b, botleft, botright) ||//bot
			lineLine(a, b, topright, botright) ||//right
			lineLine(a, b, topleft, botleft)//left
		);
	}
	
	
	/** @param {Box} box1
		@param {Box} box2 
		@param {Vector} offset */
	function boxBoxMoving(box1, box2, offset){
		
	}
	
	
	return {
		boxBox:boxBox,
		boxBoxMoving:boxBoxMoving
	}
})