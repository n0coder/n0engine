import { mod } from "../core/Utilities/NumberUtils";
import { Map2d } from "../n0math/map2d.mjs";

export class WorldGrid {
    constructor() {
        this.tileSize = 16;
        this.chunkSize = 4;
        this.chunkLog = Math.log2(this.chunkSize);
        this.chunkMask = this.chunkSize - 1
        this.x = 724;
        this.y = 2375;
        this.chunks = new Map();
    }
    setTile(x,y, obj) { //tile space so we don't multiply by chunk size
        let wx = x + this.x, wy = y + this.y;
        let cx = wx>>this.chunkLog, cy = wy>>this.chunkLog;
        let chunk = this.chunks.get(`${cx}, ${cy}`);
        if (!Array.isArray(chunk)) 
           chunk = this.createChunk(cx,cy)
        let tx = wx & this.chunkMask, ty = wy & this.chunkMask;
        chunk[tx][ty] = obj
    }
    getTile(x,y) { //tile space so we don't multiply by chunk size
        let wx = x + this.x, wy = y + this.y;
        //Math.floor(xx / this.chunkSize)
        let cx = wx>>this.chunkLog, cy = wy>>this.chunkLog;
        //((x%this.chunkSize)+this.chunkSize)%this.chunkSize
        let tx = wx & this.chunkMask, ty = wy & this.chunkMask;
        return this.chunks.get(`${cx}, ${cy}`)?.[tx]?.[ty];
    }
    createChunk(x,y, f) {
        let wx = (x*this.chunkSize) + this.x, wy = (y *this.chunkSize)+ this.y;
        //Math.floor(xx / this.chunkSize)
        let cx = wx>>this.chunkLog, cy = wy>>this.chunkLog;
        let chunk = new Array(this.chunkSize).fill(null).map((a, i) => new Array(this.chunkSize).fill(null).map((b, o)=>f?.(i, o, cx, cy) ?? {x:cx+i, y:cy+o}))
        this.chunks.set(`${cx}, ${cy}`, chunk)
        return chunk;
    }
    getChunk(x,y) {
        //multiplied by chunk size to align with world grid, 
        let wx = (x*this.chunkSize) + this.x, wy = (y *this.chunkSize)+ this.y;
        //Math.floor(xx / this.chunkSize)
        //floor world chunk coordinates to compress world coordinates into chunk space 
        let cx = wx>>this.chunkLog, cy = wy>>this.chunkLog;
        return this.chunks.get(`${cx}, ${cy}`);
    }
    get halfTileSize() {
        return this.tileSize / 2
    }

    screenToGridPoint(x, y) {
        return {
            x: Math.floor(x / this.tileSize),
            y: Math.floor(y / this.tileSize),
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
            x1: minX * this.tileSize,
            y1: minY * this.tileSize,
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
    
}
export const worldGrid = new WorldGrid(); 