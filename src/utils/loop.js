/**both render and update called once per animation request, FPS assumed to be a constant 60*/
export class RAFLoop {
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
export class TimedRAFLoop extends RAFLoop {
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