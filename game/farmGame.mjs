import { camera } from "../engine/core/Camera/camera.mjs";
import { Circle } from "./farm/circle.mjs";
import { Seed } from "./farm/seed.mjs";
import { Soil } from "./farm/soil.mjs";
import { Mommyai } from "./nanoai/mommyai.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
//startGlobalEntities(); 
var nano = new Nanoai('n0',104,110);
var nano2 = new Nanoai('abi',148, 128);

//var mommyai = new Mommyai('mommy', 158, 118)
document.nanos = [nano, nano2]

//
//nano.brain.do("walk",152.5, 211);
//nano.brain.do("transform")

var c1 = new Circle(128,128,2); 
var c2 = new Circle(128,148,2);
var c3 = new Circle(128,168,2);
var c4 = new Circle(128,188,2);
nano.brain.do("pickup",c1);
nano.brain.do("pickup",c2);
nano2.brain.do("pickup",c3);
nano2.brain.do("pickup",c4);
nano.brain.do("pickup",nano2,3);
//nano.brain.do("transform")
nano.brain.do("walk",128, 68)
var seed = new Seed (66,0,Circle, 2)
//nano.brain.do("pickup",seed);

//camera.follow(mommyai)
var soil = new Soil(0, 0);

//nano.brain.do("plant", soil, seed)

//we need to make the soil depend on water
//we need to add a water bucket

//nano.brain.do("equip",pole3);
//nano.brain.do("pickup",nano2);
//nano.brain.do("follow",seed, 16)
//nano.brain.do("use",water); 
//nano.brain.do("walk",111, -33);