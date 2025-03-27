import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { craftingRecipes } from "./craftingTable.mjs";

export class Seed {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.s = 8;
        this.kind = 'seed'
        this.setActive = setActive;
        this.setActive(true)
    }
    crop(x,y) {
        return new Crop(x,y)
    }
    draw() {
        p.fill(255)
        p.ellipse(this.x * worldGrid.gridSize, this.y * worldGrid.gridSize, this.s)
    }
}
craftingRecipes.set("crop", (nano, crops)=>{
    let crop = crops[0]
    let has = nano.inventory.has(crop)
    if (has) {
        nano.inventory.remove(crop)
        var seed = new Seed(nano.x, nano.y)
        nano.inventory.add(seed)
        var seed = new Seed(nano.x, nano.y)
        nano.inventory.add(seed)
        return seed
    }
})
class Crop {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.s = 16;
        this.growth = 0
        this.name = "crop"
        this.setActive = setActive;
        this.setActive(true)
        let e = function(){console.log(this)}
        e.call(":o")
    }
    get heldPos() {
        return this.held ? 0 : worldGrid.gridSize/2
    }
    grow(amount) {
        if (this.growth <= 1)
        this.growth += amount;
    }
    harvest(nano, pop) {
        pop()
        //if the nano can hold more items we add (rhis)
        nano.inventory.add(this)
        return this;
    }
    draw(){
        p.fill(255)
        p.ellipse(this.x*worldGrid.gridSize+this.heldPos, this.y*worldGrid.gridSize+this.heldPos, this.growth*this.s)
    }
}