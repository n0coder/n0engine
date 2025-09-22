import { gameH, gameW } from "../engine/core/n0config.mjs";
import {p} from "../engine/core/p5engine.ts"
export class FishGame {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.fishes = []
        this.bob = {x,y}
    }

    draw() {
        if (this.fishes.length < 10) 
            this.addFish();
        
        for (let i = 0; i < this.fishes.length; i++) {
          this.fishes[i].move(this.bob);
          this.fishes[i].show();
          if (this.fishes[i].eats(this.bob)) {
          }
        }
      }
      addFish() {
        this.fishes.push(new Fish(p.random( gameW ), p.random( gameH )));
      }
      mousePressed() {

        if (this.bob.caught) {
            var i = this.fishes.indexOf(this.bob.caught)
            this.fishes.splice(i, 1);
            this.bob.x = 99999;
            this.bob.y = 99999;
            this.bob.caught = null; //clear up fish
        } else {

            this.bob.x = p.mouseX;
            this.bob.y = p.mouseY;
        }
        //this.fish(p.mouseX,p.mouseY);
      }
}
class Fish{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.tx = x;
        this.ty=y;
        this.swimmingColor = [200,250,200,255]
        this.caughtColor = [250,230,160,255]
        this.caught = false;
    }
    get color() {
        return this.caught ? this.caughtColor:this.swimmingColor;
    }
    move(bob) {
        if (this.caught) return;
        if (bob&&p.dist(this.x, this.y, bob.x, bob.y) < 250) {
            this.bob = bob;
            this.tx = bob.x;
            this.ty = bob.y;
            if (d < 50) {
                this.eatable = true; 
            }
        } else {
            this.bob = null;
        var d = p.dist(this.x, this.y, this.tx, this.ty);
        if (d < 50) {
            this.tx = p.random( gameW );
            this.ty = p.random( gameH ); 
        }
        }
        var vx = this.tx-this.x;
        var vy = this.ty-this.y;
        this.myVector = p.createVector(vx, vy);
        this.myVector.normalize();
        this.x+=this.myVector.x;
        this.y+=this.myVector.y;
    }
    show() {
        let [r,g,b,a] = this.color;
        p.fill(r,g,b,a*.25);
        p.ellipse(this.x, this.y, 250, 250)
        p.fill(r,g,b,a);
        p.ellipse(this.x-(this.myVector.x*15), this.y-(this.myVector.y*15), 15, 15)
        //p.stroke(250);
        p.line(this.x, this.y, this.tx, this.ty);

    }
    eats(bob) {
        if (p.dist(this.x, this.y, bob.x, bob.y) < 50) {
            bob.caught = this;
            bob.x = 99999;
            bob.y = 99999;
            this.caught = true;
            return true
        }
        return false
    }
}