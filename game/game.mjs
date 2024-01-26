
import { BiomeFunctionCollapse } from "./world/wave/biomeFunctionCollapse.mjs"
import { DebugCursor } from "./world/debugCursor.mjs"
import {Nanoai} from "./nanoai/nanoai.mjs"
// we need to form a basic world generation layout for the nanos, something simple and cute

// form based on the nanos size, a realtive difficulty to find water, which will then change based on humidity and temperature
// we need a solid world size, then we should form the biome noises. tough challenge

// we also need to test drive searching for water
var bfc = new BiomeFunctionCollapse()
var mc = new DebugCursor();

var abi = new Nanoai("abi",14, 12)
var n0 = new Nanoai("n0", 12,12); 

let n = 0;
{
	let n = 1;
	console.log(n)
}
console.log(n)

var o = 0
console.log(o)
var o = 1
console.log(o)
