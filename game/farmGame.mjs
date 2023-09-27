import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Crop } from "./farm/crop.mjs";
import { CottonCandyPlant } from "./farm/proceduralPlantTest/cottonCandy.mjs";
worldGrid.tileSize = 64;

cosmicEntityManager.addEntity(new CottonCandyPlant());

/*
var crop = new Crop(3,1);
cosmicEntityManager.addEntity(crop);
*/

/*
var copy = crop.copy(3,2);
cosmicEntityManager.addEntity(copy);
*/

