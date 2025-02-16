import { deltaTime } from "../Time/n0Time.mjs";
import { defaultScale, gameH, gameW } from "../../n0config.mjs";
import { p } from "../p5engine.mjs";
import { worldGrid } from "../../grid/worldGrid.mjs";

export class Camera {
    constructor (x=0,y=0, s=-1) {
        this.x = x;
        this.y = y;
        this.vx = x;
        this.vy = y; 
        this.target = null;
        this.renderOrder = -25;
        this.s = s==-1?defaultScale:s;
    }
    follow(o) { 
        this.target = o;
        this.x=this.ox; this.y = this.oy;
    }
    get ox() {
        let x = this.target?.visualX ?? 0
        return gameW/2 - x;
    }
    get oy() {
        let y = this.target?.visualY ?? 0
        return gameH/2 - y
    }
    draw() {
        p.ellipse(gameW/2, gameH/2, 3, 3)
        //update
        //this is an issue, the smooth movement is annoying
        //maybe i should do what phind said and just lerp
        var tx = this.ox
        var ty = this.oy;
        var vx = tx-this.x;
        var vy = ty-this.y;
        //if the target is out of screen radius we just tp camera to target
        var gm = Math.sqrt((gameW*gameW)+(gameH*gameH))
        var m = Math.sqrt((vx*vx) + (vy*vy))
        if (m > (gm)) {
            this.x = tx;
            this.y = ty
        } else {
            this.x += vx*deltaTime;
            this.y += vy*deltaTime;
        }
        //render
        //p.scale(this.s);
        p.translate(this.x,this.y)        
        
        p.ellipse(gameW/2, gameH/2, 3, 3)
    }
}
export const camera = new Camera();
//i export an instance of camera, because it's "global"