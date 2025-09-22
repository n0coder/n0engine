import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.ts";

export class Fish {
    constructor() {
        this.x=0;
        this.y=0;

        this.setActive = setActive        
        this.setActive(true);
        this.renderOrder = 0
    }
    draw() {
        p.push()
        p.stroke(230, 255, 170)
        p.strokeWeight(3.5);
        p.line(this.x-2.5, this.y, this.x+2.5, this.y);
        p.pop();
    }
}