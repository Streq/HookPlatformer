import StateStack from "../app/stateStack.js";

/**
@template Frame, FrameInput
@typedef {
	{	copyFrame:	(frame: Frame)=>Frame
	,	copyInput:	(input:	FrameInput)
	,	stopCondition:	(input:FrameInput)=>boolean
	,	onStop:	(stack:StateStack, dt:number, input:FrameInput)=>void
	}
}RecorderOptions
 */
/** 
 * wrapper that records every frame of a given state
 * @template Frame,FrameInput,Renderer
*/
export default class Recorder{
	/**
	 * @param {RecorderOptions<Frame,FrameInput>} options 
	 * @param {import("../app/stateStack.js").State<FrameInput,Renderer>} state 
	*/
	constructor(state, options){
		this.state = state;
		this.copyFrame = options.copyFrame;
		this.copyInput = options.copyInput;
		this.stopCondition = options.stopCondition;
		this.onStop = options.onStop;
		this.record = true;
		
		this.frames = [this.copyFrame(state)];
		this.record_input_only = true;
	}

	update(stack, dt, input){
		if(this.stopCondition(input)){
			this.onStop(stack, dt, input);
			this.record = false;
		}
		if(this.record){
			this.frames.push(
				{	frame:	!this.record_input_only && this.copyFrame(this.state.frame)
				,	input:	this.copyInput(input)
				}
			);
		}
		return this.state.update(stack, dt, input);
	}

	render(renderer){
		this.state.render(renderer);
	}
}