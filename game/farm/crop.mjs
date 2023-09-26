import { p } from "../../engine/core/p5engine.mjs";
import {worldGrid} from "../../engine/grid/worldGrid.mjs"

export class Crop {
    constructor(x=0,y=0) {
        this.x = x
        this.y = y
        this.color = [150, 255, 150]
    }
    draw() {
        var {x,y,w,h} = worldGrid.getScreenTileRect(this.x,this.y);
        p.fill(this.color);
        p.rect(x,y, w, h);
    }
}