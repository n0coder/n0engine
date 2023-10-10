import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";

export class Biome {
    constructor(name, color, factors) {
        this.name = name
        this.color = color || [255, 0, 255]; 
        this.factors = factors || []
    }
    copy() {
        return new Biome(this.name, this.color, this.factors);
    }
}