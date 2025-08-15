import { camera } from "../core/Camera/camera.mjs";
import { Sparse2dMap } from "./experiments/sparceMap";
import { p } from "../core/p5engine";
export class WorldGrid {
    constructor(tileSize, chunkSize, camera) {
        this.setTileSize(tileSize);
        this.setChunkSize(chunkSize);
        this.x = 2_000_000_000 //-15 * this.chunkSize
        this.y = 2_364_373_235 //240 * this.chunkSize;
        this.tiles = new Sparse2dMap();
        this.chunks = new Sparse2dMap();
        this.camera = camera
    }
    tileSize = 16;
    chunkSize = 4;
    setTileSize(a) {
        a = Math.abs(a);
        if (a === 0) {
            console.warn(`tileSize can not be 0: ${this.tileSize}`);
            return;
        }
        
        this.tileSize = a;
        
        if ((a & (a - 1)) === 0) { // a % 2
            this.tileLog   = Math.log2(a);
            this.tileMask  = a - 1;  
            this.floorTile = x => x >> this.tileLog; // Bitwise shift
            this.modTile   = x => x & this.tileMask;
        } else {
            this.tileLog   = null;
            this.tileMask  = null;  
            this.floorTile = x => Math.floor(x / this.tileSize); // Standard division
            this.modTile   = x => ((x % this.tileSize) + this.tileSize) % this.tileSize;
        }
        
    }

    setChunkSize(a) {
        a = Math.abs(a);
        if (a === 0) {
            console.warn(`chunkSize can not be 0: ${this.chunkSize}`);
            return;
        }
        
        this.chunkSize = a;
        
        if ((a & (a - 1)) === 0) {
            this.chunkLog   = Math.log2(a);
            this.chunkMask  = a - 1;
            this.floorChunk = x => x >> this.chunkLog;
            this.modTile    = x => x & this.chunkMask;
        } else {
            this.chunkLog   = null;
            this.chunkMask  = null;
            this.floorChunk = x => Math.floor(x / this.chunkSize);
            this.modChunk   = x => ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
        }

    }    

