import { Highgrass } from "./world/props/highgrass.mjs";
import { Wall } from "./world/props/wall.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import {Circle} from "./farm/circle.mjs"
//attack action, pathfind to a target only if hungry
//defend action, defend an item or a path...

//tie in relationship systems (that don't exist yet)

//the nanos will need to be able to interact for this to work
//how can we simulate a tower defense using nano techs?!

let osif = [
    [1,0,1,1,1,0,1], 
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,0,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1]
]
for (let o = 0; o < osif.length; o++) {
    for (let i = 0; i < osif[o].length; i++) {
        if (osif[o][i] === 0) {
            let hg = new Highgrass(25+i,11+o);
        } else {
            let hg = new Wall(25+i,11+o)
        }
    }
}
let nano = new Nanoai("nano",26.5*worldGrid.gridSize,8*worldGrid.gridSize)
//

let circle = new Circle(28*worldGrid.gridSize,18*worldGrid.gridSize, 8,8)
nano.brain.do("hungry");
//nano.brain.do("pickup", circle);
//nano.brain.do("walk", 26.5*worldGrid.gridSize,8*worldGrid.gridSize)
//new Wall(28, 14)