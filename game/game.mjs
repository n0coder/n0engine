import { TerrainGenerator } from "./world/TerrainGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { p } from "../engine/core/p5engine.mjs";
import {  } from "./world/BiomeWork.mjs";

import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { camera } from "../engine/core/Camera/camera.mjs";
startGlobalEntities(); 



var nano = new Nanoai("n0", 0,0);
camera.follow(nano);
nano.brain.do("walk", 4096,4096)
var terrainGenerator = new TerrainGenerator(nano);
terrainGenerator.init();
terrainGenerator.updateMap();
