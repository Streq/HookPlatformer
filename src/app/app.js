import {default as StateStack} from './stateStack.js'
import * as Loop from '../utils/loop.js'
import {UserInputSource} from '../utils/input.js'

export default class App{

	constructor(fps, renderer, inputConfig){
		this.stack = new StateStack();
		this.renderer = renderer;
		this.input = new UserInputSource(inputConfig);
		this.loop = new Loop.TimedRAFLoop((dt)=>this.update(dt), ()=>this.render(), fps);
	}

	render(){
		this.stack.render(this.renderer);
	}

	update(dt){
		this.stack.update(dt, this.input.getFrameInput());
	}

	init(state){
		let canvas = this.renderer.canvas;
		canvas.tabIndex=-1;
		
		state.init();
		this.stack.push(state);
		
		this.input.listen(canvas);
		
		this.loop.start();
	}
	stop(){
		this.loop.stop();
	}
}