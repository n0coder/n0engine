import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";

export class FishingPole{
    //items can be set on the ground and picked up...
    constructor(x=0,y=0, vx=1, vy=1) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy=vy;
        this.setActive = setActive
        this.setActive(true);
    }
    draw() {
        p.push();
        p.strokeWeight(3)
        p.stroke(255)
        //p.rotate(this.r+(3.1415/2));
        let vx = this.vx, vy = this.vy;
        var s = Math.sqrt(vx*vx + vy*vy)
        vx /= s;
        vy /= s;
        p.line(this.x, this.y,this.x-(vx*16), this.y-(vy*16))
        p.pop();
    }
}