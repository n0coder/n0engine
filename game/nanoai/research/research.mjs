import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { p2 } from "../../visualizers/lineVisualizer.mjs";
import star from "easystarjs"
class N0Pathfinder {
    constructor() {
        this.setActive = setActive;
        this.setActive(true);
        this.grid = new Map();

        this.x = 256+worldGrid.gridSize*6;
        this.y =64+ worldGrid.gridSize;
        this.tzx =256+ worldGrid.gridSize*2;
        this.tzy =64+ worldGrid.gridSize*13
    }

    findPath(cX, cY, tX, tY, sightDistance, padding, out) {
        //let sightDistance = Math.floor(sd / worldGrid.gridSize) 
        let wx = worldGrid.screenToGridPoint(cX, cY)
        let tx = worldGrid.screenToGridPoint(tX, tY)

        let currentX = wx.x;
        let currentY = wx.y;
        let targetX = tx.x;
        let targetY = tx.y;
        // Calculate the vector from the current position to the target
        let vectorX = targetX - currentX;
        let vectorY = targetY - currentY;

        // Normalize the vector and limit its length
        let vectorLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        let normalizedVectorX = vectorX / vectorLength;
        let normalizedVectorY = vectorY / vectorLength;
        
        let limit = vectorLength < sightDistance;

        let limitedVectorX =limit? vectorX : Math.ceil(normalizedVectorX * sightDistance);
        let limitedVectorY = limit? vectorY : Math.ceil(normalizedVectorY * sightDistance);

        let pad = padding;
        let endX = currentX + limitedVectorX;
        let endY = currentY + limitedVectorY;
        
        //what happens to the currentX endX, currentY endY when we shift the bounds?

        //currentX is NOT 0, 

        //the bounds are calculated using minmaxes 

        let minax = Math.min(currentX,endX); 
        let minay = Math.min(currentY,endY);
        let maxax = Math.max(currentX,endX); 
        let maxay = Math.max(currentY,endY);
        // this forms the boundingbox, also notes the positions of each position

        //pull the bounding box to the minimum
        //pull the currents and ends with the same value

        let currentoX = currentX- minax;
        let currentoY = currentY -minay; 
        let endoX= endX - minax;
        let endoY = endY - minay;

        var a = worldGrid.gridBounds(currentX,currentY,endX,endY,pad);
        var ar = a.toRect();
        
        console.log({cfasy: {currentX,currentY,endX,endY,limitedVectorX,limitedVectorY,pad}, a,ar})

        let gridArray = [];
        for (let y = ar.y; y <= ar.h+1; y++) {
            gridArray[y] = []
            for (let x = ar.x; x <= ar.w+1; x++) {
                let tile = worldGrid.tiles.get(`${x}, ${y}`);
                gridArray[y][x] = (tile&&tile.pathDifficulty) || 0
            }
        }
        let ezstar = this.stars(gridArray);

        ezstar(currentoX +pad, currentoY +pad, endoX +pad, endoY + pad, (path) => {
            if (path !== null) {
                var points = path.map(p => worldGrid.gridToScreenPoint(a.minX+p.x, a.minY+p.y))
                out({
                    points,
                    index: 0,
                    get currentPoint() {
                        return this.points[this.index];
                    },
                    get isFinalPoint() {
                        return this.index === this.points.length-1;
                    },
                    next() {
                        if (this.index < this.points.length - 1) {
                            this.index++;
                        }
                        return this.points[this.index];
                    },
                    currentPointDistance(x, y) {
                        let dx = x - this.currentPoint.x;
                        let dy = y - this.currentPoint.y;
                        return Math.sqrt(dx * dx + dy * dy);
                    },
                    get pathEndDistance() {
                        let totalDistance = 0;
                        for (let i = this.index; i < this.points.length - 1; i++) {
                            let dx = this.points[i + 1].x - this.points[i].x;
                            let dy = this.points[i + 1].y - this.points[i].y;
                            totalDistance += Math.sqrt(dx * dx + dy * dy);
                        }
                        return totalDistance;
                    }
                });
            } else {
                out(null);
            }



        })

    }



    stars(grid) {
        let astar = new star.js();
        astar.setGrid(grid);
        astar.setAcceptableTiles([0,1,2,3,4,5,6,7]);
        astar.disableDiagonals();
        astar.setTileCost(0, 0); // Clouds
        astar.setTileCost(1, 1); // Dirt
        astar.setTileCost(2, 2); // Grass/Sand
        astar.setTileCost(3, 3); // Mud/Crops
        astar.setTileCost(4, 4); // Water/Bushes
        astar.setTileCost(5,5) //rocky
        astar.setTileCost(6,6) //thicks
        astar.setTileCost(7,7) //bitter
        return function (ax, ay, bx, by, pathFn) {
            astar.findPath(ax, ay, bx, by, pathFn);
            astar.calculate();
        }
    }


    draw() {
        p.fill(255)
        let x = 16;
        
        p.fill(166, 111, 111);
        p.ellipse(this.x, this.y, 8)
        p.fill(111, 166, 111);
        p.ellipse(this.tzx, this.tzy, 8)

        p.fill(255);
        let i = 64, o = 64;
        let a = 64+32, b = 64+32;

        [i,o,a,b] = [a,b,i,o];

        p.ellipse(i,o, 8);
        p.ellipse(a,b, 4);
        var bounds = worldGrid.gridBounds(i,o,a,b,8);
        p.ellipse(bounds.minX, bounds.minY, 12)
        p.ellipse(bounds.maxX, bounds.minY, 6)
        p.ellipse(bounds.maxX, bounds.maxY, 4)
        p.ellipse(bounds.minX, bounds.maxY, 6)
        p2.variableLine(i,o,a,b, 12, 4);
        //p2.variableLine(128,128,128,256, 16, 0);
    }
}
export var n0Pathfinder = new N0Pathfinder();