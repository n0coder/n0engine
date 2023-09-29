import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Crop } from "./farm/crop.mjs";
import { CottonCandyPlant } from "./farm/proceduralPlantTest/cottonCandy.mjs";
import { PopFlower } from "./farm/proceduralPlantTest/popFlower.mjs";
import { Nanoai } from "./nanoai.mjs";
worldGrid.tileSize = 64;

cosmicEntityManager.addEntity(new PopFlower());
cosmicEntityManager.addEntity(new CottonCandyPlant());
cosmicEntityManager.addEntity(new Nanoai());
/*
var crop = new Crop(3,1);
cosmicEntityManager.addEntity(crop);
*/

/*
var copy = crop.copy(3,2);
cosmicEntityManager.addEntity(copy);
*/

