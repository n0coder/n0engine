import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.ts";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { pinga } from "../radio/linkingPings";
import { craftingRecipes } from "./craftingTable.mjs";

export class Seed {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.s = 8;
        this.kind = 'seed'
        this.name = 'seeds'
        this.setActive = setActive;
        this.setActive(true)
    }
    crop(x,y) {
        this.setActive(false)
        return new Crop(x,y)
    }
    draw() {
        p.fill(255)
        p.ellipse(this.x * worldGrid.tileSize, this.y * worldGrid.tileSize, this.s)
    }
}
craftingRecipes.set("crop", (nano, crops)=>{
    let crop = crops[0]
    let has = nano.inventory.has(crop)
    if (has) {
        nano.inventory.remove(crop)
        var seed = new Seed(nano.x, nano.y)
        nano.inventory.add(seed)
        var seed2 = new Seed(nano.x, nano.y)
        nano.inventory.add(seed2)
        return [seed, seed2]
    }
})
class Crop {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.s = 16;
        this.growth = 0
        this.grown = false;
        this.name = "crop"
        pinga.pingChunk("harvest", this, "crop", ()=>{if(this.grown)return this;}, ()=>{  console.log("hi"); return pinga.ping("harvest", this, "crop") })
        this.setActive = setActive;
        this.setActive(true)
    }

    get heldPos() {
        return this.held ? 0 : worldGrid.tileSize/2
    }
    grow(amount) {
        if (this.growth <= 1) {
        this.growth += amount*.5;
        } else if (!this.grown) {
            this.grown=true
            pinga.pingChunk("harvest", this, "crop")

        }
    }
    harvest(nano, pop) {
        //if the nano can hold more items we add (rhis)
        nano.inventory.add(this)
        pop(this)
        this.pop()
    }
    draw(){
        p.fill(255)
        p.ellipse(this.x*worldGrid.tileSize+this.heldPos, this.y*worldGrid.tileSize+this.heldPos, this.growth*this.s)
    }
}