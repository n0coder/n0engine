import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import {n0FunctionCollapse} from "./n0FunctionCollapse.mjs";
import Alea from "alea";
import { createNoise2D } from "simplex-noise";
import { Biome, addBiomeFactors } from "../biome.mjs";
import { RangeMap } from "../../../engine/collections/RangeMap.mjs";
import { worldFactors } from "../FactorManager.mjs";
import { inverseLerp } from "../../../engine/n0math/ranges.mjs";

export class BiomeFunctionCollapse {
    constructor(nano) {
        this.nano = nano;
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;
        this.w = 28*2;
        this.h = 16*2;
        this.alea = Alea("n0")
        this.nfc = new n0FunctionCollapse(this.alea)
        this.blocks = null

        for (const [k, v] of worldFactors) {
            v.init(createNoise2D(this.alea));
        }

        var fantasy = new RangeMap(0,1);
        fantasy.add("plain").add("fantasy");
        addBiomeFactors(fantasy, "fantasy");

    }
    init() {
        let biomes = []
        var biomea = new Biome("green", [166, 145, 100], ['plain'], ["green6"])
        var biomeb = new Biome("purple", [166, 75, 155], ['fantasy'], ["purple6"])
        biomes.unshift(biomea, biomeb)
        
        var c = 5;
        for (let i = 0; i < 8; i++) {
            for (let o = 0; o < 3; o++) {
                this.geta(i*c,o*c,c,c, biomes)
            }
        }
    }

    geta(x,y,w,h,biomes) {
        for (let i = 0; i < w; i++) {
            for (let o = 0; o < h; o++) {
                //var n = noise(i*.05,o*.05)
                var biome = this.getABiome(biomes, x+i,y+o)
                biome.x = x+i, biome.y = y+o;
                this.nfc.collapseBiomeTile(x+i,y+o, biome.biome);
            }
        }
        this.nfc.blocksBiome(x,y, w,h,5) 
    }

    getABiome(biomes, vx, vy) {
        let genCache = new Map();
        let biomex = [];
        for (const b of biomes) {
            const mappedBiome = this.mapBiome(b.factors, s=>{
                if (s == null) return false;
                var factor = genCache.get(s.factor)
                    if (!factor) {
                        var vfactor = worldFactors.get(s.factor)
                        if (vfactor) factor = vfactor.getValue(vx, vy)
                        else return false;
                        genCache.set(s.factor, factor);
                    }
                var sum = inverseLerp(factor.minm, factor.maxm, factor.sum)
                return sum > s.min && sum < s.max;
            });
            if (this.pop(mappedBiome)) biomex.push(b);
        }
    
        return {genCache, biome:biomex.length>0? biomex[0]:null};
    }
    mapBiome(biome, soku) {
        return biome.map(item => {
            if (Array.isArray(item)) {
                return mapBiome(item, soku);
            } else {
                return soku(item)
            }
        });
    }
    pop(array) {
        var member = true
        var list = false, u = true;
        for (const a of array) {
            if (typeof a === 'boolean' ) {
                if (a === false) {
                    member = false;
                }
            } else if (Array.isArray(a)) {
                list ||= pop(a)
                u = false; //array exists? so use list bool
            }
        }
        return member && (list || u)
    }
    //recap, 
    /*
        when starting out with the terrain gen
        we will import info about our current tiles
    */

    draw() {
        
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
               var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
               this.nfc.drawTile(i,o, (img)=>p.image(img, v.x, v.y, v.w, v.h)); 
                
            }
        }
        
       
    }
}
