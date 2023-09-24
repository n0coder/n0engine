import { p } from "../engine/core/p5engine.mjs";


//starting out we have a grid system suggested by a gpt not chatgpt
//https://www.phind.com/
export class SandGame {
    constructor(grid) {
        this.grid = grid;        
    }
    draw() {
        for (let i = 0; i < this.grid.rows; i++) {
          for (let j = 0; j < this.grid.cols; j++) {
            if (this.grid.grid[i][j] === 6) {
              p.fill(0);
            } else {
              p.fill(255);
            }
            p.rect(j * this.grid.tileSize+this.grid.x, i * this.grid.tileSize+this.grid.y, this.grid.tileSize, this.grid.tileSize);
          }
        }
      }
}