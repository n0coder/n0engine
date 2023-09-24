import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Crop } from "./farm/crop.mjs";

worldGrid.tileSize = 64;

var crop = new Crop(3,1);
cosmicEntityManager.addEntity(crop);