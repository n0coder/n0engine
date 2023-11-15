import { Highgrass } from "./world/props/highgrass.mjs";
import { Wall } from "./world/props/wall.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import {Circle} from "./farm/circle.mjs"
import { n0radio } from "./radio/n0radio.mjs";
import { SquareName } from "./world/props/squareName.mjs";
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

nano.brain.do("hungry");
nano.brain.do("walk", 30.5*worldGrid.gridSize,8*worldGrid.gridSize)
//new Wall(28, 14)

function posta (ia, oa, channel, color) {
let pad = 4;
new SquareName(channel, (ia*worldGrid.gridSize)-pad, (oa*worldGrid.gridSize)-pad, (worldGrid.gridSize*2)+pad*2,(worldGrid.gridSize*2)+pad*2, color)
for (let o = 0; o < 2; o++) {
    for (let i = 0; i < 2; i++) {
        n0radio.postItem(channel,new Circle((ia+i)*worldGrid.gridSize,(oa+o)*worldGrid.gridSize, 8,8), nano)
    }
}

}

posta(2,2, "personal",[111,111,255])
posta(6,2, "friends",[111,222,111])
posta(10,2, "lover",[222,111,111])
posta(10,6, "general",[111,111,111])
posta(10,10, "jobs",[222,222,111])

n0radio.postItem("jobs",new Circle((12)*worldGrid.gridSize,(12)*worldGrid.gridSize, 8,8), nano)