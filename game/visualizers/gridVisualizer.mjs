import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";

export const grid = new Grid(32,4);
export class GridVisualizer {
    constructor() {
        this.x = 0, this.y = 0;
        
        this.setActive = setActive
        this.setActive(true);
    }
    draw() {
        
        let gridSize = grid.gridSize;
        let chunkSize = grid.chunkSize;
        p.fill(255)
        p.ellipse(p.mouseX, p.mouseY, 5)
        var gridPosition = grid.screenToGrid(p.mouseX, p.mouseY)
        var chunkPosition = grid.screenToChunk(p.mouseX, p.mouseY);
        var v = chunkPosition.x;//p.mouseX//*this.gridSize*this.chunkSize; 
        var o =Math.floor( Math.floor(v / gridSize)/chunkSize)
        var o2 = Math.floor((v /gridSize) / chunkSize);
        var o3 = Math.floor(v / (gridSize * chunkSize));
        p.fill(255)
        p.ellipse(o, p.mouseY, 35)
        p.fill(202)
        p.ellipse(o2/1000, p.mouseY, 20)
        p.fill(150)
        p.ellipse(o3/1000, p.mouseY, 10)
        var gs= grid.gridToScreen(gridPosition.x, gridPosition.y)
        //gs = grid.screenToGrid(gs.x, gs.y)
        p.ellipse(gs.x, gs.y, 10)
        var cs = grid.chunkToScreen(chunkPosition.x, chunkPosition.y)
        p.ellipse(cs.x, cs.y, 5)
        p.noFill()
        p.strokeWeight(2);
        p.stroke(255);
        p.rect(gridPosition.x * gridSize, gridPosition.y * gridSize, gridSize, gridSize);
        p.strokeWeight(1);
        p.stroke(255);
        p.rect(chunkPosition.x * chunkSize * gridSize, chunkPosition.y * chunkSize * gridSize, chunkSize * gridSize, chunkSize * gridSize);
        
    }

}