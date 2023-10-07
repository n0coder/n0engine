import { NoiseGenerator, TerrainGenerator } from "./world/TerrainGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { ValueDriver } from "../engine/n0math/ValueDriver.mjs";
import { createNoise2D } from "simplex-noise";
import Alea from "alea";
var nano = new Nanoai("n0", 256,256);
var terrainGenerator = new TerrainGenerator(nano);
terrainGenerator.init();
terrainGenerator.updateMap();
