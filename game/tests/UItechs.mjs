//this file has concluded it's current purpose
//i will keep it around to do additional UI techs improvements

import { rightMenu } from "../../engine/core/Menu/menu.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { addTiles } from "./n0TileSolver.mjs";


rightMenu.show();

let tiles = addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [6, "6.png", [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]],
    ],
    weight: .5,
    thresholds: [], 
    biases: [{factor: "temperature", value: -1}]
})[0]

console.logp(tiles);     

let nano = new Nanoai();
nano.brain.do("walk", 3, 3);
nano.brain.do("ping", () => console.logp("nano time??"));
13