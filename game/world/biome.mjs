export class Biome {
    constructor(name, color, factors) {
        this.name = name
        this.color = color;
        this.factors = new Map(factors)
    }

    isActive(worldFactors) {
        for (let [factor, range] of this.factors) {
            let factorValue = worldFactors.get(factor);
            if (!factorValue) console.warn(`${this.name} requires ${factor}`);
            if (factorValue < range.min || factorValue > range.max) {
                return false;
            }
        }
        return true;
    }
}