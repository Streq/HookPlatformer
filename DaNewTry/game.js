////////////////////////////////////////////////////////////////
//GAME
////////////////////////////////////////////////////////////////
var Game = (() => {
    const TYPES = {
        NONE : 0,
        BLOCK : 1,
        LAVA : 2,
        GOAL : 3
    };
    const COLORS = [
        "#0000",
        "#888",
        "#f00",
        "#00f"
    ];
    
	class Player {
		constructor(x,y){
			this.x = x;
			this.y = y;
			
			this.h = 8;
			this.w = 8;
			
			this.vx = 0;
			this.vy = 0;
		}
	}
	
	const atomicDistance = 1;
	
	
	function moveAABBinGrid(b, dx, dy, grid, ts){
		//front vertex
		let fvx,
			fvy,
		//next tile
			ntx,
			nty,
		//distance
			distx,
			disty;
			
		if(dx<0){
			fvx = b.x;
			ntx = Math.floor(fvx/ts)-1;
		} else {
			fvx = b.x + b.w;
			ntx = Math.ceil(fvx/ts);
		}
		distx = ntx*ts - fvx;
		
		if(dy<0){
			fvy = b.y;
			nty = Math.floor(fvy/ts)-1;
		} else {
			fvy = b.y + b.h;
			nty = Math.ceil(fvy/ts);
		}
		disty = nty*ts - fvy;
		
		//find next grid axis
		let timeDistx = dx ? distx/dx : Infinity;
		let timeDisty = dy ? disty/dy : Infinity;
		
		
	}
	
	return {
		init() {
			this.world = {
				player: null,
				entities: [],
				staticGrid: new SingleArrayGrid(32),
				gridSize: 8
			};
			
			//world setup
			let g = this.world.staticGrid;
			g.set(0, 5, TYPES.BLOCK);
			g.set(1, 5, TYPES.BLOCK);
			g.set(5, 5, TYPES.BLOCK);
			g.set(6, 5, TYPES.BLOCK);
			g.set(7, 5, TYPES.BLOCK);
			g.set(8, 5, TYPES.BLOCK);
			g.set(9, 5, TYPES.BLOCK);
			g.set(10, 5, TYPES.BLOCK);
			g.set(15, 5, TYPES.GOAL);
			for(var i = 0; i < 20; ++i){
				g.set(i, 31, TYPES.LAVA);
			}
			
			for(var i = 0; i < 20; ++i){
				g.set(20, i, TYPES.BLOCK);
			}
			
			for(var i = 0; i < 20; ++i){
				g.set(0, i, TYPES.BLOCK);
			}
			
			for(var i = 0; i < 20; ++i){
				g.set(i, 20, TYPES.BLOCK);
			}
			
			for(var i = 0; i < 20; ++i){
				g.set(i, 0, TYPES.BLOCK);
			}
			
			
			this.player=new Player(5*8,2*8);
			
		},

		update(dt, input) {
			let p = this.player,
				world = this.world;
			//input
			let dir = {
				x: 0 + (input.R || 0) - (input.L || 0),
				y: 0 + (input.D || 0) - (input.U || 0)
			}
			if (dir.x && dir.y) {
				dir.x *= Math.SQRT1_2;
				dir.y *= Math.SQRT1_2;
			}
			dir.x*=4;
			dir.y*=4;
			
			//set velocities
			p.vx = dir.x;
			if(dir.y)p.vy = dir.y;
			
			p.vy += dt*10;
			
			
			//check collision with lava
			let gs = world.gridSize;
			world.staticGrid.forEach((tile,x,y)=>{
				let x1 = x*gs;
				let y1 = y*gs;
				let w1 = gs;
				let h1 = gs;
				if(tile == TYPES.LAVA){
					if(Collision.boxBoxMoving(p.x, p.y, p.w, p.h, x1, y1, gs, gs, p.vx, p.vy)){
						this.die();
					}
				}
			});
			
			if(p.vy>0){
				let dy = p.vy;
				let ys = p.y+p.h;
				let y0 = Math2.floor(ys/gs);
				let y1 = Math2.floor((ys+dy)/gs);
				
				let x0a = Math.floor(p.x/gs);
				let x0b = Math2.floor((p.x+p.w)/gs);
				
				let dist = y1 - y0;
				
				let col = false;
				for(let j = y0; j <= y1; ++j){
					for(let i = x0a; i <= x0b; ++i){
						if(this.world.staticGrid.get(i,j)==TYPES.BLOCK){
							col = true;
							p.vy = 0;
							p.y = j*gs-p.h;
						}
						if(col)break;
					}
					if(col)break;
				}
				
			}
			if(p.vy<0){
				let dy = p.vy;
				let ys = p.y;
				let y0 = Math2.floor(ys/gs);
				let y1 = Math2.floor((ys+dy)/gs);
				
				let x0a = Math.floor(p.x/gs);
				let x0b = Math2.floor((p.x+p.w)/gs);
				
				let dist = -y1 + y0;
				
				let col = false;
				for(let i = y0; i >= y1; --i){
					for(let j = x0a; j <= x0b; ++j){
						if(this.world.staticGrid.get(j,i)==TYPES.BLOCK){
							col = true;
							p.vy = 0;
							p.y = (i+1)*gs;
						
						}
						if(col)break;
					}
					if(col)break;
				}
				
			}
			p.y+=p.vy;
			
			if(p.vx>0){
				let dy = p.vx;
				let ys = p.x+p.w;
				let y0 = Math2.floor(ys/gs);
				let y1 = Math2.floor((ys+dy)/gs);
				
				let x0a = Math.floor(p.y/gs);
				let x0b = Math2.floor((p.y+p.h)/gs);
				
				let dist = y1 - y0;
				
				let col = false;
				for(let i = y0; i <= y1; ++i){
					for(let j = x0a; j <= x0b; ++j){
						if(this.world.staticGrid.get(i,j)==TYPES.BLOCK){
							col = true;
							p.vx = 0;
							p.x = i*gs-p.w;
						
						}
						if(col)break;
					}
					if(col)break;
				}
				
			}
			
			if(p.vx<0){
				let dy = p.vx;
				let ys = p.x;
				let y0 = Math2.floor(ys/gs);
				let y1 = Math2.floor((ys+dy)/gs);
				
				let x0a = Math.floor(p.y/gs);
				let x0b = Math2.floor((p.y+p.h)/gs);
				
				let dist = -y1 + y0;
				
				let col = false;
				for(let i = y0; i >= y1; --i){
					for(let j = x0a; j <= x0b; ++j){
						if(this.world.staticGrid.get(i,j)==TYPES.BLOCK){
							col = true;
							p.vx = 0;
							p.x = (i+1)*gs;
						
						}
						if(col)break;
					}
					if(col)break;
				}
				
			}
			//move
			p.x+=p.vx;
			
		},
		die(){
			this.player = new Player(5*8,2*8);
		},
		
		render(ctx) {
			let p = this.player;
			//render player
			ctx.clearRect(0, 0, CONSTS.WIDTH, CONSTS.WIDTH);
			ctx.fillStyle = "#fff";
			ctx.fillRect(p.x, p.y, 8, 8);

			//render grid
			let grid = this.world.staticGrid;
			let s = this.world.gridSize;
			grid.forEach((tile,x,y)=>{
                ctx.fillStyle = COLORS[tile];
                ctx.fillRect(x * s, y * s, s, s);
            });
			

		},
		
		solveCollisionsGrid(){
			let p = this.player,
				dx = p.vx,
				dy = p.vy,
				world = this.world,
				gs = world.gridSize;
			
			while(dx!=0 && dy!=0){
				//get side of collision
				
			}
		}
		
	};
	
})();