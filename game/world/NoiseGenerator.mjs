
import { ValueDriver } from "../../engine/n0math/ValueDriver.mjs";
import { blendw, clamp, createCubicInterpolator, cubicBlendW, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";

//octaves control how detailed a section is
//

export class NoiseGenerator {
    constructor(huh={ scale: 5, amp:1, abs:false, mapSpace:[-1,1], blendPower:1, blendWeight: 1, highClip: Infinity, lowClip: -Infinity, octaves: 1, persistance: .5, lacunarity: 1, power:1, offsetX: 0, offsetY: 0, offset:0, add: [], multiply: [], blend: [], map: [] }) {
        this.offsetX = new ValueDriver(huh.offsetX||0);
        this.offsetY = new ValueDriver(huh.offsetY||0);
        this.offset = new ValueDriver(huh.offset||0)
        this.blendWeight = new ValueDriver(huh.blendWeight||1)
        this.highClip =new ValueDriver(huh.highClip!=null?huh.highClip:Infinity) 
        this.lowClip=new ValueDriver(huh.lowClip!=null?huh.lowClip:-Infinity) 
        this.abs = huh.abs||false;
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
        this.blendPower = new ValueDriver(huh.blendPower) ||1
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
    getValue(x, y) {
        var octaves = this.toValue(this.octaves,x,y)
        var offsetX = this.toValue(this.offsetX,x,y)
        var offsetY = this.toValue(this.offsetY,x,y)
        var pers = this.toValue(this.persistance,x,y)
        var lac = this.toValue(this.lacunarity,x,y)
        var ampa = this.amp.getValue(x,y)// this.toValue(this.amp,x,y)
        var scale = this.toValue(this.scale,x,y)
        var blendWeight = this.toValue(this.blendWeight,x,y)
        var blendPower = this.toValue(this.blendPower, x,y)
        var offset = this.offset.getValue(x,y)

        var minm=0,maxm=0
        var amp = 1;
        var freq = 1;
        var sum = 0; //not sure i want to do this part 
        //(me unsure if i want to the thing that makes this all possible)

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

        sum = inverseLerp(minm, maxm, sum); //
        if (this.mapper) {
            sum = inverseLerp(this.mapSpace[0], this.mapSpace[1], this.mapper(sum)) 
        }
        //sum = lerp(-1,1, sum)
        
        //minm = -1, maxm=1;
        minm=this.mapSpace[0], maxm=this.mapSpace[1];
        let aminm =0, amaxm=0
        this.multiply.forEach(a=> {
            if (a.getValue != null) {
                var value =a.getValue(x,y)
                minm *= value.minm;
                maxm *= value.maxm;
                sum *=value.sum;
              
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue != null) {
                        var value = a[0].getValue(x,y)
                        sum *= value.sum * a[1];
                        minm *= Math.abs(value.minm * a[1]);
                        maxm *=  Math.abs(value.maxm * a[1]);
                    }
                };
        })
        this.add.forEach(a=> {
            if (a.getValue != null) {
                var value =a.getValue(x,y)
                sum+= value.sum;
                minm += value.minm;
                maxm += value.maxm;
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue != null) {
                        //console.log([sum])
                        var value = a[0].getValue(x,y)
                        sum += value.sum * a[1];
                        minm += value.minm * Math.abs(a[1]);
                        maxm += value.maxm * Math.abs(a[1])
                    }
                };
        })
        if (sum<(minm+aminm) || sum>(maxm+amaxm)) {
            console.log("a noise value went over computed min max",{minm,maxm, aminm, amaxm, sum})
        }
        //
        //i don't understand why this only affects the holes that fall beneath the oceans... but its cool


        sum *= ampa.sum!= null ?ampa.sum:ampa;
        minm*=ampa.minm!= null ?ampa.minm:ampa;
        maxm*=ampa.maxm!= null ?ampa.maxm:ampa;
       
        
        //console.log([this.a,"ampa ampd",minm, maxm,ampa])
        var offset = this.offset.getValue(x,y) // this.toValue(,x,y);
        sum+= offset.sum != null ?offset.sum:offset;
        minm+=offset.minm!= null ?offset.minm:offset;
        maxm+=offset.maxm!= null ?offset.maxm:offset;
         
        //this may be implemented poorly
        var fudge = 1
        var exponent = this.toValue(this.power, x,y);
        var sim = inverseLerp(minm, maxm, sum);
        sim = Math.pow(sim*fudge,exponent)
        
        if (this.blend.length > 1) {
            var sums = this.blend.map(b=>{
            var v = b.getValue!=null?b.getValue(x,y):b
            if (v.sum!=null) {
                return inverseLerp(v.minm, v.maxm, v.sum); //input map space blending
            }
            return inverseLerp(minm, maxm, v); //map space blending...
            })
            sum = lerp(sum, lerp(minm, maxm, cubicBlendW(sums, sim, blendPower)), blendWeight); 
            //the lerp blends the current map with the values that it just blended together.
        }

        //sum = inverseLerp(minm, maxm, sum); //trying to stay in a 0 to 1 range
        
        var near = this.toValue(this.lowClip,x,y)
        var far = this.toValue(this.highClip,x,y);
        //sum = clamp(this.toValue(this.lowClip,x,y), this.toValue(this.highClip,x,y), sum) 
        //sum = lerp(-1,1, sum)
        //minm = -1, maxm = 1
        // we have an issue here, 
        return {sum, minm, maxm}
    }
}