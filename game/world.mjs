import { DebugCursor } from "./world/debugCursor.mjs";
import { WorldGenerator } from "./world/wave/worldGen/worldGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { Soil } from "./world/props/soil.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Seed } from "./world/props/seed.mjs";

worldGrid.x= 227210
worldGrid.y= 117111

let n0 = new Nanoai("n0",10,10)
globalThis.n0 = n0;
var seed = new Seed(6,6)
n0.brain.do("pickup", seed)
var seed = new Seed(10,6)
n0.brain.do("pickup", seed)
n0.brain.do("spin")

let bfc = new WorldGenerator(n0)
let mc = new DebugCursor();

worldGrid.setTile(25,25, (t) => {
    console.log("tile 25, 25 was spawned", t)
})

let crops = [];
for (let o = 10; o < 13; o++)
for (let i = 0; i < 3; i++) {

n0.brain.do("walk", i,  o)
n0.brain.do("ping", (n)=>{
    let tile = worldGrid.getTile(i,o)
    if (tile&&tile.biome.name === "plains")
    crops.push (new Soil(i, o))
})

}

n0.brain.do("ping", (n)=>n0.brain.do("plant", crops[0], n0.inventory.hasItem('seed', 'kind')))
n0.brain.do("ping", (n)=>n0.brain.do("plant", crops[1], n0.inventory.hasItem('seed', 'kind')))
n0.brain.do("walk", 0,  10)