import { p } from "../../../../engine/core/p5engine.ts";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../../FactorManager.mjs";
import { n0tiles } from "../n0FunctionCollapse.mjs";
import { genTile } from "./TileBuilder.mjs";

let c = worldGrid.chunkSize, chunks = 4
export function drawChunks(nano, gen) {
    for (let xc = -(chunks + 4); xc <= chunks+5; xc++) {
        for (let yc = -(chunks+2); yc <= chunks+2; yc++) {
            let nx = (xc * c) + nano.x, ny = (yc * c) + nano.y
            
            //TODO: wierd constant for sight radius used
            let dis =  Math.hypot(nano.x - nx, nano.y - ny)< (nano.sightRadius ?? worldGrid.tileSize*2.5)  
            if (dis) {
                let { x, y } = worldGrid.screenToChunkPoint(nx * worldGrid.tileSize, ny * worldGrid.tileSize)
                drawChunk(x*c, y*c, gen)
            }
        }
    }
}
function genTile5(xx, yy, gen) { 
    //genTile(xx, yy+1, gen)
    //genTile(xx, yy-1, gen)
    //genTile(xx+1, yy, gen)
    //genTile(xx-1, yy, gen)
    genTile(xx, yy, gen)
}

export function drawTile(x,y, tile) {    
    

    let color = tile.biome.colora(tile)
    if(color) {
        p.fill(color);
        p.rect(x * worldGrid.tileSize, y * worldGrid.tileSize, worldGrid.tileSize, worldGrid.tileSize)
    }
    let n0ts = tile.n0ts?.option !== undefined ? n0tiles.get(tile.n0ts.option) : undefined;
    let vx = 0
    let img = n0ts?.img;
    img ??= tile.n0ts?.placeholder?.[tile.n0ts.placeholder.image];
    img ??= tile.n0tsEditorTile?.img; 
    if (img) {
        p.image(img, (x * worldGrid.tileSize)+vx, (y * worldGrid.tileSize)+vx, worldGrid.tileSize-(vx*2), worldGrid.tileSize-(vx*2));
        return
    }
}

export function drawChunk(x, y, gen) {

    for (let xc = 0; xc < c; xc++) {
        for (let yc = 0; yc < c; yc++) {
            let xx = xc+x, yy = yc+y
            if (gen) genTile5(xx, yy)
            let tile = worldGrid.getTile(xx, yy);
            if (tile?.biome) {
                drawTile(xx,yy, tile);
            }
        }
    }
}