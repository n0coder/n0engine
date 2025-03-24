import { Tile } from "../../../../engine/grid/tile.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { buildBiome } from "../../BiomeWork.mjs";
import { buildFactors, worldFactors } from "../../FactorManager.mjs";
import { buildn0Collapse } from "../n0.mjs";

export function addSugar(tile) { //sugar data does not exist, make it using biome date
    
    if(tile.sugar && tile.pathDifficulty !== undefined){
        return tile;
}
    if (tile.biome === null) {
        tile.broken = true;
        tile.pathDifficulty = 9;
        return;
    }
    let sugar = tile.genCache.get("sugarzone");
    let facti = worldFactors.get("sugarzone")
    tile.sugar = { minm: 0, maxm: 2, sum: lerp(0, 2, inverseLerp(facti.mini, facti.maxi, sugar)) }
    tile.pathDifficulty = tile.biome?.getDifficulty(tile) ?? 9;
}

export function genTile(x, y) {
    let w = worldGrid;
    var tilet = w.getTile(x, y), tile
    if (!tilet)
        tile = new Tile(w.x + x, w.y + y)
    else if (typeof tilet === 'function') {
        let t = new Tile(w.x + x, w.y + y)
        tile = t
    }else if (!tile instanceof Tile) {
        let t = new Tile(w.x + x, w.y + y)
        t.layers.push(tile)
        tile = t
    } else return;
    
    tile.wx = x, tile.wy = y;
    tile.build([ //functions that modify the tile
        buildFactors, //get noise maps
        buildBiome, //categorize noise to biomes
        addSugar, //uss sugar and biome to set basic sugar level    
        //buildn0Collapse
    ])
    
    let t = tile.genCache.get("elevation")
    let elevation = worldFactors.get("elevation")
    let zz = inverseLerp(elevation.mini, elevation.maxi, t)
    tile.z = Math.floor( lerp(0, 32, zz) )
    globalThis.tiles += 1
    
    if (typeof tilet === 'function') {
        let o = tilet?.(tile)
        if (o!==undefined)
        tile.layers.push(o)
    }
    worldGrid.setTile(x, y, tile)
    return tile;
}
globalThis.tiles = 0;
export function genChunk(x, y, w, h) {
    for (let i = 0; i < w; i++) {
        for (let o = 0; o < h; o++) {
            genTile(x + i, y + o)
        }
    }

}