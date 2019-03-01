define(["utils/index"
        , "taylor/taylor"],
    function (Utils, Player) {
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

        class Controller {
            constructor() {
                this.buffer = [];
                
                this.keymap = {
                    "up": "ArrowUp",
                    "down": "ArrowDown",
                    "left": "ArrowLeft",
                    "right": "ArrowRight",
                    "A": "z",
                    "B": "x"
                }
                this.buttonState = {
                    "up": false,
                    "down": false,
                    "left": false,
                    "right": false,
                    "A": false,
                    "B": false
                }
                this.lastInput = null;
            }
            onkeydown(event) {
                let km = this.keymap;
                for(var button in km){
                    let key = km[button];
                    if(key==event.key){
                        this.setInput(button, true);
                    }
                }
            }
            onkeyup(event) {
                let km = this.keymap;
                for(var button in km){
                    let key = km[button];
                    if(key==event.key){
                        this.setInput(button, false);
                    }
                }
            }
            setInput(key, pressed) {
                this.buttonState[key] = pressed;
            }
            update(){
                let ks = this.buttonState;
                let frameInput = {
                    x: +ks["right"]-ks["left"],
                    y: +ks["down"]-ks["up"],
                    A: ks["A"],
                    B: ks["B"]
                };
                this.lastInput = frameInput;
                this.buffer.push(frameInput);
            }
        }

        class Game {
            constructor() {
                this.controller = new Controller();
                this.world = {
                    blocks: [new Rect(24, 24, 8, 8)],
                    player: new Player(8, 8),
                }
                this.world.player.init();
                let canvas = Dom.create(
                    `<canvas 
                        width = 768, 
                        height = 512 
                        style = 'background-color:black'
                        tabindex = -1
                    ></canvas>`
                );

                canvas.addEventListener("keydown", (event) => this.controller.onkeydown(event));
                canvas.addEventListener("keyup", (event) => this.controller.onkeyup(event));

                this.rendering = {
                    canvas: canvas,
                    ctx: canvas.getContext("2d"),
                };
                document.body.appendChild(canvas);

            }

            run() {
                this.world.player.init();
                new Loop.RAF((dt) => this.update(dt * 0.001), () => this.render(), 60).start();

            }

            handleInput() {
                let input = this.controller.lastInput;
                let p = this.world.player;
                if(input.y<0){p.command("up");}
                if(input.y>0){p.command("down");}
                if(input.y==0){p.command("neutralV");}
                if(input.x<0){p.command("left");}
                if(input.x>0){p.command("right");}
                if(input.x==0){p.command("neutralH");}
                
            }

            update(dt) {
                this.controller.update();
                this.handleInput();
                let p = this.world.player;
                p.update(dt);
                let oldpos = p.pos;
                p.pos.x += (p.velocity.x+p.frameVelocity.x) * dt;
                p.pos.y += (p.velocity.y+p.frameVelocity.y) * dt;
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
