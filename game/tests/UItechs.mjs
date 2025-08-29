//this file has concluded it's current purpose
//i will keep it around to do additional UI techs improvements

import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine";
import { Nanoai } from "../nanoai/nanoai.mjs";
import {  } from "../world/wave/TileMods.mjs"
import { invdiv } from "../tools/n0tilesystem/n0tseditorUI.mjs";
import { n0TileModules } from "../world/wave/n0.mjs";
import { addTiles } from "./n0TileSolver.mjs";

rightMenu.show();

let tiles = addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [6, "6.png", [0,0,0],[0,0,0],[0,0,0],[0,0,0]],
        [5, "5.png", [1,1,1],[1,1,1],[1,1,1],[1,1,1]]
    ],
    weight: .5,
    thresholds: [], 
    biases: [{factor: "temperature", value: -1}]
})

let json = {
    "thresholds":[],
    "path":"/assets/wave/purple/6.png",
    "biases":[{"factor":"temperature","value":-1}],
    "up":[0,0,0],"right":[0,0,0],"down":[0,0,0],"left":[0,0,0],
    "modules":["up","right","down","left","noiseBiases"],"weight":0.5,
}

let jtotile = {
    thresholds:[],
    path:"/assets/wave/purple/6.png",
    biases:[{"factor":"temperature","value":-1}],
    up:[0,2,0],right:[0,0,0],down:[0,0,0],left:[0,0,0],
    modules:["up","right","down","left","noiseBiases"], weight:0.5,
}

let jtotile2 = {
    thresholds:[],
    path:"/assets/wave/purple/6.png",
    biases:[{"factor":"temperature","value":-1}],
    up:[2,2,2],right:[2,2,2],down:[2,2,2],left:[2,2,2],
    modules:["up","right","down","left","thresholds", "biases", "weight"], weight:0.5,
}

console.log(JSON.stringify(tiles));     

let nano = new Nanoai();
nano.brain.do("walk", 3, 3);
nano.brain.do("ping", () => console.log("nano time??"));




export let j1 = p.createButton("j1").mouseClicked(()=>{ui.build(tiles[0])}).parent(leftMenu.menu)
let j2 = p.createButton("j2").mouseClicked(()=>{ui.build(tiles[1])}).parent(leftMenu.menu)
//ui.build(tiles)
