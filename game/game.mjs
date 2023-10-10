import { TerrainGenerator } from "./world/TerrainGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { p } from "../engine/core/p5engine.mjs";
import { heightMap } from "./world/BiomeWork.mjs";

var nano = new Nanoai("n0", 256,256);
var terrainGenerator = new TerrainGenerator(nano);
terrainGenerator.init();
terrainGenerator.updateMap();
