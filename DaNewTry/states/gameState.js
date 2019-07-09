const COLORS = [
			"#000",
			"#00f",
			"#0f0",
			"#0ff",
			"#f00",
			"#f0f",
			"#ff0",
			"#fff",
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
	null,
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
	null,
	{
		vSpeed: 10,
		hSpeed: 10,
		vGravity: 5,
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
			changeColorFromBackground(this, gameState.grid);
		}
	}

}

class GameState {
	constructor(levelData) {
		this.grid = new SingleArrayGrid(levelData.width);
		this.grid.grid = levelData.grid;
		this.spawn = levelData.spawnPoint;
		this.spawnCol = levelData.initCol;
	}

	update(dt) {
		dt *= 0.001;
		//update entity behaviour
		//player.update(dt);
		let pj = this.player;
		//move towards mouse
		let inp = Input.getFrameInput();
		let prev = Input.previous || {};
		let vv = (+!!inp.D - !!inp.U);
		let hv = (+!!inp.R - !!inp.L);



		let down = 1;
		if (pj.color == 1) down *= -1;

		pj.behaviour.jump = inp.a && !prev.a;
		pj.behaviour.change = inp.b && !prev.b;
		pj.behaviour.move = {
			x: hv,
			y: vv
		};

		Input.previous = inp;

		pj.update(dt, this);
		//update world
		this.physicsStep(dt);

	}

	render(ctx) {
		let size = gs;
		let grid = this.grid;
		let player = this.player;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.renderGrid(grid, size, ctx);
		ctx.fillStyle = COLORS[player.color];
		ctx.fillRect(player.x * size, player.y * size, player.w * size, player.h * size);

	}
	renderGrid(grid, size, ctx) {
		let player = this.player;
		grid.forEach((tile, x, y) => {

			/**if(tile == player.color){/**/
			ctx.fillStyle = COLORS[tile];
			ctx.fillRect(x * size, y * size, size, size);

			/**}else if(colorComplement(player.color,tile)!=player.color){
				ctx.fillStyle = COLORS[tile];
				ctx.fillRect(x*size,y*size,size,size);
				ctx.fillStyle = "#000";
				ctx.fillRect(x*size+4,y*size+4,size-8,size-8);

			} else {
				ctx.fillStyle = COLORS[tile];
				ctx.fillRect(x*size,y*size,size,size);
				ctx.fillStyle = "#000";
				ctx.fillRect(x*size+0.5,y*size+0.5,size-1,size-1);
			}/**/
		});
	}

	step(e, dx, dy) {
		let x0 = e.x,
			y0 = e.y,
			x1 = e.x + dx,
			y1 = e.y + dy,
			w = e.w,
			h = e.h;
		let grid = this.grid;
		let col;
		do {
			col = Collision.boxGridSubstep(x0, y0, w, h, x1, y1, (i, j) => {
				let g = grid.get(i, j);
				if (g === e.color || i > 9 || j > 9 || i < 0 || j < 0) {
					return [i, j];
				}
			});
			if (col.side) {
				let color = e.color;
				let cb = COLORS_BEHAVIOUR[color];
				if (cb.hGround == Math.sign(col.side.x) || cb.vGround == Math.sign(col.side.y)) {
					e.ground = true;
				}
				if (col.side.x) {
					x1 = col.x;
					e.vx = 0;
				}
				if (col.side.y) {
					y1 = col.y;
					e.vy = 0;
				}
			}
			x0 = col.x;
			y0 = col.y;
		} while (x0 != x1 || y0 != y1);
		e.x = x1;
		e.y = y1;
	}
	physicsStep(dt) {
		let e = this.player;
		e.ground = false;
		this.step(e, e.vx * dt, e.vy * dt);

	}
	init() {
		this.player = new Player(this.spawn.x, this.spawn.y, this.spawnCol);
	}
}
