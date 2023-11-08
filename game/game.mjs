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
nano.brain.do("walk",376,126);
nano3.brain.do("follow", nano);


let naovi = null;

let x = 20
let y = 4;
/*
for (let i = 0; i <= 5; i++) {
    new Wall(x+i, y+4)
    new Wall(x+i, y-1);
}

for (let i = 0; i < 3; i++) {
    new Wall(x, y+i)
    new Wall(x+5, y+i);
}
*/