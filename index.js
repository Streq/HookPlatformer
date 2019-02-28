define(["utils/dom"
       ,"utils/loop"
       ,"taylor/taylor"], 
       function (Dom 
                ,Loop
                ,Player
                ) {
    class Game {
        constructor() {
            this.world = {
                blocks: [new Rect(24,24,8,8)],
                player: new Player(8, 8),
            }
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
            Loop.RAF((dt)=>this.update(dt),()=>this.render(),60);
        }
        update(dt) {
            this.world.player.update(dt);
        }
        render() {
            /** @type {CanvasRenderingContext2D} */
            var ctx = this.rendering.ctx;
            
            ctx.fillStyle="blue";
            this.world.blocks.forEach((e) => {
                ctx.fillRect(e.x - e.hw, e.y - e.hh, e.x + e.hw, e.y + e.hh);
            });
            
            ctx.fillStyle="green";
            let e = this.world.player
            let s = 8;
            ctx.fillRect(e.pos.x - s, e.pos.y - s, e.pos.x + s, e.pos.y + s);
            
        }




    }

    class Rect {
        constructor(x, y, hw, hh) {
            this.x = x;
            this.y = y;
            this.hw = hw;
            this.hh = hh;
        }
    }

    class Vector {
        constructor(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
    }


    
    new Game().render();
    
    return Game;

});