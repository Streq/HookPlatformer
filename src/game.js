
define(["utils/dom"
       ,"utils/loop"
	   ,"utils/vector"
       ,"taylor/taylor"], 
       function (Dom 
                ,Loop
				,Vector
                ,Player
                ) {
    
    class Rect {
        constructor(x, y, hw, hh) {
            this.x = x;
            this.y = y;
            this.hw = hw;
            this.hh = hh;
        }
    }



    class Game {
        constructor() {
            this.world = {
                blocks: [new Rect(24,24,8,8)],
                player: new Player(8, 8),
            }
			this.world.player.init();
            let canvas = Dom.create(
                `<canvas 
                    width = 768, 
                    height = 512 
                    style='background-color:black'
                ></canvas>`
            );
            this.rendering = {
                canvas:canvas,
                ctx:canvas.getContext("2d"),
            };
            document.body.appendChild(canvas);
            
        }

        run() {
            this.world.player.init();
			new Loop.RAF((dt)=>this.update(dt*0.001),()=>this.render(),60).start();
			
        }
        update(dt) {
			let p = this.world.player;
            p.update(dt);
			let oldpos = p.pos;
			p.pos.x+=p.velocity.x*dt;
			p.pos.y+=p.velocity.y*dt;
        }
        render() {
            /** @type {CanvasRenderingContext2D} */
            var ctx = this.rendering.ctx;
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
			this.renderWorld(ctx);
        }
		
		renderWorld(ctx){
            ctx.fillStyle="blue";
            this.world.blocks.forEach((e) => {
                ctx.fillRect(e.x - e.hw, e.y - e.hh, e.hw*2, e.hh*2);
            });
            
            ctx.fillStyle="green";
            let e = this.world.player
            let s = 8;
            ctx.fillRect(e.pos.x - s, e.pos.y - s, s*2, s*2);
            
		}
    }
    return Game;

});

