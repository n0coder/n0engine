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


//import noise from some map
//import biomes from that map
//import tile sprites from those biomes
//paint those tiles above the map using n0functioncollapse techs

//note air as the medium of control for allowing other decorations to also exist next to them. 
// 0 is the id for air or something

export class DecoCollapse {
	 constructor() {
		//cosmicEntityManager.addEntity(this, -5);
        this.setActive = setActive,this.renderOrder = -5;
        this.setActive(true)
		
		 this.w = 30 * 4, this.h = 20 * 4;
		 this.i = 0, this.o = 0;
        worldGrid.x = -150+111+(this.w*15);
        worldGrid.y = 230+(this.h*285);
         this.alea = Alea("n0"), this.valea = Alea("n0v");
        this.nfc = new n0FunctionCollapse(Alea("nano"))
         this.nfc.testingCheckdir();
        for (const [k, v] of worldFactors) 
			 v.init(createNoise2D(this.alea));   
		 
		 this.useNfc = true, this.ready = false; 
	 if (this.useNfc) {
            import('./waveImportDecos.mjs').then(u => { }) //no
            n0loader.startLoading("bfc", (loaded) => this.init(loaded), ["tiles"]) //a wierd issue
        }
        else this.init()
    }
    init(loaded) {
        this.ready = true;
        loaded?.()
    }
	genChunk(x, y, w, h) {
		if (!this.ready) return;
        for (let i = 0; i < w; i++) {
            for (let o = 0; o < h; o++) {
                var tile = worldGrid.getTile(x+i, y+o)
                if (tile) continue;     
                
                let wx = worldGrid.x, wy = worldGrid.y;
                tile = new Tile(wx + x + i, wy + y + o)
                tile.wx = x+i, tile.wy = y+o;
				tile.build([buildFactors, buildBiome])
                
                if (tile.biome === null) {
                    tile.broken = true;
                    biome.pathDifficulty = 9;
                    continue
                }
                let sugar = tile.genCache.get("sugarzone");
                tile.sugar =  {
                    minm: 0, maxm: 2, sum: lerp(0,2, inverseLerp(sugar.minm, sugar.maxm, sugar.sum))  //tile.biome.sugarLevel 
                }
                tile.pathDifficulty = tile.biome?.getDifficulty(tile) ?? 9; //can't walk through an 8               

                worldGrid.setTile(x+i,y+o, tile)
				if (this.useNfc)
					tile.build(this.nfc.buildn0Collapse)
            }
        }
        //if (this.useNfc)            this.nfc.blocksBiome(x, y, w, h, 4)
		
	}
	draw() {
		//i need a way to display specifically the nfc output...
		if (!this.ready) return;
        var c = worldGrid.chunkSize * 2; //grid space
        this.genChunk( (this.i * (c * 2))  , (this.o * c) , c * 2, c)
        
        this.i++;
        if (this.i >= 9) {
            this.o++
            this.i = 0;
            if (this.o >= 9) {
                this.o = 0
            }
        }


        for (let i = 0; i < this.w + 1; i++) {
            for (let o = 0; o < this.h + 1; o++) {
                var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
                var tile = worldGrid.getTile(i, o)
                if (tile && tile.biome) {
                        let e = tile.genCache.get("elevation");
                        let vinv = inverseLerp(e.minm, e.maxm, e.sum)                       
                        let voff = lerp(worldGrid.gridSize,0, vinv);

                        let color = null;
                        
                        if (tile.read && this.read) {
                            let c =  readRaw ? tile.read.sum * 255 : inverseLerp(-1, 1, tile.read.sum) * 255
                            color = [c,c,c]
                        } else {
                            let colora = tile.biome.colorsugar(tile);
                            if (colora)
                                color = colora
                        }
                        let cinv = Math.pow(vinv, 2)
                        let r = color[0] // lerp((color[0]/3)-10, color[0], cinv);
                        let g = color[1] //lerp(color[1]/3, color[1], cinv);
                        let b = color[2] //lerp(color[2]/3, color[2], cinv );
                        //console.log({r,g,b})
                        //p.noLoop();
                        p.fill(r, g, b);
                        //p.fill(color);
                        //let vux = (voff*v.h) //lerp(v.h, (voff*v.h), inverseLerp(-1,1, Math.sin(ticks*.1)))
                        let vux = v.h;
                        p.rect(v.x, vux+(v.y-v.h), v.w, vux)
					//p.rect(v.x, v.y, v.w, v.h)
                    //if (tile)
                    

				}
			}
			
        }
        for (let i = 0; i < this.w + 1; i++) {
            for (let o = 0; o < this.h + 1; o++) {
                var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
                var tile = worldGrid.getTile(i,o)
                if (tile && tile.biome) {
                    let tilenfc = tile.n0fc?.tile
                    if (tilenfc && tilenfc.img !== undefined) {                        
                        let e = tile.genCache.get("elevation");
                        let vinv = inverseLerp(e.minm, e.maxm, e.sum)-.01                     
                        let voff = lerp(worldGrid.gridSize,0, vinv);

                        let color = null;
                        
                        if (tile.read && this.read) {
                            let c =  readRaw ? tile.read.sum * 255 : inverseLerp(-1, 1, tile.read.sum) * 255
                            color = [c,c,c]
                        } else {
                            let colora = tile.biome.colorsugar(tile);
                            if (colora)
                                color = colora
                        }

                        
                        let cinv = Math.pow(vinv, 2)
                        let r = color[0] // lerp((color[0]/3)-10, color[0], cinv);
                        let g = color[0] //lerp(color[1]/3, color[1], cinv);
                        let b = color[0] // lerp(color[2] / 3, color[2], cinv);
                        let end = (255 / 3);
                       
                        if (Array.isArray(tilenfc.img)) {
                            for (let isu = 0; isu < tilenfc.img.length; isu++) {
                                
                                p.image(tilenfc.img[isu], v.x - (v.w / 2), v.y - v.h, v.w * 2, v.h * 2)
                               
                            }
                        } else {
                            p.image(tilenfc.img, v.x - (v.w / 2), v.y - v.h, v.w * 2, v.h * 2)
                        }
                    }
                    p.fill(255)
                    p.rect(128,128,32,32)
                }
            }
        }
        /*

        */
        
    }
}