import { DebugCursor } from "./world/debugCursor.mjs";
import { WorldGenerator } from "./world/wave/decoCollapse.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
let n0 = new Nanoai("n0",4,4)
n0.brain.do("walk", 22,32)
n0.brain.do("spin")
let bfc = new WorldGenerator(n0)
let mc = new DebugCursor();


