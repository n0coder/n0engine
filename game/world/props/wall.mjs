import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.ts";
import { worldGrid } from "../../../engine/grid/worldGrid.ts";
import { cubicBlendW, inverseLerp } from "../../../engine/n0math/ranges.mjs";

export class Wall{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.pathDifficulty = 8; //can't walk through an 8
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder =0;

    } 

    
    draw() {
        var a = worldGrid.gridToScreenBounds(this.x, this.y, 1,1)
        p.fill(255)
        p.rect(a.x1, a.y1, a.x2, a.y2);
    }
}