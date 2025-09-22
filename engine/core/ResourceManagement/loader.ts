export type LoaderItem = (cb: () => void) => void;
export type PhaseChangeCallback = (phase: string, loader: Loader) => void;

export class Loader {
    loadingItems: Map<string, LoaderItem>;
    loadedItems: Map<string, LoaderItem>;
    queue: Map<string, [LoaderItem, string[]]>;
    phase: string;
    phaseHistory: string[];
    phaseChangeCallbacks: PhaseChangeCallback[];
    constructor() {
        this.loadingItems = new Map();
        this.loadedItems = new Map();
        this.queue = new Map();
        // Phase tracking
        this.phase = 'init';
        this.phaseHistory = [this.phase];
        this.phaseChangeCallbacks = [];
    }


    setPhase(newPhase: string) {
        if (this.phase !== newPhase) {
            this.phase = newPhase;
            this.phaseHistory.push(newPhase);
            this.phaseChangeCallbacks.forEach(cb => cb(newPhase, this));
        }
    }

    onPhaseChange(cb: PhaseChangeCallback) {
        this.phaseChangeCallbacks.push(cb);
    }

    loadItem(key: string, item: LoaderItem) {
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

    startLoading(key: string, item: LoaderItem, dependencies?: string[]) {
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

    isLoading(item: string): LoaderItem | undefined {
        return this.loadingItems.get(item);
    }
    isPending(item: string): [LoaderItem, string[]] | undefined {
        return this.queue.get(item);
    }

    loaded(item: string) {
        //console.log("loaded item", item);
    }
}

export let n0loader = new Loader();

/*
// Optional: react instantly when phase flips
n0loader.onPhaseChange((phase) => {
    console.log(`Phase changed to: ${phase}`);
});
*/