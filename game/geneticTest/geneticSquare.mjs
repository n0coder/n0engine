import { p } from "../../engine/core/p5engine.mjs";

export class GeneticSquare {
    constructor(r,g,b, x,y,size){
        this.r = r;
        this.g = g;
        this.b = b; 
        this.x =x||-222;
        this.y =y||-222;
        this.size =size|| 32;
    }
    mousePressed() {
        if (this.x*this.size<p.mouseX && (this.x*this.size)+this.size >p.mouseX)
        if (this.y*this.size<p.mouseY && (this.y*this.size)+this.size >p.mouseY)
        this.selected?.(this);
    }

    regenerate(square, mutSize = 30) {
        let [r, g, b] = [square.r, square.g, square.b];
    
        // Select a random channel
        //let channel = Math.floor(Math.random() * 3);
    
        let halfMutSize = mutSize/2;

        // Mutate the selected channel (phind added channel selection idk if we need it)
        //if (channel === 0) {
            r = Math.min(255, Math.max(0, r + Math.floor(Math.random() * mutSize) - halfMutSize));
        //} else if (channel === 1) {
            g = Math.min(255, Math.max(0, g + Math.floor(Math.random() * mutSize) - halfMutSize));
        //} else {
            b = Math.min(255, Math.max(0, b + Math.floor(Math.random() * mutSize) - halfMutSize));
        //}
        this.r = r;
        this.g = g;
        this.b = b;
    }
    mutateCopy(mutSize = 30) {
        let [r, g, b] = [this.r, this.g, this.b];
    
        // Select a random channel
        //let channel = Math.floor(Math.random() * 3);
    
        let halfMutSize = mutSize/2;

        // Mutate the selected channel (phind added channel selection idk if we need it)
        //if (channel === 0) {
            r = Math.min(255, Math.max(0, r + Math.floor(Math.random() * mutSize) - halfMutSize));
        //} else if (channel === 1) {
            g = Math.min(255, Math.max(0, g + Math.floor(Math.random() * mutSize) - halfMutSize));
        //} else {
            b = Math.min(255, Math.max(0, b + Math.floor(Math.random() * mutSize) - halfMutSize));
        //}
    
        return new GeneticSquare(r,g,b);
    }
    draw() {
        p.fill(this.r,this.g,this.b)
        p.rect(this.x*this.size, this.y*this.size, this.size, this.size);
    }
    
}