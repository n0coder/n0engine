
import { ValueDriver } from "../../engine/n0math/ValueDriver.mjs";
import { blendw, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";

//octaves control how detailed a section is
//

export class NoiseGenerator {
    constructor(huh={ scale: 5, amp:1, octaves: 1, persistance: .5, lacunarity: 1, power:1, offsetX: 0, offsetY: 0, offset:0, add: [], multiply: [], blend: [] }) {
        this.offsetX = new ValueDriver(huh.offsetX||0);
        this.offsetY = new ValueDriver(huh.offsetY||0);
        this.offset = new ValueDriver(huh.offset||0)
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
        return octaves.sum?octaves.sum:octaves;
    }
    getValue(x, y) {
        var octaves = this.toValue(this.octaves,x,y)
        var offsetX = this.toValue(this.offsetX,x,y)
        var offsetY = this.toValue(this.offsetY,x,y)
        var pers = this.toValue(this.persistance,x,y)
        var lac = this.toValue(this.lacunarity,x,y)
        var ampa = this.amp.getValue(x,y)// this.toValue(this.amp,x,y)
        var scale = this.toValue(this.scale,x,y)
        var tamp = 1;
        var minm = 0, maxm = 0
        //console.log([this.a,"init",minm, maxm])
        var amp = 1;
        var freq = 1;
        var sum = 0; //not sure i want to do this part
        for (let o = 0; o < octaves; o++) {
            var sx = x / scale * freq;
            var sy = y / scale * freq;
            var value = this.noise(sx + offsetX, sy + offsetY);

            sum += value * amp;
            minm += -1 * amp;
            maxm += 1 * amp;
            //console.log([this.a,"initial ampd",minm, maxm, amp])
            amp *= pers;
            freq *= lac;
        } 
        
        this.multiply.forEach(a=> {
            //console.log(a)
            if (a.getValue) {
                var value =a.getValue(x,y)
                minm *= value.minm;
                maxm *= value.maxm;
                //console.log([this.a,"this.multiply multiplied",minm, maxm, value.minm,value.maxm])
                sum *= value.sum;
                amp *= value.amp;
                freq*=value.freq;

               
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue) {
                        var value = a[0].getValue(x,y)
                        //console.log([this.a, {sum, amp, freq}, "comb", value])
                        sum *= value.sum * a[1];
                        minm *= value.minm * Math.abs(a[1]);
                        maxm *= value.maxm * Math.abs(a[1]);
                        //console.log([this.a,"this.multiply multiplied",minm, maxm, value.minm*a[1],value.maxm*a[1]])
                        amp*= value.amp;
                        freq*=value.freq;
                    }
                };
        })
        
       
        this.add.forEach(a=> {
            if (a.getValue) {
                var value =a.getValue(x,y)
                sum += value.sum;
                minm += value.minm;
                maxm += value.maxm;
                //console.log([this.a,"this.add added",minm, maxm, value.minm,value.maxm])
                amp+= value.amp;
                freq+=value.freq;
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue) {
                        var value = a[0].getValue(x,y)
                        sum += value.sum * a[1];
                        minm += value.minm * Math.abs(a[1]);
                        maxm += value.maxm * Math.abs(a[1])
                        //console.log([this.a,"this.add added",minm, maxm, value.minm * a[1],value.maxm * a[1], a[1]])
                        amp+= value.amp;
                        freq+=value.freq;
                    }
                };
        })
        
        
        
        sum *= ampa.sum?ampa.sum:ampa;
        minm*=ampa.minm?ampa.minm:ampa;
        maxm*=ampa.maxm?ampa.maxm:ampa;
        amp*=ampa
        
        //console.log([this.a,"ampa ampd",minm, maxm,ampa])
        var offset = this.offset.getValue(x,y) // this.toValue(,x,y);
        sum+= offset.sum?offset.sum:offset;
        minm+=offset.minm?offset.minm:offset;
        maxm+=offset.maxm?offset.maxm:offset;
        
        var fudge = 1
        var exponent = this.toValue(this.power, x,y);
        var sim = inverseLerp(minm, maxm, sum)
        sim = Math.pow(sim*fudge,exponent)
        var sum = lerp(minm, maxm, sim);

        if (this.blend.length > 1) {
        var sums = this.blend.map(b=>{
            var v = b.getValue?b.getValue(x,y):b
            return v.sum?v.sum:v
        })

        sum = blendw(sums, sim);
        }
        //console.log([this.a,"offset",minm, maxm,offset])
        //console.log()
        return {sum, amp, freq, minm, maxm}
    }
}