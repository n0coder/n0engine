import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";

export class Soil{
    constructor (x, y) {
        this.name = "soil"
        this.x = x;
        this.y = y;
        this.setActive = setActive;
        this.setActive(true)
        this.tile.layers.push(this);
    }

    get tile() {
        return worldGrid.getTile(this.x, this.y)
    }
    draw() {
        let x = this.x *worldGrid.gridSize
        let y = this.y *worldGrid.gridSize
        let t = worldGrid.gridSize
        p.fill(202, 144, 126)
        p.rect(x, y, t, t)
    }
    harvest(nano) {

    }
}

