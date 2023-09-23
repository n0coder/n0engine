import { p } from "../engine/core/p5engine.mjs";


export class Circle {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw() {
        if (this.inBounds(p.mouseX, p.mouseY))
            p.fill(50, 255, 50) 
        else 
            p.fill(255,255,255)
    
        p.rect(this.x,this.y,this.w,this.h,2);

        p.ellipse(p.mouseX, p.mouseY, 5,5)
    }
    inBounds(x,y) {
        return (x > this.x&& x<this.x+this.w && y > this.y && y < this.y+this.h)
    }

}