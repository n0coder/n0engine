export class WorldGrid {
    constructor() {
        this.gridSize = 4;
        this.chunkSize = 4
    }
    get halfTileSize() {
        return this.gridSize / 2
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
    gridBoundsScreenSpace(x,y, w=1,h=1) {
        return {
            x: x * this.gridSize,
            y: y * this.gridSize,
            w: w*this.gridSize,
            h: h*this.gridSize
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
    chunkBoundsGridSpace(x,y,w,h) {
        return {
            x: chunkX * this.chunkSize,
            y: chunkY * this.chunkSize,
            w: w*this.chunkSize,
            h: h*this.chunkSize
        };
    }
    chunkBoundsScreenSpace(x,y,w,h) {
        return {
            x: x * this.gridSize *this.chunkSize,
            y: y *this.gridSize * this.chunkSize,
            w: w*this.gridSize *this.chunkSize,
            h: h*this.gridSize *this.chunkSize
        };
    }
    alignPosition(x, y) {
        if (Array.isArray(x)) [x, y] = x;
        
        // Scale down to world space.
        let worldX = x / this.gridSize;
        let worldY = y / this.gridSize;
        
        // Floor the position to align with world position.
        worldX = Math.floor(worldX);
        worldY = Math.floor(worldY);
        
        // Scale back up to screen space.
        let screenX = worldX * this.gridSize;
        let screenY = worldY * this.gridSize;
        
        return [screenX, screenY];
    }
    
}
export const worldGrid = new WorldGrid(); 