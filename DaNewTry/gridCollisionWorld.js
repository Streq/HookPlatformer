class GridCollisionWorld{

	constructor(){
		this.grid = new DoubleArrayGrid();
		this.objects = [];
	}

	step(dt){
		this.objects.forEach((e)=>{
			let step = {
				dx : e.vx*dt,
				dy : e.vy*dt
			}
			while(step.dx && step.dy){
				/*
					collision = {
						tile,
						x,		y,
						sidex,	sidey
					}
				*/
				let collision = this.checkGridCollision(e.x, e.y, e.w, e.h, step.dx, step.dy);
				if(collision){
					//handle collision
					switch(tile){
						default:{
							step.dx = !sidex && (step.dx - collision.x + e.x);
							step.dy = !sidey && (step.dy - collision.y + e.y);
							e.x = collision.x;
							e.y = collision.y;
						}break;
					}
				}else{
					e.x += step.dx;
					e.y += step.dy;
					step.dx = 0;
					step.dy = 0;
				}
			}
		});
	}
	
	checkGridCollision(x, y, w, h, dx, dy){
			let i0, j0;
			Collision.rasterizeBoxMoving(
				(i, j)=>{
					if(i0==null){
						i0=i; j0=j;
					}
					let tile = this.grid.get(i,j);
					if(tile){
						let sx = i-i0;
						let sy = j-j0;
						return {
							tile: tile,
							sidex: sx,
							sidey: sy,
							x: sx>0 ? (i-w) : i,
							y: sy>0 ? (j-h) : j
						}
					};
					
					i0=i; j0=j;
					return null;
					
				}
			);
	}
}
