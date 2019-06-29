////////////////////////////////////////////////////////////////
//CONSTS
////////////////////////////////////////////////////////////////
var CONSTS = {
	WIDTH : 256,
	HEIGHT : 256,
};

////////////////////////////////////////////////////////////////
//DOM SETUP
////////////////////////////////////////////////////////////////
function setupDOM(){
    /**@type {HTMLCanvasElement}*/
    let canvas = (()=>{
        /**@type {HTMLCanvasElement}*/
        let c = DomUtils.set("<canvas></canvas>");
        c.width = CONSTS.WIDTH;
        c.height = CONSTS.HEIGHT;
        c.style.backgroundColor="#000";
        c.tabIndex=-1;

        return c;
    })();
    dom.canvas = canvas;
    Input.listen(canvas);
}
////////////////////////////////////////////////////////////////
//LOOP SETUP
////////////////////////////////////////////////////////////////
function beginLoop(){
    let ctx = dom.canvas.getContext("2d");
	let loop = new Loop.TimedRAFLoop(
		(dt)=>{//update
			let frameInput = Input.getFrameInput();
			Game.update(dt/1000,frameInput);
		},
		()=>{//render
			Game.render(ctx);
		},
		30
	);
	loop.start();
    return loop;
}

////////////////////////////////////////////////////////////////
//RUN
////////////////////////////////////////////////////////////////
function main(){
    setupDOM();
    Game.init();
	beginLoop();
};

////////////////////////////////////////////////////////////////
//DOM UTILS
////////////////////////////////////////////////////////////////
var DomUtils = ((mod)=>{
	function fromString(html){
		var template = document.createElement('template'),
			text = html.trim();
		template.innerHTML = text;
		return template.content.firstChild;
	}
	
	function get(idValue, propertyName, rootElement) {
		let r = rootElement || document.body;
		let p = propertyName || "id";
		let v = idValue;
		return r.querySelector(`[${p}=${v}]`);
	};
	
	function set(stringHtml, idValue, propertyName, rootElement) {
		let target = get(idValue,propertyName,rootElement);
		let r = rootElement || document.body;
		if (!target) {
			target = r.appendChild(fromString(stringHtml));
		} else {
			target.outerHtml = template.outerHtml;
		}
		return target;
	};
	
	function loadScrollBar() {
        document.documentElement.style.overflow = 'auto';  // firefox, chrome
        document.body.scroll = "yes"; // ie only
    }

    function unloadScrollBar() {
        document.documentElement.style.overflow = 'hidden';  // firefox, chrome
        document.body.scroll = "no"; // ie only
    }
	
	Object.assign(mod,{
		fromString : fromString,
		get : get,
		set : set,
		loadSrollBar : loadScrollBar,
		unloadSrollBar : unloadScrollBar,
	});
	return mod;
})(DomUtils||{});


////////////////////////////////////////////////////////////////
//LOOP
////////////////////////////////////////////////////////////////
var Loop = ((mod)=>{
	/**both render and update called once per animation request, FPS assumed to be a constant 60*/
	class RAFLoop {
		constructor(update, render, fps) {
			this.keepUpdating = false;
			this.update = update;
			this.render = render;
		}

		start() {
			this.keepUpdating = true;
			window.requestAnimationFrame((t) => this.request(t));
		}

		stop() {
			this.keepUpdating = false;
		}

		request(currentTimestamp) {
			if (this.keepUpdating) {
				window.requestAnimationFrame((t) => this.request(t));
			}
			this.frame(currentTimestamp);
		}

		frame(currentTimestamp) {
			this.render();
			this.update(1000 / 60);
		}
	}

	/**timed update, render called only after an update*/
	class TimedRAFLoop extends RAFLoop {
		constructor(update, render, fps) {
			super(update, render, fps);

			this.frameTime = 1000 / fps;
			this.lastFrameTimestamp = null;
			this.accumulatedTime = 0;
		}

		frame(currentTimestamp) {
			this.accumulatedTime += currentTimestamp - (this.lastFrameTimestamp || currentTimestamp);
			this.lastFrameTimestamp = currentTimestamp;

			if (this.accumulatedTime >= this.frameTime) {
				while (this.accumulatedTime >= this.frameTime) {
					this.update(this.frameTime);
					this.accumulatedTime -= this.frameTime;
				}
				this.render();
			}
		}
	}

	mod.RAFLoop = RAFLoop;
	mod.TimedRAFLoop = TimedRAFLoop;
	return mod;
})(Loop||{});

////////////////////////////////////////////////////////////////
//INPUT UTILS
////////////////////////////////////////////////////////////////
var InputUtils = ((mod)=>{

	const EVENT_NAMES = ["keyup","keydown"];


	// listens to events on keyboard
	class UserInputSource{
		constructor(config){
			this.config = config;
			this.inputState = {};

			this.binds = {};
			EVENT_NAMES.forEach(e => {
				this.binds[e] = (event => this[e](event))
			});
		}

		keydown(event) {
			let km = this.config.keymap;
			for(var button in km){
				let key = km[button];
				if(key==event.key){
					this.inputState[button] = true;
				}
			}
		}
		keyup(event) {
			let km = this.config.keymap;
			for(var button in km){
				let key = km[button];
				if(key==event.key){
					this.inputState[button] = false;
				}
			}
		}

		getFrameInput(){
			return Object.assign({},this.inputState);;
		}

		/** @param {HTMLCanvasElement} canvas */
		listen(canvas){
			EVENT_NAMES.forEach((each) => canvas.addEventListener(each, this.binds[each]));
		}
		/** @param {HTMLCanvasElement} canvas */
		stopListen(canvas){
			EVENT_NAMES.forEach((each) => canvas.removeEventListener(each, this.binds[each]));
		}
	}

	//pre recorded inputs
	class RecordedInputSource{
		constructor(inputs){
			this.inputs = inputs;
			this.index = -1;
		}
		getFrameInput(){
			return this.inputs[++index];
		}
	}


	mod.UserInputSource = UserInputSource,
	mod.RecordedInputSource = RecordedInputSource
	return mod;

})(InputUtils||{});

////////////////////////////////////////////////////////////////
//GAME DOM
////////////////////////////////////////////////////////////////
var dom = {};


////////////////////////////////////////////////////////////////
//INPUT
////////////////////////////////////////////////////////////////
var Input = (()=>{
	return new InputUtils.UserInputSource({
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
			"z": "d",
			
			"Start": "Enter"
		}
	});
})();


////////////////////////////////////////////////////////////////
//GRID
////////////////////////////////////////////////////////////////
class DoubleArrayGrid{
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

class SingleArrayGrid{
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



////////////////////////////////////////////////////////////////
//GET MOUSE POS
////////////////////////////////////////////////////////////////
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}


////////////////////////////////////////////////////////////////
//MATH UTILS
////////////////////////////////////////////////////////////////
var Math2 = {
	//like Math.floor but integers are rounded down
	floor(n){return Math.ceil(n-1);},
	ceil(n){return Math.floor(n+1);},
	getDecimalPart(n){return n-Math.trunc(n);},
	approach(value, target, amount){
		return (
			(value < target) 
				? Math.min(value+amount, target) 
				: Math.max(value-amount, target)
		);
	},
	approachSum(value,target,amount){
		return (
			(value < target) 
				? Math.min(value+amount, target) 
				: Math.max(value+amount, target)
		);
	},
	clamp(v,a,b){
		return Math.min(Math.max(a, v), b);
	},
	clampWithSort(v,a,b){
		return Math2.clamp(v, Math.min(a, b), Math.max(a, b));
	}
}