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
			for(var i = 0; i < 32; ++i){
				g.set(i, 31, TYPES.LAVA);
			}
			
			this.player=new Player(0,0);
			
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
			dir.x*=8;
			dir.y*=8;
			
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
			
			//move
			p.x+=p.vx;
			p.y+=p.vy;
			
		},
		
		die(){
			this.player = new Player(0,0);
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
			

		}
	};
})();