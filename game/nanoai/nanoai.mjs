import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { ticks } from "../../engine/core/Time/n0Time.mjs";
import { addAnimationSet, getAnimation, loadImg, loadImgArray } from "../../engine/core/Utilities/ImageUtils";
import { p } from "../../engine/core/p5engine.ts";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { n0radio } from "../radio/n0radio.mjs";
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
    constructor(name, x=0, y=0, z) {
        this.name = name
        this.x = x, this.vx = 0
        this.y = y, this.vy = 0
        this.z = z

        //TODO: wierd constant for sight radius used
        this.fov = 180, this.sightRadius = worldGrid.tileSize*2.5; //reasonable fov
        this.speed = 10;
        this.sugar = -4;
        this.lover = null;
        loadImg('../nanoai.png', (img) => this.img = img);
        this.brain = new NanoaiBrain(this);
        this.inventory = new NanoInventory(9, [[-0, -0], [1, -0], [0, -20]]);
        this.identity = {
            skills: new Map([
                ["harvesting", 1],
                ["reading", 1]
            ]),
            opinions: new Map([
                ["skills", new Map([
                    ["harvesting", 1], //neutral opinion is .5 (a multiplier, used as a way for a high skilled nano to still avoid jobs with specific likes and dislikes) (0 is a score of 0, 1 is a full score)
                ]) ]
            ]),
            relationships: new Map()
        }

        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = 2;
        this.working = true
        this.frame = 0, this.t = 0;
        this.dMap= new Map([
            [[0, -1], "walkUp"],[[0, 1], "walkDown"],[[-1, 0], "walkLeft"],[[1, -1], "walkRight"]
        ]) 
    }
    get visualX() {
        return (this.x*worldGrid.tileSize)+(this.spriteX/2);
    }
    get visualY() {
        return (this.y*worldGrid.tileSize)-(this.spriteY/2)
    }
    get spriteY() {
        return (this.img ? this.img.height : 0)
    }
    get spriteX() {
        return (this.img ? this.img.width : 0)
    }
    //keeping track of an unknown x and y center is easier with this calculation function
    get centerX() {
        return (this.img ? (this.x*worldGrid.tileSize) - this.img.width / 2 : this.x);
    }

    get centerY() {
        return ((this.img) ? (this.y*worldGrid.tileSize) - this.img.height : this.y);
    }

    idle() {
        n0radio.findJob(this);
        //find something to do
        //check battery
        //call radio
        //check feelings (wants to do hobby or chat with friend)?
    }
    
    draw() {
        let angleRad = Math.atan2(this.vx, this.vy);
        let fovToRad = (((2*3.1415926)/360)*this.fov);
        let startAngle = angleRad -fovToRad / 2;
        let stopAngle = angleRad + fovToRad / 2;

        let a = ((2 * 3.1415926) / 360) * (180 +90);
        //p.fill(255, 255, 255,16)
        //p.arc(this.visualX, this.visualY, worldGrid.gridSize*this.sightRadius*2, worldGrid.gridSize*this.sightRadius*2, a-startAngle, a-stopAngle);

        if (this.working)
            this.brain.work(this);
            
            let b = [this.vx, this.vy];
            let bestDir = {dot: -2, dir:"?"};
            for (let [a, dir] of this.dMap) {
                let dot = a[0] * b[0] + a[1] * b[1];
                if (!bestDir || bestDir.dot < dot ) {
                    bestDir.dot = dot;
                    bestDir.dir = dir;
                }
            }

        if (!this.cimg)
            this.cimg = this.img;

            if (!(b[0]===0&&b[1]===0))
                this.cimg = getAnimation("nano", bestDir.dir, ticks)
        p.fill(125, 222, 152)

        p.text(`${this.brain.currentActivity?.name??""}`, this.visualX+10, this.visualY-10);
        
        //p.text(`${this.vx.toFixed(2)}, ${this.vy.toFixed(2)}`, this.visualX+10, this.visualY-10);
        if (this.cimg) {
            p.image(this.cimg, Math.round(this.centerX+worldGrid.halfTileSize), Math.round(this.centerY+worldGrid.halfTileSize));
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
