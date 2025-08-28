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
    up:[0,2,0],right:[0,0,0],down:[0,0,0],left:[0,0,0],
    modules:["up","right","down","left","noiseBiases"], weight:0.5,
}

let jtotile2 = {
    thresholds:[],
    path:"/assets/wave/purple/6.png",
    biases:[{"factor":"temperature","value":-1}],
    up:[2,2,2],right:[2,2,2],down:[2,2,2],left:[2,2,2],
    modules:["up","right","down","left","noiseBiases"], weight:0.5,
}

console.log(JSON.stringify(tiles));     

let nano = new Nanoai();
nano.brain.do("walk", 3, 3);
nano.brain.do("ping", () => console.log("nano time??"));


rightMenu.show();
let ui = {
    div: p.createDiv().id("tileEditor").parent(rightMenu.menu),
    modules:new Map([
        //["up", {}],["right", {}],["down", {}],["left", {}],["biases", {}],["thresholds", {}], 
    ]),
    build(tile){
        var itemsa = Array.from(this.div.elt.children);
        for (const node of itemsa) {
            invdiv.elt.appendChild(node);
        }
        if (tile) {
            for (const name of tile.modules) {
                console.log(name);
            let module = n0TileModules.get(name)
            
            let ui = module?.buildUI?.(tile)
                
            if (module?.div) module.div.parent(this.div);
        } 

        /*
        let row = this.div;
        if (!row.div) row.div = p.createDiv().class("addMods")
        row.div.parent(row);
        if (!row.factor) {
            row.factor = p.createButton("Add Modules").class("addMods")
        }
        row.factor.parent(row.div);
        row.menu = p.createDiv().class("modules")
        row.menu.parent(row.div);
        row.menu.mods ??= [];
        for (const [fk] of n0TileModules) { 
            if (!row.menu.mods[fk]) {
                row.menu.mods[fk] = p.createButton(fk).class("module");
            }
            row.menu.mods[fk].parent(row.menu);
        }
        */
        //row.factor.value();
        
        //if (row.factor.currentFN)
            //row.factor.elt.removeEventListener("change", row.factor.currentFN);
        //row.factor.currentFN = () => {
            //n0ts.biases[i].factor = row.factor.value();
        //};
        //row.factor.elt.addEventListener("change", row.factor.currentFN);
        }
    }
}


export let j1 = p.createButton("j1").mouseClicked(()=>{ui.build(tiles)}).parent(leftMenu.menu)
let j2 = p.createButton("j2").mouseClicked(()=>{ui.build(jtotile2)}).parent(leftMenu.menu)
//ui.build(tiles)
