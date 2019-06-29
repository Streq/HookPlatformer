class GridCollisionWorld{

	constructor(){
		this.grid = new DoubleArrayGrid();
		this.objects = [];
	}

	
	checkGridCollision(x, y, w, h, dx, dy, filter){
		let i0, j0;
		return Collision.rasterizeBoxMoving(x, y, w, h, x+dx, y+dy,
			(i, j)=>{
				if(i0==null){
					i0=i; j0=j;
				}
				let tile = this.grid.get(i,j);
				let passed = tile != null && (!filter || filter(tile));
				if(passed){
					let side = Collision.boxBoxSideOfCollision(x,y,w,h,i,j,1,1,dx,dy);
					let sx = side.x;//i-i0;
					let sy = side.y;//j-j0;
					let x1, y1;
					if(sx){
						x1 = sx>0 ? (i-w) : (i+1);
						y1 = y + dy/dx*(x1-x);
					}else{
						y1 = sy>0 ? (j-h) : (j+1);
						x1 = x + dx/dy*(y1-y);
					}

					return {
						tile: tile,
						sidex: sx,
						sidey: sy,
						x: x1,
						y: y1
					}
				}

				i0=i; j0=j;
				return null;

			}
		);
	}
	
	
	
	
}
