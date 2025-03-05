import { p } from "../../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp } from "../../../../engine/n0math/ranges.mjs";
import { genTile } from "./TileBuilder.mjs";

let c = worldGrid.chunkSize, chunks = 8
export function drawChunks(nano) {
    for (let xc = -chunks; xc <= chunks; xc++) {
        for (let yc = -chunks; yc <= chunks; yc++) {
            let nx = (xc * c) + nano.x, ny = (yc * c) + nano.y

            let dis =  Math.hypot(nano.x - nx, nano.y - ny)<nano.sightRadius
            if (dis) {
                let { x, y } = worldGrid.screenToChunkPoint(nx * worldGrid.gridSize, ny * worldGrid.gridSize)
                drawChunk(x*c, y*c)
            }
        }
    }
}
function genTile5(xx, yy) { 
    genTile(xx, yy)
    genTile(xx, yy+1)
    genTile(xx, yy-1)
    genTile(xx+1, yy)
    genTile(xx-1, yy)
}
export function drawChunk(x, y) {
    for (let xc = 0; xc < c; xc++) {
        for (let yc = 0; yc < c; yc++) {
            let xx = xc+x, yy = yc+y
            genTile5(xx, yy)
            let tile = worldGrid.getTile(xx, yy);
            if (tile && tile.biome) {
                let color = tile.biome.colorsugar(tile)
                p.fill(color);
                // let t = tile.genCache.get("elevation")
                // let z = inverseLerp(t.minm, t.maxm, t.sum)
                //p.fill(z*255)
                p.rect(xx * worldGrid.gridSize, yy * worldGrid.gridSize, worldGrid.gridSize, worldGrid.gridSize)
            }
        }
    }
}