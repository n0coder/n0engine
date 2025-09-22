import { Camera, camera } from "../core/Camera/camera.mjs";
import { Sparse2dMap } from "./experiments/sparceMap.ts";
import { p } from "../core/p5engine";
import { Tile } from "./tile.mjs";
export class WorldGrid {

    constructor(tileSize:number, chunkSize:number, camera:Camera) {
        this.setTileSize(tileSize);
        this.setChunkSize(chunkSize);
        this.tiles = new Sparse2dMap();
        this.chunks = new Sparse2dMap();
        this.camera = camera
    }
    x:number=110_000_100;
    y:number=334_373_235;
    tiles:Sparse2dMap<Tile|any>
    chunks:Sparse2dMap<object>
    camera:Camera
    tileSize = 4;
    chunkSize = 4;

    setTileSize(a:number) {
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

    setChunkSize(a:number) {
        a = Math.abs(a);
        if (a === 0) {
            console.warn(`chunkSize can not be 0: ${this.chunkSize}`);
            return;
        }
        
        this.chunkSize = a;
        
        if ((a & (a - 1)) === 0) {
            this.chunkLog   = Math.log2(a);
            this.chunkMask  = a - 1;
            this.floorChunk = x => { if (this.modChunk(x) > (3/4*a))  return x >> this.chunkLog };
            this.modChunk    = x => x & this.chunkMask;
        } else {
            this.chunkLog   = null;
            this.chunkMask  = null;
            this.floorChunk = x => Math.floor(x / this.chunkSize);
            this.modChunk   = x => ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
        }

    }    

    setTile(x:number,y:number, obj:any) {
        let xx = Math.floor(x), yy = Math.floor(y)
        this.tiles.set(xx, yy, obj)
        //this.tiles.set(`${this.x+xx}, ${this.y+yy}`, obj);
    }
    getTile(x:number,y:number) : Tile {
        let xx = Math.floor(x), yy = Math.floor(y)
        return this.tiles.get(xx,yy)
        //return this.tiles.get(`${this.x+xx}, ${this.y+yy}`)
    }
    getChunk(x:number,y:number) : {  }  {
        let xx = Math.floor(x), yy = Math.floor(y)
        //let c = this.chunks.get(`${this.x+xx}, ${this.y+yy}`) 
        //why are we adding world coordinates to chunk coordinates lol
        return this.chunks.get(xx,yy) 
    }
    makeChunk(x:number, y:number, callback) {
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
    get mouseOnScreen(): boolean {
        return (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height)
    }
    mouseInRect(x:number,y:number,w:number,h:number) {
        return (p.mouseX > x && p.mouseX < x+w && p.mouseY > y && p.mouseY < y+h)
    }
    screenToTile(x:number, y:number) {
        let grid = this;
        
        return {
            x: grid.floorTile(x-(camera.rx??0)),
            y: grid.floorTile(y-(camera.ry??0)),
            screen(centered) {
                if (centered)
                    return grid.scaleByTileCentered (this.x,this.y);
                return grid.scaleByTile(this.x, this.y);
            }
        };
    }
    scaleByTile(x:number, y:number) {
        x *= this.tileSize
        y *= this.tileSize
        return { x, y }
    }
    scaleByTileCentered(x:number, y:number) {
        x *= this.tileSize
        x += (this.tileSize / 2)
        y *= this.tileSize
        y += (this.tileSize / 2)

        return { x, y }
    }
    screenToTileRaw(x:number, y:number) {
        return { 
            x: x / this.tileSize, 
            y: y / this.tileSize 
        };
    }
    screenToChunkPoint(x:number, y:number) {
        let tilechunk = (this.tileSize * this.chunkSize);
        return { 
            x: Math.floor(x / tilechunk), 
            y: Math.floor(y / tilechunk) 
        };
    }
    screenToTileBounds(x1:number, y1:number, x2:number, y2:number, pad = 0) {
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
    screenToChunkBounds(x1:number, y1:number, x2:number, y2:number) {
        let tilechunk = (this.tileSize * this.chunkSize);
        return {
            minX: Math.floor(x1 / tilechunk),
            minY: Math.floor(y1 / tilechunk),
            maxX: Math.floor(x2 / tilechunk),
            maxY: Math.floor(y2 / tilechunk)
        };
    }
    tileBounds(gx1:number, gy1:number, gx2:number, gy2:number, pad = 0) {
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
    tileToScreenPoint(x:number, y:number) {
        return { 
            x: x * this.tileSize, 
            y: y * this.tileSize 
        };
    }
    tileToChunkPoint(x:number, y:number) {
        return { 
            x: this.floorChunk(x), 
            y: this.floorChunk(y)
        };
    }
    tileToScreenBounds(minX:number, minY:number, maxX:number, maxY:number) {

        return {
            x1: (minX * this.tileSize),
            y1: (minY * this.tileSize),
            x2: (maxX) * this.tileSize,
            y2: (maxY) * this.tileSize
        };
    }
    tileToChunkBounds(x1:number, y1:number, x2:number, y2:number) {
        return {
            minX: this.floorChunk(x1),
            minY: this.floorChunk(y1),
            maxX: this.floorChunk(x2),
            maxY: this.floorChunk(y2)
        };
    }
    tileBoundsScreenSpace(x:number, y:number, w = 1, h = 1) {
        return {
            x: x * this.tileSize,
            y: y * this.tileSize,
            w: w * this.tileSize,
            h: h * this.tileSize
        };
    }
    chunkToScreen(x:number, y:number) {

        let chunktile = this.chunkSize*this.tileSize;
        return { x: x *chunktile, y: y * chunktile };
    }
    chunkToTile(x:number, y:number) {
        return { x: x * this.chunkSize, y: y * this.chunkSize };
    }
    chunkToScreenBounds(minX:number, minY:number, maxX:number, maxY:number) {
        
        let chunktile = this.chunkSize*this.tileSize;
        return {
            x1: minX * chunktile,
            y1: minY * chunktile,
            x2: (maxX) * chunktile,
            y2: (maxY) * chunktile
        };
    }
    chunkToScreenBounds1(minX:number, minY:number, maxX:number, maxY:number) {
        let chunktile = this.chunkSize*this.tileSize;
        return {
            x1: minX * chunktile,
            y1: minY * chunktile,
            x2: (maxX + 1) * chunktile,
            y2: (maxY + 1) * chunktile
        };
    }
    chunkBoundsTileSpace(x:number, y:number, w:number, h:number) {
        return {
            x: x * this.chunkSize,
            y: y * this.chunkSize,
            w: w * this.chunkSize,
            h: h * this.chunkSize
        };
    }
    chunkBoundsScreenSpace(x:number, y:number, w:number, h:number) {
        let chunktile = this.chunkSize*this.tileSize;
        return {
            x: x * chunktile,
            y: y * chunktile,
            w: w * chunktile,
            h: h * chunktile
        };
    }
    alignPosition(x:number, y:number) {
        // Scale down to world space.
        let worldX = x / this.tileSize;
        let worldY = y / this.tileSize;

        // Floor the position to align with world position.
        worldX = Math.floor(worldX);
        worldY = Math.floor(worldY);

        // Scale back up to screen space.
        let screenX = worldX * this.tileSize;
        let screenY = worldY * this.tileSize;

        return {x:screenX, y:screenY};
    }
    alignPositionChunk(x:number, y:number) {

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
    alignScreenPositionChunk(x:number, y:number) {

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

    circleChunks(i:number,o:number) {
        i*=this.tileSize, o*=this.tileSize
        let ac = (x,y) => { 
            let [xx,yy] = this.alignPositionChunk(x,y); 
            return this.getChunk(xx/this.tileSize, yy/this.tileSize) 
        }
        let h = (this.tileSize/2);
        return [ac(i+h,o), ac(i-h,o), ac(i,o+h),ac(i,o-h)]
            .filter((o,i, a)=> (a.findIndex(item => item === o)) === i)
    }

/*
    tileLog?  : number;
    tileMask? : number;
    floorTile?: (a: number) => number;
    modTile?  : (a: number) => number;

    declare chunkLog?  : number;
    chunkMask? : number;
    floorChunk?: (a: number) => number;
    modChunk?  : (a: number) => number;
*/


    tileLog? : number;
    tileMask? : number;
    
    /**
     * Floors a world coordinate to the tile coordinate it belongs to
     * @param {number} a - World coordinate (e.g., pixel position)
     * @returns {number} Tile coordinate
     */
    floorTile(a:number): number;
    
    /**
     * Gets the offset within a tile for a world coordinate
     * @param {number} a - World coordinate (e.g., pixel position)
     * @returns {number} Offset within the tile
     */
    modTile(a:number): number;
    
    chunkLog: number;
    chunkMask: number;
    
    /**
     * Floors a tile coordinate to the chunk coordinate it belongs to
     * @param {number} a - Tile coordinate
     * @returns {number} Chunk coordinate
     */
    floorChunk(a:number): number;
    
    /**
     * the tile position in a chunk using & masking modulo
     * @param {number} a - Tile coordinate
     * @returns {number} & mask varient of ((x % chunkSize) + chunkSize) % chunkSize;
     */
    modChunk(a:number): number;
    
}
export const worldGrid = new WorldGrid(32,4,camera); 