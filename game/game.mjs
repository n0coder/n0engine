import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { Grid } from "../engine/grid/grid.mjs";
import { SandGame } from "./SandGame.mjs";


var autogame = new Grid(64, 8, 14, 0, 0);
autogame.init();
//gonna make a cellular automata game first
var sandGame = new SandGame(autogame);
cosmicEntityManager.addEntity(sandGame);