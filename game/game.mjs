import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { Circle } from "./circle.mjs";
//var circle = new Circle();
cosmicEntityManager.addEntity(new Circle(10, 10, 50, 50))
cosmicEntityManager.addEntity(new Circle(10, 70, 50, 50))
cosmicEntityManager.addEntity(new Circle(70, 70, 50, 50))
cosmicEntityManager.addEntity(new Circle(70, 10, 50, 50))