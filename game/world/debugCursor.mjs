import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.ts";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { buildn0ts } from "./wave/n0.mjs";

export class DebugCursor{
    constructor() {
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = 5;
        this.tile = null;
    }
    draw() {

        let tilePos = worldGrid.mouseTilePos, size = worldGrid.tileSize;
        let pos = tilePos.screen();
        let tile = worldGrid.getTile(tilePos.x, tilePos.y);
        p.fill(255) //white inside
        p.textSize(16) 
        p.strokeWeight(5)
        if (tile?.transition) {
            p.stroke("#338833")
            p.text(tile.transition.proximity, pos.x+(size*1.5), pos.y+(15+size))
            p.noFill()
            p.strokeWeight(5)
            p.rect( pos.x, pos.y, worldGrid.tileSize, worldGrid.tileSize)
        }
        /*
        if (tile?.biome) {
            p.stroke(tile.biome.colorsugar (tile))
            var txt = tile.layers?.[tile.layers.length-1]?.name
            txt ??= tile.biome.name
            p.text( txt, pos.x + (size*1.5), pos.y+(size));
        }
        if (tile?.n0ts?.placeholder) {
            p.stroke("#e02251ff")
            p.text(tile.n0ts.placeholder.reason[0], pos.x+(size*1.5), pos.y+(15+size))
            p.noFill()
            p.strokeWeight(5)
            p.rect( pos.x, pos.y, worldGrid.tileSize, worldGrid.tileSize)
        }
        */

    } 
    mouseClicked() {
        
        if (!worldGrid.mouseOnScreen) return;
        var isu = worldGrid.screenToTile(p.mouseX, p.mouseY);
        var wisu = worldGrid.tileToScreenBounds(isu.x, isu.y, 1, 1);
        //p.rect(wisu.x1, wisu.y1, wisu.x2, wisu.y2);
        let tile = worldGrid.getTile(isu.x, isu.y);

        //buildn0Collapse(tile);
        if (tile !== undefined)
        console.log({tile: tile, n0ts: tile?.n0ts}, isu)
    }
}