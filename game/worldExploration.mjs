import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { findPath } from "./nanoai/research/n0Pathfinder.mjs";
import { Wall } from "./world/props/wall.mjs";
import { Water } from "./world/props/water.mjs";

let n0 = new Nanoai("n0", 7, 3);
[[5,5], [6,5], [7,5], [8,5], [9,5]].map(([x,y]) => 
	worldGrid.setTile(x, y, new Wall(x,y)))
let water = new Water(7, 7)
n0.brain.do("follow", water)
n0.brain.do("walk", 15,11);
n0.brain.do("follow", water)
