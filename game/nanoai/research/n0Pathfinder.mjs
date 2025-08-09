import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.ts";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { p2 } from "../../visualizers/lineVisualizer.mjs";
import star from "easystarjs"

export function findPath(cx, cy, tx, ty, sightDistance, padding, out, agraphics) {
    //let sightDistance = Math.floor(sd / worldGrid.gridSize) 
    tx = Math.floor(tx), cx = Math.floor(cx);
    ty = Math.floor(ty), cy = Math.floor(cy);
    let vectorX = tx - cx;
    let vectorY = ty - cy;
    // Normalize the vector and limit its length
    let vectorLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    let normalizedVectorX = vectorX / vectorLength;
    let normalizedVectorY = vectorY / vectorLength;
    let limit = vectorLength < sightDistance;

    let limitedVectorX = limit ? vectorX : Math.ceil(normalizedVectorX * sightDistance);
    let limitedVectorY = limit ? vectorY : Math.ceil(normalizedVectorY * sightDistance);
    let pad = padding;
    let endX = cx + limitedVectorX;
    let endY = cy + limitedVectorY;
    let minax = Math.min(cx, endX);
    let minay = Math.min(cy, endY);
    let currentoX = cx - minax;
    let currentoY = cy - minay;
    let endoX = endX - minax;
    let endoY = endY - minay;

    var a = worldGrid.gridBounds(cx, cy, endX, endY, pad);
    var ar = a.toRect();
    //console.log({ar,cx,cy,tx,ty}) //bounds
    
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

    //console.log(gridArray)
    let ss = 2;
    if (!agraphics) {
         agraphics = p.createGraphics((ar.w + 1) * ss, (ar.h + 1) * ss);
    }
    else{
         // Resize graphics to new dimensions
         agraphics.resizeCanvas((ar.w + 1) * ss, (ar.h + 1) * ss);
         // Clear previous content
         agraphics.clear();
    }
    for (let y = 0; y <= ar.h; y++) {
        for (let x = 0; x <= ar.w; x++) {
            let value = gridArray[y][x];
            agraphics.noStroke();
            agraphics.fill(lerp(0, 255, inverseLerp(0, 8, value))); // Adjust these values as needed
            agraphics.rect(x * ss, y * ss, 1 * ss, 1 * ss);
            agraphics.fill(222, 121, 121)
            agraphics.rect((currentoX + pad) * ss, (currentoY + pad) * ss, 1 * ss, 1 * ss);
            agraphics.rect((endoX + pad) * ss, (endoY + pad) * ss, 1 * ss, 1 * ss);
        }
    }

    let ezstar = stars(gridArray);
    ezstar(currentoX + pad, currentoY + pad, endoX + pad, endoY + pad, (path) => {
        //console.log(path)
        if (path !== null) {

            agraphics.fill(255);
            agraphics.stroke(255);
            agraphics.strokeWeight(1)
            for (let i = 0; i < path.length - 1; i++) {
                agraphics.line(path[i].x * 2, path[i].y * 2, path[i + 1].x * 2, path[i + 1].y * 2);
            }
            //draw path to graphics buffer

            var points = path.map(p => {
                let world = worldGrid.gridToScreenPoint(a.minX + p.x, a.minY + p.y)
                return { x: world.x + worldGrid.halfTileSize, y: world.y + worldGrid.halfTileSize }
            })

            var points = path.map(p => {
                return { x: a.minX + p.x , y: a.minY + p.y }
            })

           
            out({
                points, index: 0, graphics:agraphics,
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
            
            out({n:null, graphics:agraphics});
        }



    })
    
}
function stars(grid) {
    let astar = new star.js();
    astar.setGrid(grid);
    astar.setAcceptableTiles([0, 1, 2, 3, 4, 5, 6, 7]);
    //astar.disableDiagonals();
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
    
    //console.log(grid)
    return function (ax, ay, bx, by, pathFn) {
        let a = grid[ay][ax]
        let b = grid[by][bx]
        if (a > 7) console.error("path starts in a wall", {ax,ay,a:worldGrid.getTile(ax, ay)});
        if (b > 7) console.error("path ends in a wall",{bx,by,b:worldGrid.getTile(bx, by)});

            let vectorX = ax - bx;
            let vectorY = ay - by;
            let vectorLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
            //console.log({ax,ay,bx,by,vectorLength}); //i'm betting on the idea nanos get confused when walkiing 0 distance
            astar.findPath(ax, ay, bx, by, (path)=>{ 
            //console.log(path)
            if (path.length === 0) path.push({x:bx, y:by}) //if 0 length path, fake one point so the nano can say it reached the point
            return pathFn(path)
        });
        astar.calculate();
    }
}

//stars([[0,0,0],[0,0,0],[0,0,0]])(0,0,0,0, (path)=>{console.log(path)})