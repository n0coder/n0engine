export class Map2d {
    constructor() {
      this.map = new Map();
    }
    set(x, y, value) {
        let a = this.map.get(x);
        if (a === undefined) {
            a = new Map();
            this.map.set(x, a);
        }
        a.set(y, value);
    }  
    get(x, y) {
        return this.map.get(x)?.get(y);
    }  
    has(x, y) {
        return this.map.get(x)?.has(y);
    }  
    delete(x, y) {
        const a = this.map.get(x);
        if (a) {
            const deleted = yMap.delete(y);
            if (yMap.size === 0) this.map.delete(x);
            return deleted;
        }
        return false;
    }
    clearAll() {
        this.map.clear();
    }
    clearX(x) {
        this.map.get(x)?.clear();
    }
}