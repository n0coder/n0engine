import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import { p } from "../../engine/core/p5engine.mjs"
import { worldGrid } from "../../engine/grid/worldGrid.mjs"
import Alea from 'alea';
import { createNoise2D } from 'simplex-noise'
import { blend, blendw, clamp, inverseLerp, lerp } from '../../engine/n0math/ranges.mjs'
import { gameH, gameW } from "../../engine/n0config.mjs";
import { RangeMap } from "../../engine/collections/RangeMap.mjs"
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
export class TerrainGenerator {
    constructor(nano) {
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;
        this.random = "abi";
        this.alea = Alea(this.random)
        this.nano = nano;
        this.range = new RangeMap(-0.52, 1.6);
        this.range.add([50, 50, 200], 2)
        this.range.add([50, 200, 50], 1)
        this.range.add([150, 200, 150],2)
        this.min = Infinity;
        this.max = -Infinity;
        var scale = 5;
        this.noi2 = new NoiseGenerator({ scale: scale*2.5, octaves: 1, persistance: .5, lacunarity: 1, offsetX:253, offsetY:222 })
        this.noi = new NoiseGenerator({ scale: scale, octaves: 3, persistance: .5, lacunarity: 2, add: [[this.noi2,-3]] });
        console.log(this)
    }
    init() {
        this.noi.init(createNoise2D(this.alea));
    }
    getBiome(x, y) {
        var size = 5;
        //get values between a range and return a color (simple)
        var elevation = this.noi.getValue(x, y).sum
        elevation = inverseLerp(-1.3, 1.43, elevation);
        if (elevation < this.min) this.min = elevation;
        if (elevation > this.max) this.max = elevation
        var biome = this.range.get(elevation)
        //biome.value = ;
        //console.log([elevation, this.range, biome])

        return { biome, value: elevation };
    }
    updateMap() {
        var obj =  new Map();

        for (let x = 0; x < worldGrid.chunkSize * 14; x++) {
            for (let y = 0; y < worldGrid.chunkSize * 8; y++) {

                var gridNano = worldGrid.screenToGridPoint(this.nano.x, this.nano.y);

                var gw = gridNano.x, gh = gridNano.y
                //var brightness = inverseLerp(-1,1, this.getNoise((x),(y), 50, 4, .5,2));
                var v = worldGrid.gridBoundsScreenSpace(x, y, 1, 1)
                var biome = this.getBiome(x + gw, y + gh).biome// *255
                biome ||= [0,0,0]
                obj.set(`${x},${y}`, {biome}) 
            }
        }
        this.map = obj;
    }
    draw() {

        var mx = inverseLerp(0, p.width, p.mouseX);
        var my = clamp(0, 1, inverseLerp(0, p.height, p.mouseY));
        var gridGameWH = worldGrid.screenToGridPoint(gameW / 2, gameH / 2)
        for (let x = 0; x < worldGrid.chunkSize * 14; x++) {
            for (let y = 0; y < worldGrid.chunkSize * 8; y++) {
                //var brightness = inverseLerp(-1,1, this.getNoise((x),(y), 50, 4, .5,2));
                var v = worldGrid.gridBoundsScreenSpace(x, y, 1, 1)
                //var biome = this.getBiome(x+gw,y+gh).biome// *255
                //biome ||= [0,0,0]
                if (this.map) {
                    var biome = this.map.get(`${x},${y}`)
                    p.fill(biome?.biome  || [0,0,0]);
                    p.rect(v.x, v.y, v.w, v.h)
                }
            }
        }
        p.fill(255);
        var b = blendw([0, [32, 4], 0], mx)
        p.ellipse(256, 256, 1 * b);

        //var v = worldGrid.gridBoundsScreenSpace(0,0, 1,1)

        //var noise = this.getNoise(mx*.05, my*.05)
        //console.log([mx,my])
        //p.fill(255);
        //p.ellipse(p.mouseX,p.mouseY,25*mx,25*my)
    }
}