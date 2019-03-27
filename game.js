/*///////////////////////////////////////////////////////////////
RUN
/*///////////////////////////////////////////////////////////////
window.onload = ()=>{
	//CONSTS
	WIDTH = 240;
	HEIGHT = 160;
	
	//DOM
	/**@type {HTMLCanvasElement}*/
	let canvas = (()=>{
		/**@type {HTMLCanvasElement}*/
		let c = DOM.set("<canvas></canvas>");
		c.width = WIDTH;
		c.height = HEIGHT;
		c.style.backgroundColor="#000";
		
		return c;
	})();
	let ctx = canvas.getContext("2d");
			
	let x = 5; 
	let y = 5;
	
	let loop = new Loop.TimedRAFLoop(
		(dt)=>{//update
			x+=1;
			y+=1*(HEIGHT/WIDTH);
		},
		()=>{//render
			ctx.fillStyle = "#f00";
			ctx.clearRect(0,0,WIDTH,HEIGHT);
			ctx.fillRect(x,y,2,2);
		},
		30
	);
	loop.start();
	
};




/*///////////////////////////////////////////////////////////////
DOM
/*///////////////////////////////////////////////////////////////
var DOM = ((mod)=>{
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
})(DOM||{});

/*///////////////////////////////////////////////////////////////
LOOP
/*///////////////////////////////////////////////////////////////
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

/*///////////////////////////////////////////////////////////////
Input
/*///////////////////////////////////////////////////////////////
var Input = ((mod)=>{
	return mod;
})(Input||{});