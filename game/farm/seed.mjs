import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";

export class Seed {
    constructor(x,y,plant, size) {
        this.x = x
        this.y = y
        this.size = size;
        this.plant = plant;


        this.setActive = setActive
        this.setActive(true);
        this.renderOrder = 0
    }
    draw() {
        p.ellipse(this.x, this.y, this.size, this.size)
    }
}