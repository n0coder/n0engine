import { deltaTime } from "../Time/n0Time.mjs";
import { defaultScale, gameH, gameW } from "../../n0config.mjs";
import { p } from "../p5engine.mjs";

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
        this.x =gameW/2- o.x*this.s;
        this.y =gameH/2- o.y*this.s;
    }
    draw() {
        p.ellipse(gameW/2, gameH/2, 3, 3)
        //update
        //this is an issue, the smooth movement is annoying
        //maybe i should do what phind said and just lerp
        var tx = gameW/2-((this.target.x))*this.s
        var ty = gameH/2-((this.target.y))*this.s;
        var vx = tx-this.x;
        var vy = ty-this.y;
        this.x += vx*deltaTime;
        this.y += vy*deltaTime;
        
        //render
        p.translate(this.x,this.y)        
        p.scale(this.s);
        p.ellipse(gameW/2, gameH/2, 3, 3)
    }
}
export const camera = new Camera();
//i export an instance of camera, because it's "global"