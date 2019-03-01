define([], function () {
    class Taylor {
        constructor(x, y) {
            this.speed = 100;
            this.jumpspeed = 100;
            this.grounded = true;
            this.pos = {
                x: x || 0,
                y: y || 0
            };
			this.velocity = {
                x: 0,
                y: 0
            };
            this.frameVelocity = {
                x: 0,
                y: 0
            }
            this.dir = 1;
        }
		init(){
			this.setState(Idle);
		}
        setState(State) {
            this.state = new State(this);
        }

        setFacing(dir) {
            this.dir = (dir === "right") - (dir === "left");
        }
        getFacing() {
            let dir = this.dir;
            return (dir == 1) ? "right" : "left";
        }


        command(cmd) {
            this.state.command(cmd);
        }
        update(dt) {
            this.frameVelocity.x = 0;
            this.frameVelocity.y = 0;
            this.state.update(dt);
        }
    }

    class Idle {
        constructor(e) {
            this.entity = e;
        }
        update() {
            let e = this.entity;
            if (!e.grounded) {
                e.setState(Air);
            }
        }
        command(cmd) {
            let e = this.entity;
            switch (cmd) {
                case "left":
                    e.setFacing("left");
                    e.setState(Running);
                    break;
                case "right":
                    e.setFacing("right");
                    e.setState(Running);
                    break;
                case "up":
                    e.setState(Jumping);
                    break;
                case "down":
                    e.setState(Crouching);
                    break;
            }
        }
    }

    class Running {
        constructor(e) {
            this.entity = e;
        }
        update(dt) {
            let e = this.entity;
            e.frameVelocity.x += e.speed*e.dir;
            if (!e.grounded) {
                e.setState(Air);
            }
        }
        command(cmd) {
            let e = this.entity;
            switch (cmd) {
                case "left":
                    if (e.getFacing() != "left") {
                        e.setFacing("left");
                        e.setState(Running);
                    }
                    break;
                case "right":
                    if (e.getFacing() != "right") {
                        e.setFacing("right");
                        e.setState(Running);
                    }
                    break;
                case "neutralH":
                    e.setState(Idle);
                    break;
                case "up":
                    e.setState(Jumping);
                    break;
                case "down":
                    e.setState(Crouching);
                    break;
            }
        }
    }

    class Jumping {
        constructor(e) {
            this.entity = e;
        }
        update(dt) {
            let e = this.entity;
            this.time += dt;
            if (this.time >= 1) {
                e.velocity.y -= e.speed;
                e.setState(Air);
            }
        }
        command(cmd) {
            let e = this.entity;
            switch (cmd) {}
        }
    }

    class Air {
        constructor(e) {
            this.entity = e;
        }
        update() {
            let e = this.entity;
            if (this.move) {
                this.entity.velocity.x = this.entity.speed * d;
            }
            if (e.grounded) {
                e.setState(Idle);
            }

        }
        command(cmd) {
            let e = this.entity;
            this.move = 0;
            switch (cmd) {
                case "left":
                    e.setFacing("left");
                    this.move = 1;
                    break;
                case "right":
                    e.setFacing("right");
                    this.move = 1;
                    break;
                case "neutralH":
                    this.move = 0;
                    break;
            }
        }
    }
    
    class Crouching {
        constructor(e) {
            this.entity = e;
        }
        update() {
            let e = this.entity;
            if (!e.grounded) {
                e.setState(Air);
            }

        }
        command(cmd) {
            let e = this.entity;
            this.move = 0;
            switch (cmd) {
                case "neutralV":{
                    e.setState(Idle);
                }
            }
        }
    }
    return Taylor;
});