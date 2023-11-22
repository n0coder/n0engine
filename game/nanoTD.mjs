import { Highgrass } from "./world/props/highgrass.mjs";
import { Wall } from "./world/props/wall.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import {Circle} from "./farm/circle.mjs"
import { n0radio } from "./radio/n0radio.mjs";
import { SquareName } from "./world/props/squareName.mjs";
import { PopFlower } from "./farm/proceduralPlantTest/popFlower.mjs"
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
let pop2 = new PopFlower(6*worldGrid.gridSize,12*worldGrid.gridSize,.5,48,5,5)
let pop = new PopFlower(3.5*worldGrid.gridSize,12*worldGrid.gridSize,.5,48,3,3)
let nano = new Nanoai("n0",10*worldGrid.gridSize,5*worldGrid.gridSize)
let nano4 = new Nanoai("abi",10.5*worldGrid.gridSize,5.5*worldGrid.gridSize)


new Circle(10.5*worldGrid.gridSize,8.5*worldGrid.gridSize, 32,32)
new Circle(10.5*worldGrid.gridSize,7.5*worldGrid.gridSize, 16+8,16+8)
//let nano2 = new Nanoai("nano",11*worldGrid.gridSize,7*worldGrid.gridSize)
//let nano3 = new Nanoai("nano",11.5*worldGrid.gridSize,6.5*worldGrid.gridSize)
//n0radio.addFriend(nano, nano2);
//n0radio.addFriend(nano, nano3);
//n0radio.addFriend(nano2, nano3);
n0radio.addFriend(nano, nano4)
nano.lover = nano4;
nano4.lover = nano;

nano.brain.do("hungry");
//nano2.brain.do("hungry");
//nano3.brain.do("hungry");
nano4.brain.do("hungry");
nano.brain.do("walk", 10*worldGrid.gridSize,5*worldGrid.gridSize)
nano4.brain.do("walk", 10.5*worldGrid.gridSize,5.5*worldGrid.gridSize);
//nano2.brain.do("walk", 11*worldGrid.gridSize,7*worldGrid.gridSize);
//nano3.brain.do("walk",11.5*worldGrid.gridSize,6.5*worldGrid.gridSize);

//new Wall(28, 14)
let dist = 5;
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
posta(2,(dist*2)-8, "friends",[111,222,111])
//posta(2,(dist*4)-8, "lover",[222,111,111])
//posta(2,(dist*5.5), "general",[111,111,111])
//posta(2,(dist*7), "jobs",[222,222,111])

n0radio.postObject("jobs",pop) // make pop flower visible to the jobs system?
n0radio.postObject("jobs",pop2) //

n0radio.postObject("jobs", table) //will we post a crafter into the jobs?

n0radio.postJob("jobs", "split", "PopFlower") //split pops into pieces