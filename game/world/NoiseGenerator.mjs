
import { ValueDriver } from "../../engine/n0math/ValueDriver.mjs";

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
    getValue(x, y) {
        var octaves =  this.octaves.getValue(x,y)
        octaves = octaves.sum?octaves.sum:octaves;
        var scale=this.scale.getValue(x,y)
        scale = scale.sum?scale.sum:scale;
        var offsetX = this.offsetX.getValue(x,y)
        offsetX = offsetX.sum?offsetX.sum:offsetX
        var offsetY = this.offsetY.getValue(x,y)
        offsetY = offsetY.sum?offsetY.sum:offsetY
        var pers = this.persistance.getValue(x,y)
        pers = pers.sum?pers.sum:pers
        var lac = this.lacunarity.getValue(x,y)
        lac = lac.sum?lac.sum:lac


        var amp = 1;
        var freq = 1;
        var sum = 0; //not sure i want to do this part
        for (let o = 0; o < octaves; o++) {
            var sx = x / scale * freq;
            var sy = y / scale * freq;
            var value = this.noise(sx + offsetX, sy + offsetY);
            sum += value * amp;
            amp *= pers;
            freq *= lac;
        }
        this.multiply.forEach(a=> {
            //console.log(a)
            if (a.getValue) {
                var value =a.getValue(x,y)
                sum *= value.sum;
                amp*= value.amp;
                freq*=value.freq;

               
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue) {
                        var value = a[0].getValue(x,y)
                        //console.log([this.a, {sum, amp, freq}, "comb", value])
                        sum *= value.sum * a[1];
                        amp*= value.amp;
                        freq*=value.freq;
                    }
                };
        })
        this.add.forEach(a=> {
            if (a.getValue) {
                var value =a.getValue(x,y)
                sum += value.sum;
                amp+= value.amp;
                freq+=value.freq;
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue) {
                        var value = a[0].getValue(x,y)
                        sum += value.sum * a[1];
                        amp+= value.amp;
                        freq+=value.freq;
                    }
                };
        })
        //console.log([this.a,sum, amp, freq] )
        var amp = this.amp.getValue(x,y)
        amp = amp.sum?amp.sum:amp
        sum*= amp
        amp*=amp
        
        var o = this.offset.getValue(x,y)
        sum+= o.sum ? o.sum : o;
        //console.log()
        return {sum, amp, freq}
    }
}