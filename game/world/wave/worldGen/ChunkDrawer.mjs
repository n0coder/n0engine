import { p } from "../../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp } from "../../../../engine/n0math/ranges.mjs";
import { genTile } from "./TileBuilder.mjs";

let c = worldGrid.chunkSize *2
export function drawChunks(nano) {

    for (let xc = -c; xc < c; xc++) {
        for (let yc = -c; yc < c; yc++) {
            let nx = xc + nano.x, ny = yc + nano.y
            let { x, y } = worldGrid.screenToGridPoint(nx * worldGrid.gridSize, ny * worldGrid.gridSize)

            genTile(x, y)
            let tile = worldGrid.getTile(x, y);
            if (tile && tile.biome) {
                let color = tile.biome.colorsugar(tile)
                p.fill(color);
                p.rect(x * worldGrid.gridSize, y * worldGrid.gridSize, worldGrid.gridSize, worldGrid.gridSize)
            }
        }
    }
}