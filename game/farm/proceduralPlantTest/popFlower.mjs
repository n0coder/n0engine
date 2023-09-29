import { deltaTime } from "../../../engine/core/Time/n0Time.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { Offseter } from "../../../engine/n0math/offseter.mjs";
import { inverseLerp, remap } from "../../../engine/n0math/ranges.mjs";


//plans to make the little red part of the flower pop off as a sweet fruit
export class PopFlower {
    constructor() {
        this.rx = 1+Math.random()
        this.ry = 1+Math.random()
        this.s = .5*(1+Math.random())
        this.t = 0;
        this.count = 1+Math.floor(Math.random() * 5)
        this.pos = new Offseter(164,128)
        this.color = [255, 180, 180]
        this.lineColor = [185, 190, 140]
        this.highlight = [-11, 46, 36]
    }
    draw() {
        this.t += deltaTime;
        var angle = (4*Math.cos(5*this.t))
        var vsv = this.pos.rotate(0, -48*this.s, angle)
        var cx = vsv.x, cy = vsv.y;
        var distance = 12*this.s;
        var vlength = 10*this.s*(remap(-1,1, .5, 1, Math.sin(this.t)));
        var hlength = 8*this.s;
        var pluses =this.count;
        //console.log([radians, pluses, radians*pluses])
        
        var pos = this.pos.rotate(0,-48*this.s, angle);
        this.line (this.pos.x, this.pos.y, pos.x, pos.y, this.lineColor, this.highlight)
        var [r,g,b] = this.color
        var [hr, hg, hb]= this.highlight
        p.fill([r, g, b])
        this.popFlower(pluses,  vlength, hlength, cx, distance, cy);
        p.fill([r-(hr*3), g-(hg*2), b-hb])
        this.popFlower(pluses,  vlength, hlength-10, cx, distance*.25, cy);


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
    popFlower(pluses, vlength, hlength, cx, distance, cy) {

        var radians = (Math.PI*2)/pluses;
        p.beginShape();
        for (let i = 0; i < pluses; i++) {
            let x = Math.sin(i * radians + this.t * .2);
            let y = Math.cos(i * radians + this.t * .2);
            //x and y are vectors
            var perp = this.perpandicular(x, y);

            var upx1 = (x * vlength);
            var upy1 = (y * vlength);

            var downx2 = (-x * vlength);
            var downy2 = (-y * vlength);

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

    perpandicular(x,y) {
        return {x: -y, y: x} 
    }
}