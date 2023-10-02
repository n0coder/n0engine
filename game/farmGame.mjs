import { camera } from "../engine/core/Camera/camera.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { p } from "../engine/core/p5engine.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Circle } from "./farm/circle.mjs";
import { Crop } from "./farm/crop.mjs";
import { CottonCandyPlant } from "./farm/proceduralPlantTest/cottonCandy.mjs";
import { PopFlower } from "./farm/proceduralPlantTest/popFlower.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
worldGrid.tileSize = 64;
startGlobalEntities(); //set up globals like camera etc
camera.s=3

var nano = new Nanoai('n0',64, 64);
cosmicEntityManager.addEntity(nano);

var nano2 = new Nanoai('abi',128, 64);
cosmicEntityManager.addEntity(nano2);

//try to make pictures of this when possible:
//var nano = new Nanoai('n0',64, 64); cosmicEntityManager.addEntity(nano); camera.follow(nano) var nano2 = new Nanoai('abi',128, 64); cosmicEntityManager.addEntity(nano2);


//we need a handful of activities to test the nano ai on
document.nanos = [nano, nano2]
//what if we queue nano activites? 
//later we can figure out a system for procedural activity generation
//what i mean is not hardcode these systems

//nano.talk(nano2);


//walk position
nano.walk(256, 0);
nano.follow(nano2);
nano2.walk(20, 0);
nano.walk(0, 0);
//a pickup
var circle = new Circle(80,0,5); //pick
cosmicEntityManager.addEntity(circle)
nano.pickup(circle);

camera.follow(circle)

//a crop
var crop = new Crop();
nano.harvest(crop)

//fishing pole
var water = new Water();
var pole = new Pole();
nano.equip(pole);
nano.use(water); //i don't understand how to get this working

//make path (abiai's suggestion)
//var pointA = [253, 256];
//var pointB = [260, 256];
//nano.makePath (pointA, pointB)
//another nano ai?
