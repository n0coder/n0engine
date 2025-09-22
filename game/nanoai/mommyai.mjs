import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { loadImg } from "../../engine/core/Utilities/ImageUtils";
import { p } from "../../engine/core/p5engine.ts";
import { clamp, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { NanoInventory } from "./nanoInventory.mjs";
import { NanoaiBrain } from "./nanoaiBrain.ts";
import { Poser } from "./poser.mjs";
export class Puff {
    constructor(x, y, w, h, s = 15, boom) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.s = s;
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = 3;
        this.r = 15;
        this.puffs = []
        for (let pp = 0; pp < this.r; pp++) {
            var rx = ((Math.random() - .5) * 2) * (this.w + 5)
            var ry = -(this.h) + ((Math.random() - .5)) * -this.h;
            var rs = lerp(.6, 1, Math.random()) * this.s
            this.puffs.push({ rx, ry, rs })
        }
        this.t = 4;
        this.done = false;
        this.boom = boom;
    }
    draw() {
        this.t -= deltaTime
        var size = clamp(0, 1, inverseLerp(4, 0, this.t) * inverseLerp(0, 3.5, this.t)) * 8
        for (let o = 0; o < this.puffs.length; o++) {
            var puff = this.puffs[o]
            var ox = 4 + this.x + puff.rx * clamp(0, 1, inverseLerp(0, 3.5, this.t));
            var oy = this.y + (this.t * 10) + puff.ry
            p.ellipse(ox, oy, puff.rs * size * clamp(0, 1, inverseLerp(0, 3.5, this.t)));
        }
        if (this.t < 3.5 && !this.done) {
            this.done = true;
            this.boom?.()
        }
    }
}
export class Mommyai {
    constructor(name, x, y) {
        this.name = name
        this.x = x
        this.y = y
        this.speed = 48;
        loadImg('../mommyaiCloudForm.png', (img) => this.img = img);
        this.brain = new NanoaiBrain(this);
        this.inventory = new NanoInventory(10, [[-6, -25], [9, -25], [-5, -30], [7, -30], [0, -50]]);
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = 1;
        this.working = false
        this.poser = new Poser();
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
            //p.rect(this.centerX, this.centerY, 48,20)
        }
        p.fill(226, 159, 159)

        this.brain.work(this);
        this.inventory.draw(this);
    }

    doubleClicked() {
        this.working = true
    }
}