import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import {worldGrid} from "../../engine/grid/worldGrid.mjs"
import { Circle } from "./circle.mjs";

export class Soil {
    constructor(x=0,y=0, pops=false) {
        this.x = x
        this.y = y
        this.color = [150, 255, 150]
        this.inventory = []

        this.maxCount = 2;
        this.pops = pops
        this.setActive = setActive;
        this.setActive(true);

        var [gx, gy] = worldGrid.screenToWorldPosition(x, y)
        var rect = worldGrid.getScreenTileRect(gx, gy);
        this.rect = rect
    }
    draw() {
        var {x,y,w,h} = this.rect;
        p.fill(160, 130, 130)
        p.rect(x-(w/2),y-(h/2),w,h);
        p.fill(255)
        p.ellipse(this.x, this.y, 5)
        this.inventory.forEach(p=>{
            if (p.s <= p.ms) 
                p.s += deltaTime*10
        })
    }
    plant(nano, seed) {
        
        if (nano.inventory.has(seed)) {
            console.log("seed is in inventory")
        } else {
            console.log("seed is not in inventory")
        }
    }
    harvest(nano) {
        if (!nano.inventory.isOpen()) return false;
        
        var plant = this.inventory.find(p=>p.s >= p.ms)
        if (plant&&nano.inventory.add(plant)) {
            var i = this.inventory.indexOf(plant)
            this.inventory.splice(i, 1)
        }
        return plant;
    }
}