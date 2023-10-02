import { cosmicEntityManager, setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { walk } from "./nanoaiActions.mjs";
import { NanoaiBrain } from "./nanoaiBrain.mjs";
export class Nanoai {
    constructor(name, x, y) {
        this.name = name
        this.x = x
        this.y = y
        this.speed = 48;
        p.loadImage('../nanoai.png', img => {
            this.img = img;
        });
        this.brain = new NanoaiBrain(this);
        this.setActive = setActive;
        this.setActive(true)
    }
    //keeping track of an unknown x and y center is easier with this calculation function
    get centerX() {
        if (this.img)
            return this.x - this.img.width / 2;
        return this.x;
    }

    get centerY() {
        if (this.img)
            return this.y - this.img.height;
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
            p.image(this.img, this.centerX, this.centerY);
        }
    }
    //if i put this on every object it can feel hard to use...
    
    
    chat(nano2, msg, done) {
        //i have to figure out how to get nanoais to chat, this won't work for now
        let progress = 0;
        if (progress === 0) {
            console.log(`${this.name}: ${msg} ${nano2.name}`)
            nano2.chat(this, "hi back", () => progress++)
        }
        if (progress >= 1) done();
    }
    pickup(item) {
        this.brain.do("walk", item.x,item.y) //this is sick wtf
        
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