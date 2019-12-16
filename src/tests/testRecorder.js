import Recorder from "../utils/recorder.js"
import {getMousePos} from "../utils/dom.js"
import {default as StateStack} from '../app/stateStack.js'
import {RAFLoop as Loop} from '../utils/loop.js'
import {HtmlInputHandler,InputState} from '../utils/input.js'
const 
	canvas = document.getElementById("canvas")
,	ctx = canvas.getContext("2d")
,	appState =	{
		box: 
		{	x:	0
		,	y:	0
		,	w:	32
		,	h:	32
		}
	,	update: 
			function(stack, dt, inputState){
				let cursor = inputState.cursor_pos;
				if(cursor){
					this.box.x = cursor.x;
					this.box.y = cursor.y;
				}
			}
	,	render: 
			function(renderer){
				renderer.renderBox(this.box);
			}
	}
,	recorder = new Recorder
	(	appState
	,	{	copyFrame:
				(frame)=>(
					{	box: 
						{	x:	frame.box.x
						,	y:	frame.box.y
						,	w:	frame.box.w
						,	h:	frame.box.h
						}
					}
				)
		,	copyInput:
				(input)=>(
					{	cursor_pos:	
						(	input.cursor_pos
							?	{	x:	input.cursor_pos.x
								,	y:	input.cursor_pos.y
								}
							:	null
						)
					}
				)
		,	onStop:
				(stack,dt,input)=>{
					stack.pop();
					stack.push(appState);
				}
		,	stopCondition:(input)=>!!input.p
		}
	)
;


class App{
	constructor(config, first_state){
		this.stack = new StateStack();
		this.stack.states.push(first_state);
		this.renderer = config.renderer;
		this.loop = new Loop(
				(dt) => this.update(dt)
			,	() => this.render(config.renderer)
			,	config.loop.fps
			);
		
		this.input_handler = new HtmlInputHandler(config.input.event_mapping);
		this.input_source_element = config.input.source;
		this.input = new InputState();
	}

	run(){
		this.input_handler.listen(this.input_source_element,(event)=>this.input.handleEvent(event));
		this.loop.start();
	}

	stop(){
		this.input_handler.unlisten();
		this.loop.stop();
	}

	render(){
		this.stack.render(this.renderer);
	}

	update(dt){
		this.stack.update(dt, this.input.copyCurrentState());
	}
}

new App(
	{	loop:	
		{	fps:	60
		}
	,	input:	
		{	source:	canvas
		,	event_mapping:
			{	mousemove:	(event, element)=>(
					{	name:	"cursor_pos"
					,	value:	getMousePos(element,event)
					}
				)
			,	keydown:	(event, element)=>(
					{	name:	event.key
					,	value:	true
					}
				)
			,	keyup:	(event, element)=>(
					{	name:	event.key
					,	value:	false
					}
				)
			}
		}
	,	renderer: 
		{	ctx: canvas.getContext("2d")
		,	renderBox: function(box){
				let c = this.ctx;
				c.fillStyle = "green";
				
				c.clearRect(0,0,c.canvas.width,c.canvas.height);
				c.fillRect(box.x,box.y,box.w,box.h);
			}
		}
	}
,	recorder
).run();
