import { p } from "../engine/core/p5engine.mjs";


//starting out we have a grid system suggested by a gpt not chatgpt
//https://www.phind.com/
export class SandGame {
    constructor(grid) {
        this.grid = grid;
        this.sands = [];        
    }
    draw() {
        let bb = this.grid.boundingBox;
        //console.log(bb);

        p.fill(255);
        p.rect(bb.x, bb.y, bb.w, bb.h);

        //gonna shift sand to it's own entity class
        for (let i = 0; i < this.grid.rows; i++) {
          for (let j = 0; j < this.grid.cols; j++) {
            if (this.grid.grid[i][j] === 6) {
                p.fill(0);
                p.rect(j * this.grid.tileSize+this.grid.x, i * this.grid.tileSize+this.grid.y, this.grid.tileSize, this.grid.tileSize);
            }
          }
        }
      }
}