import { Tile } from "../../../../engine/grid/tile.mjs";
import { WorldGrid, worldGrid } from "../../../../engine/grid/worldGrid.ts";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { biomeMap, buildBiome, buildEdge, buildEdgeX } from "../../BiomeWork.mjs";
import { buildFactors, worldFactors } from "../../FactorManager.mjs";
import { buildn0ts } from "../n0.mjs";
// import { buildn0Collapse } from "../n0.mjs";

export function addSugar(tile) { //sugar data does not exist, make it using biome date
    
    if(tile.sugar && tile.pathDifficulty !== undefined){
        return tile;
    }
    if (tile.biome === null) {
        tile.broken = true;
        tile.pathDifficulty = 9;
        return;
    }
    let sugar = tile.genCache.get("sugar");
    let facti = worldFactors.get("sugar");
    tile.sugar = { minm: 0, maxm: 2, sum: lerp(0, 2, inverseLerp(facti.mini, facti.maxi, sugar)) }
    tile.pathDifficulty =  biomeMap.get(tile.biome)?.getDifficulty(tile) ?? 9;
}
/**
 * @param {{ genCache: { get: (arg0: string) => any; }; z: number; invZ: number; }} tile
 */
export function buildZ (tile) {
    let wf = worldFactors.get("elevation");
    let ff = tile.genCache.get("elevation");
    let inv = inverseLerp(wf.mini, wf.maxi, ff)
    let size = lerp(-8,8, inv);
    tile.z = Math.floor(size)
    tile.invZ = inverseLerp(-8, 8, size)//tile.z)
}
interface TileGenCache {
    get(arg0: string): any;
}

interface TileType {
    wx?: number;
    wy?: number;
    z?: number;
    invZ?: number;
    sugar?: number;
    pathDifficulty?: number;
    biome?: string | null;
    broken?: boolean;
    genCache: TileGenCache;
    layers: any[];
    build(fns: Array<((tile: TileType) => void) | undefined>): void;
}

interface WorldGridType {
    x: number;
    y: number;
    getTile(x: number, y: number): TileType | ((tile: TileType) => any) | undefined;
    setTile(x: number, y: number, tile: TileType): void;
}

export function genTile(
    x: number,
    y: number,
    n0: boolean = true
): TileType | undefined {
    let w: WorldGridType = worldGrid;
    var tilet = w.getTile(x, y), tile: TileType;
    if (!tilet)
        tile = (new Tile(w.x + x, w.y + y));
    else if (typeof tilet === 'function') {
        let t = new Tile(w.x + x, w.y + y);
        tile = t;
    } else if (!(tilet instanceof Tile)) {
        let t = new Tile(w.x + x, w.y + y);
        t.layers.push(tilet);
        tile = t;
    } else return;
    n0 = false;
    tile.wx = x, tile.wy = y;
    tile.build([
        buildFactors,
        buildBiome,
        buildEdgeX,
        addSugar,
        //buildZ,
        n0 ? buildn0ts : undefined
    ]);
    globalThis.tiles += 1;
    if (typeof tilet === 'function') {
        let o = tilet?.(tile);
        if (o !== undefined)
            tile.layers.push(o);
    }
    worldGrid.setTile(x, y, tile);

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