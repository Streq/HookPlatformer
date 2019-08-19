const EVENT_NAMES = ["keyup","keydown"];


// listens to events on keyboard
export class UserInputSource{
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
export class RecordedInputSource{
	constructor(inputs){
		this.inputs = inputs;
		this.index = -1;
	}
	getFrameInput(){
		return this.inputs[++index];
	}
}