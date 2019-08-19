import {SingleArrayGrid} from "../../utils/grid.js"
import * as Collision from "../../collision/index.js"
import {Math2} from "../../utils/index.js"
import {TILE_SIZE as gs} from "../../config/index.js"



const COLORS = [
	"#000000",
	"#0000ff",
	"#00ff00",
	"#00ffff",
	"#ff0000",
	"#ff00ff",
	"#ffff00",
	"#ffffff",
];
const COLORS_BEHAVIOUR = [
	null,
	{
		vSpeed: 0,
		hSpeed: 10,
		vGravity: -5,
		hGravity: 0,
		vGround: -1,
		hGround: 0,
		jumpSpeed: 5,
		friction:2,
	},
	{
		vSpeed: 0,
		hSpeed: 10,
		vGravity: 5,
		hGravity: 0,
		vGround: 1,
		hGround: 0,
		jumpSpeed: 5,
		friction:2,
	},
	{
		vSpeed: 10,
		hSpeed: 10,
		vGravity: 0,
		hGravity: 0,
		vGround: 1,
		hGround: 0,
		jumpSpeed: 5,
		friction:2,
	},
	{
		vSpeed: 10,
		hSpeed: 0,
		vGravity: 0,
		hGravity: -5,
		vGround: 0,
		hGround: -1,
		jumpSpeed: 5,
		friction:2,
	},
	{
		vSpeed: 10,
		hSpeed: 10,
		vGravity: 0,
		hGravity: 0,
		vGround: 1,
		hGround: 0,
		jumpSpeed: 5,
		friction:2,
	},
	{
		vSpeed: 10,
		hSpeed: 10,
		vGravity: 0,
		hGravity: 0,
		vGround: 1,
		hGround: 0,
		jumpSpeed: 5,
		friction:2,
	},
	null,
];

function colorOverwrite(a,b){
	return b;
}

function colorComplement(a,b){
	let comp = b^a;
	if(a+comp != b)
		return a;	
	return comp;
}

var colorFunction = colorComplement;



