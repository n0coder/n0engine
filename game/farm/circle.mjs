import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";

//i don't like to overcomplicate things
//we can pickup any object with a position

export class Circle{
    constructor(x=0,y=0, s=15, ms=15) {
        this.x = x;
        this.y = y;
        this.offsetX = worldGrid.halfTileSize;
        this.offsetY = worldGrid.halfTileSize;
        this.held = false;
        this.kind = "food"
        this.s = s;
        this.sugar = 1;
        this.ms = ms;
        this.setActive = setActive;
        this.setActive(true);
        this.renderOrder = 1;
        this.eaten = false; 
    }
    draw() {
        let x = this.x + (this.held ? 0 : this.offsetX);
        let y = this.y +(this.held ? 0 : this.offsetY);
        p.ellipse(x, y, this.s, this.s);
    }
    onEat(nano) {
        this.eaten = true;
    }
}