import { p } from "../../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../../FactorManager.mjs";
import { genTile } from "./TileBuilder.mjs";

let c = worldGrid.chunkSize, chunks = 4
export function drawChunks(nano) {
    for (let xc = -chunks; xc <= chunks; xc++) {
        for (let yc = -chunks; yc <= chunks; yc++) {
            let nx = (xc * c) + nano.x, ny = (yc * c) + nano.y

            let dis =  Math.hypot(nano.x - nx, nano.y - ny)<nano.sightRadius
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
export function drawChunk(x, y, z) {
    

    for (let xc = 0; xc < c; xc++) {
        for (let yc = 0; yc < c; yc++) {
            let xx = xc+x, yy = yc+y
            //z = worldGrid.getTile(xx,yy)?.genCache?.get("elevation")
            genTile5(xx, yy)
            let tile = worldGrid.getTile(xx, yy);
            if (tile && tile.biome) {
                let color = tile.biome.colora(tile)
                if(color) {
                p.fill(color);
                //let zz =z- tile.z
                //p.fill(z*255)
                p.rect(xx * worldGrid.tileSize, (yy) * worldGrid.tileSize, worldGrid.tileSize, worldGrid.tileSize)
                }
            }
        }
    }
}