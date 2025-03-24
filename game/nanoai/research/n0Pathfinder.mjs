import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { p2 } from "../../visualizers/lineVisualizer.mjs";
import star from "easystarjs"

export function findPath(cX, cY, tX, tY, sightDistance, padding, out) {
    
    //let sightDistance = Math.floor(sd / worldGrid.gridSize) 
    //let wx = worldGrid.screenToGridPoint(cX, cY)
    //let tx = worldGrid.screenToGridPoint(tX, tY)
    tX = Math.floor(tX), cX = Math.floor(cX);
    tY = Math.floor(tY), cY = Math.floor(cY);


    let vectorX = Math.floor(tX) - Math.floor(cX);
    let vectorY = Math.floor(tY) - Math.floor(cY);
    // Normalize the vector and limit its length
    let vectorLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    let normalizedVectorX = vectorX / vectorLength;
    let normalizedVectorY = vectorY / vectorLength;
    let limit = vectorLength < sightDistance;

    let limitedVectorX = limit ? vectorX : Math.ceil(normalizedVectorX * sightDistance);
    let limitedVectorY = limit ? vectorY : Math.ceil(normalizedVectorY * sightDistance);
    let pad = padding;
    let endX = cX + limitedVectorX;
    let endY = cY + limitedVectorY;
    let minax = Math.min(cX, endX);
    let minay = Math.min(cY, endY);
    let currentoX = cX - minax;
    let currentoY = cY - minay;
    let endoX = endX - minax;
    let endoY = endY - minay;

    var a = worldGrid.gridBounds(cX, cY, endX, endY, pad);
    var ar = a.toRect();

    let gridArray = [];
    for (let y = ar.y; y <= ar.h; y++) {
        gridArray[y] = [];
        for (let x = ar.x; x <= ar.w; x++) {
            let ga =  minax + x - pad;
            let gb = minay + y - pad;
            let tile = worldGrid.getTile(ga, gb);
            let p = (tile && tile.pathDifficulty) ?? 7
            gridArray[y][x] = p <0 ?0 :p
        }
    }

    let ezstar = stars(gridArray);
    ezstar(currentoX + pad, currentoY + pad, endoX + pad, endoY + pad, (path) => {
        if (path !== null) {
            var points = path.map(p => {
                return { x: a.minX + p.x , y: a.minY + p.y }
            })

           
            out({
                points, index: 0,
                get currentPoint() {
                    return this.points[this.index];
                },
                get isFinalPoint() {
                    return this.index === this.points.length - 1;
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
function stars(grid) {
    let astar = new star.js();
    astar.setGrid(grid);
    astar.setAcceptableTiles([0, 1, 2, 3, 4, 5, 6, 7]);
    astar.disableDiagonals();
    astar.setTileCost(0, 0); // Clouds
    astar.setTileCost(1, 1); // Dirt
    astar.setTileCost(2, 2); // Grass/Sand
    astar.setTileCost(3, 3); // Mud/Crops
    astar.setTileCost(4, 4); // Water/Bushes
    astar.setTileCost(5, 5) //rocky
    astar.setTileCost(6, 6) //thicks
    astar.setTileCost(7, 7) //bitter
    astar.setTileCost(8,8)
    astar.setTileCost(9,9)
    return function (ax, ay, bx, by, pathFn) {
       
        astar.findPath(ax, ay, bx, by, pathFn);
        astar.calculate();
    }
}
