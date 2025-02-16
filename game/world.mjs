import { DebugCursor } from "./world/debugCursor.mjs";
import { WorldGenerator } from "./world/wave/decoCollapse.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { camera } from "../engine/core/Camera/camera.mjs";

//startGlobalEntities(); 

let n0 = new Nanoai("n0",10,10)
//camera.follow(n0)
n0.brain.do("walk", 5,  5)
n0.brain.do("spin")
let bfc = new WorldGenerator(n0)
let mc = new DebugCursor();


