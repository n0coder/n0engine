import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
export function mapDeep(arr, mapFn) {
    return arr.map(item => Array.isArray(item) ? mapDeep(item, mapFn) : mapFn(item));
}

export const biomeFactorMap = new Map()
export function addBiomeFactors(map, factor) {
    var ranges = map.exportRanges(factor)
    ranges.forEach(r=>{
        var [tag, fact, min, max] = r;
        var obj = { factor: fact, min: min, max: max }
        biomeFactorMap.set(tag, obj)
    })
}


export class Biome {
    constructor(name, color, factors) {
        //console.log([name,factors])
        this.name = name
        this.color = color || [255, 0, 255]; 
        //allow for creating biomes without factors
        this.factors = (factors!=null) ? mapDeep(factors, f => biomeFactorMap.get(f)) : []
        //console.log(this.factors)
    }
    copy(name, color) {
        let biome = new Biome(name||this.name, color||this.color);
        if (this.factors != null)
            biome.factors = this.factors.slice();
        return biome;
    }
    addFactor(factor) {
        this.factors.push(biomeFactorMap.get(factor));
        return this;
    }
    addFactors(factors) {
        this.factors.push(...mapDeep(factors, f => biomeFactorMap.get(f)));
        return this;
    }
}