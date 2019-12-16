import {SingleArrayGrid} from "../../../utils/grid.js"
import * as Collision from "../../../collision/index.js"
import {Math2} from "../../../utils/index.js"
import {TILE_SIZE} from "../../../config/index.js"
import Player from "./player.js"
import COLORS_BEHAVIOUR from "./colors_behaviour.js"
import MovingGrid from "./moving_grid.js"


const COLORS = [
	"#00000000",
	"#0000ff",
	"#00ff00",
	"#00ffff",
	"#ff0000",
	"#ff00ff",
	"#ffff00",
	"#ffffff",
];




/**
 * @param {Point2d} point
 * @param {Point2d} velocity
 * @param {number} seconds
 * @returns {Point2d}
 */
const getEndPoint = (point, velocity, seconds)=>(
	{	x:	point.x + velocity.x*seconds
	,	y:	point.y + velocity.y*seconds
	}
)
/**
 * @param {Point2d} a
 * @param {Point2d} b
 * @returns {Point2d}
 */
const addPoints = (a, b)=>(
	{	x:	a.x + b.x
	,	y:	a.y + b.y
	}
)





export default class GameState {
	/** @param {LevelDef} levelData */
	constructor(levelData) {
		this.time_since_start = 0;
		
		this.static_grid = new SingleArrayGrid(levelData.static_grid.size.x);
		this.static_grid.grid = levelData.static_grid.grid;
		
		this.width = levelData.static_grid.size.x;
		this.height = levelData.static_grid.size.y;
		//this.movingTilesSpawn = levelData.movingTiles;
		this.spawn = levelData.spawn.position;
		this.spawnCol = levelData.spawn.color;
		this.keys = [];
		
		/** @type {MovingGrid[]}*/
		this.dynamic_grids = [];
		levelData.dynamic_grids && levelData.dynamic_grids.forEach(each => {
			this.dynamic_grids.push(new MovingGrid(each));
		});
		
	}

	update(stack, dt, input){
		let dt_secs = dt * 0.001;
		this.time_since_start += dt;
		this.handleInput(input);
		
		this.updateEntities(dt_secs);
		this.moveDynamicEntities(dt_secs);
	}
	handleInput(input){
		//set player state from input
		let previous_input = this.previous_input_frame || {};
		
		let pj = this.player;
		
		let vertical_orientation = (+!!input.D - !!input.U);
		let horizontal_orientation = (+!!input.R - !!input.L);

		pj.behaviour.move = {x: horizontal_orientation, y: vertical_orientation};
		pj.behaviour.jump = input.a && !previous_input.a;
		pj.behaviour.change = input.b && !previous_input.b;

		this.previous_input_frame = input;
	}
	updateEntities(dt){
		this.player.update(dt, this);
		this.keys.forEach(each => each.update(dt, this));
		this.dynamic_grids.forEach(each => each.update(dt, this));
	}
	moveDynamicEntities(dt){
		this.moveEntityThroughWorld(this.player, dt);
		this.keys.forEach(each=>this.moveEntityThroughWorld(each, dt));
	}
	
	moveEntityThroughWorld(entity, dt){
		this.step(entity, entity.velocity.x * dt, entity.velocity.y * dt);

		/*solve for static grid -> get t of first collision that is not inside a bubble
		solve for dynamic grids -> 
			get t of first collision: 
				same color that is not inside a bubble
				OR
				void color that is inside a same color bubble
		*/
	}

	render(ctx){
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.renderStaticGrid(ctx);
		this.renderDynamicGrids(ctx);
		this.renderPlayer(ctx);
		this.renderKeys(ctx);
	}
	renderStaticGrid(ctx){
		this.static_grid && this.static_grid.forEach((tile, x, y) => {
			ctx.fillStyle = COLORS[tile];
			ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		});
	}
	renderDynamicGrids(ctx){
		this.dynamic_grids.forEach(each=>{
			let {x:posx, y:posy} = each.position;
			each.grid.forEach((tile, x, y) => {
				ctx.fillStyle = COLORS[tile];
				ctx.fillRect((x+posx) * TILE_SIZE, (y+posy) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			})
		});
	}
	renderPlayer(ctx){
		let player = this.player;
		ctx.fillStyle = COLORS[player.color];
		ctx.fillRect
			(	player.position.x*TILE_SIZE
			,	player.position.y*TILE_SIZE
			,	player.size.x*TILE_SIZE
			,	player.size.y*TILE_SIZE
			);
		
	}
	renderKeys(ctx){}
	renderOld(ctx) {
		let size = TILE_SIZE;
		let grid = this.static_grid;
		
		let tiles = this.movingTiles;
		let player = this.player;
		renderGrid(grid, size, ctx, player.color);
		renderTiles(tiles, size, ctx);
		renderPlayer(player, size, ctx);
	}
	
	step(e, dx, dy) {
		let x0 = e.position.x,
			y0 = e.position.y,
			x1 = e.position.x + dx,
			y1 = e.position.y + dy,
			w = e.size.x,
			h = e.size.y;
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
						e.velocity.x = 0;
						dx = 0;
					}
					if (col.side.y) {
						if(col.side.y<0){
							y1 = col.tile.y + 1;
						}else{
							y1 = col.tile.y - h;
						}
						
						x0 = x0 + n * (y1 - y0);
						e.velocity.y = 0;
						dy = 0;
					}
				}
			}else{
				x0 = x1;
				y0 = y1;
			}
		} while (x0 != x1 || y0 != y1);
		e.position.x = x1;
		e.position.y = y1;
	}
	getStaticCollisions(e,dx,dy){
		let collisions = [],
			x0 = e.position.x,
			y0 = e.position.y,
			x1 = e.position.x + dx,
			y1 = e.position.y + dy,
			w = e.size.x,
			h = e.size.y,
			grid = this.static_grid;
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
	
	init() {
		this.player = new Player(this.spawnCol,this.spawn.x, this.spawn.y);
		this.movingTiles = [];
	}
}

function renderPlayer(player, size, ctx){
	ctx.fillStyle = COLORS[player.color];
	ctx.fillRect(player.position.x*size,player.position.y*size,player.size.x*size,player.size.y*size);
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