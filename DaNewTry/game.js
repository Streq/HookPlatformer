////////////////////////////////////////////////////////////////
//GAME
////////////////////////////////////////////////////////////////
var Game = (() => {
	return {
		init() {
			this.world = {
				player: null,
				entities: [],
				staticGrid: [],
				gridSize: 8
			};
			let setGrid = (x, y, val) => {
				let g = this.world.staticGrid;
				let row = g[y] = g[y] || [];
				row[x] = val;
			}
			setGrid(0, 5, true);
			setGrid(5, 5, true);
			setGrid(7, 5, true);
			setGrid(9, 5, true);
			setGrid(10, 5, true);

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
			ctx.fillStyle = "#0f0";
			ctx.fillRect(this.x, this.y, 8, 8);

			//render grid
			ctx.fillStyle = "#00f";
			let grid = this.world.staticGrid;
			let s = this.world.gridSize;
			grid.forEach((row, j) => {
				if (!row) return;
				row.forEach((tile, i) => {
					if (!tile) return;
					ctx.fillRect(i * s, j * s, s, s);
				})
			});

		}
	};
})();