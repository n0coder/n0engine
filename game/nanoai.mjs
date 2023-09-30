import { p } from "../engine/core/p5engine.mjs";
import { NanoaiBrain } from "./nanoai/nanoaiBrain.mjs";
export class Nanoai {
    constructor(x,y) {
        this.x = x
        this.y = y
         p.loadImage('../nanoai.png', img => {
            this.img = img;
            console.log('Image loaded');
          });
          this.brain = new NanoaiBrain();
        
        this.queue = []
    }
    draw() {
        this.brain.work(this);
        if (this.img) {
            p.image(this.img, this.x, this.y);
        }
    }
    talk(nano){
        
        
    }
    walk(x,y) {
        this.brain.currentActivity = {
            x: x,
            y: y,
            work: function(nano) {
              // this should realistically be more of a walking code
              nano.x = this.x;
              nano.y = this.y;
              return false;
            }
        }

        this.brain.state = "active"
    }
    pickup(item) {

    }
    harvest(crop) {

    }
    equip(item) {

    }
    use(obj) {

    }
}