import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";

export class DebugCursor{
    constructor() {
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = 5;
        this.tile = null;
    }
    draw() {
        var isu = worldGrid.screenToGridPoint(p.mouseX, p.mouseY);
        var wisu = worldGrid.gridToScreenBounds(isu.x, isu.y, 1,1);
        //p.rect(wisu.x1, wisu.y1, wisu.x2, wisu.y2);
        this.tile = worldGrid.getTile(isu.x, isu.y);
        
        //p.ellipse(p.mouseX, p.mouseY, 3,3);
         p.fill(255)
        
        p.textSize(16);
        if (this.tile?.biome) {
        p.stroke(this.tile.biome.colorsugar (this.tile))
        p.strokeWeight(5)
        let txt =  (this.tile.layers.length > 0) ? this.tile.layers[this.tile.layers.length-1].name : this.tile.biome.name
        p.text( this.tile != null ? txt : ":(", wisu.x1+(wisu.x2*1.5), wisu.y1+wisu.y2);
        
        }
    } 
    mouseClicked() {
        var isu = worldGrid.screenToGridPoint(p.mouseX, p.mouseY);
        var wisu = worldGrid.gridToScreenBounds(isu.x, isu.y, 1, 1);
        //p.rect(wisu.x1, wisu.y1, wisu.x2, wisu.y2);
        let tile = worldGrid.getTile(isu.x, isu.y);
        console.log({tile: tile, isu})
    }
}