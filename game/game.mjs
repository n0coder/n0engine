import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { Grid } from "../engine/grid/grid.mjs";
import { SandGame } from "./SandGame.mjs";
import { Sand } from "./sand.mjs";


var autogame = new Grid(8, 224, 224, 0, 0);
autogame.init();
//gonna make a cellular automata game first
var sandGame = new SandGame(autogame);
cosmicEntityManager.addEntity(sandGame);
var sand = new Sand(6, 0, autogame.tileSize);
cosmicEntityManager.addEntity(sand);
sandGame.addSand(sand)
