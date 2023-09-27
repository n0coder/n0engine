import { p } from "../../engine/core/p5engine.mjs";

export class GeneticSquare {
    constructor(r,g,b, x,y,size, mut=30){
        this.r = r;
        this.g = g;
        this.b = b; 
        this.x =x||-222;
        this.y =y||-222;
        this.size =size|| 32;
        this.mut = mut;
    }
    mousePressed() {
        if (this.x*this.size<p.mouseX && (this.x*this.size)+this.size >p.mouseX)
        if (this.y*this.size<p.mouseY && (this.y*this.size)+this.size >p.mouseY)
        this.selected?.(this);
    }

    regenerate(square, mutChange = 30) {
        [this.r,this.g,this.b] = this.mutate([square.r, square.g, square.b], square.mut +  mutChange);
        this.mut = square.mut + mutChange;
    }
    
    mutateCopy(mutChange = 30) {
        var [r,g,b] = this.mutate([this.r,this.g, this.b], this.mut + mutChange);
        return new GeneticSquare(r,g,b,this.x, this.y, this.size, this.mut+mutChange);
    }
    mutate (color, mutSize) {
        let [r, g, b] = color;

        let halfMutSize = mutSize/2;
            if (Math.random() < 0.5) {
            if (Math.random() > 0.15)
                r = Math.min(255, Math.max(0, r + Math.floor(Math.random() * mutSize) - halfMutSize));
        
            if (Math.random() > 0.15)
                g = Math.min(255, Math.max(0, g + Math.floor(Math.random() * mutSize) - halfMutSize));
       
            if (Math.random() > 0.15)
                b = Math.min(255, Math.max(0, b + Math.floor(Math.random() * mutSize) - halfMutSize));
            }
            return [r,g,b]
    }
    draw() {
        p.fill(this.r,this.g,this.b)
        p.rect(this.x*this.size, this.y*this.size, this.size, this.size);
    }
    
}