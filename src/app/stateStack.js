export default class StateStack{
	constructor(){
		this.states=[];
		this.q = [];
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
		this.q.push({action:"push",state:state});
	}

	pop(){
		this.q.push({action:"pop"});
	}
	clear(){
		this.q.push({action:"clear"});
	}

	processQueue(){
		this.q.forEach((e)=>{
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
		this.q = [];
	}
}
