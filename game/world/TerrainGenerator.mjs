import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import {p} from "../../engine/core/p5engine.mjs"
import {worldGrid} from "../../engine/grid/worldGrid.mjs"
import Alea from 'alea';
import {createNoise2D} from 'simplex-noise'
import {clamp, inverseLerp} from '../../engine/n0math/ranges.mjs'
import { gameH, gameW } from "../../engine/n0config.mjs";
import {RangeMap} from "../../engine/collections/RangeMap.mjs"
class NoiseGenerator {
    constructor (alea, scale, octaves=1, persistance, lacunarity) {
        this.alea = alea;
        this.noise = createNoise2D(alea)
        this.scale = scale;
        this.octaves = octaves;
        this.persistance = persistance;
        this.lacunarity = lacunarity;
    }
    get(x,y){
        var amp = 1;
        var freq = 1;
        var h = 0; //not sure i want to do this part
        for (let o = 0; o < this.octaves; o++) {
            var sx = x / this.scale * freq;
            var sy = y / this.scale * freq;
            var noi = this.noise(sx,sy);
            h+=noi*amp;
            amp*=this.persistance;
            freq*=this.lacunarity;
        }
        return h
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
        this.range = new RangeMap(-.72, 1.7);
        this.range.add([50,50,200],2)
        this.range.add([50,200,50],2)
        this.range.add([150,200,150])
        this.min = Infinity;
        this.max=-Infinity;
        this.noi = new NoiseGenerator(this.alea, 5, 1, .5, 2);
        this.noi2 = new NoiseGenerator(this.alea, 15,1,.5,1 )
        console.log(this)
    }
    
    getBiome(x,y) {
        var size = 5;
        //get values between a range and return a color (simple)
        var elevation = this.noi.get(x,y) 
        elevation = inverseLerp(-1.3, 1.43, elevation)-this.noi2.get(x,y) ;
        if (elevation<this.min) this.min = elevation;
        if (elevation>this.max) this.max = elevation
        var biome =  this.range.get(elevation)
        //biome.value = ;
        //console.log([elevation, this.range, biome])
        
        return {biome, value: elevation };
    }
    draw() {
        var mx = clamp(0,1,inverseLerp(0, p.width, p.mouseX));
        var my = clamp(0,1,inverseLerp(0, p.height, p.mouseY));
        var gridGameWH = worldGrid.screenToGridPoint(gameW/2, gameH/2)
        var gridNano = worldGrid.screenToGridPoint(this.nano.x, this.nano.y);
        
        var gw = gridNano.x, gh = gridNano.y
        for (let x = 0; x < worldGrid.chunkSize*14; x++) {
            for (let y = 0; y < worldGrid.chunkSize*8; y++) {
                //var brightness = inverseLerp(-1,1, this.getNoise((x),(y), 50, 4, .5,2));
                var v = worldGrid.gridBoundsScreenSpace(x,y, 1,1)
                var biome = this.getBiome(x+gw,y+gh).biome// *255
                biome ||= [0,0,0]
                p.fill(biome);
                p.rect(v.x, v.y, v.w, v.h)
            }
        }

        
        //var v = worldGrid.gridBoundsScreenSpace(0,0, 1,1)
        
        //var noise = this.getNoise(mx*.05, my*.05)
        //console.log([mx,my])
        //p.fill(255);
        //p.ellipse(p.mouseX,p.mouseY,25*mx,25*my)
    }
}