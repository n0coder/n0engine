import { TerrainGenerator } from "./world/TerrainGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { p } from "../engine/core/p5engine.mjs";
import {  } from "./world/BiomeWork.mjs";

import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { camera } from "../engine/core/Camera/camera.mjs";
startGlobalEntities(); 



var nano = new Nanoai("n0", 0,0);
camera.follow(nano);
var terrainGenerator = new TerrainGenerator(nano);
terrainGenerator.init();
terrainGenerator.updateMap();

nano.brain.do("walk", -2100,0)
nano.brain.do("walk", -2100,100)
nano.brain.do("walk", -2000,100)
nano.brain.do("walk", -2000,0)