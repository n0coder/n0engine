import { p } from "../../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../../FactorManager.mjs";
import { genTile } from "./TileBuilder.mjs";

let c = worldGrid.chunkSize, chunkCount = 3

let chunks = []
export function drawChunks(nano) {
    //let nx = (cx * c) + nano.x, ny = (cy * c) + nano.y
    //let dis =  Math.hypot(nano.x - nx, nano.y - ny)<nano.sightRadius
    for (const chunk of chunks) {
        drawChunk(chunk)
    }
}
export function addChunk(cx,cy) {
    let chunk = worldGrid.getChunk(cx,cy);
    if (!Array.isArray(chunk)) 
        chunk = worldGrid.createChunk(cx, cy, (i, o, wx, wy)=>{ 
            let tile = genTile((worldGrid.chunkSize*cx)+i,(worldGrid.chunkSize*cy)+o)
            tile.cx = worldGrid.chunkSize*cx, tile.cy = worldGrid.chunkSize*cy;
            tile.wx = (worldGrid.chunkSize*cx)+i, tile.wy =(worldGrid.chunkSize*cy)+o;
            return tile;
        });
    chunks.push(chunk);
}
export function drawChunk(chunk) {
    for (let x of chunk) {
        for (let y of x) {
            console.log(y);
            let color = y.biome.colora(y)
            if (color) p.fill(color);
            p.rect(y.wx * worldGrid.tileSize, (y.wy) * worldGrid.tileSize, worldGrid.tileSize, worldGrid.tileSize)
        }
    }
}