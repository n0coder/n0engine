import { Nanoai } from "../nanoai/nanoai.mjs";
import { Inventory } from "../shared/Inventory.mjs";

export class Chest extends Inventory{
    x: number;
    y: number;
    insert(nano:Nanoai, item:object) {
        nano.inventory.remove(item)
        let c =this.add(item)
        return c;
    }
    constructor(slots:number, x:number, y:number) {
        super(slots)
        this.x =x;
        this.y =y;
    }
}