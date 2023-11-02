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
    constructor(name, color, tags, tiles) {
        this.name = name
        this.color = color || [255, 0, 255]; 
        this.tags = tags; 
        this.factors = (tags!=null) ? mapDeep(tags, f => biomeFactorMap.get(f)) : []
        this.tiles = tiles || []
    }
    copy(name, color) {
        let biome = new Biome(name||this.name, color||this.color);
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
