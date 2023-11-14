import { Inventory } from "../shared/Inventory.mjs";
//i generally hate inheritance, but in this case i really needed it
export class NanoInventory extends Inventory {
    constructor(slots, offsets=[]) {
        super(slots);
        this.offsets = offsets;
    }

    isPhysical(item) {
        let index = this.list.indexOf(item);
        return index >= 0 && index < this.offsets.length
    }
    equip(item) {
        //console.log(item)
        if (this.list.includes(item)) {
            var i = this.list.indexOf(item)
            var o = this.list.splice(i, 1) //split item out of list
            return this.list.unshift(item); //add item to beginning
        } else {
            if (this.list.length < this.slots) {
                item.renderOrder = 2
                return this.list.unshift(item);
            }
            return false;
        }
    }
    unequip(item) {
        if (this.list.includes(item)) {
            var i = this.list.indexOf(item)
            var o = this.list.splice(i, 1) //split item out of list
            return this.list.splice(this.list.length - 1, 0, item) //add item to end
        } else {
            return false
        }
    }
    add(item) { //0
        return super.add(item, ()=>{
            item.renderOrder = 2
            if (item.held != null) item.held = true;
            this.refresh()
        })
    }
       
    drop(item) {
return super.remove(item, ()=>{
    item.setActive(true);
    if (item.held != null && item.held) item.held = false; 
    item.renderOrder = 0
    this.refresh()
})
    }

    remove(item) {
        item.setActive(false);
        var removed = super.remove(item, ()=> {
            this.refresh()
        })
        return removed;
    }
    //update position of visible items
    draw(nano) {
        let x = 0, y = 0;
        if (nano) {
            x = nano.x;
            y = nano.y;
        }
        for (let i = 0; i < Math.min(this.list.length, this.offsets.length); i++) {
            var slot = this.list[i];
            if (slot === null) continue;
            var offset = this.offsets[i]
            //console.log(offset); 
            slot.x = x + offset[0]
            slot.y = y + offset[1]
            slot.vx = -offset[0];
            slot.vy = -offset[1]

        }
    }
    //make items visible when there are positions that are available
    refresh() {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i] === null) continue;
            this.list[i].setActive(i < this.offsets.length)

        }
    }

}