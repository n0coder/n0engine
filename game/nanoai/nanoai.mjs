import { cosmicEntityManager, setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone, loadImg } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { NanoInventory } from "./nanoInventory.mjs";
import { walk } from "./nanoaiActions.mjs";
import { NanoaiBrain } from "./nanoaiBrain.mjs";
export class Nanoai {
    constructor(name, x, y) {
        this.name = name
        this.x = x
        this.y = y
        this.speed = 48;        
        loadImg(this, "img", '../nanoai.png');
        this.brain = new NanoaiBrain(this);
        this.inventory = new NanoInventory(3, [[-7,-10], [7,-10], [0, -20]]);
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder =1;
        this.working =false
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
        if (this.img) { 
            p.image(this.img, this.centerX, this.centerY);
        } else {
            p.rect(this.centerX, this.centerY, 48,20)
        }
        if (!this.working) return;
        this.brain.work(this);
        
        this.inventory.draw(this);
    }

    doubleClicked() {
        this.working = true
    }
}