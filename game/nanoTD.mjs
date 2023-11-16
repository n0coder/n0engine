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
let nano = new Nanoai("n0",28.5*worldGrid.gridSize,8*worldGrid.gridSize)
let nano4 = new Nanoai("n0",29.5*worldGrid.gridSize,8*worldGrid.gridSize)
let nano2 = new Nanoai("nano",21.5*worldGrid.gridSize,8*worldGrid.gridSize)
let nano3 = new Nanoai("nano",23.5*worldGrid.gridSize,8*worldGrid.gridSize)
n0radio.addFriend(nano, nano2);
n0radio.addFriend(nano, nano3);
n0radio.addFriend(nano2, nano3);

nano.lover = nano4;
nano4.lover = nano;

nano.brain.do("hungry");
nano2.brain.do("hungry");
nano3.brain.do("hungry");
nano4.brain.do("hungry");
nano.brain.do("walk", 28.5*worldGrid.gridSize,8*worldGrid.gridSize)
nano4.brain.do("walk", 29.5*worldGrid.gridSize,8*worldGrid.gridSize);
nano2.brain.do("walk", 21.5*worldGrid.gridSize,8*worldGrid.gridSize);
nano3.brain.do("walk", 23.5*worldGrid.gridSize,8*worldGrid.gridSize);

//new Wall(28, 14)
let dist = 4;
function posta (ia, oa, channel, color) {
let pad = 4;
new SquareName(channel, (ia*worldGrid.gridSize)-pad, (oa*worldGrid.gridSize)-pad, (worldGrid.gridSize*dist)+pad*2,(worldGrid.gridSize*dist)+pad*2, color)
for (let o = 0; o < dist; o++) {
    for (let i = 0; i < dist; i++) {
        n0radio.postItem(channel,new Circle((ia+i)*worldGrid.gridSize,(oa+o)*worldGrid.gridSize, 8,8), nano)
    }
}

}

//posta(2,(dist), "personal",[111,111,255])
posta(2,(dist*2.5), "friends",[111,222,111])
posta(2,(dist*4), "lover",[222,111,111])
//posta(2,(dist*5.5), "general",[111,111,111])
//posta(2,(dist*7), "jobs",[222,222,111])

//n0radio.postItem("jobs",new Circle((12)*worldGrid.gridSize,(12)*worldGrid.gridSize, 8,8), nano)