import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import { p } from "../../engine/core/p5engine.mjs"
import { worldGrid } from "../../engine/grid/worldGrid.mjs"
import Alea from 'alea';
import { createNoise2D } from 'simplex-noise'
import { blend, blendw, clamp, inverseLerp, lerp } from '../../engine/n0math/ranges.mjs'
import { gameH, gameW } from "../../engine/n0config.mjs";
import { RangeMap } from "../../engine/collections/RangeMap.mjs"
import { getBiome, minmax, one, readRaw, worldFactors } from "./FactorManager.mjs";
export class TerrainGenerator {
    constructor(nano, x,y) {
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;
        this.random = "abi";
        this.alea = Alea(this.random)
        this.nano = nano;
        this.min = Infinity;
        this.max = -Infinity;
        this.length = 10
        this.chunkMap = new Map();

        this.spawnX = x, this.spawnY = y;
    }
    init() {
        for (const [k, v] of worldFactors) {
            v.init(createNoise2D(this.alea));
        }

        var pos = this.findSpawnPoint()
        //gonna make the nano walk to the spawn point 
        //(realistically we teleport the nano there or spawn a nano there and then center camera there)
        //this part is really fun
        this.nano.x = pos.x*worldGrid.gridSize
        this.nano.y = pos.y*worldGrid.gridSize
    }

    findSpawnPoint() {
        var o = worldGrid.chunkSize*8;
        var bs = 2;
        for (let x = -bs; x <= bs; x++) {
            for (let y = -bs; y <= bs; y++) {
                var ox = o*x, oy = o*y;
                var biome = getBiome(ox,oy) //i should keep generator tags in the biomes, so we can insert 
                var obj = {x:ox, y:oy, biome};
                
                
                
                //if (biome.tags.some(t=>t==="surface")) //basically it would be possible to read biome tags, all surface biomes are valid starting spots basically
                if (biome.biome.hasTag("surface")) {
                    console.log("found a spot for spawning",obj) //immediately we find a mountain as a starting position because we don't exclude it
                    
                    return obj;
                }
            }
        }
    }
    /*
    setup() {

        let menuDiv = p.select("#menu"); // Select the menu div using its id
        menuDiv.style("width", "256px"); // Set the width of the div to 256 pixels
        let testDiv = p.createDiv(); // Create a new div
        testDiv.id("test"); // Set the id of the div to "test"
        testDiv.parent(menuDiv); // Set the parent of the div to the menu div
        let testDiv2 = p.createDiv(); // Create a new div
        testDiv2.id("test2"); // Set the id of the div to "test"
        testDiv2.parent(testDiv);
        this.lengthSlider = p.createSlider(0, 20, this.length);
        this.lengthSlider.parent('test2');

        this.outputText = p.createP();
        this.outputText.parent('test2');
   
    }
    */

    

    getChunk(cx,cy) {
        var tileMap = this.chunkMap.get(`${cx}, ${cy}`)
        if (tileMap) return tileMap;
        var ox= cx*worldGrid.chunkSize
        var oy = cy*worldGrid.chunkSize
        tileMap = new Map();

        var xv = worldGrid.chunkSize
        var yv = worldGrid.chunkSize;
        for (let x = 0; x < xv ; x++) {
            for (let y = 0; y < yv; y++) {
                var biome = getBiome(ox+x,oy+y) 
                biome ||= [0, 0, 0] 
                tileMap.set(`${ox+x},${oy+y}`,  biome )
            }
        }
        this.chunkMap.get(`${cx}, ${cy}`, tileMap)
        return tileMap;
    }
    updateMap() {
        var obj = new Map();
        var xv = one?1: worldGrid.chunkSize
        var yv = one?1: worldGrid.chunkSize;
        for (let x = 0; x < xv ; x++) {
            for (let y = 0; y < yv; y++) {
                var biome = getBiome(x,y) 
                biome ||= [0, 0, 0] 
                obj.set(`${x},${y}`,  biome )
            }
        }
        this.map = obj;
        console.log(minmax)
        this.noise = createNoise2D(this.alea)
        console.log(worldFactors.get("elevation"))
    }
    drawChunk(xv,yv) {
        var pc = worldGrid.screenToChunkPoint(this.nano.x, this.nano.y);
        var chunk = this.getChunk(pc.x+xv, pc.y+yv)
        var cx = (pc.x+xv)*worldGrid.chunkSize, cy = (pc.y+yv)*worldGrid.chunkSize
        if (chunk) {
            for (let x = 0; x < worldGrid.chunkSize; x++) {
                for (let y = 0; y < worldGrid.chunkSize; y++) {
                    this.drawTile(chunk, cx,cy, x, y);
                }
            }
        }
    }
    drawTile(chunk, cx, cy, x, y) {
        var biome = chunk.get(`${(cx + x)},${(cy + y)}`);
        if (biome) {
            var v = worldGrid.gridBoundsScreenSpace((cx + x), (cy + y), 1, 1);
            var [r, g, b] = [0, 0, 0];

            if (biome) {
                //biome.genCache.get("elevation");

                if (biome.read) {
                    var rd = readRaw ? biome.read.sum * 255 : inverseLerp(-1, 1, biome.read.sum) * 255;
                    [r, g, b] = [rd, rd, rd];
                }
                else[r, g, b] = biome?.biome?.color || [0, 0, 0];
            }
            p.fill([r, g, b]);
            p.rect(v.x - 2, v.y - 2, v.w + 4, v.h + 4);
        }
    }

    draw() {
        var w = 4, h =3;
        for (let x = -w; x <= w; x++) {
            for (let y = -h; y <= h; y++) {
                this.drawChunk(x,y);            
            }
        }
    }
}