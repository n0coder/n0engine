import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../engine/world/worldGrid.mjs";
import { Rect } from "./rect.mjs";
//var circle = new Circle();

//we need to be able to convert back and forth to world and screen ez
var point = [144, 128]

var worldPoint = worldGrid.screenToWorldPosition(point)
var screenPoint = worldGrid.worldToScreenPosition(worldPoint)
console.log([point, worldPoint, screenPoint])

var alignedPoint = worldGrid.alignPosition(point);
console.log([point, alignedPoint]);

cosmicEntityManager.addEntity(new Rect(point[0], point[1], 2, 2))
cosmicEntityManager.addEntity(new Rect(alignedPoint[0]+worldGrid.halfScaledTileSize, alignedPoint[1]+worldGrid.halfScaledTileSize, 20, 20))

/*
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
*/