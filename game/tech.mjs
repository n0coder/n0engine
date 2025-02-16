import {Nanoai} from "./nanoai/nanoai.mjs"
let n0 = new Nanoai("n0",4,4)
n0.brain.do("walk", 12,12)
n0.brain.do("spin")
