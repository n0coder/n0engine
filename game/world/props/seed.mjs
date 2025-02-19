import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { deltaTime } from "../../../engine/core/Time/n0Time.mjs";
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
        this.growth = 0

        this.setActive = setActive;
        this.setActive(true)
    }
    get heldPos() {
        return this.held ? 0 : worldGrid.gridSize/2
    }
    draw(){
        p.fill(255)
        if (this.growth <1)
        this.growth += deltaTime*.25
        p.ellipse(this.x*worldGrid.gridSize+this.heldPos, this.y*worldGrid.gridSize+this.heldPos, this.growth*this.s)
    }
}