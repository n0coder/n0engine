import { createNoise2D } from "simplex-noise";
import { cosmicEntityManager, setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { n0FunctionCollapse } from "./n0FunctionCollapse.mjs";
import { Tile } from "../../../engine/grid/tile.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import Alea from "alea";
import { buildFactors, worldFactors } from "../FactorManager.mjs";
import { buildBiome } from "../BiomeWork.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { n0loader } from "../../../engine/core/ResourceManagement/loader.mjs";
import { genChunk } from "./worldGen/TileBuilder.mjs";

var c = worldGrid.chunkSize;
export class WorldGenerator {
	 constructor() {
        this.setActive = setActive,this.renderOrder = -5;
        this.setActive(true)
		
		 this.w = 22 * c, this.h = 10 * c;
		 this.i = 0, this.o = 0;

         this.alea = Alea("n0"), this.valea = Alea("n0v");
        
        for (const [k, v] of worldFactors) 
			 v.init(createNoise2D(this.alea));   
		 
    }
    init(loaded) {
        loaded?.()
    }
    
	draw() {
        for (let io = 0; io < 10; io++) {
        genChunk(this.i * c, this.o * c, c, c)
        
        this.i++;
        if (this.i >= this.w) {
            this.o++;
            this.i = 0;
            if (this.o >= this.h) 
                this.o = 0
        }
        }

        for (let i = 0; i < this.w + 1; i++) {
            for (let o = 0; o < this.h + 1; o++) {
                var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
                var tile = worldGrid.getTile(i, o)
                if (tile && tile.biome) {
                        let color = null;
                        
                        if (tile.read && this.read) {
                            let c =  readRaw ? tile.read.sum * 255 : inverseLerp(-1, 1, tile.read.sum) * 255
                            color = [c,c,c]
                        } else {
                            let colora = tile.biome.colorsugar(tile)
                           
                            if (colora)
                                color = colora
                        }
                        let [r,g,b] = color
                        p.fill(r, g, b);
                        let vux = v.h;
                        p.rect(v.x, vux+(v.y-v.h), v.w, vux)
				}
			}
			
        }
    }
}