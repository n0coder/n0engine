import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime, ticks } from "../../engine/core/Time/n0Time.mjs";
import { addAnimationSet, atomicClone, getAnimation, loadImg, loadImgArray } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { p2 } from "../visualizers/lineVisualizer.mjs";
import { NanoInventory } from "./nanoInventory.mjs";
import { NanoaiBrain } from "./nanoaiBrain.mjs";

loadImgArray("assets/nano/up", 4, imgArray => {
    addAnimationSet("nano", "walkUp", imgArray)
});
loadImgArray("assets/nano/down", 4, imgArray => {
    addAnimationSet("nano", "walkDown", imgArray)
});
loadImgArray("assets/nano/right", 4, imgArray => {
    addAnimationSet("nano", "walkRight", imgArray)
});
loadImgArray("assets/nano/left", 4, imgArray => {
    addAnimationSet("nano", "walkLeft", imgArray)
});
export class Nanoai {
    constructor(name, x, y) {
        this.name = name
        this.x = x, this.vx = 0
        this.y = y, this.vy = 0
        this.speed = 48 * 2;
        this.sugar = -4;
        this.lover = null;
        loadImg(this, "img", '../nanoai.png');
        this.brain = new NanoaiBrain(this);
        this.inventory = new NanoInventory(3, [[-7, -10], [7, -10], [0, -20]]);
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = 2;
        this.working = false
        this.frame = 0, this.t = 0;
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
        if (this.working)
            this.brain.work(this);
        p.text(`${this.sugar <= 0? "hungry": ""}  ${this.sugar}`, this.x+10, this.y-16);
        if (!this.cimg)
            this.cimg = this.img;

        if (this.vy > 0.1)
            this.cimg = getAnimation("nano", "walkDown", ticks)
        else if (this.vy < -0.1) {
            this.cimg = getAnimation("nano", "walkUp", ticks)
        } else if (this.vx > 0.1) {
            this.cimg = getAnimation("nano", "walkRight", ticks)
        } if (this.vx < -0.1) {
            this.cimg = getAnimation("nano", "walkLeft", ticks)
        }

        if (this.cimg) {
            p.image(this.cimg, this.centerX, this.centerY);
        } else {
            //p.rect(this.centerX, this.centerY, 48,20)
        }

        //if (!this.working) return;


        this.inventory.draw(this);
    }

    doubleClicked() {
        this.working = true
    }
}