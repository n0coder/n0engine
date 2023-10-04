import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { lerp } from "../../engine/n0math/ranges.mjs";
import { waterActions } from "../world/water.mjs";

export class FishingPole{
    //items can be set on the ground and picked up...
    constructor(x=0,y=0, vx=1, vy=1) {
        this.x = x;
        this.y = y;
        this.bobX = null;
        this.bobY = null;
        this.bobtX = null;
        this.bobtY = null;
        this.bobtvX = null;
        this.bobtvY = null;
        this.vx = vx;
        this.vy=vy;
        this.setActive = setActive
        this.setActive(true);
        this.fishrect = null;
        this.renderOrder = 2
    }
    draw() {
        p.push();
        p.strokeWeight(2)
        p.stroke(255)
        //p.rotate(this.r+(3.1415/2));
        let vx = this.vx, vy = this.vy;
        var s = Math.sqrt(vx*vx + vy*vy)
        vx /= s;
        vy /= s;

        p.push()
        p.noStroke()
        p.pop()
        var tipX = this.x-(vx*16)
        var tipY = this.y-(vy*16)
        p.line(this.x, this.y,tipX, tipY)

        if (this.bobX != null && this.bobY != null) {
        p.strokeWeight(.5)
        p.line(tipX, tipY, this.bobX, this.bobY)
        if (this.bobtX != null && this.bobtY != null && this.bobtvX != null && this.bobtvY != null ) {
            this.bobX = lerp(this.bobX,this.bobtX, deltaTime*.2 )
            this.bobY = lerp(this.bobY,this.bobtY, deltaTime*.2 )
            this.bobtX = lerp(this.bobtX,this.bobtvX, deltaTime*.4 )
            this.bobtY = lerp(this.bobtY,this.bobtvY, deltaTime*.4 )
            var vox = Math.abs(this.bobtX - this.bobX);
            var voy = Math.abs( this.bobtY - this.bobY);
            p.ellipse(this.bobX, this.bobY, 3)
            var vovx = Math.abs(this.bobtvX - this.bobtX);
            var vovy = Math.abs( this.bobtvY - this.bobtY);
        if (this.fishrect ) {
            if (vox < 1 || voy < 1) {
                this.bobtX = this.fishrect.x+Math.random()*this.fishrect.w
                this.bobtY = this.fishrect.y+Math.random()*this.fishrect.h
            }
            if (vovx < 1 || vovy < 1) {
                this.bobtvX = this.fishrect.x+Math.random()*this.fishrect.w
                this.bobtvY = this.fishrect.y+Math.random()*this.fishrect.h
            }
            }
        }
        }
        p.pop();
    }
}

waterActions.set("FishingPole", function(nanoai, poles, water) {
    //console.log("pole")
    poles.forEach(pole => {
        pole.fishrect = water.rect;
        pole.bobX = water.rect.x+Math.random()*water.rect.w
        pole.bobY = water.rect.y+Math.random()*water.rect.h
        pole.bobtX = pole.bobX
        pole.bobtY = pole.bobY
        pole.bobtvX = pole.bobX
        pole.bobtvY = pole.bobY
    });
})
waterActions.set("2FishingPole", function(nanoai, poles, water) {
    //console.log([nanoai, water])
    poles.forEach(pole => {
        pole.fishrect = water.rect;
        pole.bobX = water.rect.x+Math.random()*water.rect.w
        pole.bobY = water.rect.y+Math.random()*water.rect.h
        pole.bobtX = pole.bobX
        pole.bobtY = pole.bobY
        pole.bobtvX = pole.bobX
        pole.bobtvY = pole.bobY
    });
})