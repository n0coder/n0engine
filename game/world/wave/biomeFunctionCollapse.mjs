import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { n0FunctionCollapse } from "./n0FunctionCollapse.mjs";
import Alea from "alea";
import { createNoise2D } from "simplex-noise";
import { getBiome, readRaw, worldFactors } from "../FactorManager.mjs";
import { inverseLerp } from "../../../engine/n0math/ranges.mjs";
import { n0loader } from "../../../engine/core/ResourceManagement/loader.mjs";

export class BiomeFunctionCollapse {
    constructor(nano) {
        this.nano = nano;
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;
        this.w = 28 * 4;
        this.h = 18 * 4;
        this.alea = Alea("n0")
        this.nfc = new n0FunctionCollapse(this.alea)
        this.blocks = null

        for (const [k, v] of worldFactors) {
            v.init(createNoise2D(this.alea));
        }
        //this.tiles = new Map()
        this.i = 0;
        this.o = 0;
        this.ready = false;
        this.read = false;
        this.useNfc = false;

        if (this.useNfc) {
            import('./waveImport.mjs').then(u => { }) //no
            n0loader.startLoading("bfc", (loaded) => this.init(loaded), ["tiles"]) //a wierd issue
        }
        else this.init()
    }
    init(loaded) {
        //let biomes = []
        //var biomea = new Biome("green", [166, 145, 100], ['plain'], ["green0","green1","green2","green3","green4","green5","green6"])
        //var biomeb = new Biome("purple", [166, 75, 155], ['fantasy'], ["purple0","purple1","purple2","purple3","purple4","purple5","purple6"])
        //biomes.unshift(biomea, biomeb)

        //figuring out underlying issues
        this.ready = true;
        loaded?.()
    }

    genChunk(x, y, w, h) {

        for (let i = 0; i < w; i++) {
            for (let o = 0; o < h; o++) {
                var tile = worldGrid.tiles.get(`${x + i}, ${y + o}`)
                if (tile) continue;

                var biome = getBiome(x + i, y + o)
                if (biome.biome === null) {
                    worldGrid.tiles.set(`${x + i}, ${y + o}`, null)
                    continue
                }
                biome.x = x + i, biome.y = y + o;
                biome.sugar = {
                    minm: 0, maxm: 2, sum: biome.biome.sugarLevel 
                }
                biome.pathDifficulty = biome?.biome != null ? biome?.biome?.getDifficulty(biome) : 9; //can't walk through an 8
                
                if (this.useNfc)
                    tile = this.nfc.collapseBiomeTile(x + i, y + o, biome);
                worldGrid.tiles.set(`${x + i}, ${y + o}`, tile || biome)
            }
        }
        if (this.useNfc)
            this.nfc.blocksBiome(x, y, w, h, 5)
    }

    getABiome(biomes, vx, vy) {
        let genCache = new Map();
        let biomex = [];
        for (const b of biomes) {
            const mappedBiome = this.mapBiome(b.factors, s => {
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

        return { genCache, biome: biomex.length > 0 ? biomex[0] : null };
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
            if (typeof a === 'boolean') {
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
        if (!this.ready) return;
        //testing entire board shifts
        var x = worldGrid.x;
        var y = worldGrid.y;

        var c = worldGrid.chunkSize * 2; //grid space
        this.genChunk( (this.i * (c * 2)) + x, (this.o * c) + y, c * 2, c)

        this.i++;
        if (this.i >= 3) {
            this.o++
            this.i = 0;
            if (this.o >= 3) {
                this.o = 0
            }
        }


        for (let i = 0; i < this.w + 1; i++) {
            for (let o = 0; o < this.h + 1; o++) {
                var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
                if (this.useNfc)
                    this.nfc.drawTile(i + x, o + y,
                        (tile, img) => p.image(img, v.x, v.y, v.w, v.h),
                        (tile, color) => {
                            p.fill(color); p.rect(v.x, v.y, v.w, v.h)
                        }
                    );

                else {
                    var biome = worldGrid.tiles.get(`${x + i}, ${y + o}`)
                    if (biome && biome.biome) {
                        if (biome.read && this.read)
                            p.fill(readRaw ? biome.read.sum * 255 : inverseLerp(-1, 1, biome.read.sum) * 255)
                        else {
                            let colora = biome.biome.colorsugar(biome);
                            if (colora)
                            p.fill(colora)
                        }
                        p.rect(v.x, v.y, v.w, v.h)
                    }
                }
            }
        }
    }

    doubleClicked() {
        this.read = !this.read
    }
}
