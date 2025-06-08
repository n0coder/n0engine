import { createNoise2D } from "simplex-noise";
import { cosmicEntityManager, setActive } from "../../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { n0FunctionCollapse } from "../n0FunctionCollapse.mjs";
import { Tile } from "../../../../engine/grid/tile.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.mjs";
import Alea from "alea";
import { buildFactors, worldFactors } from "../../FactorManager.mjs";
import { buildBiome } from "../../BiomeWork.mjs";
import { inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { p } from "../../../../engine/core/p5engine.mjs";
import { n0loader } from "../../../../engine/core/ResourceManagement/loader.mjs";
import { genChunk } from "./TileBuilder.mjs";
import { drawChunks } from "./ChunkDrawer.mjs";

var c = worldGrid.chunkSize;
export class WorldGenerator {
	 constructor(nano) {
        this.setActive = setActive,this.renderOrder = -5;
        this.setActive(true)
		
        this.nano = nano ?? {x: 0, y:0, z:0, sightRadius: 32};
		 this.w = 22 * c, this.h = 10 * c;
		 this.i = 0, this.o = 0;

         
    }
    init(loaded) {
        loaded?.()
    }
    
	draw() {
			
	    drawChunks(this.nano)
    
    }
}