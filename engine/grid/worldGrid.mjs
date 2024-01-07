export class WorldGrid {
    constructor() {
        this.gridSize = 16;
        this.chunkSize = 8;
        this.x = -150
        this.y = 230;
        this.tiles = new Map();
    }

    getTile(x,y) {
        return this.tiles.get(`${this.x+x}, ${this.y+y}`)
    }

    get halfTileSize() {
        return this.gridSize / 2
    }

    screenToGridPoint(x, y) {
        return { x: Math.floor(x / this.gridSize), y: Math.floor(y / this.gridSize) };
    }
    screenToGridPointRaw(x, y) {
        return { x: x / this.gridSize, y: y / this.gridSize };
    }
    screenToChunkPoint(x, y) {
        return { x: Math.floor(x / (this.gridSize * this.chunkSize)), y: Math.floor(y / (this.gridSize * this.chunkSize)) };
    }
    screenToGridBounds(x1, y1, x2, y2, pad = 0) {
        let gx1 = Math.floor(x1 / this.gridSize);
        let gy1 = Math.floor(y1 / this.gridSize);
        let gx2 = Math.floor(x2 / this.gridSize)
        let gy2 = Math.floor(y2 / this.gridSize)
        return {
            minX: Math.min(gx1, gx2) - pad,
            minY: Math.min(gy1, gy2) - pad,
            maxX: Math.max(gx1, gx2) + pad,
            maxY: Math.max(gy1, gy2) + pad,
            toRect() {
                return {
                    x: this.minX - this.minX,
                    y: this.minY - this.minY,
                    w: this.maxX - this.minX,
                    h: this.maxY - this.minY
                }
            }
        };
    }
    screenToChunkBounds(x1, y1, x2, y2) {
        return {
            minX: Math.floor(x1 / (this.gridSize * this.chunkSize)),
            minY: Math.floor(y1 / (this.gridSize * this.chunkSize)),
            maxX: Math.floor(x2 / (this.gridSize * this.chunkSize)),
            maxY: Math.floor(y2 / (this.gridSize * this.chunkSize))
        };
    }
    gridBounds(gx1, gy1, gx2, gy2, pad = 0) {
        return {
            minX: Math.min(gx1, gx2) - pad,
            minY: Math.min(gy1, gy2) - pad,
            maxX: Math.max(gx1, gx2) + pad,
            maxY: Math.max(gy1, gy2) + pad,
            toRect() {
                return {
                    x: 0,
                    y: 0,
                    w: this.maxX - this.minX,
                    h: this.maxY - this.minY
                }
            }
        };

    }
    gridToScreenPoint(x, y) {
        return { x: x * this.gridSize, y: y * this.gridSize };
    }
    gridToChunkPoint(x, y) {
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
    gridBoundsScreenSpace(x, y, w = 1, h = 1) {
        return {
            x: x * this.gridSize,
            y: y * this.gridSize,
            w: w * this.gridSize,
            h: h * this.gridSize
        };
    }
    chunkToScreen(x, y) {
        return { x: x * this.chunkSize * this.gridSize, y: y * this.chunkSize * this.gridSize };
    }
    chunkToGrid(x, y) {
        return { x: x * this.chunkSize, y: y * this.chunkSize };
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
    chunkBoundsGridSpace(x, y, w, h) {
        return {
            x: chunkX * this.chunkSize,
            y: chunkY * this.chunkSize,
            w: w * this.chunkSize,
            h: h * this.chunkSize
        };
    }
    chunkBoundsScreenSpace(x, y, w, h) {
        return {
            x: x * this.gridSize * this.chunkSize,
            y: y * this.gridSize * this.chunkSize,
            w: w * this.gridSize * this.chunkSize,
            h: h * this.gridSize * this.chunkSize
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