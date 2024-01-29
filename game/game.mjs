
import { BiomeFunctionCollapse } from "./world/wave/biomeFunctionCollapse.mjs"
import { DebugCursor } from "./world/debugCursor.mjs"
import {Nanoai} from "./nanoai/nanoai.mjs"
import { worldGrid } from "../engine/grid/worldGrid.mjs";
// we need to form a basic world generation layout for the nanos, something simple and cute

// form based on the nanos size, a realtive difficulty to find water, which will then change based on humidity and temperature
// we need a solid world size, then we should form the biome noises. tough challenge

//the world is already really good, we just need to improve the bitter/sugar biome techs

// we also need to test drive searching for water
var bfc = new BiomeFunctionCollapse()
var mc = new DebugCursor();

var abi = new Nanoai("abi",14, 12)
var n0 = new Nanoai("n0", 12,12); 


//make decoration tech using n0functioncollapse
//place water (objects) in water (tiles)
n0.brain.do("ping", () => {
	var x = worldGrid.x;
	var y = worldGrid.y;
	let wt = []
	for (let i = 0; i < bfc.w + 1; i++) {
		for (let o = 0; o < bfc.h + 1; o++) {
			var biome = worldGrid.tiles.get(`${x + i}, ${y + o}`)
			if (biome?.biome?.name?.includes("water"))
				wt.push(biome);
		}
	}
	console.log(wt)
})

//this is a floating read