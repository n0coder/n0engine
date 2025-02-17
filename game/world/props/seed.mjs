import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";

export class Seed {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.s = 8;
        this.kind = 'seed'
        this.setActive = setActive;
        this.setActive(true)
    }
    crop(x,y) {
        return new Crop(x,y)
    }
    draw() {
        p.fill(255)
        p.ellipse(this.x * worldGrid.gridSize, this.y * worldGrid.gridSize, this.s)
    }
}

class Crop {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.s = 16;

        this.setActive = setActive;
        this.setActive(true)
    }
    draw(){
        p.fill(255)
        p.ellipse(this.x*worldGrid.gridSize+ worldGrid.gridSize/2, this.y*worldGrid.gridSize+worldGrid.gridSize/2, this.s)
    }
}