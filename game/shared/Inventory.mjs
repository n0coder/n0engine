export class Inventory {
    constructor(slots=-1) {
        this.slots = slots;
        this.list = [];
    }

    transfer(inventory) {
        var all = this.list.splice(0)
        inventory.transferRecieve(all)
    }
    transferRecieve(all) {
        all.forEach(i => this.add(i));
    }
    add(item, onAdded) { //0
        if (this.list.includes(item)) {
            return false;
        } else {
            if (this.isOpen) {
                var o = this.list.push(item); 
                onAdded?.();
                return o > 0;
            }
            return false;
        }
    }
    get isOpen() {
        return this.slots === -1 || this.list.length < this.slots;
    }

    has(item) {
        let index = this.list.indexOf(item);
        return index >= 0
    }

    hasItem(item, type) {
        const condition = type === "kind" 
         ? element => element && element.kind === item 
         : element => element && element.constructor.name === item;
        return this.list.find(condition);
       }
       
    hasItems(item, type, count) {
        const condition = type === "kind" 
        ? element => element && element.kind === item 
        : element => element && element.constructor.name === item;
       
        const items = this.list.filter(condition);
        return items.length >= count ? items : null;
       }
       
    remove(item, onRemoved) {
        if (this.list.includes(item)) {
            var i = this.list.indexOf(item);
            var o = this.list.splice(i, 1);
            onRemoved?.()
            return o;
        } else {
            return false;
        }
    }

}