define( [ "utils/index"
        , "taylor/taylor"
	    , "input"],
    function (Utils, Player, Input) {
        let Vector = Utils.Vector,
            Dom = Utils.Dom,
            Loop = Utils.Loop;


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
                    blocks: [new Rect(24, 24, 8, 8)],
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
                
				let p = this.world.player;
                p.update(dt);
                let oldpos = p.pos;
                
				p.pos.x += (p.velocity.x + p.frameVelocity.x) * dt;
                p.pos.y += (p.velocity.y + p.frameVelocity.y) * dt;
				
				
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
                    ctx.fillRect(e.x - e.hw, e.y - e.hh, e.hw * 2, e.hh * 2);
                });

                ctx.fillStyle = "green";
                let e = this.world.player
                let s = 8;
                ctx.fillRect(e.pos.x - s, e.pos.y - s, s * 2, s * 2);

            }
        }
        return Game;

    });
