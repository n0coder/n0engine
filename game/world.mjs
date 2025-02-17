import { DebugCursor } from "./world/debugCursor.mjs";
import { WorldGenerator } from "./world/wave/worldGen/worldGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { Soil } from "./world/props/soil.mjs";


let n0 = new Nanoai("n0",10,10)

n0.brain.do("spin")

let bfc = new WorldGenerator(n0)
let mc = new DebugCursor();

let crops = [];
for (let o = 10; o < 13; o++)
for (let i = 10; i < 20; i++) {

n0.brain.do("walk", i,  o)
n0.brain.do("ping", ()=>{
    crops.push (new Soil(i, o))
})

}
n0.brain.do("walk", 0,  10)