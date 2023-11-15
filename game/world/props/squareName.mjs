import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";

export class SquareName{
    constructor(name, x,y, w,h, color){
        this.name = name;
        this.x = x; this.y = y;
        this.w=w; this.h=h;
        this.color = color;
        this.setActive = setActive;
        this.setActive(true);
        this.renderOrder = -8;
    }
draw() {
    p.push()
    p.fill(this.color)
    p.rect(this.x,this.y,this.w,this.h);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text(this.name, this.x+(.5*this.w),this.y-4)
    p.pop();
}
}