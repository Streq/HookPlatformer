export class DoubleArrayGrid{
    constructor(){
        this.grid = [];
    }
    set(x,y,val){
        let g = this.grid;
        let row = g[y] = g[y] || [];
        row[x] = val;        
    }
    get(x,y){
        let g = this.grid;
        let row = g[y];
        return row && row[x];
        
    }
    forEach(callback){
        let g = this.grid;
        g.forEach((row, i) => row && row.forEach((tile, j) => tile && callback(tile,j,i)));
    }
}

export class SingleArrayGrid{
    constructor(width){
        this.grid = [];
        this.width = width;
    }
    set(x,y,val){
        let index = x + y*this.width;
        this.grid[index] = val;
    }
    get(x,y){
        let index = x + y*this.width;
        return this.grid[index];
    }
    forEach(callback){
        let g = this.grid;
        g.forEach((tile, i) => callback(tile, i%this.width, Math.trunc(i/this.width)));
    }
}
