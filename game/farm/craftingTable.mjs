import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.ts";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { nanoaiActions } from "../nanoai/nanoaiActions.mjs";
import { pinga } from "../radio/linkingPings";

export let craftingRecipes = new Map();

//nano.brain.do("craft", table, item)
nanoaiActions.set("craft", function (table, item, outa){
    return  {
        before: ["follow"], table, item,
        work: function (nano) {
            //nanos interface with the crafting table
            //do the inventory management here
            //console.log(this)
            let out = table.craft(nano, item?.());
            outa?.(out)
        },
        
    } 
})
export class CraftingTable {
    constructor(x,y) {
        this.x = x
        this.y = y
        pinga.ping("craft", this, "crop", true)
        this.setActive = setActive; 
        this.setActive(true);
    }
    craft(nano, items) {
        if (!Array.isArray(items)) 
            items = [items];
        //console.log(items)
        console.log(items)
        let recipe =`${items.map(c => c.name).sort()}`
        let crafta = craftingRecipes.get(recipe)
        if (!crafta) {
            console.warn(`no recipe for item (${recipe})`)
            return false;
        }
        let out = crafta(nano, items)
        return out
    }
    draw(){
        let x = this.x *worldGrid.tileSize
        let y = this.y *worldGrid.tileSize
        let t = worldGrid.tileSize
            p.fill(255,255,255)
            p.rect(x, y, t, t)
    }
}

let table={
    x:0, y:0,
    craft(nano, items) {
        let recipe =`${items.map(c => c.name).sort()}`
        let craft = craftingRecipes.get(recipe)

        let out = craft?.(nano, items)
        return out
    }
}
let circle = {name: "circle"}
let n0 = {name:'n0', i: (circle)}
craftingRecipes.set(`circle`, (nano, circle)=>{return {name: "dot", n:4}})
let dot = table.craft(n0, [circle])
console.log(dot)
