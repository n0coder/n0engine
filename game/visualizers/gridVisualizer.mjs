import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";

export class Grid {
    constructor(gridSize, chunkSize) {
        this.gridSize = gridSize;
        this.chunkSize = chunkSize;
    }

    screenToGridPoint(x,y) {
        return { x: Math.floor(x / this.gridSize), y: Math.floor(y / this.gridSize) };
    }
    screenToChunkPoint(x,y) {
        return { x: Math.floor(x / (this.gridSize*this.chunkSize)), y: Math.floor(y / (this.gridSize*this.chunkSize)) };
    }
    screenToGridBounds(x1, y1, x2, y2) {
        return {
            minX: Math.floor(x1 / this.gridSize),
            minY: Math.floor(y1 / this.gridSize),
            maxX: Math.floor(x2 / this.gridSize),
            maxY: Math.floor(y2 / this.gridSize)
        };
    }
    screenToChunkBounds(x1, y1, x2, y2) {
        return {
            minX: Math.floor(x1 / (this.gridSize*this.chunkSize)),
            minY: Math.floor(y1 / (this.gridSize*this.chunkSize)),
            maxX: Math.floor(x2 / (this.gridSize*this.chunkSize)),
            maxY: Math.floor(y2 / (this.gridSize*this.chunkSize))
        };
    }
    gridToScreenPoint(x,y) {
        return { x: x * this.gridSize, y: y * this.gridSize };
    } 
    gridToChunkPoint(x,y) {
        return { x: Math.floor(x / this.chunkSize), y: Math.floor(y / this.chunkSize) };
    } 
    gridToScreenBounds(minX, minY, maxX, maxY) {
        return {
            x1: minX * this.gridSize,
            y1: minY * this.gridSize,
            x2: (maxX) * this.gridSize,
            y2: (maxY) * this.gridSize
        };
    }
    gridToChunkBounds(x1, y1, x2, y2) {
        return {
            minX: Math.floor(x1 / this.chunkSize),
            minY: Math.floor(y1 / this.chunkSize),
            maxX: Math.floor(x2 / this.chunkSize),
            maxY: Math.floor(y2 / this.chunkSize)
        };
    }
    gridBoundsScreenSpace(x,y) {
        return {
            x: x * this.gridSize,
            y: y * this.gridSize,
            width: this.gridSize,
            height: this.gridSize
        };
    }
    chunkToScreen(x,y) {
        return { x: x *this.chunkSize *this.gridSize, y: y *this.chunkSize* this.gridSize };
    }
    chunkToGrid(x,y) {
        return { x: x *this.chunkSize, y: y *this.chunkSize};
    }
    chunkToScreenBounds(minX, minY, maxX, maxY) {
        return {
            x1: minX * this.gridSize * this.chunkSize,
            y1: minY * this.gridSize * this.chunkSize,
            x2: (maxX) * this.gridSize * this.chunkSize,
            y2: (maxY) * this.gridSize * this.chunkSize
        };
    }
    chunkToScreenBounds1(minX, minY, maxX, maxY) {
        return {
            x1: minX * this.gridSize * this.chunkSize,
            y1: minY * this.gridSize * this.chunkSize,
            x2: (maxX + 1) * this.gridSize * this.chunkSize,
            y2: (maxY + 1) * this.gridSize * this.chunkSize
        };
    }
    chunkBoundsGridSpace(x,y) {
        return {
            x: chunkX * this.chunkSize,
            y: chunkY * this.chunkSize,
            width: this.chunkSize,
            height: this.chunkSize
        };
    }
}
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