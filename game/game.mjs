import { TerrainGenerator } from "./world/TerrainGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { p } from "../engine/core/p5engine.mjs";
import {  } from "./world/BiomeWork.mjs";

import { startGlobalEntities } from "../engine/core/globalEntities.mjs";
import { camera } from "../engine/core/Camera/camera.mjs";
import { NanoFunctionCollapse } from "./world/wave/NanoFunctionCollapse.mjs";
import { } from "./world/wave/waveImport.mjs"
import { WaveFunctionCollapse } from "./world/wave/WaveFunctionCollapse.mjs";
//startGlobalEntities(); 



var nano = new Nanoai("n0", 256,256);
//camera.follow(nano);
//var terrainGenerator = new TerrainGenerator(nano);
//terrainGenerator.init();

var nanoFunctionCollapse = new WaveFunctionCollapse(nano); // NanoFunctionCollapse(nano);
nanoFunctionCollapse.init();
/*
nano.brain.do("walk", -100,0)
nano.brain.do("walk", -100,100)
nano.brain.do("walk", -0,100)
nano.brain.do("walk", -0,0)
*/