import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";

//i don't like to overcomplicate things
//we can pickup any object with a position

export class Circle{
    constructor(x=0,y=0, s=15) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.setActive = setActive;
        this.setActive(true);
    }
    draw() {
        p.ellipse(this.x, this.y, this.s, this.s);
    }
}