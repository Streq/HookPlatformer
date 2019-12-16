/**
@template Input, Renderer
@typedef {
	{	update: (stack:StateStack, dt:number, input:Input)=>boolean
	,	render:	(renderer:Renderer)=>void
	}
}State<InputFrame>

*/


export default class StateStack{
	constructor(){
		/**@type {Array<State<any,CanvasRenderingContext2D>>}*/
		this.states = [];
		this.task_queue = [];
	}

	render(renderer){
		let a = this.states, 
			len = a.length;
		for(var i = 0 ; i < len; ++i){
			a[i].render(renderer);
		}
	}

	update(dt, input){
		let a = this.states, 
			len = a.length;
		for(var i = len-1; i >= 0; --i){
			if(a[i].update(this, dt, input)){
				break;
			}
		}

		this.processQueue();
	}

	push(state){
		this.task_queue.push({action:"push",state:state});
	}

	pop(){
		this.task_queue.push({action:"pop"});
	}
	clear(){
		this.task_queue.push({action:"clear"});
	}

	processQueue(){
		this.task_queue.forEach((e)=>{
			switch(e.action){
				case "push":
					this.states.push(e.state);
					break;
				case "pop":
					this.states.pop();
					break;
				case "clear":
					this.states = [];
					break;
			}
		});
		this.task_queue = [];
	}
}
