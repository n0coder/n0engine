import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { pinga } from "../radio/linkingPings";
import { Inventory } from "../shared/Inventory.mjs";

export class Chest extends Inventory{
    x: number;
    y: number;
    insert(nano:Nanoai, item) {
        if (Array.isArray(item)) {
            for (const i of item) 
                this.insert(nano, i)
            return
        }
        nano.inventory.remove(item)
        let c =this.add(item)
        console.log(item)
        pinga.ping("take", this, item.name)
        if (this.isOpen()) 
            pinga.ping("insert", this, "crop")
        return c;
    }
    take(nano:Nanoai, item, out) {
        console.log({has:this.hasItem(item), chest: this})
        let i = this.hasItem(item)
        if (i){
            this.remove(i)
            nano.inventory.add(i)
            out?.(i)

             if (this.isOpen()) 
             pinga.ping("insert", this, "crop")
        }
    }
    setActive
    constructor(slots:number, x:number, y:number) {
        super(slots)
        this.x =x;
        this.y =y;
        pinga.ping("insert", this, "crop")
        this.setActive = setActive; 
        this.setActive(true);
    }

    draw(){
            let x = this.x *worldGrid.gridSize
                let y = this.y *worldGrid.gridSize
                let t = worldGrid.gridSize
                p.fill(255,255,255)
               p.rect(x, y, t, t)
        }
}