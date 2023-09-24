import { p } from "../engine/core/p5engine.mjs";

export class Sand {
    constructor(x,y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = [222, 127,125]
    }
    draw() {
        p.fill(this.color)
        p.rect(this.x*this.size,this.y*this.size,this.size,this.size);
    }
}