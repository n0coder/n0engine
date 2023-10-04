import { camera } from "../engine/core/Camera/camera.mjs";
import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { Circle } from "./farm/circle.mjs";
import { Soil } from "./farm/soil.mjs";
import { FishingPole } from "./items/fishingPole.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { Water } from "./world/water.mjs";
startGlobalEntities(); //start camera
var water = new Water(85,-33);
var nano = new Nanoai('n0',64, 64);
var nano2 = new Nanoai('abi',128, 64);
document.nanos = [nano, nano2]


//so shifting into more gameplay focused mechanics
//we need to have a seed to grow things
//var seed = new Seed(Circle, )

//we need to make the soil depend on water
//we need to add a water bucket
var circle = new Circle(80,0,5); 
camera.follow(nano)
var soil = new Soil(0, 0);
document.crops = [soil]

var pole = new FishingPole(62,15);
var pole2 = new FishingPole(102,15);
var pole3 = new FishingPole(122,30);
var pole4 = new FishingPole(77,30);
nano.brain.do("follow", pole);
nano.brain.do("equip",pole);
nano.brain.do("follow", pole2);
nano.brain.do("equip",pole2);


nano2.brain.do("follow", pole3);
nano2.brain.do("equip",pole3);
nano2.brain.do("follow", pole4);
nano2.brain.do("equip",pole4);

//nano.brain.do("follow", pole3);
//nano.brain.do("equip",pole3);
nano.brain.do("pickup",nano2);
nano.brain.do("follow",water, 16)

//before i can handle other ideas, we need an exit strategy for the fishing mechanic

nano.brain.do("use",water); 
nano2.brain.do("use",water); 
nano.brain.do("walk",111, -33);