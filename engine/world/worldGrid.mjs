export class WorldGrid {
    constructor() {
        this.tileSize = 32;
        this.scale =2; 
    }

    worldToScreenPosition(x,y) {
        return [x*this.tileSize, y*this.tileSize]
    }
}
export const worldGrid = new WorldGrid(); 