//this will be a cotton candy plant
//it will grow in incremental shapes that approximate size
//it's procedural in the literal means (not pure random)
//it will wave around?

import { deltaTime } from "../../../engine/core/Time/n0Time.mjs";
import { p } from "../../../engine/core/p5engine.mjs"
import { Offseter } from "../../../engine/n0math/offseter.mjs";
import {inverseLerp} from "../../../engine/n0math/ranges.mjs"
export class CottonCandyPlant { //THIS TURNED INTO HELL
    constructor(x,y) {
        this.s = 32;
        this.pos = new Offseter(x,y)
        this.t = 0;
        this.color = [255, 180, 180]
        this.lineColor = [185, 190, 140]
        this.highlight = [-11, 46, 36]
        this.tree = {
          backgroundClouds: [{
            posX: 6, posY: -44, angleOffset: 1.5, size: 34 , color: this.mutateColor(this.color, 32) 
          },{
            posX: 16, posY: -54, angleOffset: 1.5, size: 28 , color: this.mutateColor(this.color, 32)   
          }],
          foregroundClouds: [{
            posX: 0, posY: -64, angleOffset: 1, size: 48  , color: this.mutateColor(this.color, 32)
          },{
            posX: -16, posY: -54, angleOffset: 1.2, size: 28  , color: this.mutateColor(this.color, 32)
          }]

        }
    }
    draw() { 
        this.t +=  deltaTime;
        var angle = (8*Math.cos(2.5*this.t));
        
        this.clouds(this.tree.backgroundClouds, angle);
        var pos = this.pos.rotate(0,-64, angle);
        this.line (this.pos.x, this.pos.y, pos.x, pos.y, this.lineColor, this.highlight)
        this.clouds(this.tree.foregroundClouds, angle)
        
    }
    mutateColor(color, mutSize) {
      let [r, g, b] = color;

      let halfMutSize = mutSize/2;
          if (Math.random() < 0.5) {
          if (Math.random() > 0.15)
              r = Math.min(255, Math.max(0, r + Math.floor(Math.random() * mutSize) - halfMutSize));
      
          if (Math.random() > 0.15)
              g = Math.min(255, Math.max(0, g + Math.floor(Math.random() * mutSize) - halfMutSize));
     
          if (Math.random() > 0.15)
              b = Math.min(255, Math.max(0, b + Math.floor(Math.random() * mutSize) - halfMutSize));
          }
          return [r,g,b]
  }
  clouds(clouds, angle) {
    clouds.forEach(c => {
      var cld = this.pos.rotate(c.posX, c.posY, angle * c.angleOffset);
      this.cloud(cld.x, cld.y, -.1, .1, c.size, c.color, this.highlight);
    });
  }

    rotate(x2, y2, degrees) {
      // Convert degrees to radians
      var radians = degrees * (Math.PI/180);
  
      // Calculate the distance from the center
      var differenceFromCentre = {
        x: x2 - this.x,
        y: y2 - this.y
      };
  
      // Calculate the new point after rotation
      var newX = this.x + Math.cos(radians) * differenceFromCentre.x - Math.sin(radians) * differenceFromCentre.y;
      var newY = this.y + Math.sin(radians) * differenceFromCentre.x + Math.cos(radians) * differenceFromCentre.y;
      
      return {x: newX, y: newY};
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
  reCany(baseX, baseY, headX, headY, angle) {
    const clouds = [
      { x: this.s * 1, y:  -this.s * 0.75, x2: -0.1, y2: 0.1, size: .77*this.s },
      { x: this.s * 1.25, y:  -this.s, x2: -0.1, y2: 0.1, size: .64*this.s },
      { x: this.s * 0.5, y:  -this.s, x2: -0.1, y2: 0.1, size: .55*this.s },
      { x: this.s * 1.1, y: -this.s * 0.95, x2: -0.1, y2: 0.1, size: .62*this.s },
      { x: this.s * 1, y: -this.s * 0.75, x2: -0.1, y2: 0.1, size: .47*this.s },
    ];
  
    const lines = [
      { x1: headX + this.s * 1, y1: headY + this.s * 0.75, x2: baseX , y2: baseY},
    ];
    lines.forEach(line => this.line(line.x1, line.y1, line.x2, line.y2));
    

    clouds.forEach(cloud =>{
      var c = this.pos.rotate(cloud.x, cloud.y, angle);
      this.cloud(c.x, c.y, cloud.x2, cloud.y2, cloud.size)
    });
    
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
    line(baseX, baseY, headX, headY, color, highlight) {
      var [r,g,b] =color
      var [hr, hg, hb]= highlight
        p.push()
        p.strokeWeight(.25*this.s);
        p.stroke([r+hr, g+hg, b+hb])
        p.line(headX+(this.s*.02),headY, baseX+(this.s*.05),baseY);
        p.strokeWeight(.25*this.s);
        p.stroke([r, g, b])
        p.line(headX,headY, baseX,baseY);
        p.pop();
    }
    cloud(x,y, x2, y2, size, color, highlight) {
        //size *= this.s;
        x2 *= size;
        y2 *= size;
        //p.fill([233, 180-22, 180-36])
        //p.ellipse( x+(x2*1.5),y+(y2*1.5),size,size )
        var [r,g,b] = color
        var [hr, hg, hb]= highlight
        p.fill([r-hr, g+hg, b+hb])
        p.ellipse( x,y,size*1.2,size )
        p.fill([r, g, b])
        p.ellipse( x+x2,y+y2,size,size )
    }

    //i need a way to handle scaling math

}