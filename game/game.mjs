import {BiomeFunctionCollapse} from "./world/wave/biomeFunctionCollapse.mjs"
//import {} from "./world/wave/waveImport.mjs"
import {Nanoai} from "./nanoai/nanoai.mjs"
import { p } from "../engine/core/p5engine.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { Wall } from "./world/props/wall.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";

var bfc = new BiomeFunctionCollapse()


var nano = new Nanoai("abi", 656,256)
var nano3 = new Nanoai("abi", 656,356)
var nano2 = new Nanoai("n0", 376,126); 
nano.brain.do("walk", 0, 256);
nano3.brain.do("follow", nano);


let naovi = null;



for (let i = 20; i <= 25; i++) {
    new Wall(i, 10)
    new Wall(i, 5);
}

for (let i = 6; i < 9; i++) {
    new Wall(20, i)
    new Wall(25, i);
}