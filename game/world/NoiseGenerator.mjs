
import { ValueDriver } from "../../engine/n0math/ValueDriver.mjs";
import { Map2d } from "../../engine/n0math/map2d.mjs";
import { blendw, clamp, createCubicInterpolator, cubicBlendW, inverseLerp, lerp, recubic } from "../../engine/n0math/ranges.mjs";
import { Graph } from "./noiseGen/graph.mjs";

//octaves control how detailed a section is
//
export let noiseCount = 0;
export class NoiseGenerator {
    constructor(huh = { name: "noise", scale: 5, amp: 1, inverted: false, abs: false, blendStyle: "new", mapSpace: [-1, 1], blendPower: 2, blendWeight: 1, highClip: Infinity, lowClip: -Infinity, octaves: 1, persistance: .5, lacunarity: 1, power: 1, offsetX: 0, offsetY: 0, offset: 0, add: [], multiply: [], blend: [], map: [] }) {
        this.name = huh.name || "noise";
        this.offsetX = new ValueDriver(huh.offsetX || 0);
        this.offsetY = new ValueDriver(huh.offsetY || 0);
        this.offset = new ValueDriver(huh.offset || 0)
        this.blendWeight = new ValueDriver(huh.blendWeight || 1)
        this.highClip = new ValueDriver(huh.highClip != null ? huh.highClip : Infinity)
        this.lowClip = new ValueDriver(huh.lowClip != null ? huh.lowClip : -Infinity)
        this.abs = huh.abs || false;
        this.inverted = huh.inverted || false;
        this.blendStyle = huh.blendStyle || "new" //i just realized this or false will never happen
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
        this.pointCache = new Map2d()
        this.inited = false;
        this.mini =0; this.maxi =1;
    }
    clean( ) {
        this.pointCache.clearAll();
        this.offset.clean();
        this.offsetX.clean();
        this.offsetY.clean();
        this.blendWeight.clean();
        this.highClip.clean();
        this.lowClip.clean();
        this.scale.clean();
        this.octaves.clean();
        this.persistance.clean();
        this.lacunarity.clean();
        this.power.clean();
        this.amp.clean();
        this.blendPower.clean();

        for (const add of this.add) {
            add.clean?.()
        }
        for (const multiply of this.multiply) {
            multiply.clean?.()
        }
        for (const blend of this.blend) {
            blend.clean?.()
        }
    }
    init(noise2d, min=-1, max=1) {
        
        if (this.inited) return; //we set up our properties
        this.max = max;
        this.min = min;
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
        return octaves.sum ?? octaves;
    }
    //ps, ways to optimize this
    //cache x and y values 
    //(if we get the same input multiple times from the same generator)
    //we can skip generation, just return what we already calculated
    //this would optimize the way we reuse the same generator

    getValue(x, y, minmaxsum=true) {
        var value = this.pointCache.get(x, y) //take from cache
        if (value) return value;
        var blendWeight = this.toValue(this.blendWeight, x, y)
        var blendPower = this.toValue(this.blendPower, x, y)
        var offset = this.offset.getValue(x, y)

        var minmax = this.generateNoise(x, y);
        //console.log(minmax.sum, this);
        //minmax.sum = minmax.maxm - minmax.sum
        if (this.abs) {
            minmax.sum = Math.abs(minmax.sum);
            minmax.minm = 0;
        }

        if (this.mapper) {
            var sim = inverseLerp(minmax.minm, minmax.maxm, minmax.sum); //shift into 0 to 1 space
            minmax.sum = clamp(this.mapSpace[0], this.mapSpace[1], this.mapper(sim));
            minmax.minm = this.mapSpace[0]
            minmax.maxm = this.mapSpace[1]
        }
        //console.log(minmax.sum, this);
        //sum = lerp(minm, maxm, sim);
        (this.doMultiply(x, y, minmax));
        (this.doAdd(x, y, minmax));
        this.doPow(x, y, minmax, 1);
        //console.log(minmax.sum, this);
        //when we invert, and the maxm is too low, for whatever reason... 
        // (such as input "noise" function being an axis instead of a constant...)
        //this shifts the value way outside range; 
        if (this.inverted && minmax.sum <= minmax.maxm )  
            minmax.sum = minmax.maxm - minmax.sum
        var offset;
        (offset = this.ampoffset(x, y, minmax, offset));
        //console.log(minmax.sum, this);
        //console.log({cola:"b4blend", aid: this.a,minm,sum,maxm})
        if (this.blend.length > 1) {
            if (this.blendStyle === "new") {
                this.newBlend(minmax, x, y, blendPower, blendWeight);
            } else if (this.blendStyle === "recubic") {
                let blenpa = blendPower;
                this.recubix(minmax, x, y, blendPower, blendWeight);
               
            }
        }

        value = minmaxsum ? minmax : minmax.sum
        this.mini = minmax.minm;
        this.maxi = minmax.maxm;
        this.pointCache.set(x, y, value)
        return value
    }

