
import { ValueDriver } from "../../engine/n0math/ValueDriver.mjs";
import { blendw, clamp, createCubicInterpolator, cubicBlendW, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";

//octaves control how detailed a section is
//

export class NoiseGenerator {
    constructor(huh={ scale: 5, amp:1, abs:false, blendClassic:false, mapSpace:[-1,1], blendPower:2, blendWeight: 1, highClip: Infinity, lowClip: -Infinity, octaves: 1, persistance: .5, lacunarity: 1, power:1, offsetX: 0, offsetY: 0, offset:0, add: [], multiply: [], blend: [], map: [] }) {
        this.offsetX = new ValueDriver(huh.offsetX||0);
        this.offsetY = new ValueDriver(huh.offsetY||0);
        this.offset = new ValueDriver(huh.offset||0)
        this.blendWeight = new ValueDriver(huh.blendWeight||1)
        this.highClip =new ValueDriver(huh.highClip!=null?huh.highClip:Infinity) 
        this.lowClip=new ValueDriver(huh.lowClip!=null?huh.lowClip:-Infinity) 
        this.abs = huh.abs||false;
        this.blendClassic = huh.blendClassic ||false //i just realized this or false will never happen
        this.noise = null
        this.scale = new ValueDriver(huh.scale||5);
        this.octaves = new ValueDriver(huh.octaves||1);
        this.persistance = new ValueDriver(huh.persistance||.5);
        this.lacunarity = new ValueDriver(huh.lacunarity||1);
        this.power = new ValueDriver(huh.power||1)
        this.amp = new ValueDriver(huh.amp||1)
        this.add = huh.add || []
        this.multiply = huh.multiply ||[]
        this.blend = huh.blend ||[]
        this.blendPower = new ValueDriver(huh.blendPower||2)
        this.mapSpace = huh.mapSpace || [-1,1]
        this.map = huh.map ||[]
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
        this.multiply.forEach(a =>{
            if (a.init) {
                a.init(noise2d)
              } else if (Array.isArray(a)) {
                    if ( a[0].init) 
                        a[0].init(noise2d)
                    
                };
        });
        this.add.forEach(a =>{
            if (a.init) {
                a.init(noise2d)
              } else if (Array.isArray(a)) {
                    if ( a[0].init) 
                        a[0].init(noise2d)
                    
                };
        });
        this.blend.forEach(a =>{
            if (a.init) {
                a.init(noise2d)
              } else if (Array.isArray(a)) {
                    if ( a[0].init) 
                        a[0].init(noise2d)
                    
                };
        });
        this.inited = true
    }
    toValue(value,x,y) {
        var octaves = value.getValue(x,y)
        return octaves.sum != null?octaves.sum:octaves;
    }
    //ps, ways to optimize this
    //cache x and y values 
    //(if we get the same input multiple times from the same generator)
    //we can skip generation, just return what we already calculated
    //this would optimize the way we reuse the same generator
    
    getValue(x, y) {
        var octaves = this.toValue(this.octaves,x,y)
        var offsetX = this.toValue(this.offsetX,x,y)
        var offsetY = this.toValue(this.offsetY,x,y)
        var pers = this.toValue(this.persistance,x,y)
        var lac = this.toValue(this.lacunarity,x,y)
        var scale = this.toValue(this.scale,x,y)
        var blendWeight = this.toValue(this.blendWeight,x,y)
        var blendPower = this.toValue(this.blendPower, x,y)
        var offset = this.offset.getValue(x,y)
        
        var minm = 0, maxm = 0
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
        
        if (this.abs) {
            sum = Math.abs(sum);
            minm = 0;
            }
            //convert the noise into mapper space    
            var sim = inverseLerp(minm, maxm, sum);
            if (this.mapper) 
                sim = inverseLerp(this.mapSpace[0], this.mapSpace[1], this.mapper(sim))   
            sum = lerp(minm, maxm, sim)

        this.multiply.forEach(a=> {
            if (a.getValue != null) {
                var value =a.getValue(x,y)
                sum *=value.sum;
                minm *= value.minm;
                maxm *= value.maxm;
            } else if (Array.isArray(a)) {
                if ( a[0].getValue != null) {
                    var value = a[0].getValue(x,y)
                    sum *= value.sum * a[1];
                    minm *= Math.abs(value.minm * a[1]);
                    maxm *=  Math.abs(value.maxm * a[1]);
                }
                };
        })
        var isu = 0
        var oci = [{isu: isu++, name:"start", sum, minm,maxm}]
        this.add.forEach(a=> {
            if (a.getValue != null) {
                var value =a.getValue(x,y)
                sum += value.sum;
                minm += value.minm;
                maxm += value.maxm;
                oci.push({isu: isu++, name:"add", sum, minm,maxm, value})
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue != null) {
                        var value = a[0].getValue(x,y)
                        sum += value.sum * a[1];
                        minm += value.minm * Math.abs(a[1]);
                        maxm += value.maxm * Math.abs(a[1])
                        oci.push({isu: isu++, name:"add(multipled)", sum, minm,maxm, value, multiplier:a[1] })
                    }
                };
        })
        //console.log({sum,minm, maxm, oci})

        var ampa = this.amp.getValue(x,y)
        if (ampa.sum != null) {
            sum *= ampa.sum;
            minm*=ampa.minm;
            maxm*=ampa.maxm;
        } else {
            sum *= ampa;
            minm*=ampa;
            maxm*=ampa;
        }
        var offset = this.offset.getValue(x,y)
        if (offset.sum != null) {
            sum += offset.sum;
            minm+=offset.minm;
            maxm+=offset.maxm;            
        } else {
            sum += offset;
            minm+=offset;
            maxm+=offset;
        }
        var fudge = 1
        var exponent = this.toValue(this.power, x,y);
        // if (exponent <= 0) exponent = 1;
        var sim = inverseLerp(minm, maxm, sum)
        var isim = Math.pow(sim*fudge,exponent)           
        var som = lerp(minm, maxm, isim);
        //console.log({exponent, sim, isim,minm, maxm, som, sum})
        sim = isim;
        sum = som;

        var b4sum, b4minm, b4maxm
        if (this.blend.length > 1) {
            if (this.blendClassic) {
            var sums = this.blend.map(b=>{
            var v = b.getValue!=null?b.getValue(x,y):b
                return v.sum!=null?v.sum:v
            })
            var nvu = blendw(sums, sim)
            sum = lerp(sum, nvu, blendWeight);
            let [min, max] = sums.reduce(([prevMin,prevMax], curr)=> [Math.min(prevMin, curr), Math.max(prevMax, curr)], [Infinity, -Infinity]);
            minm = lerp(minm, min, blendWeight);
            maxm = lerp(maxm, max, blendWeight)
            } else {
                    var sums = this.blend.map(b => {
                        var v = b.getValue != null ? b.getValue(x, y) : b
                        if (v.sum != null) return v.sum                        
                        return v
                    })
                    var nvu = cubicBlendW(sums, sim, blendPower);
                    var mins = this.blend.map(b => {
                        var v = b.getValue != null ? b.getValue(x, y) : b
                        if (v.minm != null) return v.minm                        
                        return v
                    })
                    var minnvu = cubicBlendW(mins, sim, blendPower);
                    sums.push(minnvu)
                    var maxes = this.blend.map(b => {
                        var v = b.getValue != null ? b.getValue(x, y) : b
                        if (v.maxm != null) return v.maxm                        
                        return v
                    })
                    var maxnvu = cubicBlendW(maxes, sim, blendPower);
                    sums.push(maxnvu)
                    //cubic blend the mins and maxes too
                    
                    sum = lerp(sum, nvu, blendWeight); 
                    let [min, max] = sums.reduce(([prevMin,prevMax], curr)=> [Math.min(prevMin, curr), Math.max(prevMax, curr)], [Infinity, -Infinity]);
                    minm = lerp(minm, min, blendWeight);
                    maxm = lerp(maxm, max, blendWeight)
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
        //console.log({sum,minm,maxm})

        return {sum, minm, maxm}
    }
}