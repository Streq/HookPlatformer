import {Math2} from "../../../utils/index.js"
import COLORS_BEHAVIOUR from "./colors_behaviour.js"
import * as Collision from "./../../../collision/index.js"
export default class Player {
	constructor(color, x, y) {
		this.color = color;
		this.size = {x:0.5, y:0.5};
		this.position = {x:x, y:y};
		this.velocity = {x:0, y:0};
		this.ground = false;
		this.behaviour = 
		{	jump: false
		,	change: false
		,	move: 
			{	x: 0
			,	y: 0
			}
		}
	}

	update(dt, gameState) {
		let cb = COLORS_BEHAVIOUR[this.color];
		
		
		//move
		this.velocity.x += cb.hSpeed * this.behaviour.move.x * dt;
		this.velocity.y += cb.vSpeed * this.behaviour.move.y * dt;

		//fall
		this.velocity.x += cb.hGravity * dt;
		this.velocity.y += cb.vGravity * dt;
		
		//damping
		let damp_factor = Math2.approach(1,0,dt * 1);
		this.velocity.x *= damp_factor;
		this.velocity.y *= damp_factor;
	

		if (this.ground){
			if(this.behaviour.jump) {
				//jump
				this.velocity.x -= cb.hGround * cb.jumpSpeed;
				this.velocity.y -= cb.vGround * cb.jumpSpeed;
			} else{
				//friction
				this.velocity.x = Math2.approach(this.velocity.x, 0, Math.abs(cb.vGround * cb.friction * dt));
				this.velocity.y = Math2.approach(this.velocity.y, 0, Math.abs(cb.hGround * cb.friction * dt));
			}
		}
		
		//changeColors
		if (this.behaviour.change) {
			changeColorFromBackground(this, gameState.static_grid);
		}

		this.ground = false;
	}

}
function changeColorFromBackground(player,grid){
	let ret = [];
	Collision.rasterizeBox(player.position.x,player.position.y,player.size.x,player.size.y,(i,j)=>{
		ret.push(grid.get(i,j));
	});
	if(ret.length){
		let col = ret[0];
		let homogeneous = ret.findIndex(e=>(e !== col)) === -1;
		if(homogeneous){
			player.color = colorFunction(player.color, col);
		}
	}
}


function colorOverwrite(a,b){
	return b;
}

function colorComplement(a,b){
	let comp = b^a;
	if(a+comp != b)
		return a;	
	return comp;
}

//rgb must be a number in 0xrrggbb format
function complementColor(_0xRRGGBB){
	var complement = 0xffffff ^ _0xRRGGBB;
}



var colorFunction = colorComplement;
