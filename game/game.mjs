import { n0Pathfinder } from "./nanoai/research/research.mjs";
import {BiomeFunctionCollapse} from "./world/wave/biomeFunctionCollapse.mjs"
//import {} from "./world/wave/waveImport.mjs"
import {Nanoai} from "./nanoai/nanoai.mjs"

var bfc = new BiomeFunctionCollapse()


var nano = new Nanoai("abi", 256,512); 
nano.brain.do("walk", 466,355);