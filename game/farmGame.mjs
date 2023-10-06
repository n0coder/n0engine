import { camera } from "../engine/core/Camera/camera.mjs";
import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { Circle } from "./farm/circle.mjs";
import { Seed } from "./farm/seed.mjs";
import { Soil } from "./farm/soil.mjs";
import { Mommyai } from "./nanoai/mommyai.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
startGlobalEntities(); 
var nano = new Nanoai('n0',104,110);

var circle = new Circle(90,110, 5);
var circle2 = new Circle(85,110, 5);
nano.brain.do("pickup",circle);
nano.brain.do("pickup",circle2);
var nano2 = new Nanoai('abi',148, 128);

var circle3 = new Circle(155,128, 5);
var circle4 = new Circle(160,128, 5);
nano2.brain.do("pickup",circle3);
nano2.brain.do("pickup",circle4);


var circle5 = new Circle(155,188, 12);
var circle6 = new Circle(150,198, 23);

//var mommyai = new Mommyai('mommy', 128, 118)
document.nanos = [nano, nano2]

nano.brain.do("pickup",nano2,3);
nano.brain.do("walk",152.5, 211);
nano.brain.do("transform")
var seed = new Seed (66,0,Circle, 2)
//nano.brain.do("pickup",seed);

camera.follow(nano)
var soil = new Soil(0, 0);

//nano.brain.do("plant", soil, seed)

//we need to make the soil depend on water
//we need to add a water bucket

//nano.brain.do("equip",pole3);
//nano.brain.do("pickup",nano2);
//nano.brain.do("follow",water, 16)
//nano.brain.do("use",water); 
//nano.brain.do("walk",111, -33);