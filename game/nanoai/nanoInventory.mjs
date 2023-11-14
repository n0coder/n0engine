export class NanoInventory {
    constructor(slots, offsets) {
        this.slots = slots;
        this.offsets = offsets;
        this.list = [];
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
    transfer(inventory) {
        var all = this.list.splice(0)
        inventory.transferRecieve(all)
    }
    transferRecieve(all) {
        all.forEach(i => this.add(i));
    }
    add(item) { //0
        if (this.list.includes(item)) {
            return false;
        } else {

            //console.log("item added")
            if (this.list.length < this.slots) {
                item.renderOrder = 2
                var o = this.list.push(item); //1
                if (item.held != null) item.held = true;
                this.refresh()
                return o > 0;
            }
            return false;
        }
    }
    isOpen() {
        return this.list.length < this.slots
    }

    isPhysical(item) {
        let index = this.list.indexOf(item);
        return index >= 0 && index < this.offsets.length
    }
    has(item) {
        let index = this.list.indexOf(item);
        console.log(index);
        return index >= 0
    }
    hasItem(kind) {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            if (element && element.constructor.name === kind) {
                return element;
            }
        }
        return null;
    }

    hasItems(kind, count) {
        let i = []
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            if (element && element.constructor.name === kind) {
                i.push(element)
                if (i.length >= count) {
                    return i;
                }
            }
        }
        return null;
    }
    remove(item) {
        if (this.list.includes(item)) {
            var i = this.list.indexOf(item);
            var o = this.list.splice(i, 1);
            this.refresh()
            item.setActive(true);
            if (item.held != null && item.held) item.held = false; 
            item.renderOrder = 0
            return o;
        } else {
            return false;
        }
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