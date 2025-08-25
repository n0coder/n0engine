//this file has concluded it's current purpose
//i will keep it around to do additional UI techs improvements

import { rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { invdiv } from "../tools/n0tilesystem/n0tseditorUI.mjs";
import { n0TileModules } from "../world/wave/n0.mjs";
import { addTiles } from "./n0TileSolver.mjs";


rightMenu.show();

let tiles = addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [6, "6.png", [0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    ],
    weight: .5,
    thresholds: [], 
    biases: [{factor: "temperature", value: -1}]
})[0]

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
    up:[0,0,0],right:[0,0,0],down:[0,0,0],left:[0,0,0],
    modules:["up","right","down","left","noiseBiases"], weight:0.5,
}

console.log(JSON.stringify(tiles));     

let nano = new Nanoai();
nano.brain.do("walk", 3, 3);
nano.brain.do("ping", () => console.log("nano time??"));

let ui = {
    div: p.createDiv().class("tilediv").parent(rightMenu.menu),
    modules:new Map([
        ["up", {
            div: n0TileModules.get("up").buildUI(jtotile)

        }]
    ]),
    build(){
        var itemsa = Array.from(this.div.elt.children);
        for (const node of itemsa) {
            invdiv.elt.appendChild(node);
        }
        
        for (const [name, module] of modules) {
            module.div.parent(this.div)
        }
    
    }
}
ui.build()