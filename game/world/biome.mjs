import { p } from "../../engine/core/p5engine.mjs";
import { cubicBlendW, inverseLerp, posterize } from "../../engine/n0math/ranges.mjs";
import { luts } from "./BiomeWork.mjs";

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
        this.bitter = luts[0][name] || [255,0,255]
        this.plain = luts[1][name]|| [255,0,255]
        this.sugar = luts[2][name]|| [255,0,255]
        this.sugarLevel = color;
        this.difficulty = 1;
        this.color = color;
        this.tags = tags;
        this.factors = (tags != null) ? mapDeep(tags, f => biomeFactorMap.get(f)) : []
        this.tiles = tiles || []
    }
    colorsugar (biome){
        if (!this.bitter || !this.plain || !this.sugar) {
            return this.color;
        }
        var gc = biome.sugar;
        let isu = inverseLerp(gc.minm, gc.maxm, gc.sum);
        //isu = posterize(isu, 5)

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
