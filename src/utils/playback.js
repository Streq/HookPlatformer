export default class Playback{
	/**
	 * @param {RecorderOptions<Frame,FrameInput>} options 
	 * @param {import("../app/stateStack.js").State<FrameInput,Renderer>} state 
	*/
	constructor(state, recording, options){
		this.state = state;
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


new Playback({
	
})