    setTile(x,y, obj) {
        let xx = Math.floor(x), yy = Math.floor(y)
        this.tiles.set(xx, yy, obj)
        //this.tiles.set(`${this.x+xx}, ${this.y+yy}`, obj);
    }
    getTile(x,y) {
        let xx = Math.floor(x), yy = Math.floor(y)
        return this.tiles.get(xx,yy)
        //return this.tiles.get(`${this.x+xx}, ${this.y+yy}`)
    }
    getChunk(x,y) {
        let xx = Math.floor(x), yy = Math.floor(y)
        //let c = this.chunks.get(`${this.x+xx}, ${this.y+yy}`) 
        //why are we adding world coordinates to chunk coordinates lol
        let c = this.chunks.get(xx,yy)        
        return c
    }
    makeChunk(x, y, callback) {
        let xx = Math.floor(x), yy = Math.floor(y)
        let c = {pos: [xx, yy]}
        this.chunks.set(xx,yy, c);
    }
    get halfTileSize() {
        return this.tileSize / 2
    }
    get mouseTilePos(){
        return  this.screenToTile(p.mouseX, p.mouseY)
    }
    get mouseOnScreen() {
        return (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height)
    }
    mouseInRect(x,y,w,h) {
        return (p.mouseX > x && p.mouseX < x+w && p.mouseY > y && p.mouseY < y+h)
    }
    screenToTile(x, y) {
        let grid = this;
        return {
            x: grid.floorTile(x-(camera.rx??0)),
            y: grid.floorTile(y-(camera.ry??0)),
            screen(centered) {
                if (centered)
                    return grid.scaleByTileCentered (this.x,this.y);
                else 
                    return grid.scaleByTile(this.x, this.y);
            }
        };
    }
    scaleByTile(x, y, c) {
        if (c) console.error("btw center used here") //todo: remove this lol
        x *= this.tileSize
        y *= this.tileSize
        return { x, y }
    }
    scaleByTileCentered(x, y) {
        x *= this.tileSize
        x += (this.tileSize / 2)
        y *= this.tileSize
        y += (this.tileSize / 2)

        return { x, y }
    }
    screenToTileRaw(x, y) {
        return { 
            x: x / this.tileSize, 
            y: y / this.tileSize 
        };
    }
    screenToChunkPoint(x, y) {
        let tilechunk = (this.tileSize * this.chunkSize);
        return { 
            x: Math.floor(x / tilechunk), 
            y: Math.floor(y / tilechunk) 
        };
    }
    screenToTileBounds(x1, y1, x2, y2, pad = 0) {
        let gridX1 = this.floorTile(x1), gridY1 = this.floorTile(y1);
        let gridX2 = this.floorTile(x2), gridY2 = this.floorTile(y2);
        return {
            minX: Math.min(gridX1, gridX2) - pad,
            minY: Math.min(gridY1, gridY2) - pad,
            maxX: Math.max(gridX1, gridX2) + pad,
            maxY: Math.max(gridY1, gridY2) + pad,
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
        let tilechunk = (this.tileSize * this.chunkSize);
        return {
            minX: Math.floor(x1 / tilechunk),
            minY: Math.floor(y1 / tilechunk),
            maxX: Math.floor(x2 / tilechunk),
            maxY: Math.floor(y2 / tilechunk)
        };
    }
    tileBounds(gx1, gy1, gx2, gy2, pad = 0) {
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
    tileToScreenPoint(x, y) {
        return { 
            x: x * this.tileSize, 
            y: y * this.tileSize 
        };
    }
    tileToChunkPoint(x, y) {
        return { 
            x: this.floorChunk(x), 
            y: this.floorChunk(y)
        };
    }
    tileToScreenBounds(minX, minY, maxX, maxY) {

        return {
            x1: (minX * this.tileSize),
            y1: (minY * this.tileSize),
            x2: (maxX) * this.tileSize,
            y2: (maxY) * this.tileSize
        };
    }
    tileToChunkBounds(x1, y1, x2, y2) {
        return {
            minX: this.floorChunk(x1),
            minY: this.floorChunk(y1),
            maxX: this.floorChunk(x2),
            maxY: this.floorChunk(y2)
        };
    }
    tileBoundsScreenSpace(x, y, w = 1, h = 1) {
        return {
            x: x * this.tileSize,
            y: y * this.tileSize,
            w: w * this.tileSize,
            h: h * this.tileSize
        };
    }
    chunkToScreen(x, y) {

        let chunktile = this.chunkSize*this.tileSize;
        return { x: x *chunktile, y: y * chunktile };
    }
    chunkToTile(x, y) {
        return { x: x * this.chunkSize, y: y * this.chunkSize };
    }
    chunkToScreenBounds(minX, minY, maxX, maxY) {
        
        let chunktile = this.chunkSize*this.tileSize;
        return {
            x1: minX * chunktile,
            y1: minY * chunktile,
            x2: (maxX) * chunktile,
            y2: (maxY) * chunktile
        };
    }
    chunkToScreenBounds1(minX, minY, maxX, maxY) {
        let chunktile = this.chunkSize*this.tileSize;
        return {
            x1: minX * chunktile,
            y1: minY * chunktile,
            x2: (maxX + 1) * chunktile,
            y2: (maxY + 1) * chunktile
        };
    }
    chunkBoundsTileSpace(x, y, w, h) {
        return {
            x: chunkX * this.chunkSize,
            y: chunkY * this.chunkSize,
            w: w * this.chunkSize,
            h: h * this.chunkSize
        };
    }
    chunkBoundsScreenSpace(x, y, w, h) {
        let chunktile = this.chunkSize*this.tileSize;
        return {
            x: x * chunktile,
            y: y * chunktile,
            w: w * chunktile,
            h: h * chunktile
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

        let chunktile = this.chunkSize*this.tileSize;

        // Scale down to world space.
        let worldX = x / (chunktile);
        let worldY = y / (chunktile);

        // Floor the position to align with world position.
        worldX = Math.floor(worldX);
        worldY = Math.floor(worldY);

        // Scale back up to screen space.
        let screenX = worldX * chunktile;
        let screenY = worldY * chunktile;

        return [screenX, screenY];
    }

    circleChunks(i,o) {
        i*=this.tileSize, o*=this.tileSize
        let ac = (x,y) => { 
            let [xx,yy] = this.alignPositionChunk(x,y); 
            return this.getChunk(xx/this.tileSize, yy/this.tileSize) 
        }
        let h = (this.tileSize/2);
        return [ac(i+h,o), ac(i-h,o), ac(i,o+h),ac(i,o-h)]
            .filter((o,i, a)=> (a.findIndex(item => item === o)) === i)
    }

    tileLog = null;
    tileMask = null;
    
    /**
     * Floors a world coordinate to the tile coordinate it belongs to
     * @param {number} a - World coordinate (e.g., pixel position)
     * @returns {number} Tile coordinate
     */
    floorTile(a) { /* Set by setTileSize */ }
    
    /**
     * Gets the offset within a tile for a world coordinate
     * @param {number} a - World coordinate (e.g., pixel position)
     * @returns {number} Offset within the tile
     */
    modTile(a) { /* Set by setTileSize */ }
    
    chunkLog = null;
    chunkMask = null;
    
    /**
     * Floors a tile coordinate to the chunk coordinate it belongs to
     * @param {number} a - Tile coordinate
     * @returns {number} Chunk coordinate
     */
    floorChunk(a) { /* Set by setChunkSize */ }
    
    /**
     * the tile position in a chunk using & masking modulo
     * @param {number} a - Tile coordinate
     * @returns {number} & mask varient of ((x % chunkSize) + chunkSize) % chunkSize;
     */
    modChunk(a) { /* Set by setChunkSize */ }
    
}
export const worldGrid = new WorldGrid(32,4,camera); 