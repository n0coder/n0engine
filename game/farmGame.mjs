import { camera } from "../engine/core/Camera/camera.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { p } from "../engine/core/p5engine.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Circle } from "./farm/circle.mjs";
import { Crop } from "./farm/crop.mjs";
import { CottonCandyPlant } from "./farm/proceduralPlantTest/cottonCandy.mjs";
import { PopFlower } from "./farm/proceduralPlantTest/popFlower.mjs";
import { FishingPole } from "./items/fishingPole.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { Water } from "./world/water.mjs";
worldGrid.tileSize = 64;
startGlobalEntities(); //set up globals like camera etc
camera.s=1

//so there should be an easier way to shift in and out of world space
//what that means is that we need to handle cosmic entity status somewhere
var nano = new Nanoai('n0',64, 64);
var nano2 = new Nanoai('abi',128, 64);
//we can now add entities to the world without directly handling it where we spawn objects

//try to make pictures of this when possible:
//var nano = new Nanoai('n0',64, 64); cosmicEntityManager.addEntity(nano); camera.follow(nano) var nano2 = new Nanoai('abi',128, 64); cosmicEntityManager.addEntity(nano2);


//we need a handful of activities to test the nano ai on
document.nanos = [nano, nano2]

//what if we queue nano activites? 
//later we can figure out a system for procedural activity generation
//what i mean is not hardcode these systems

//nano.talk(nano2);


//walk position
//deleting the hardcoded ties to the functions
//i only added them to test setup lol
//i'm not sure i want this tech, but i like the idea of actions based on concepts

//nano.brain.do("walk", 256, 0);
//nano.brain.do("follow", nano2);
//nano2.brain.do("walk",20, 0); 
//nano.brain.do("walk",0, 0);

//nano.brain.do("deactivate"); needed to test disabling (entity) self at will
//its not death it's more shifting into the data dimension lol
//a pickup
var circle = new Circle(80,0,5); //pick
//nano.brain.do("follow", circle);
nano.brain.do("pickup",circle);
//nano.inventory.add(circle);
var circle2 = new Circle(140,82,5);
nano.brain.do("pickup",circle2);


var circle3 = new Circle(100,40,5); //pick
//nano.brain.do("follow", circle);
nano2.brain.do("pickup",circle3);
//nano.inventory.add(circle);
var circle4 = new Circle(120,62,5);
nano2.brain.do("pickup",circle4);

camera.follow(nano)
nano.brain.do("pickup",nano2);

//a crop
//calling harvest on a plant, will activate the plant specific action hook
var crop = new Crop(0, 0);
nano.brain.do("harvest",crop)
document.crops = [crop]
//fishing pole
var water = new Water();
var pole = new FishingPole();

nano.brain.do("equip",pole);
nano.brain.do("use",water); 

//normally trying to "use" water (without an item equipped), 
//would do what for a nano ai?

//abiai said "it can help cool the ai down", i had the idea of cleaning the ai when it gets dirty
//so it's a cleanup/cooldown use


//i don't understand how to get this working
//lol of course i dont lol... it was too early lol

//make path (abiai's suggestion)
//var pointA = [253, 256];
//var pointB = [260, 256];
//nano.makePath (pointA, pointB)
//another nano ai?
