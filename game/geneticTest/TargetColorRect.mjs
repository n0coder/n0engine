import { p } from "../../engine/core/p5engine.mjs";
import { GeneticSquare } from "./geneticSquare.mjs";

export class TargetColorRect {
    constructor(x,y,size, col){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = col||[166,255,133]
    }
    draw() {
        var col = this.color;
        if (this.color instanceof GeneticSquare) {
            col = [col.r, col.g, col.b] 
        }
        p.fill(col);
        p.rect(this.x, this.y, this.size, this.size);
    }
    randomize() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        this.color = [r, g, b];
    }
    
}