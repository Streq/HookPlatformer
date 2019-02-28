define(function () {
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

    /**only update is timed, render called for every request*/
    class SemiTimedRAFLoop extends TimedRAFLoop {
        frame(currentTimestamp) {
            this.render();

            this.accumulatedTime += currentTimestamp - (this.lastFrameTimestamp || currentTimestamp);
            this.lastFrameTimestamp = currentTimestamp;

            while (this.accumulatedTime >= this.frameTime) {
                this.update(this.frameTime);
                this.accumulatedTime -= this.frameTime;
            }
        }
    }

    /**sets an interval for render and update*/
    class IntervalLoop {

        constructor(update, render, fps) {
            this.loopHandle = null;
            this.frameTime = 1000 / fps;
            this.render = render;
            this.update = update;
        }

        start() {
            this.loopHandle = setInterval(() => {
                this.render();
                this.update(this.frameTime);
            }, this.frameTime);
        }

        stop() {
            clearInterval(this.loopHandle);
        }
    }

    return {
        RAF: RAFLoop,
        TimedRAF: TimedRAFLoop,
        SemiTimedRAF: SemiTimedRAFLoop,
        Interval: IntervalLoop
    }
});