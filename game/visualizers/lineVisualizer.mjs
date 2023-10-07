import { p } from "../../engine/core/p5engine.mjs"
import { inverseLerp, lerp } from "../../engine/n0math/ranges.mjs"
import { perpandicular } from "../../engine/n0math/vectorMath.mjs"

export class p5Plus {
    variableLine(x1,y1,x2,y2, s1=2, s2=4) {
        //p.strokeWeight
        
        //essentially take the vector of a direction
        //at the end point take the perpandicular of the vector
        //then use that to drive a shape thickness
        s1/=2;
        s2/=2
        var v = this.Magnitude({x:x2-x1, y: y2-y1});
        var o = perpandicular(v.x, v.y);
        
        p.beginShape()
        p.vertex(x1+o.x*-s1, y1+o.y*-s1);
        p.vertex(x2+(o.x*-s2), y2+(o.y*-s2));
        p.vertex(x2+(o.x*s2), y2+(o.y*s2))
        p.vertex(x1+o.x*s1, y1+o.y*s1)
        p.endShape(p.CLOSE)
        
        p.ellipse(x2,y2, s2*2)
        p.ellipse(x1,y1, s1*2)
    }

    Magnitude(v) {
        var mag = Math.sqrt(v.x * v.x + v.y * v.y);
        v.x /= mag;
        v.y /= mag;
        return v;
    }
}
export const p2 = new p5Plus()