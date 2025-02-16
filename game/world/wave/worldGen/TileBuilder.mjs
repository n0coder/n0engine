import { Tile } from "../../../../engine/grid/tile.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { buildBiome } from "../../BiomeWork.mjs";
import { buildFactors } from "../../FactorManager.mjs";


export function addSugar(tile) { //sugar data does not exist, make it using biome date
    if (tile.biome === null) {
        tile.broken = true;
        biome.pathDifficulty = 9;
        return;
    }
    let sugar = tile.genCache.get("sugarzone");
    tile.sugar = { minm: 0, maxm: 2, sum: lerp(0, 2, inverseLerp(sugar.minm, sugar.maxm, sugar.sum)) }
    tile.pathDifficulty = tile.biome?.getDifficulty(tile) ?? 9;
}
export function genTile(x, y) {
    let w = worldGrid;
    var tile = w.getTile(x, y)
    if (tile) return;

    tile = new Tile(w.x + x, w.y + y)
    tile.wx = x, tile.wy = y;
    tile.build([ //functions that modify the tile
        buildFactors,
        buildBiome,
        addSugar
    ])
    worldGrid.setTile(x, y, tile)
}
export function genChunk(x, y, w, h) {
    for (let i = 0; i < w; i++) {
        for (let o = 0; o < h; o++) {
            genTile(x + i, y + o)
        }
    }

}