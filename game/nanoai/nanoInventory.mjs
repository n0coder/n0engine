export class NanoInventory{
    constructor(slots, offsets) {
        this.slots = slots;
        this.offsets = offsets;
        this.list = [];
    }
    add(item) { //0
        if (this.list.includes(item)) {
            return false;
        } else {
            console.log("item added")
            var o = this.list.push(item); //1
            this.refresh()
            return o>0;
        }
    }
    remove(item) {
        if (this.list.includes(item)) {
            var i = this.list.indexOf(item);
            var o = this.list.splice(i, 1);
            this.refresh()
            item.setActive(true);
            return o;
        } else {
            return false;
        }
    }
    //update position of visible items
    draw(nano) {
        let x=0,y=0;
        if (nano) {
            x = nano.x;
            y = nano.y;
        }
        for (let i = 0; i < Math.min(this.list.length, this.offsets.length); i++) {
            var slot = this.list[i];   
            var offset = this.offsets[i]
            //console.log(offset); 
            slot.x = x+offset[0]
            slot.y = y+offset[1]
        }
    }
    //make items visible when there are positions that are available
    refresh() {
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].setActive(i < this.offsets.length)            
        }
    }

}