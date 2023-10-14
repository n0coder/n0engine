
import { ValueDriver } from "../../engine/n0math/ValueDriver.mjs";
import { blendw, clamp, createCubicInterpolator, cubicBlendW, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";

//octaves control how detailed a section is
//
export let noiseCount = 0;
export class NoiseGenerator {
    constructor(huh = { scale: 5, amp: 1, abs: false, blendClassic: false, mapSpace: [-1, 1], blendPower: 2, blendWeight: 1, highClip: Infinity, lowClip: -Infinity, octaves: 1, persistance: .5, lacunarity: 1, power: 1, offsetX: 0, offsetY: 0, offset: 0, add: [], multiply: [], blend: [], map: [] }) {
        this.offsetX = new ValueDriver(huh.offsetX || 0);
        this.offsetY = new ValueDriver(huh.offsetY || 0);
        this.offset = new ValueDriver(huh.offset || 0)
        this.blendWeight = new ValueDriver(huh.blendWeight || 1)
        this.highClip = new ValueDriver(huh.highClip != null ? huh.highClip : Infinity)
        this.lowClip = new ValueDriver(huh.lowClip != null ? huh.lowClip : -Infinity)
        this.abs = huh.abs || false;
        this.blendClassic = huh.blendClassic || false //i just realized this or false will never happen
        this.noise = null
        this.scale = new ValueDriver(huh.scale || 5);
        this.octaves = new ValueDriver(huh.octaves || 1);
        this.persistance = new ValueDriver(huh.persistance || .5);
        this.lacunarity = new ValueDriver(huh.lacunarity || 1);
        this.power = new ValueDriver(huh.power || 1)
        this.amp = new ValueDriver(huh.amp || 1)
        this.add = huh.add || []
        this.multiply = huh.multiply || []
        this.blend = huh.blend || []
        this.blendPower = new ValueDriver(huh.blendPower || 2)
        this.mapSpace = huh.mapSpace || [-1, 1]
        this.map = huh.map || []
        if (this.map.length > 1) {
            if (this.map.some(m => m.c == null || m.y == null)) {
                console.error("A control point or value was not set correctly");
            } else {
                this.mapper = createCubicInterpolator(this.map);
            }
        }
        this.inited = false;
    }

    init(noise2d) {
        
        if (this.inited) return; //we set up our properties

        this.id = noiseCount++;
        this.noise = noise2d;
        this.offset.init(noise2d)
        this.offsetX.init(noise2d)
        this.offsetY.init(noise2d)
        this.scale.init(noise2d)
        this.octaves.init(noise2d)
        this.persistance.init(noise2d)
        this.blendWeight.init(noise2d);
        this.blendPower.init(noise2d);
        this.lacunarity.init(noise2d)
        this.power.init(noise2d)
        this.amp.init(noise2d)
        this.multiply.forEach(a => {
            if (a.init) {
                a.init(noise2d)
            } else if (Array.isArray(a)) {
                if (a[0].init)
                    a[0].init(noise2d)

            };
        });
        this.add.forEach(a => {
            if (a.init) {
                a.init(noise2d)
            } else if (Array.isArray(a)) {
                if (a[0].init)
                    a[0].init(noise2d)

            };
        });
        this.blend.forEach(a => {
            if (a.init) {
                a.init(noise2d)
            } else if (Array.isArray(a)) {
                if (a[0].init)
                    a[0].init(noise2d)

            };
        });
        this.inited = true
    }
    toValue(value, x, y) {
        var octaves = value.getValue(x, y)
        return octaves.sum != null ? octaves.sum : octaves;
    }
    //ps, ways to optimize this
    //cache x and y values 
    //(if we get the same input multiple times from the same generator)
    //we can skip generation, just return what we already calculated
    //this would optimize the way we reuse the same generator
    
    getValue(x, y) {

        var blendWeight = this.toValue(this.blendWeight, x, y)
        var blendPower = this.toValue(this.blendPower, x, y)
        var offset = this.offset.getValue(x, y)

        var { sum, minm, maxm } = this.generateNoise(x, y);
        if (this.abs) {
            sum = Math.abs(sum);
            minm = 0;
        }

        if (this.mapper) {
            var sim = inverseLerp(minm, maxm, sum); //shift into 0 to 1 space
            sum = clamp(this.mapSpace[0],this.mapSpace[1], this.mapper(sim));
            minm = this.mapSpace[0]
            maxm = this.mapSpace[1]
            }
        
            //sum = lerp(minm, maxm, sim);

        ({ sum, minm, maxm } = this.doMultiply(x, y, sum, minm, maxm));
        ({ sum, minm, maxm } = this.doAdd(x, y, sum, minm, maxm));
        sum = this.doPow(x, y, minm, maxm, sum, 1);

        var offset;
        ({ offset, sum, minm, maxm } = this.ampoffset(x, y, sum, minm, maxm, offset));

        //console.log({cola:"b4blend", aid: this.a,minm,sum,maxm})
        if (this.blend.length > 1) {
            if (this.blendClassic) {
                ({ sum, minm, maxm } = this.classicBlend(x, y, sum, minm, maxm, blendWeight));
            } else {
                let { ominm, omaxm, osum } = this.newBlend(minm, maxm, sum, x, y, blendPower, blendWeight);
                //console.log({sum, minm, maxm, osum, ominm,omaxm})
                sum=osum
                minm=ominm
                maxm =omaxm
                //console.log ({sums, sim, min, minm, max,maxm})
            }
        }
        /*
        var near = this.toValue(this.lowClip, x, y)
        var far = this.toValue(this.highClip, x, y);
        sum = clamp(near, far, sum) 

        minm = Math.max(near, minm)
        maxm = Math.min(far, maxm)
        */
        //console.log({cola:"a4blend",aid: this.a,minm,sum,maxm})

        return {  sum, minm, maxm }
    }

    newBlend( minm, maxm, sum, x, y, blendPower, blendWeight) {
        var sim = inverseLerp(minm, maxm, sum);
        var { sums, nvu } = this.blendSumMinMax(x, y, sim, blendPower);

        //cubic blend the mins and maxes too
        sum = lerp(sum, nvu, blendWeight);
        let [min, max] = sums.reduce(([prevMin, prevMax], curr) => [Math.min(prevMin, curr), Math.max(prevMax, curr)], [Infinity, -Infinity]);
        minm = lerp(minm, min, blendWeight);
        maxm = lerp(maxm, max, blendWeight);
        return {  ominm:minm, omaxm:maxm, osum:sum };
    }

    blendSumMinMax(x, y, sim, blendPower) {
        var sums = this.blend.map(b => {
            var v = b.getValue != null ? b.getValue(x, y) : b;
            if (v.sum != null) return v.sum;
            return v;
        });
        var nvu = cubicBlendW(sums, sim, blendPower);

        var mins = this.blend.map(b => {
            var v = b.getValue != null ? b.getValue(x, y) : b;
            if (v.minm != null) return v.minm;
            return v;
        });
        var min = cubicBlendW(mins, sim, blendPower);
        sums.push(min);

        var maxes = this.blend.map(b => {
            var v = b.getValue != null ? b.getValue(x, y) : b;
            if (v.maxm != null) return v.maxm;
            return v;
        });
        var max = cubicBlendW(maxes, sim, blendPower);
        sums.push(max);
        //console.log({sums, nvu, mins, min, maxes, max})
        return { sums, nvu };
    }

    classicBlend(x, y, sum, blendWeight, minm, maxm) {
        var sim = inverseLerp(minm, maxm, sum);
        var sums = this.blend.map(b => {
            var v = b.getValue != null ? b.getValue(x, y) : b;
            return v.sum != null ? v.sum : v;
        });
        var nvu = blendw(sums, sim);
        sum = lerp(sum, nvu, blendWeight);
        let [min, max] = sums.reduce(([prevMin, prevMax], curr) => [Math.min(prevMin, curr), Math.max(prevMax, curr)], [Infinity, -Infinity]);
        minm = lerp(minm, min, blendWeight);
        maxm = lerp(maxm, max, blendWeight);
        return { sum, minm, maxm };
    }
    //should i pow in abs?
    //math.pow(math.abs(sim))
    doPow(x, y, minm, maxm, sum) {
        if (minm>sum) console.log("sum is lower than minm", {sum, minm})
        var sim = inverseLerp(minm, maxm, sum);

       // console.log([1,minm, sum, maxm])

        var exponent = this.toValue(this.power, x, y);
//world low blend
        var osim = Math.pow(sim, exponent);

        sum = lerp(minm, maxm, osim); //LOL
        //console.log([ exponent ]) 
        //we STILL have the issue where we are powing by a negative num
        return sum;
    }

    ampoffset(x, y, sum, minm, maxm, offset) {
        var ampa = this.amp.getValue(x, y);
        if (ampa.sum != null) {
            sum *= ampa.sum;
            minm *= ampa.minm;
            maxm *= ampa.maxm;
        } else {
            sum *= ampa;
            minm *= ampa;
            maxm *= ampa;
        }
        var offset = this.offset.getValue(x, y);
        if (offset.sum != null) {
            sum += offset.sum;
            minm += offset.minm;
            maxm += offset.maxm;
        } else {
            sum += offset;
            minm += offset;
            maxm += offset;
        }
        return { offset, sum, minm, maxm };
    }

    doAdd(x, y, sum, minm, maxm) {
        this.add.forEach(a => {
            if (a.getValue != null) {
                var value = a.getValue(x, y);
                sum += value.sum;
                minm += value.minm;
                maxm += value.maxm;
            } else if (Array.isArray(a)) {
                if (a[0].getValue != null) {
                    var value = a[0].getValue(x, y);
                    sum += value.sum * a[1];
                    minm += value.minm * Math.abs(a[1]);
                    maxm += value.maxm * Math.abs(a[1]);
                }
            };
        });
        return { sum, minm, maxm };
    }

    doMultiply(x, y, sum, minm, maxm) {
        this.multiply.forEach(a => {
            if (a.getValue != null) {
                var value = a.getValue(x, y);
                sum *= value.sum;
                minm *= value.minm;
                maxm *= value.maxm;
            } else if (Array.isArray(a)) {
                if (a[0].getValue != null) {
                    var value = a[0].getValue(x, y);
                    sum *= value.sum * a[1];
                    minm *= Math.abs(value.minm * a[1]);
                    maxm *= Math.abs(value.maxm * a[1]);
                }
            };
        });
        return { sum, minm, maxm };
    }

    generateNoise(x, y) {
        var scale = this.toValue(this.scale, x, y);
        var offsetX = this.toValue(this.offsetX, x, y);
        var offsetY = this.toValue(this.offsetY, x, y);
        var pers = this.toValue(this.persistance, x, y);
        var lac = this.toValue(this.lacunarity, x, y);
        var octaves = this.toValue(this.octaves, x, y);
        var minm = 0, maxm = 0;
        var amp = 1, freq = 1, sum = 0;
        for (let o = 0; o < octaves; o++) {
            var sx = x / scale * freq;
            var sy = y / scale * freq;
            var value = this.noise(sx + offsetX, sy + offsetY);

            sum += value * amp;
            minm += -1 * amp;
            maxm += 1 * amp;
            amp *= pers;
            freq *= lac;
        }
        return { sum, minm, maxm };
    }
}