    newBlend(minmax, x, y, blendPower) {
        var spoints = this.blend.map(v => {
            if (typeof v === "function") return v(x,y);
            if (v.create) return v.create(x,y);
            if (v.getValue) return v.getValue(x,y);
            if (v.sum) return v;
            return v
        })
        var i = inverseLerp(minmax.minm, minmax.maxm, minmax.sum);
        var sums = spoints.map(v => v.sum ?? v );
        var mins = spoints.map(v => v.minm ?? v );
        var maxs = spoints.map(v => v.maxm ?? v );
        minmax.sum = cubicBlendW(sums, i, blendPower);
        minmax.minm = Math.min(...mins)
        minmax.maxm = Math.max(...maxs)
    }
    recubix(minmax, x, y, blenpa, blendWeight){
        let min = Infinity;
        let max = -Infinity;
        let sums = this.blend.map((v) => {
            if (v.sum != null) return v.sum;
            if (typeof v === "function") {
                let sum = v(output);
                min = Math.min(min, sum);
                max = Math.max(max, sum);
                return sum;
            }
            if (v instanceof Graph) {
                let tech = v.create(output.x, output.y);
                min = Math.min(min, tech.minm);
                max = Math.max(max, tech.maxm);
                return tech.sum;
            }
            if (v && v.sum != null) {
                min = Math.min(min, v.minm ?? v.sum);
                max = Math.max(max, v.maxm ?? v.sum);
                return v.sum;
            }
            if (v.getValue != null) {
                let b = v.getValue(x, y)
                min = Math.min(min, b.minm ?? b.sum);
                max = Math.max(max, b.maxm ?? b.sum);
                return b.sum;
            }
            min = Math.min(min, v);
            max = Math.max(max, v);
            return v;
        });
        let sim = inverseLerp(minmax.minm, minmax.maxm, minmax.sum);
        //console.log({mxsum:minmax.sum, mxmin:minmax.minm, mxmax: minmax.maxm, sim});
        minmax.sum = recubic(sums, sim, blenpa);
        minmax.minm = min;
        minmax.maxm = max;
        //console.log(minmax.sum, sim);
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

    classicBlend(x, y, minmax, blendWeight) {
        var sim = inverseLerp(minmax.minm, minmax.maxm, minmax.sum);
        var sums = this.blend.map(b => {
            var v = b.getValue != null ? b.getValue(x, y) : b;
            return v.sum ?? v;
        });
        var nvu = blendw(sums, sim);
        minmax.sum = lerp(minmax.sum, nvu, blendWeight);
        let [min, max] = sums.reduce(([prevMin, prevMax], curr) => [Math.min(prevMin, curr), Math.max(prevMax, curr)], [Infinity, -Infinity]);
        minmax.minm = lerp(minmax.minm, min, blendWeight);
        minmax.maxm = lerp(minmax.maxm, max, blendWeight);
    }
    //should i pow in abs?
    //math.pow(math.abs(sim))
    doPow(x, y, minmax) {
        if (minmax.minm > minmax.sum) console.log("sum is lower than minm", this, minmax)
        if (minmax.maxm < minmax.sum ) console.log("sum is higher than maxm", this, minmax)
        var sim = inverseLerp(minmax.minm, minmax.maxm, minmax.sum);

        // console.log([1,minm, sum, maxm])

        var exponent = this.toValue(this.power, x, y);
        //world low blend
        var osim = Math.pow(sim, exponent);

        minmax.sum = lerp(minmax.minm, minmax.maxm, osim); //LOL
        //console.log([ exponent ]) 
        //we STILL have the issue where we are powing by a negative num
        return minmax.sum;
    }

    ampoffset(x, y, minmax, offset) {
        var ampa = this.amp.getValue(x, y);
        if (ampa.sum != null) {
            minmax.sum *= ampa.sum;
            minmax.minm *= ampa.minm;
            minmax.maxm *= ampa.maxm;
        } else {
            minmax.sum *= ampa;
            minmax.minm *= ampa;
            minmax.maxm *= ampa;
        }
        var offset = this.offset.getValue(x, y);
        if (offset.sum != null) {
            minmax.sum += offset.sum;
            minmax.minm += offset.minm;
            minmax.maxm += offset.maxm;
        } else {
            minmax.sum += offset;
            minmax.minm += offset;
            minmax.maxm += offset;
        }
        return offset;
    }

doAdd(x, y, minmax) {
    this.add.forEach(a => {
        let ss = minmax.sum, smin = minmax.minm, smax = minmax.maxm;
        if ( smax < ss || smin > ss ) {
            console.log("started out of bounds", this, {sums: {ss, es}, min: {smin, emin}, max:{smax,emax}})
            return;
        }
        if (a.getValue != null) {
            const v = a.getValue(x, y);
            minmax.sum += v.sum;
            // union the bounds
            minmax.minm = Math.min(minmax.minm, minmax.minm + v.minm);
            minmax.maxm = Math.max(minmax.maxm, minmax.maxm + v.maxm);
            
            let es = minmax.sum, emin = minmax.minm, emax = minmax.maxm;
            if ( emax < es || emin > es )  console.log("ended out of bounds num", {sums: {ss, es}, min: {smin, emin}, max:{smax,emax}})
            return;
        }

        if (Array.isArray(a)) {
            const m = a[1];
            const v = a[0].getValue?.(x, y) ?? a[0];
            let sign = Math.sign(m);
            let min = v.minm*m;
            let max = v.maxm*m;
            if (m < 0){
                max = v.minm*m;
                min = v.maxm*m;
            }
            minmax.sum += v.sum * m;
            minmax.minm = Math.min(minmax.minm, minmax.minm + min);
            minmax.maxm = Math.max(minmax.maxm, minmax.maxm + max);
            let es = minmax.sum, emin = minmax.minm, emax = minmax.maxm;
            if ( emax < es || emin > es ) console.log("ended out of bounds range", {sums: {ss, es}, min: {smin, min, emin}, max:{smax, max, emax}})
            return;
        }
    });
}


    doMultiply(x, y, minmax) {
        this.multiply.forEach(a => {
            if (a.getValue != null) {
                var value = a.getValue(x, y);
                minmax.sum *= value.sum;
                minmax.minm *= value.minm;
                minmax.maxm *= value.maxm;
            } else if (Array.isArray(a)) {
                if (a[0].getValue != null) {
                    var value = a[0].getValue(x, y);
                    minmax.sum *= value.sum * a[1];
                    minmax.minm *= Math.abs(value.minm * a[1]);
                    minmax.maxm *= Math.abs(value.maxm * a[1]);
                }
            };
        });
    }

    generateNoise(x, y) {
        var scale = this.toValue(this.scale, x, y);
        var offsetX = this.toValue(this.offsetX, x, y);
        var offsetY = this.toValue(this.offsetY, x, y);
        var pers = this.toValue(this.persistance, x, y);
        var lac = this.toValue(this.lacunarity, x, y);
        var octaves = this.toValue(this.octaves, x, y);
        var minm = 0, maxm = 0;
        var amp = 1, freq = 1, sum = 0, soup = 0;
        for (let o = 0; o < octaves; o++) {
            var sx = x / scale * freq;
            var sy = y / scale * freq;
            var value = this.noise(sx + offsetX, sy + offsetY);

            sum += value * amp;
            minm += this.min * amp;
            maxm += this.max * amp;

            soup+=amp;
            amp *= pers;
            freq *= lac;
        }
        gens += 1
        //console.log({sum, minm, maxm, min:this.min, max:this.max})
        return { sum, minm, maxm };
    }
}
globalThis. gens = 0