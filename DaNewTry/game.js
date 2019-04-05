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
    
	return {
		init() {
			this.world = {
				player: null,
				entities: [],
				staticGrid: new SingleArrayGrid(32),
				gridSize: 8
			};
			let setGrid = (x, y, val) => {
				let g = this.world.staticGrid;
				g.set(x,y,val)
			}
			setGrid(0, 5, TYPES.BLOCK);
			setGrid(5, 5, TYPES.BLOCK);
			setGrid(7, 5, TYPES.BLOCK);
			setGrid(9, 5, TYPES.BLOCK);
			setGrid(15, 5, TYPES.GOAL);
			setGrid(10, 9, TYPES.LAVA);

			this.x = 0;
			this.y = 0;
			this.vx = 0;
			this.vy = 0;
		},

		update(dt, input) {
			let dir = {
				x: 0 + (input.R || 0) - (input.L || 0),
				y: 0 + (input.D || 0) - (input.U || 0)
			}
			if (dir.x && dir.y) {
				dir.x *= Math.SQRT1_2;
				dir.y *= Math.SQRT1_2;
			}
			dir.x*=10;
			dir.y*=10;
			
			this.vx = dir.x;
			if(dir.y)this.vy = dir.y;
			
			this.vy += dt*10;
			
			
			this.x+=this.vx;
			this.y+=this.vy;
		},

		render(ctx) {

			//render player
			ctx.clearRect(0, 0, CONSTS.WIDTH, CONSTS.WIDTH);
			ctx.fillStyle = "#fff";
			ctx.fillRect(this.x, this.y, 8, 8);

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