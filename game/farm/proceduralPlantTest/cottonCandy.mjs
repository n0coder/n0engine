//this will be a cotton candy plant
//it will grow in incremental shapes that approximate size
//it's procedural in the literal means (not pure random)
//it will wave around?

import { deltaTime } from "../../../engine/core/Time/n0Time.mjs";
import { p } from "../../../engine/core/p5engine.mjs"
export class CottonCandyPlant {
    constructor() {
        this.s = 32;
        this.pos = {x: 64, y: 64}
        this.t = 0;
    }
    draw() { //hard work...
        this.t += deltaTime;
        this.reCany(this.pos.x, this.pos.y, this.pos.x+(7*Math.cos(2.5*this.t)), this.pos.y+(2.5*Math.sin(1*this.t)))
        p.ellipse(this.pos.x, this.pos.y,5,5);
    }


// Define a function to draw a cloud
drawCloud(x, y, x2, y2, size) {
    p.push();
    p.ellipse(x, y, size, size);
    p.ellipse(x + x2, y + y2, size, size);
    p.pop();
  }
  
  // Define a function to draw a line
  drawLine(x1, y1, x2, y2) {
    p.push();
    p.strokeWeight(15*this.s);
    p.line(x1, y1, x2, y2);
    p.pop();
  }
  
  // Use these functions in your cany function
  reCany(baseX, baseY, headX, headY) {
    const clouds = [
      { x: headX + this.s * 1, y: headY + this.s * 0.75, x2: -0.1, y2: 0.1, size: .77*this.s },
      { x: headX + this.s * 1.25, y: headY + this.s, x2: -0.1, y2: 0.1, size: .64*this.s },
      { x: headX + this.s * 0.5, y: headY + this.s, x2: -0.1, y2: 0.1, size: .55*this.s },
      { x: headX + this.s * 1.1, y: headY + this.s * 0.95, x2: -0.1, y2: 0.1, size: .62*this.s },
      { x: headX + this.s * 1, y: headY + this.s * 0.75, x2: -0.1, y2: 0.1, size: .47*this.s },
    ];
  
    const lines = [
      { x1: headX + this.s * 1, y1: headY + this.s * 0.75, x2: baseX + this.s * 1, y2: baseY + this.s * 2 },
    ];
    lines.forEach(line => this.line(line.x1, line.y1, line.x2, line.y2));
    clouds.forEach(cloud => this.cloud(cloud.x, cloud.y, cloud.x2, cloud.y2, cloud.size));
    
  }
  

    cany(baseX, baseY, headX, headY){
        p.push()

        this.cloud(headX+this.s*1,headY+this.s*.75,-.1, .1,77);
        this.cloud(headX+this.s*1.25,headY+this.s, -.1, .1, 64);
        this.cloud(headX+this.s*.5,headY+this.s,-.1, .1, 55 );
        

        this.cloud(headX+this.s*1.1,headY+this.s*.95,-.1, .1,62);
        this.cloud(headX+this.s*1,headY+this.s*.75,-.1, .1,47);

        p.pop()
    }
    line(baseX, baseY, headX, headY) {
        p.push()
        p.strokeWeight(.15*this.s);
        p.stroke([185+44, 190+46, 140+36])
        p.line(headX+(this.s*.02),headY, baseX+(this.s*.05),baseY);
        p.strokeWeight(.15*this.s);
        p.stroke([185, 190, 140])
        p.line(headX,headY, baseX,baseY);
        p.pop();
    }
    cloud(x,y, x2, y2, size) {
        //size *= this.s;
        x2 *= size;
        y2 *= size;
        p.fill([233, 180-22, 180-36])
        //p.ellipse( x+(x2*1.5),y+(y2*1.5),size,size )

        p.fill([244, 180+46, 180+36])
        p.ellipse( x,y,size*1.2,size )
        p.fill([255, 180, 180])
        p.ellipse( x+x2,y+y2,size,size )
    }

    //i need a way to handle scaling math

}