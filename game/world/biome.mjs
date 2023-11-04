import { p } from "../../engine/core/p5engine.mjs";
import { cubicBlendW, inverseLerp } from "../../engine/n0math/ranges.mjs";

export function mapDeep(arr, mapFn) {
    return arr.map(item => Array.isArray(item) ? mapDeep(item, mapFn) : mapFn(item));
}

export const biomeFactorMap = new Map()
export function addBiomeFactors(map, factor) {
    var ranges = map.exportRanges(factor)
    ranges.forEach(r => {
        var [tag, fact, min, max] = r;
        var obj = { factor: fact, min: min, max: max }
        biomeFactorMap.set(tag, obj)
    })
}

export class Biome {
    constructor(name, color, tags, tiles) {
        this.name = name
        this.bitter = Array.isArray(color[0]) ? color[0]: null;
        this.plain = Array.isArray(color[1]) ? color[1]: null;
        this.sugar = Array.isArray(color[2]) ? color[2]: null;
        this.color = color;
        this.tags = tags;
        this.factors = (tags != null) ? mapDeep(tags, f => biomeFactorMap.get(f)) : []
        this.tiles = tiles || []
    }
    colorsugar (biome){
        var gc = biome.genCache.get("sugar");
        
        let isu = inverseLerp(gc.minm, gc.maxm, gc.sum);
        if (!this.bitter || !this.plain || !this.sugar) {
        
            return this.color;

        }
        let r = cubicBlendW([this.bitter[0], this.plain[0], this.sugar[0]], isu, 2)
        let g = cubicBlendW([this.bitter[1], this.plain[1], this.sugar[1]], isu, 2)
        let b = cubicBlendW([this.bitter[2], this.plain[2], this.sugar[2]], isu, 2)
        return [r,g,b]
    }
    getDifficulty (biome) {
        var gc = biome.genCache.get("sugar");
        let isu = inverseLerp(gc.minm, gc.maxm, gc.sum);
        let difi = Math.round(cubicBlendW([1, 0, -1], isu, 2))
        return difi - this.dificulty;
    }
    copy(name, color) {
        let biome = new Biome(name || this.name, color || this.color);
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
