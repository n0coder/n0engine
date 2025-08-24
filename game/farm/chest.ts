import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.ts";
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
        let ir = nano.inventory.remove(item)
        if (ir) {}
        let c =this.add(item)
        pinga.ping("take", this, item.name)
        //console.log(item)
        return c;
        
    }
    take(nano:Nanoai, item, out) {
        //console.log({has:this.hasItem(item), chest: this})
        let i;
        if (typeof item === "string" )
            i = this.hasItem(item)
        else if (this.list.indexOf(item) >= 0)
            i = item
        if (i){
            this.remove(i)
            nano.inventory.add(i)
            out?.(i)

        }
    }
    setActive
    constructor(slots:number, x:number, y:number, item) {
        super(slots)
        this.x =x;
        this.y =y;
        pinga.ping("insert", this, item, true)
        this.setActive = setActive; 
        this.setActive(true);
    }

    draw(){
            let x = this.x *worldGrid.tileSize
                let y = this.y *worldGrid.tileSize
                let t = worldGrid.tileSize
                p.fill(255,255,255)
                p.rect(x, y, t, t)
        }
}