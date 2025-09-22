import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../../engine/core/Time/n0Time.mjs";
import { p } from "../../../engine/core/p5engine.ts";
import { Offseter } from "../../../engine/n0math/offseter.mjs";
import { inverseLerp, lerp, remap } from "../../../engine/n0math/ranges.mjs";
import { perpandicular } from "../../../engine/n0math/vectorMath.mjs";


//plans to make the little red part of the flower pop off as a sweet fruit
export class PopFlower {
    constructor(x,y,size=1, length=48,count=4,currentCount=4, growSpeed=.125 ) {
        this.rx = 1//+Math.random()
        this.ry = 1//+Math.random()
        this.size = .5*size//.5*(1+Math.random())
        this.angle = 14;
        this.pieceAngleOffset = .3
        this.len =length
        this.lineSegments = 3;
        this.t = 0;
        this.count = count //1+Math.floor(Math.random() * 6)
        this.currentCount = currentCount;
        this.pos = new Offseter(x,y)
        this.color = [255, 180, 180]
        this.lineColor = [185, 190, 140]
        this.highlight = [-11, 46, 36]
        this.growaSpeed = growSpeed
        this.growth = 0
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = 1;
    }
    get length() {
        return this.len * inverseLerp(0,this.count, this.currentCount)
    }
    get s() {
        return this.size * inverseLerp(0,this.count, this.growth);
    }
    get growSpeed() {
return this.growaSpeed * (this.count);
    } 
    draw() {
        let ga = this.currentCount+(this.growSpeed*deltaTime);
        if (ga < this.count)
            this.currentCount= (ga)

        ga = this.growth+(this.growSpeed*deltaTime);
        if (ga < this.count)
            this.growth= (ga)

        this.t += deltaTime;
        var angle = (Math.cos(5*this.t))
        var vsv = this.pos.rotate(0, -this.length*this.s, this.angle*angle)
        var cx = vsv.x, cy = vsv.y;
        var distance = 12*this.s;
        var vlength = 10*this.s*(remap(-1,1, .5, 1, Math.sin(this.t)));
        var hlength = 8*this.s;
        var pluses =this.count;
        //console.log([radians, pluses, radians*pluses])
        var angleSegments = this.angle/this.lineSegments
        var lengthSegments = this.length/this.lineSegments
        var startX = this.pos.x;
        var startY = this.pos.y;
        for (let linez = 0; linez <= this.lineSegments; linez++) {
            const a = linez*angleSegments*angle;
            const b = linez*lengthSegments;
            var pos = this.pos.rotate(0,-b*this.s, a);
            this.line (startX, startY, pos.x, pos.y, this.lineColor, this.highlight)
            startX = pos.x;
            startY = pos.y;
        }
        
        var [r,g,b] = this.color
        var [hr, hg, hb]= this.highlight
        p.fill([r, g, b])
        this.popFlower(pluses,  vlength*1.25, hlength, cx, distance, cy, this.currentCount);

        let seta = inverseLerp(0,this.count, this.currentCount)
        p.fill([r-(hr*3), g-(hg*2), b-hb])
        this.popFlower(pluses,  vlength, hlength-10, cx, distance*.25, cy, this.count);


    }
    line(baseX, baseY, headX, headY, color, highlight) {
        var [r,g,b] =color
        var [hr, hg, hb]= highlight
          p.push()
          p.strokeWeight(.25*this.s);
          p.stroke([r+hr, g+hg, b+hb])
          p.line(headX+(this.s*.02),headY, baseX+(this.s*.05),baseY);
          p.strokeWeight(.25*12*this.s);
          p.stroke([r, g, b])
          p.line(headX,headY, baseX,baseY);
          p.pop();
      }
    popFlower(pluses, vlength, hlength, cx, distance, cy,count) {

        var radians = (Math.PI*2)/pluses;
        p.beginShape();
        for (let i = 0; i < pluses; i++) {
            let cc = (count);

            //lerp(0, vlength, count%1) //usuing the 0.x, t
            let alength = null;
            if (i == Math.floor(cc)) 
                alength = lerp(0, vlength, cc%1)
             else if (i>cc-1)           
                alength = 0
            else 
                alength = vlength;
            //alength =(i>cc) ? 0 : vlength;
            let x = Math.sin(i * radians + this.t * .2);
            let y = Math.cos(i * radians + this.t * .2);
            //x and y are vectors
            var perp = perpandicular(x, y);

            var upx1 = (x * alength);
            var upy1 = (y * alength);

            var downx2 = (-x * alength);
            var downy2 = (-y * alength);

            var rightx3 = (perp.x * hlength);
            var righty3 = (perp.y * hlength);

            var leftx4 = (-perp.x * hlength);
            var lefty4 = (-perp.y * hlength);



            var uprightx = upx1 + rightx3;
            var uprighty = upy1 + righty3;
            var upleftx = upx1 + leftx4;
            var uplefty = upy1 + lefty4;
            var downrightx = downx2 + rightx3;
            var downrighty = downy2 + righty3;
            var downleftx = downx2 + leftx4;
            var downlefty = downy2 + lefty4;


            p.vertex(cx + (x * distance) + downrightx, cy + (y * distance) + downrighty);
            p.vertex(cx + (x * distance) + uprightx, cy + (y * distance) + uprighty);
            p.vertex(cx + (x * distance) + upleftx, cy + (y * distance) + uplefty);
            p.vertex(cx + (x * distance) + downleftx, cy + (y * distance) + downlefty);
        }
        p.endShape(p.CLOSE);
    }

    
}