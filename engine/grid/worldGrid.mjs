import { camera } from "../core/Camera/camera.mjs";

export class WorldGrid {
    constructor() {
        this.setTileSize(16);
        this.setChunkSize(4);
        this.x = 724 //-15 * this.chunkSize
        this.y = 2375 //240 * this.chunkSize;
        this.tiles = new Map();
        this.chunks = new Map();
    }
    tileSize = 16;
    chunkSize = 4;
    setTileSize(a) {
        a = Math.abs(a); // Silently convert negative to positive
        if (a === 0) {
            console.warn(`tileSize can not be 0: ${this.tileSize}`);
            return; // Exit to avoid division by zero
        }
        
        this.tileSize = a;
        
        // Check if a is a power of 2: n > 0 && (n & (n - 1)) === 0
        if ((a & (a - 1)) === 0) {
            this.tileLog = Math.log2(a);
            this.tileMask = a - 1;
            this.floorTile = x => x >> this.tileLog; // Bitwise shift
            this.modTile = x => x & this.tileMask;   // Bitwise AND
        } else {
            this.tileLog = null;
            this.tileMask = null;
            this.floorTile = x => Math.floor(x / this.tileSize); // Standard division
            this.modTile = x => ((x % this.tileSize) + this.tileSize) % this.tileSize; // Modulo with negative handling
        }
    }

    setChunkSize(a) {
        a = Math.abs(a); // Silently convert negative to positive
        if (a === 0) {
            console.warn(`chunkSize can not be 0: ${this.chunkSize}`);
            return; // Exit to avoid division by zero
        }
        
        this.chunkSize = a;
        
        if ((a & (a - 1)) === 0) {
            this.chunkLog = Math.log2(a);
            this.chunkMask = a - 1;
            this.floorChunk = x => x >> this.chunkLog;
            this.modChunk = x => x & this.chunkMask;
        } else {
            this.chunkLog = null;
            this.chunkMask = null;
            this.floorChunk = x => Math.floor(x / this.chunkSize);
            this.modChunk = x => ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
        }
    }    

    setTile(x,y, obj) {
        this.tiles.set(`${this.x+ x}, ${ this.y+ y}`, obj);
    }
    getTile(x,y) {
        var xx = Math.floor(x), yy = Math.floor(y)
        return this.tiles.get(`${this.x+xx}, ${this.y+yy}`)
    }
    getChunk(x,y) {
        var xx = Math.floor(x), yy = Math.floor(y)
        let c = this.chunks.get(`${this.x+xx}, ${this.y+yy}`)
        if (!c) {
             c = {pos: [xx, yy]}
            this.chunks.set(`${this.x+xx}, ${this.y+yy}`, c)
        }
        return c
    }
    get halfTileSize() {
        return this.tileSize / 2
    }

