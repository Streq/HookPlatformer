define( [ "utils/index"
        , "taylor/taylor"
	    , "input"
		, "physics/collision"],
    function (Utils, Player, Input, Collision) {
        let Vector = Utils.Vector,
            Dom = Utils.Dom,
            Loop = Utils.Loop;


        class Rect {
            constructor(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            }
        }
		
        class Game {
            constructor() {
                this.input = new Input.UserInputSource({
					keymap:{
						"U": "ArrowUp",
						"D": "ArrowDown",
						"L": "ArrowLeft",
						"R": "ArrowRight",

						"a": "z",
						"b": "x",
						"c": "c",
						"x": "a",
						"y": "s",
						"z": "d"
					}
                });
				
				let canvas = Dom.create(
                    `<canvas 
                        width = 768, 
                        height = 512 
                        style = 'background-color:black'
                        tabindex = -1
                    ></canvas>`
                );
				this.rendering = {
                    canvas: canvas,
                    ctx: canvas.getContext("2d"),
                };
                document.body.appendChild(canvas);
				this.input.listen(canvas);
                
				this.world = {
                    blocks: [
						new Rect(24, 24, 8, 8),
						new Rect(8, 128, 8, 8)
					],
                    player: new Player(8, 8),
                }
                this.world.player.init();
                
            }

            run() {
                this.world.player.init();
                new Loop.RAF((dt) => this.update(dt * 0.001), () => this.render(), 60).start();
            }
			
            handleInput() {
                let input = this.input.getFrameInput();
                let dir = {
					x: +(input.R||0)-(input.L||0),
					y: +(input.D||0)-(input.U||0)
				}
				let p = this.world.player;
                if(dir.y<0){p.command("up");}
                if(dir.y>0){p.command("down");}
                if(dir.y==0){p.command("neutralV");}
                if(dir.x<0){p.command("left");}
                if(dir.x>0){p.command("right");}
                if(dir.x==0){p.command("neutralH");}
                if(input.A){p.command("A");}
                if(input.B){p.command("B");}
            }

            update(dt) {
                this.handleInput();
                let w = this.world;
				let p = w.player;
                let bs = w.blocks;
				
				p.update(dt);
                let oldpos = p.pos;
                
				p.pos.x += (p.velocity.x + p.frameVelocity.x) * dt;
                p.pos.y += (p.velocity.y + p.frameVelocity.y) * dt;
				
				let s = 8;
				let pBox = new Rect(p.pos.x, p.pos.y, s, s);
				
				w.blocks.forEach((b)=>{
					let tocan = Collision.boxBox(b,pBox);
					
					if(tocan){
						p.velocity.y = 0;
						p.pos.y = b.y - s;
					}
				});
				
            }
            render() {
                /** @type {CanvasRenderingContext2D} */
                var ctx = this.rendering.ctx;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                this.renderWorld(ctx);
            }

            renderWorld(ctx) {
                ctx.fillStyle = "blue";
                this.world.blocks.forEach((e) => {
                    ctx.fillRect(e.x, e.y, e.w, e.h);
                });

                ctx.fillStyle = "green";
                let e = this.world.player
                let s = 8;
                ctx.fillRect(e.pos.x, e.pos.y, s, s);

            }
        }
        return Game;

    });
