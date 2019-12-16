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




let keymaps =
	{	"z":"A"
	,	"x":"B"
	}
;
const inputConfig = 
	{	mousemove: (event, element)=>(
			{	name: "cursor_pos"
			,	value: getMousePos(element,event)
			}
		)
	,	keydown: (event)=>{
			let mapping = keymaps[event.key];
			return (
				mapping 
				?	{	name: mapping
					,	value: true
					}
				:	null
			)
		}
	,	keyup: (event)=>{
			let mapping = keymaps[event.key];
			return (
				mapping 
				?	{	name: mapping
					,	value: false
					}
				:	null
			)
		}
	}


/**@description Listens to html Events and fires app Events */
export class HtmlInputHandler{
	constructor(mappings){
		this.mappings = mappings;
	}
	/**@param element {HTMLElement} */
	listen(element, callback){
		for(var eventType in this.mappings){
			let handler = this.mappings[eventType];
			//create a handler that binds the listened element 
			//and signals the observers
			let boundHandler = (htmlEvent)=>{
				let appEvent = handler(event,element);
				if(appEvent){
					callback(appEvent);
				}
			};
			
			element.addEventListener(eventType,boundHandler);
			//store for future unlisten
			this[eventType] = boundHandler;
		}
	}
	/**@param element {HTMLElement} */
	unlisten(element){
		for(var eventType in this.mappings){
			element.removeEventListener(eventType,this[eventType]);
		}
	}
}

/** @description pollable input class. yeah my app polls input DEAL with it */
export class InputState {
	constructor(){
		this.state = {};
	}
	handleEvent(input){
		this.state[input.name] = input.value;
	}
	copyCurrentState(){
		return Object.assign({}, this.state);
	}
}


export class InputRecorder {
	constructor(){
		this.frames = [];
		this.currentFrame = [];
	}
	updateFrame(){
		this.frames.push(this.currentFrame);
		this.currentFrame = [];

	}
	handleEvent(input){
		this.currentFrame.push(input);
	}
}