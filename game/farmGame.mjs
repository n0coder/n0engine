import { camera } from "../engine/core/Camera/camera.mjs";
import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { Circle } from "./farm/circle.mjs";
import { Seed } from "./farm/seed.mjs";
import { Soil } from "./farm/soil.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
startGlobalEntities(); 
var nano = new Nanoai('n0',64, 64);
var nano2 = new Nanoai('abi',128, 64);
document.nanos = [nano, nano2]

var seed = new Seed (66,0,Circle, 2)
//nano.brain.do("pickup",seed);

camera.follow(nano)
var soil = new Soil(0, 0);

nano.brain.do("plant", soil, seed)

//we need to make the soil depend on water
//we need to add a water bucket

//nano.brain.do("equip",pole3);
//nano.brain.do("pickup",nano2);
//nano.brain.do("follow",water, 16)
//nano.brain.do("use",water); 
//nano.brain.do("walk",111, -33);