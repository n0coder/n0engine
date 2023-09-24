import { p } from "../../engine/core/p5engine.mjs";
import {worldGrid} from "../../engine/grid/worldGrid.mjs"

export class Crop {
    constructor(x=0,y=0) {
        this.x = x
        this.y = y
    }
    draw() {
        var {x,y,w,h} = worldGrid.getScreenTileRect(this.x,this.y);
        p.fill(255);
        p.rect(x,y, w, h);
        
    }
}