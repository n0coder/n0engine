import { deltaTime } from "../Time/n0Time.mjs";
import { gameH, gameW } from "../n0config.mjs";
import { p } from "../p5engine.mjs";

export class Camera {
    constructor (x=0,y=0, s=1) {
        this.x = x;
        this.y = y;
        this.vx = x;
        this.vy = y; 
        this.target = null;
        this.s = s;
    }
    follow(o) { 
        this.target = o;
        console.log(o.x, o.y)
    }
    draw() {
        p.ellipse(gameW/2, gameH/2, 3, 3)
        //update
        var tx = gameW/2-((this.target.centerX||this.target.x))*this.s
        var ty = gameH/2-((this.target.centerY||this.target.y))*this.s;
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