    screenToGridPoint(x, y) {
        return {
            x: Math.floor((x-camera.rx) / this.tileSize),
            y: Math.floor((y-camera.ry) / this.tileSize),
            screen(centered) {
                return worldGrid.scaleGrid(this.x,this.y, centered)
            }
        };
    }
    scaleGrid(x, y, centered) {
        x *=worldGrid.tileSize
        x += centered ? (worldGrid.tileSize / 2) : 0
        y *= worldGrid.tileSize
        y += centered ? (worldGrid.tileSize / 2) : 0

        return { x, y }
    }
    screenToGridPointRaw(x, y) {
        return { x: x / this.tileSize, y: y / this.tileSize };
    }
    screenToChunkPoint(x, y) {
        return { x: Math.floor(x / (this.tileSize * this.chunkSize)), y: Math.floor(y / (this.tileSize * this.chunkSize)) };
    }
    screenToGridBounds(x1, y1, x2, y2, pad = 0) {
        let gx1 = Math.floor(x1 / this.tileSize);
        let gy1 = Math.floor(y1 / this.tileSize);
        let gx2 = Math.floor(x2 / this.tileSize)
        let gy2 = Math.floor(y2 / this.tileSize)
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
            minX: Math.floor(x1 / (this.tileSize * this.chunkSize)),
            minY: Math.floor(y1 / (this.tileSize * this.chunkSize)),
            maxX: Math.floor(x2 / (this.tileSize * this.chunkSize)),
            maxY: Math.floor(y2 / (this.tileSize * this.chunkSize))
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
        return { x: x * this.tileSize, y: y * this.tileSize };
    }
    gridToChunkPoint(x, y) {
        return { x: Math.floor(x / this.chunkSize), y: Math.floor(y / this.chunkSize) };
    }
    gridToScreenBounds(minX, minY, maxX, maxY) {

        return {
            x1: (minX * this.tileSize),
            y1: (minY * this.tileSize),
            x2: (maxX) * this.tileSize,
            y2: (maxY) * this.tileSize
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
            x: x * this.tileSize,
            y: y * this.tileSize,
            w: w * this.tileSize,
            h: h * this.tileSize
        };
    }
    chunkToScreen(x, y) {
        return { x: x * this.chunkSize * this.tileSize, y: y * this.chunkSize * this.tileSize };
    }
    chunkToGrid(x, y) {
        return { x: x * this.chunkSize, y: y * this.chunkSize };
    }
    chunkToScreenBounds(minX, minY, maxX, maxY) {
        return {
            x1: minX * this.tileSize * this.chunkSize,
            y1: minY * this.tileSize * this.chunkSize,
            x2: (maxX) * this.tileSize * this.chunkSize,
            y2: (maxY) * this.tileSize * this.chunkSize
        };
    }
    chunkToScreenBounds1(minX, minY, maxX, maxY) {
        return {
            x1: minX * this.tileSize * this.chunkSize,
            y1: minY * this.tileSize * this.chunkSize,
            x2: (maxX + 1) * this.tileSize * this.chunkSize,
            y2: (maxY + 1) * this.tileSize * this.chunkSize
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
            x: x * this.tileSize * this.chunkSize,
            y: y * this.tileSize * this.chunkSize,
            w: w * this.tileSize * this.chunkSize,
            h: h * this.tileSize * this.chunkSize
        };
    }
    alignPosition(x, y) {
        if (Array.isArray(x)) [x, y] = x;

        // Scale down to world space.
        let worldX = x / this.tileSize;
        let worldY = y / this.tileSize;

        // Floor the position to align with world position.
        worldX = Math.floor(worldX);
        worldY = Math.floor(worldY);

        // Scale back up to screen space.
        let screenX = worldX * this.tileSize;
        let screenY = worldY * this.tileSize;

        return [screenX, screenY];
    }
    alignGridPosition(x,y) {
        return [Math.floor(x), Math.floor(y)]
    }
    alignPositionChunk(x, y) {
        if (Array.isArray(x)) [x, y] = x;

        // Scale down to world space.
        let worldX = x / (this.chunkSize);
        let worldY = y / (this.chunkSize);

        // Floor the position to align with world position.
        worldX = Math.round(worldX);
        worldY = Math.round(worldY);

        // Scale back up to screen space.
        let screenX = worldX * this.chunkSize;
        let screenY = worldY * this.chunkSize;

        return [screenX, screenY];
    }
    alignScreenPositionChunk(x, y) {
        if (Array.isArray(x)) [x, y] = x;

        // Scale down to world space.
        let worldX = x / (this.chunkSize*this.tileSize);
        let worldY = y / (this.chunkSize*this.tileSize);

        // Floor the position to align with world position.
        worldX = Math.round(worldX);
        worldY = Math.round(worldY);

        // Scale back up to screen space.
        let screenX = worldX * this.chunkSize*this.tileSize;
        let screenY = worldY * this.chunkSize*this.tileSize;

        return [screenX, screenY];
    }

    circleChunks(i,o) {
        i=i*this.tileSize, o=o*this.tileSize
        let ac = (x,y) => { var [xx,yy] = this.alignPositionChunk(x,y); return this.getChunk(xx/this.tileSize,yy/this.tileSize) }
        let h = (this.tileSize/2);
        return [ac(i+h,o), ac(i-h,o), ac(i,o+h),ac(i,o-h)].filter((o,i, a)=> a.findIndex(item => item === o) === i)
    }

    tileLog = null;
    tileMask = null;
    
    /**
     * Floors a world coordinate to the tile coordinate it belongs to
     * @param {number} a - World coordinate (e.g., pixel position)
     * @returns {number} Tile coordinate
     */
    floorWorldTile(a) { /* Set by setTileSize */ }
    
    /**
     * Gets the offset within a tile for a world coordinate
     * @param {number} a - World coordinate (e.g., pixel position)
     * @returns {number} Offset within the tile
     */
    modWorldTile(a) { /* Set by setTileSize */ }
    
    chunkLog = null;
    chunkMask = null;
    
    /**
     * Floors a tile coordinate to the chunk coordinate it belongs to
     * @param {number} a - Tile coordinate
     * @returns {number} Chunk coordinate
     */
    floorTileChunk(a) { /* Set by setChunkSize */ }
    
    /**
     * Gets the offset within a chunk for a tile coordinate
     * @param {number} a - Tile coordinate
     * @returns {number} Offset within the chunk
     */
    modTileChunk(a) { /* Set by setChunkSize */ }
    
}
export const worldGrid = new WorldGrid(); 