export class WorldGrid {
    constructor() {
        this.tileSize = 32;
        this.scale =2; 
    }
    get scaledTileSize() {
        return this.tileSize * this.scale;
      }
    get halfScaledTileSize() {
        return (this.tileSize * this.scale)/2
    }
    get halfTileSize() {
        return this.tileSize / 2
    }
    worldToScreenPosition(x,y) {
        if (Array.isArray(x)) [x,y] = x; 
        return [x*this.scaledTileSize, y*this.scaledTileSize]
    }
    screenToWorldPosition(x,y) {
        if (Array.isArray(x)) [x,y] = x; 
        return [Math.floor(x/this.scaledTileSize), Math.floor(y/this.scaledTileSize)]
    } 
    alignPosition(x, y) {
        if (Array.isArray(x)) [x, y] = x;
        
        // Scale down to world space.
        let worldX = x / this.scaledTileSize;
        let worldY = y / this.scaledTileSize;
        
        // Floor the position to align with world position.
        worldX = Math.floor(worldX);
        worldY = Math.floor(worldY);
        
        // Scale back up to screen space.
        let screenX = worldX * this.scaledTileSize;
        let screenY = worldY * this.scaledTileSize;
        
        return [screenX, screenY];
    }
    
}
export const worldGrid = new WorldGrid(); 