function changeColorFromBackground(player,grid){
	let ret = [];
	Collision.rasterizeBox(player.x,player.y,player.w,player.h,(i,j)=>{
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

function isOutOfColorToBe(player){
	let ret = true;
	Collision.rasterizeBox(player.x,player.y,player.w,player.h,(i,j)=>{
		if(grid.get(i,j)===player.colorToBe) ret = false;
	});
	return ret;
}



class MovingTile {
	constructor(color, x, y, states) {
		this.color = color;
		this.x = x;
		this.y = y;
		this.states = states;
		this.index = -1;
	}
	
	nextState(){
		return this.state = Object.assign({},this.states[(++this.index) % this.states.length]);
	}
	
	update(dt, gameState) {
		let s = this.state || this.nextState();
		if(s.lag>0){
			s.lag -= dt;
		}else if(this.x!=s.goal.x || this.y!=s.goal.y){
			let d = s.speed*dt;
			this.x0 = this.x,
			this.y0 = this.y;
			
			this.x = Math2.approach(this.x, s.goal.x, d);
			this.y = Math2.approach(this.y, s.goal.y, d);
			
			
		}else{
			this.nextState();
		}
	}
}

class Player {
	constructor(color, x, y) {
		this.color = color;
		this.colorToBe = color;
		this.w = 0.5;
		this.h = 0.5;


		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;


		this.behaviour = {
			jump: false,
			change: false,
			move: {
				x: 0,
				y: 0
			}
		}

		this.ground = false;
	}

	update(dt, gameState) {
		let cb = COLORS_BEHAVIOUR[this.color];
		//move
		this.vx += cb.hSpeed * this.behaviour.move.x * dt;
		this.vy += cb.vSpeed * this.behaviour.move.y * dt;
		
		//fall
		this.vy += cb.vGravity * dt;
		this.vx += cb.hGravity * dt;

		//damping
		this.vx *= 1 - dt * 1;
		this.vy *= 1 - dt * 1;

		if (this.ground){
			if(this.behaviour.jump) {
				//jump
				this.vx -= cb.hGround * cb.jumpSpeed;
				this.vy -= cb.vGround * cb.jumpSpeed;
			} else{
				//friction
				this.vx = Math2.approach(this.vx, 0, Math.abs(cb.vGround * cb.friction * dt));
				this.vy = Math2.approach(this.vy, 0, Math.abs(cb.hGround * cb.friction * dt));
			
			}
		}
		
		//changeColors
		if (this.behaviour.change) {
			changeColorFromBackground(this, gameState.frameGrid);
		}
	}

}

export default class GameState {
	constructor(levelData) {
		this.grid = new SingleArrayGrid(levelData.static_grid.width);
		this.grid.grid = levelData.static_grid.grid;
		this.width=levelData.static_grid.width;
		this.height=levelData.static_grid.height;
		//this.movingTilesSpawn = levelData.movingTiles;
		this.spawn = levelData.spawn_point;
		this.spawnCol = levelData.spawn_point.color;
	}

	update(stack, dt, inp) {
		dt *= 0.001;
		let pj = this.player;
		//set player state from input
		let prev = this.previous_input_frame || {};
		let vv = (+!!inp.D - !!inp.U);
		let hv = (+!!inp.R - !!inp.L);

		
		let frameGrid = this.frameGrid = new SingleArrayGrid(this.grid.width);
		frameGrid.grid = [...this.grid.grid];
		

		let down = 1;
		if (pj.color == 1) down *= -1;

		pj.behaviour.jump = inp.a && !prev.a;
		pj.behaviour.change = inp.b && !prev.b;
		pj.behaviour.move = {
			x: hv,
			y: vv
		};

		this.previous_input_frame = inp;

		pj.update(dt, this);
		let mt = this.movingTiles || [];
		mt.forEach(e=>e.update(dt,this));
		mt.forEach(e=>{
			Collision.rasterizeBox(e.x,e.y,1,1,(x,y)=>{
				frameGrid.set(x,y,e.color);
			});
		});
		
		//update world
		this.physicsStep(dt);

	}

	render(ctx) {
		let size = gs;
		let grid = this.frameGrid;
		
		let tiles = this.movingTiles;
		let player = this.player;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		renderGrid(grid, size, ctx, player.color);
		renderTiles(tiles, size, ctx);
		renderPlayer(player, size, ctx);
	}
	
	step(e, dx, dy) {
		let x0 = e.x,
			y0 = e.y,
			x1 = e.x + dx,
			y1 = e.y + dy,
			w = e.w,
			h = e.h;
		let grid = this.frameGrid;
		let col;
		do {
			let cols = this.getStaticCollisions(e,dx,dy);
			if(cols.length){
				col = cols[0];
				
				let m = dy / dx;
				let n = dx / dy;
				
				if (col.side) {
					let color = e.color;
					let cb = COLORS_BEHAVIOUR[color];
					if (cb.hGround == Math.sign(col.side.x) || cb.vGround == Math.sign(col.side.y)) {
						e.ground = true;
					}
					if (col.side.x) {
						if(col.side.x<0){
							x1 = col.tile.x + 1;
						}else{
							x1 = col.tile.x - w;
						}
						
						y0 = y0 + m * (x1 - x0);
						e.vx = 0;
						dx = 0;
					}
					if (col.side.y) {
						if(col.side.y<0){
							y1 = col.tile.y + 1;
						}else{
							y1 = col.tile.y - h;
						}
						
						x0 = x0 + n * (y1 - y0);
						e.vy = 0;
						dy = 0;
					}
				}
			}else{
				x0 = x1;
				y0 = y1;
			}
		} while (x0 != x1 || y0 != y1);
		e.x = x1;
		e.y = y1;
	}
	getStaticCollisions(e,dx,dy){
		let collisions = [],
			x0 = e.x,
			y0 = e.y,
			x1 = e.x + dx,
			y1 = e.y + dy,
			w = e.w,
			h = e.h,
			grid = this.frameGrid;
		const width = this.width;
		const height = this.height;
		Collision.rasterizeBoxMoving(x0, y0, w, h, x1, y1, (i, j, sx, sy, x, y) => {
			let g = grid.get(i, j);
			if (g === e.color || i < 0 || j < 0 || i > width-1 || j > height-1 ) {
				collisions.push({
					tile:{x:i,y:j},
					side:{x:sx,y:sy},
				});
			}
		});
		return collisions;
	}
	getDynamicCollisions(e,dx,dy){
		let sameColor = [];
		let diffColor = [];
		
		this.movingTiles.forEach(t=>{
			if(t.color == e.color){
				//TODO
			}
		})
	}
	physicsStep(dt) {
		let e = this.player;
		e.ground = false;
		this.step(e, e.vx * dt, e.vy * dt);

	}
	init() {
		this.player = new Player(this.spawnCol,this.spawn.x, this.spawn.y);
		this.movingTiles = [];
		if(this.movingTilesSpawn){
			this.movingTilesSpawn.forEach(e=>{
				this.movingTiles.push(new MovingTile(e.color, e.x, e.y, e.states));
			});
		}
	}
}

function renderPlayer(player, size, ctx){
	ctx.fillStyle = COLORS[player.color];
	ctx.fillRect(player.x * size, player.y * size, player.w * size, player.h * size);
}
function renderKey(k, size, ctx){
	let x = k.x * size;
	let y = k.y * size;
	let w = k.w * size;
	let h = k.h * size;
	ctx.fillStyle = COLORS[k.color];
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fill();
	ctx.closePath();
}
function renderKeyHole(k, size, ctx){
	let x = k.x * size;
	let y = k.y * size;
	let w = k.w * size;
	let h = k.h * size;
	ctx.strokeStyle = COLORS[k.color];
	ctx.beginPath();
	ctx.lineWidth=2;
	ctx.rect(x, y, w, h);
	ctx.stroke();
	ctx.closePath();
}
function renderGrid(grid, size, ctx) {
	grid && grid.forEach((tile, x, y) => {
		ctx.fillStyle = COLORS[tile];
		ctx.fillRect(x * size, y * size, size, size);
	});
}

function renderTiles(grid, size, ctx) {
	grid && grid.forEach((t) => {
		ctx.strokeStyle = Color.complement(COLORS[t.color]);
		ctx.strokeRect(t.x * size, t.y * size, size, size);
	});
}
function renderGridSolid(grid, size, ctx, color) {
	grid.forEach((tile, x, y) => {

		if(tile == color){
		ctx.fillStyle = COLORS[tile];
		ctx.fillRect(x * size, y * size, size, size);

		} else if(colorComplement(color,tile)!=color){
			ctx.fillStyle = COLORS[tile];
			ctx.fillRect(x*size,y*size,size,size);
			ctx.fillStyle = "#000";
			ctx.fillRect(x*size+4,y*size+4,size-8,size-8);
		} else {
			ctx.fillStyle = COLORS[tile];
			ctx.fillRect(x*size,y*size,size,size);
			ctx.fillStyle = "#000";
			ctx.fillRect(x*size+0.5,y*size+0.5,size-1,size-1);
		}
	});
}
//rgb must be a number in 0xrrggbb format
function complementColor(_0xRRGGBB){
	var complement = 0xffffff ^ _0xRRGGBB;
}
