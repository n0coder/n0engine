//this will be a cotton candy plant
//it will grow in incremental shapes that approximate size
//it's procedural in the literal means (not pure random)
//it will wave around?

import { p } from "../../../engine/core/p5engine.mjs"
export class CottonCandyPlant {
    constructor() {
        this.s = 64;
        this.pos = {x: 64, y: 64}
    }
    draw() { //hard work...
        p.push()
        this.cloud(this.s,this.s, -2, 6, 64);
        //this.cloud(this.s*-.5,this.s,-8, 8, 64 );
        //this.cloud(this.s*.25,this.s*.25,-8, 8,64);
        p.pop()
        p.ellipse(this.pos.x,this.pos.y, 15, 15);
    }
    cloud(x,y, x2, y2, size) {
        //size *= this.s;
        p.fill([255, 220, 220])
        p.ellipse( x,y,size,size )
        p.fill([255, 180, 180])
        p.ellipse( x+x2,y+y2,size,size )
    }

    //i need a scaling library for something...
}