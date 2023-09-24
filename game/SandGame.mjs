import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../engine/core/p5engine.mjs";


//starting out we have a grid system suggested by a gpt not chatgpt
//https://www.phind.com/
export class SandGame {
    constructor(grid) {
        this.grid = grid;
        this.sands = [];        
        this.i = 0;
        this.o = 0;
    }
    draw() {
        let bb = this.grid.boundingBox;
        p.fill(255);
        //p.rect(bb.x, bb.y, bb.w, bb.h);
        this.i++;
        if (this.i>=30) {
            this.i = 0;
            this.o ++;
            if (this.o >= 30) {
                this.o = 0
            }
        }
        this.grid.shift(this.sands[0], this.i,this.o);
      }

      addSand(sand) {
        this.sands.push(sand);
        this.grid.grid[sand.y][sand.x] = sand;
      }
}