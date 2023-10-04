export class WorldGrid {
    constructor() {
        this.tileSize = 32;
        this.scale =1; 
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
    getGridTileRect(x, y,w=1,h=1) {
        return {
            x: x,
            y: y,
            w: w, // Assuming grid cells are 1x1
            h: h,
            toScreenRect: function() {
                return {
                    x: this.x * this.tileSize,
                    y: this.y * this.tileSize,
                    w: this.w * this.tileSize,
                    h: this.h * this.tileSize
                }
            },
            toScreenBoundingBox: function() {
                return {
                    x: this.x * this.tileSize,
                    y: this.y * this.tileSize,
                    x2: (this.x + this.w) * this.tileSize,
                    y2: (this.y + this.h) * this.tileSize
                }
            },
            toGridBoundingBox: function() {
                return {
                    x: this.x,
                    y: this.y,
                    x2: this.x + this.w,
                    y2: this.y + this.h
                }
            }
        }
    }
    
    //this technically isn't bounds is it?
    getScreenTileRect(x,y,w=1,h=1) {
        return {
            x: x*this.tileSize,
            y: y*this.tileSize,
            w: w*this.tileSize,
            h: h*this.tileSize,
            toScreenBoundingBox: function() {
                return {
                    x: this.x,
                    y: this.y,
                    x2: this.x+this.w,
                    y2: this.y+this.h
                    
                }
            },
            toGridBoundingBox: function() {
                return {
                    x: Math.floor(this.x/this.tileSize),
                    y: Math.floor(this.y/this.tileSize),
                    x2: Math.floor(this.x/this.tileSize)+Math.floor(this.w/this.tileSize),
                    y2: Math.floor(this.y/this.tileSize)+Math.floor(this.h/this.tileSize)
                    
                }
            },
            toGridRect: function() {
                return {
                    x: Math.floor(this.x/this.tileSize),
                    y: Math.floor(this.y/this.tileSize),
                    w: Math.floor(this.w/this.tileSize),
                    h: Math.floor(this.h/this.tileSize)
                }
            }
        }
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