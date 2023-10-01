import { p } from "../../engine/core/p5engine.mjs";
import { NanoaiBrain } from "./nanoaiBrain.mjs";
export class Nanoai {
    constructor(name, x,y) {
        this.name = name
        this.x = x
        this.y = y
         p.loadImage('../nanoai.png', img => {
            this.img = img;
            console.log('Image loaded');
          });
          this.brain = new NanoaiBrain();
        this.activityMap = new Map([
            ["walk", {
                x: x,
                y: y,
                work: function(nano) {
                  // this should realistically be more of a walking code
                  nano.x = this.x;
                  nano.y = this.y;
                  return false;
                }
            }]
        ])
    }
    //keeping track of an unknown x and y center is easier with this calculation function
    get centerX() { 
        if (this.img) 
          return this.x + this.img.width / 2;        
        return this.x;
      }
    
      get centerY() {
        if (this.img) 
          return this.y + this.img.height;
        return this.y;
      }
    idle() {
        //find something to do
        //check battery
        //call radio
        //check feelings (wants to do hobby or chat with friend)?
    }
    draw() {
        this.brain.work(this);
        if (this.img) {
            p.image(this.img, this.x, this.y);
        }
    }
    talk(nano2){
        /*this.brain.queue.push({
            nano2: nano2,
            work: function(nano) {
              //nano.chat(nano2, "hi",function(){ nano.brain.state = "idle"} );
            }
        });*/
    }
    walk(x,y) {
        var walk = this.activityMap.get("walk")
        walk.x = x;
        walk.y = y;
        this.brain.currentActivity = walk;
        this.brain.state = "active"
    }
    chat (nano2, msg, done) { 
        //i have to figure out how to get nanoais to chat, this won't work for now
        let progress = 0;
        if (progress === 0) {
        console.log(`${this.name}: ${msg} ${nano2.name}`)
        nano2.chat(this, "hi back", () => progress++)
        }
        if (progress >= 1) done();
    }
    pickup(item) {
        //this involves walking to and lifting an object off the ground
    }
    harvest(crop) {
        //this involves picking items from plants
    }
    equip(item) {
        //this involves getting an object ready to use
    }
    use(obj) {
        //this involves using an object from inventory or world
    }
}