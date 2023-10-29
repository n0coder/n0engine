export class Loader {
    constructor() {
        this.loadingItems = new Map();
        this.loadedItems = new Map();
        this.queue = new Map();
    }

    loadItem(item) {
        this.loadingItems.set(item.galaxyKey, item);
        if (item?.onLoad) {
            item.onLoad(() => {
                this.loadingItems.delete(item.galaxyKey);
                this.loadedItems.set(item.galaxyKey, item);
                this.loaded(item.galaxyKey);
                for (let [queuedItem, dependencies] of this.queue) {
                    this.startLoading(queuedItem, dependencies, true)
                }
            });
        }
    }

    startLoading(item, dependencies) {
        if (dependencies == null) {
            this.loadItem(item);
            return false;
        }
       
        if (dependencies.every(dependency => this.loadedItems.has(dependency))) {
            if (this.queue.get(item))
                this.queue.delete(item);
            this.loadItem(item); 
        } else {
            this.queue.set(item, dependencies);
        }
    }

    isLoading(item) {
        return this.loadingItems.get(item);
    }

    loaded(item) {
        console.log("loaded item", item);
    }
}

let l = new Loader();


l.startLoading({
    galaxyKey: "bVi",

    onLoad(loaded) {
        loaded(this);
    }
}, ["aoY"]);

l.startLoading({
    galaxyKey: "aoY",

    onLoad(loaded) {
        loaded(this);
    }
})
l.startLoading({
    galaxyKey: "aes",

    onLoad(loaded) {
        loaded(this);
    }
}, ["bVi"]);