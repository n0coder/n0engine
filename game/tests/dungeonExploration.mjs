import { createNoise2D } from "simplex-noise";
import { p } from "../../engine/core/p5engine.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { NoiseGenerator } from "../world/NoiseGenerator.mjs";
import Alea from "alea";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { clamp, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import {camera} from "../../engine/core/Camera/camera.mjs"
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { WorldGenerator } from "../world/wave/worldGen/worldGenerator.mjs";
import { DebugCursor } from "../world/debugCursor.mjs";
import { Graph } from "../world/noiseGen/graph.mjs"
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";
import { } from "./graphworker.mjs"
import { Map2d } from "../../engine/n0math/map2d.mjs";
import { addChunk, drawChunk, drawChunks } from "../world/wave/worldGen/ChunkDrawer.mjs";
worldGrid.x =0; 
worldGrid.y= -0;

let n0 = new Nanoai(`n0`, 2, 4)
let n1 = new Nanoai(`n1`, 4, 4)
let n2 = new Nanoai(`n2`, 6, 4)
globalThis.n0 = n0;
//drawChunk(0, 0);

n0.brain.do("walk", 0, -100)

n1.brain.do("walk", 0, -100)

n2.brain.do("walk", 0, -100)

//instead of relying on classes which i hate
//we can now render ultra tiny entities
for (let i = -5; i < 5; i++) {
    for (let o = -5; o < 5; o++) {
        addChunk(i,o);
    }
}
cosmicEntityManager.addEntity({
    draw() {
        drawChunks(n0);
    }
})

//new DebugCursor()
//new WorldGenerator(n0)

camera.follow(n0);
cosmicEntityManager.addEntity(camera);
