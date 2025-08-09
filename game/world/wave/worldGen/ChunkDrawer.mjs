import { p } from "../../../../engine/core/p5engine.ts";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../../FactorManager.mjs";
import { n0tiles } from "../n0FunctionCollapse.mjs";
import { genTile } from "./TileBuilder.mjs";

let c = worldGrid.chunkSize, chunks = 4
export function drawChunks(nano) {
    for (let xc = -chunks; xc <= chunks; xc++) {
        for (let yc = -chunks; yc <= chunks; yc++) {
            let nx = (xc * c) + nano.x, ny = (yc * c) + nano.y
            
            //TODO: wierd constant for sight radius used
            let dis =  Math.hypot(nano.x - nx, nano.y - ny)< (nano.sightRadius ?? worldGrid.tileSize*2.5)  
            if (dis) {
                let { x, y } = worldGrid.screenToChunkPoint(nx * worldGrid.tileSize, ny * worldGrid.tileSize)
                drawChunk(x*c, y*c, nano.z)
            }
        }
    }
}
function genTile5(xx, yy) { 
    genTile(xx, yy+1)
    genTile(xx, yy-1)
    genTile(xx+1, yy)
    genTile(xx-1, yy)
    genTile(xx, yy)
}

export function drawTile(x,y, tile) {
    


    let n0fc = tile.n0fc?.option !== undefined ? n0tiles.get(tile.n0fc.option) : undefined;
    if (n0fc?.img) {
        p.image(n0fc.img, x * worldGrid.tileSize, y * worldGrid.tileSize, worldGrid.tileSize, worldGrid.tileSize);
        return
    }

    let color = tile.biome.colora(tile)
    if(color) {
        p.fill(color);
        p.rect(x * worldGrid.tileSize, y * worldGrid.tileSize, worldGrid.tileSize, worldGrid.tileSize)
    }
}

export function drawChunk(x, y, z) {
    for (let xc = 0; xc < c; xc++) {
        for (let yc = 0; yc < c; yc++) {
            let xx = xc+x, yy = yc+y
            genTile5(xx, yy)
            let tile = worldGrid.getTile(xx, yy);
            if (tile?.biome) {
                drawTile(xx,yy, tile);
            }
        }
    }
}