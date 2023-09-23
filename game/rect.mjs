import { p } from "../engine/core/p5engine.mjs";


export class Rect {
    constructor(x,y,w,h) {
        this.vx = x;
        this.vy = y;
        this.w = w;
        this.h = h;
        this.offsetx = this.w/2
        this.offsety = this.h/2
    }
    get x() {
        return this.vx+this.offsetx
    }
    get y() {
        return this.vy+this.offsety
    }
    draw() {
        if (this.inBounds(p.mouseX, p.mouseY))
            p.fill(50, 255, 50) 
        else 
            p.fill(255,255,255)
    
        p.rect(this.x,this.y,this.w,this.h,2);
    }
    inBounds(x,y) {
        return (x > this.x&& x<this.x+this.w && y > this.y && y < this.y+this.h)
    }

}