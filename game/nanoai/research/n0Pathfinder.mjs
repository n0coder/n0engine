import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { p2 } from "../../visualizers/lineVisualizer.mjs";
import star from "easystarjs"

export function findPath(cX, cY, tX, tY, sightDistance, padding, out) {
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

    let limitedVectorX = limit ? vectorX : Math.ceil(normalizedVectorX * sightDistance);
    let limitedVectorY = limit ? vectorY : Math.ceil(normalizedVectorY * sightDistance);

    let pad = padding;
    let endX = currentX + limitedVectorX;
    let endY = currentY + limitedVectorY;

    let minax = Math.min(currentX, endX);
    let minay = Math.min(currentY, endY);

    let currentoX = currentX - minax;
    let currentoY = currentY - minay;
    let endoX = endX - minax;
    let endoY = endY - minay;

    var a = worldGrid.gridBounds(currentX, currentY, endX, endY, pad);
    var ar = a.toRect();

    let gridArray = [];
    for (let y = ar.y; y <= ar.h; y++) {
        gridArray[y] = [];
        for (let x = ar.x; x <= ar.w; x++) {
            let tile = worldGrid.tiles.get(`${worldGrid.x + minax + x - pad}, ${worldGrid.y + minay + y - pad}`);
            gridArray[y][x] = (tile && tile.pathDifficulty) || 7
        }
    }
    let ss = 2;
    let graphics = p.createGraphics((ar.w + 1) * ss, (ar.h + 1) * ss);
    for (let y = 0; y <= ar.h; y++) {
        for (let x = 0; x <= ar.w; x++) {
            let value = gridArray[y][x];
            graphics.noStroke();
            graphics.fill(lerp(0, 255, inverseLerp(0, 8, value))); // Adjust these values as needed
            graphics.rect(x * ss, y * ss, 1 * ss, 1 * ss);
            graphics.fill(222, 121, 121)
            graphics.rect((currentoX + pad) * ss, (currentoY + pad) * ss, 1 * ss, 1 * ss);
            graphics.rect((endoX + pad) * ss, (endoY + pad) * ss, 1 * ss, 1 * ss);
        }
    }


    let ezstar = stars(gridArray);
    ezstar(currentoX + pad, currentoY + pad, endoX + pad, endoY + pad, (path) => {
        if (path !== null) {
            graphics.fill(255);
            graphics.stroke(255);
            graphics.strokeWeight(1)
            for (let i = 0; i < path.length - 1; i++) {
                graphics.line(path[i].x * 2, path[i].y * 2, path[i + 1].x * 2, path[i + 1].y * 2);
            }
            //draw path to graphics buffer

            var points = path.map(p => {
                let world = worldGrid.gridToScreenPoint(a.minX + p.x, a.minY + p.y)
                return { x: world.x + worldGrid.halfTileSize, y: world.y + worldGrid.halfTileSize }
            })
            //points[points.length-1] = {x:tX, y:tY}
            out({
                points,
                graphics,
                index: 0,
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
    return function (ax, ay, bx, by, pathFn) {
        astar.findPath(ax, ay, bx, by, pathFn);
        astar.calculate();
    }
}
