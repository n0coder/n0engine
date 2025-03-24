import { cubicBlendW, inverseLerp, posterize } from "../../engine/n0math/ranges.mjs";
import { luts } from "./BiomeWork.mjs";
import { worldFactors } from "./FactorManager.mjs";

export function mapDeep(arr, mapFn) {
    return arr.map(item => Array.isArray(item) ? mapDeep(item, mapFn) : mapFn(item));
}

export const biomeFactorMap = new Map()
export function addBiomeFactors(map, factor, gens) {
    let f = gens.get(factor)
    let gen = f?.getValue(0,0) || 0
    var ranges = map.exportRanges(factor, gen.minm, gen.maxm)
    
    ranges.forEach(r => {
        var [tag, fact, min, max] = r;
        var obj = { factor: fact, min: min, max: max }
       
        biomeFactorMap.set(tag, obj)
    })
}
document.lutMissingMap = new Map()
export class Biome {
    constructor(name, colorName, color, tags, tiles) {
        this.name = name
        this.sugara=null;
        this.colorName = colorName;
        if (!luts[0][colorName]) 
            document.lutMissingMap.set(`0, ${colorName}`, true);
           if (!luts[1][colorName]) 
           document.lutMissingMap.set(`1, ${colorName}`, true);
           if (!luts[2][colorName]) 
           document.lutMissingMap.set(`2, ${colorName}`, true);
        this.bitter = luts[0][colorName] || [255,0,255]
        this.plain = luts[1][colorName]|| [255,0,255]
        this.sugar = luts[2][colorName]|| [255,0,255]
        this.sugarLevel = color;
        this.difficulty = 1;
        this.color = luts[1][colorName];
        this.tags = tags;
        this.factors = (tags != null) ? mapDeep(tags, f => biomeFactorMap.get(f)) : []
        this.tiles = tiles || []
        
    }
    colorsugar (tile){
        if (!this.bitter || !this.plain || !this.sugar) {
            return this.color;
        }
        var gc = tile.sugar;
        let isu = inverseLerp(gc.minm, gc.maxm, gc.sum);
       
        let r = cubicBlendW([this.bitter[0], this.plain[0], this.sugar[0]], isu, 2)
        let g = cubicBlendW([this.bitter[1], this.plain[1], this.sugar[1]], isu, 2)
        let b = cubicBlendW([this.bitter[2], this.plain[2], this.sugar[2]], isu, 2)
        return [r,g,b]
    }
    colora(){
        let c = {}
        c[0]=this.bitter
        c[1]=this.plain
        c[2]=this.sugar
        return c[this.sugara]
    }
    getDifficulty (tile) {
        var gc = tile.sugar;
        let isu = inverseLerp(gc.minm, gc.maxm, gc.sum);
        let difi = Math.round(cubicBlendW([1, 0, -1], isu, 2))
        return this.difficulty+difi;
    }
    copy(name, color) {
        let biome = new Biome(this.name, this.colorName, color );
        biome.name = name || this.name;
        biome.colorName = this.colorName;
        biome.difficulty = this.difficulty;
        if (this.factors != null)
            biome.factors = this.factors.slice();
        if (this.tags != null)
            biome.tags = this.tags.slice();
        return biome;
    }
    addFactor(tags) {
        this.tags.push(tags);
        this.factors.push(biomeFactorMap.get(tags));
        return this;
    }
    hasTag(tag) {
        return this.tags.flat(16).includes(tag);
    }
    addFactors(tags) {
        this.tags.push(...tags)
        this.factors.push(...mapDeep(tags, f => biomeFactorMap.get(f)));
        return this;
    }
}
