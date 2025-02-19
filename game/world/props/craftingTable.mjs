import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";

export let craftingRecipes = new Map();
export class CraftingTable {
    constructor(x,y) {
        this.x = x
        this.y = y

        this.setActive = setActive; this.setActive(true);
    }
    craft(nano, items) {
        let recipe =`${items.map(c => c.name).sort()}`
        let craft = craftingRecipes.get(recipe)
        if (!craft) {
            console.warn("no recipe for item")
            return false;
        }
        let out = craft(nano, items)
        console.log(out)
    }
}

let table={
    x:0, y:0,
    craft(nano, items) {
        let recipe =`${items.map(c => c.name).sort()}`
        let craft = craftingRecipes.get(recipe)
        let out = craft?.(nano, items)
        //craft
        console.log({recipe, craft, out})
    }
}
let circle = {name: "circle"}
let n0 = {name:'n0', i: (circle)}
craftingRecipes.set(`circle`, (nano, circle)=>{return {name: "dot", n:4}})
table.craft(n0, [circle])
