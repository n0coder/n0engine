export class Loader {
    constructor() {
        this.loadingItems = new Map();
        this.loadedItems = new Map();
        this.queue = new Map();
        
        // Phase tracking
        this.phase = 'init';
        this.phaseHistory = [this.phase];
        this.phaseChangeCallbacks = [];
    }

    setPhase(newPhase) {
        if (this.phase !== newPhase) {
            this.phase = newPhase;
            this.phaseHistory.push(newPhase);
            this.phaseChangeCallbacks.forEach(cb => cb(newPhase, this));
        }
    }

    onPhaseChange(cb) {
        this.phaseChangeCallbacks.push(cb);
    }

    loadItem(key, item) {
        this.loadingItems.set(key, item);
        if (item) {
            item(() => {
                this.loadingItems.delete(key);
                this.loadedItems.set(key, item);
                this.loaded(key);
                for (let [qKey, [qItem, dependencies]] of this.queue) {
                    this.startLoading(qKey, qItem, dependencies);
                }
                this.checkAllComplete();
            });
        }
    }

    startLoading(key, item, dependencies) {
        if (!dependencies) {
            this.loadItem(key, item);
            return;
        }
        
        if (dependencies.every(dep => this.loadedItems.has(dep))) {
            this.queue.delete(key);
            this.loadItem(key, item); 
        } else {
            this.queue.set(key, [item, dependencies]);
        }
    }

    checkAllComplete() {
        if (this.loadingItems.size === 0 && this.queue.size === 0) {
            this.setPhase('nano'); // automatic flip when all initial loads done
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
// Phase-aware logging
console.logp = (...args) => {
    console.log(console, `%c[${n0loader.phase} time]`, 
        n0loader.phase === 'init' ? 'color: orange' : 'color: cyan', 
        ...args
    );
};
/*
// Optional: react instantly when phase flips
n0loader.onPhaseChange((phase) => {
    console.log(`Phase changed to: ${phase}`);
});
*/