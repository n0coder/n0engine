import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../engine/world/worldGrid.mjs";
import { Circle } from "./circle.mjs";
//var circle = new Circle();


for (let i = 1; i < 3; i++) {
    for (let o = 1; o < 3; o++) {
        var [x,y] = worldGrid.worldToScreenPosition(i,o)
        var ts = worldGrid.tileSize;
        cosmicEntityManager.addEntity(new Circle(x, y, ts, ts))
    }
}

cosmicEntityManager.addEntity(new Circle(128+10, 128+10, 50, 50))
cosmicEntityManager.addEntity(new Circle(128+10, 128+70, 50, 50))
cosmicEntityManager.addEntity(new Circle(128+70, 128+70, 50, 50))
cosmicEntityManager.addEntity(new Circle(128+70, 128+10, 50, 50))