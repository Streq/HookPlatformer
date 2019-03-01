define(["utils/transform2d"],function(Transform2D){
    class View{
        constructor(options){
            options = options || 
                {
                    //in pixels
                    center        : {x: 0, y: 0},
                    //in pixels
                    halfDimensions: {x: 0, y: 0},
                    //in proportions
                    viewPort      : {x: 0, y: 0, w: 0, h: 0}
                };
            Object.assign(this,options);
        }
        
        /**@param {CanvasRenderingContext2D} ctx*/
        applyTransform(ctx){
            const w  = ctx.canvas.width, 
                  h  = ctx.canvas.height, 
                  vp = this.viewPort,
                  c  = this.center,
                  hd = this.halfDimensions;
           //clip viewport
			ctx.beginPath();
            ctx.rect(w*vp.x, h*vp.y, w*vp.w, h*vp.h);
            ctx.clip();
			
			let vptf = this.getViewPortTransform(ctx);
			let wtf = this.getWorldTransform(ctx);
            
			let tf = vptf.combine.apply(vptf, wtf.matrix);
			ctx.transform.apply(ctx,tf.matrix);
        }
        getWorldTransform(ctx){
            const w  = ctx.canvas.width, 
                  h  = ctx.canvas.height, 
                  c  = this.center,
                  hd = this.halfDimensions;
            
            let ret = new Transform2D();
            //scale view
            ret.scale(w/(hd.x*2), h/(hd.y*2));
            //move to view in World units so no division by scale
            ret.translate(-c.x + hd.x, -c.y + hd.y);
            return ret;
        }
        getViewPortTransform(ctx){
            const w  = ctx.canvas.width, 
                  h  = ctx.canvas.height, 
                  vp = this.viewPort;
            
            let ret = new Transform2D();
            //scale to viewport
           	ret.scale(vp.w,vp.w);
			//move to viewport in canvas units so divide to scale
			ret.translate(vp.x*w/vp.w, vp.y*h/vp.h);
            return ret;
        }
		
		getFullTransform(ctx){
			let vp = this.getViewPortTransform(ctx);
			return vp.combine.apply(vp,this.getWorldTransform(ctx).matrix);
		}
    }
    return View;
});