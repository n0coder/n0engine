export class Loader {
    constructor() {
        this.loadingItems = new Map();
        this.loadedItems = new Map();
        this.queue = new Map();
    }

    loadItem(key, item) {
        this.loadingItems.set(key, item);
        if (item) {
            item(() => {
                this.loadingItems.delete(key);
                this.loadedItems.set(key, item);
                this.loaded(key);
                for (let [key, [item, dependencies]] of this.queue) {
                    this.startLoading(key, item, dependencies)
                }
            });
        }
    }

    startLoading(key, item, dependencies) {
        //console.log(`loading ${key}`)
        if (dependencies == null) {
            this.loadItem(key, item);
            return false;
        }
       
        if (dependencies.every(dependency => this.loadedItems.has(dependency))) {
            if (this.queue.get(key))
                this.queue.delete(key);
            this.loadItem(key, item); 
        } else {
            this.queue.set(key, [item, dependencies]);
        }
    }

    isLoading(item) {
        return this.loadingItems.get(item);
    }
    isPending(item) {
        return this.queue.get(item);
    }

    loaded(item) {
        //console.log("loaded item", item);
    }
}
export let n0loader = new Loader();
