import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import {worldGrid} from "../../engine/grid/worldGrid.mjs"
import { lerp } from "../../engine/n0math/ranges.mjs";
import { pinga } from "../radio/linkingPings";


export class Soil {
    constructor(x=0,y=0, pops=false) {
        this.x = x
        this.y = y
        this.colorDry = [150, 150, 100]
        this.colorWet = [202, 144, 126]
        this.crop=null;

        pinga.ping("plant", this, "seeds")
        this.sugarLevel = worldGrid?.getTile(x,y)?.sugarLevel ?? 0;
        this.waterLevel = 1;
        this.setActive = setActive;
        this.setActive(true);
    }
    draw() {

        this.crop?.grow?.(deltaTime*0.2*this.waterLevel)
        
    
        let x = this.x *worldGrid.gridSize
    let y = this.y *worldGrid.gridSize
    let t = worldGrid.gridSize
    let r = lerp(this.colorDry[0], this.colorWet[0], this.waterLevel)
    let g = lerp(this.colorDry[1], this.colorWet[1],this.waterLevel)
    let b = lerp(this.colorDry[2], this.colorWet[2],this.waterLevel)
    p.fill(r,g,b)
    p.rect(x, y, t, t)
    }
    plant(nano, seed) {

        if (typeof seed === "string")
            seed = nano.inventory.hasItem(seed)
        if(seed) {
        nano.inventory.remove(seed)
        //console.log(seed)
        this.crop = seed.crop(this.x, this.y)
        this.crop.pop =()=>{
            //console.log("put seeds in me", this)
            pinga.ping("plant", this, "seeds")
            this.crop = null;
        }
    }
    }
    harvest(nano) {
        return this.crop?.harvest?.(nano);
    }
}