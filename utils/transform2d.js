define(function(){
    class Transform2D{
        /*Gon look like
            a,c,e
            b,d,f
            0,0,1
        */
        constructor(a,b,c,d,e,f)//Defines a 2D transformation, using a matrix of six values
        {
            if(arguments.length>0){
                this.matrix = [a,b,c,d,e,f];
            }else{
                this.matrix = [1,0,0,1,0,0];
            }
        }
        combine(a1,b1,c1,d1,e1,f1){
            /*Gon look like
                a0,c0,e0   a1,c1,e1   a0*a1+c0*b1, a0*c1+c0*d1, a0*e1+c0*f1+e0
                b0,d0,f0 * b1,d1,f1 = b0*a1+d0*b1, b0*c1+d0*d1, b0*e1+d0*f1+f0
                 0, 0, 1    0, 0, 1             0,           0,              1
            */
            let m = this.matrix,
                a0 = m[0],
                b0 = m[1],
                c0 = m[2],
                d0 = m[3],
                e0 = m[4],
                f0 = m[5];
            this.matrix = [
                a0*a1+c0*b1,
                b0*a1+d0*b1,
                a0*c1+c0*d1,
                b0*c1+d0*d1,
                a0*e1+c0*f1+e0,
                b0*e1+d0*f1+f0
            ];
            
            return this;
        }
        translate(x,y)          //Defines a 2D translation, moving the element along the X- and the Y-axis
        {
            return this.combine(1,0,0,1,x,y);
        }
        translateX(n)           //Defines a 2D translation, moving the element along the X-axis
        {
            return this.combine(1,0,0,1,n,0);
        }
        translateY(n)           //Defines a 2D translation, moving the element along the Y-axis
        {
            return this.combine(1,0,0,1,0,n);
        }
        scale(x,y)              //Defines a 2D scale transformation, changing the elements width and height
        {
            return this.combine(x,0,0,y,0,0);
        }
        scaleX(n)               //Defines a 2D scale transformation, changing the element's width
        {
            return this.combine(n,0,0,1,0,0);
        }
        scaleY(n)               //Defines a 2D scale transformation, changing the element's height
        {
            return this.combine(1,0,0,n,0,0);
        }
        rotate(angle)           //Defines a 2D rotation, the angle is specified in the parameter
        {
            let cosA = Math.cos(angle),
                sinA = Math.sin(angle);
            return this.combine(cosA,-sinA,sinA,cosA,0,0);
        }
        skew(x_angle,y_angle)   //Defines a 2D skew transformation along the X- and the Y-axis
        {
            let tanx = Math.tan(x_angle),
                tany = Math.tan(y_angle);
            return this.combine(1,tany, tanx, 1, 0, 0)
        }
        skewX(angle)            //Defines a 2D skew transformation along the X-axis
        {
            let tanx = Math.tan(x_angle);
            return this.combine(1,0, tanx, 1, 0, 0);
        }
        skewY(angle)            //Defines a 2D skew transformation along the Y-axis
        {
            let tany = Math.tan(y_angle);
            return this.combine(1,tany, 0, 1, 0, 0);
        }
    }
    return Transform2D;
})