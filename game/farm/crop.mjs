import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import {worldGrid} from "../../engine/grid/worldGrid.mjs"
import { Circle } from "./circle.mjs";

export class Crop {
    constructor(x=0,y=0, pops=false) {
        this.x = x
        this.y = y
        this.color = [150, 255, 150]
        this.inventory = []
        this.seed = Circle; //i should have a more dedicated seed object
        this.t = 0;
        this.spawnT = 1;
        this.maxCount = 2;
        this.pops = pops
        this.setActive = setActive;
        this.setActive(true);
    }
    draw() {
        var {x,y,w,h} = worldGrid.getScreenTileRect(this.x,this.y);
        
        this.inventory.forEach(p=>{
            if (p.s <= p.ms) 
                p.s += deltaTime*10
        })
        this.t+=deltaTime;
        if (this.t > this.spawnT && this.inventory.length < this.maxCount) {
            
            var p = new this.seed(this.x+(Math.random()*15), this.y+(Math.random()*15), 0, 15+(Math.random()*15));
            this.inventory.push(p)
            
            this.t = 0;
        }
    }
    harvest(nano) {
        if (!nano.inventory.isOpen()) return false;
        
        var plant = this.inventory.find(p=>p.s >= p.ms)
        if (nano.inventory.add(plant)) {
            var i = this.inventory.indexOf(plant)
            this.inventory.splice(i, 1)
        }
        return this.inventory.find(p=>p.s >= p.ms);
    }
}