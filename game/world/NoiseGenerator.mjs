
import { ValueDriver } from "../../engine/n0math/ValueDriver.mjs";
export class NoiseGenerator {
    constructor(huh={ scale: 5, octaves: 1, persistance: .5, lacunarity: 1, offsetX: 0, offsetY: 0, add: [], multiply: [], blend: [] }) {
        this.offsetX = new ValueDriver(huh.offsetX||0);
        this.offsetY = new ValueDriver(huh.offsetY||0);
        this.noise = null
        this.scale = new ValueDriver(huh.scale||5);
        this.octaves = new ValueDriver(huh.octaves||1);
        this.persistance = new ValueDriver(huh.persistance||.5);
        this.lacunarity = new ValueDriver(huh.lacunarity||1);
        this.add = huh.add || []
        this.multiply = huh.multiply ||[]
        this.blend = huh.blend ||[]
        this.inited = false;
    }
    init(noise2d) {
        if (this.inited) return; //we set up our properties
        this.noise = noise2d;
        this.add.forEach(a =>{
            if (a.init) {
                a.init(noise2d)
              } else if (Array.isArray(a)) {
                    if ( a[0].init) 
                        a[0].init(noise2d)
                    
                };
              
        });
        this.multiply.forEach(a => a.init(noise2d));
        this.blend.forEach(a => a.init(noise2d));
        this.inited = true
    }
    getValue(x, y) {
        //console.log("xy")
        var tamp = 1;
        var tfreq = 1;
        var tsum = 0;
        var toffX = 0;
        var toffY = 0;

        //i forgot what goes into this cursed a#$ code
        //i didn't expect it to work first try
        //but thats what i get i did do this before... spent like 100+ hours on this at one point

        var amp = 1;
        var freq = 1;
        var sum = 0; //not sure i want to do this part
        for (let o = 0; o < this.octaves.getValue(); o++) {
            var sx = x / this.scale.getValue() * freq;
            var sy = y / this.scale.getValue() * freq;
            var value = this.noise(sx + this.offsetX.getValue(), sy + this.offsetY.getValue());
            sum += value * amp;
            amp *= this.persistance.getValue();
            freq *= this.lacunarity.getValue();
        }
        //console.log(this.add)
        for (let a = 0; a < this.add.length; a++) {
            //console.log(a)
            
        }
        this.add.forEach(a=> {
            if (a.getValue) {
                var value =a.getValue(x,y)
                sum += value.sum * a[1];
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
        this.multiply.forEach(a=> {
            if (a.getValue) {
                var value =a.getValue(x,y)
                sum *= value.sum * a[1];
                amp*= value.amp;
                freq*=value.freq;
              } else if (Array.isArray(a)) {
                    if ( a[0].getValue) {
                        var value = a[0].getValue(x,y)
                        sum *= value.sum * a[1];
                        amp*= value.amp;
                        freq*=value.freq;
                    }
                };
        })
        //console.log()
        return {sum, amp, freq}
    }
}