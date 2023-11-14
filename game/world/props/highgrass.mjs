import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { cubicBlendW, inverseLerp } from "../../../engine/n0math/ranges.mjs";

export class Highgrass {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        worldGrid.tiles.set(`${worldGrid.x+ this.x}, ${ worldGrid.y+ this.y}`, this);
        this.pathDifficulty = 1; 
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder =0;

    } 

    
    draw() {
        var a = worldGrid.gridToScreenBounds(this.x, this.y, 1,1)
        p.fill(111, 200,111)
        p.rect(a.x1, a.y1, a.x2, a.y2);
    }
}