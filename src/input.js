define(["utils/index"],
    function (Utils) {
		
		const EVENT_NAMES = ["keyup","keydown"];
	
		class UserInputSource{
			constructor(config){
				this.config = config;
				this.inputState = {};
				this.binds = {
					keyup: (e) => this.onkeyup(e),
					keydown: (e) => this.onkeydown(e),
				};
			}
			
			onkeydown(event) {
				let km = this.config.keymap;
				for(var button in km){
					let key = km[button];
					if(key==event.key){
						this.inputState[button] = true;
					}
				}
			}
			onkeyup(event) {
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
				let binds = this.binds;
				EVENT_NAMES.forEach((each) => canvas.addEventListener(each, binds[each]));
			}
			/** @param {HTMLCanvasElement} canvas */
			stopListen(canvas){
				let binds = this.binds;
				EVENT_NAMES.forEach((each) => canvas.removeEventListener(each, binds[each]));
			}
		}
	
		class RecordedInputSource{
			constructor(inputs){
				this.inputs = inputs;
				this.index = -1;
			}
			getFrameInput(){
				return this.inputs[++index];
			}
		}
	
        return {
			UserInputSource: UserInputSource,
			RecordedInputSource: RecordedInputSource
		};

    });
