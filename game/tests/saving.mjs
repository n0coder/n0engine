import { p } from "../../engine/core/p5engine";
import { a0Clone, atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";

// gonna prototype saving systems

//TODO: XD ideas depending on save systems:
//TODO: world generator, for deleting unmodified chunks
//TODO: nanoais, for storing skills, opinions and relationships
//TODO: items/objects/tiles, to allow saving them

export let n0saves = { 
    strats:new Map(), items: new Set(),
    addStrat( name, serialize, hydrate ) { 
        this.strats.set(name, { 
            items:[], serialize, hydrate 
        }); 
    },
    addItem( obj, strat ) {
        if (this.items.has(obj)) return; //don't print to console, it may spam
        const name = strat ?? obj.saveStrat;
        if (!obj.saveStrat && name) obj.saveStrat = name;   // stamp once
        this.items.add(obj);
    },
    save() {
    p.noLoop();

    const idMap  = new Map();   // obj -> id
    let   nextId = 0;

    /* ---------- 1.  crawl the entire graph ---------- */
    const queue = [...this.items];          // seed set
    for (const root of queue) {
        dfs(root);
    }
  /* ---------- 2.  build cleaned atoms ---------- */
    const atoms = [];
    for (const [o, id] of idMap) {
        //debugger;
        const clone = a0Clone(o);         // pure data copy
        let fns = replaceRefs(clone, idMap);            // swap objects → ids
        if (fns && !clone.saveStrat) {                  // mark strategy failure visibly
            //clone.id = id;
            clone.broken = true;
            atoms.push(clone);
        } else  {
            const strat = this.strats.get(clone.saveStrat);
            //clone.id = id;
            atoms.push(strat?.serialize?.(clone) ?? clone);
        }
    }

    p.loop();
    return atoms;

  /* ---------- local helpers ---------- */
    function dfs(obj) {
    if (obj === null || typeof obj !== 'object') return;
    if (idMap.has(obj)) return; // already seen
    idMap.set(obj, nextId++);

    // discover if it needs a strategy
    let needs = false;
    for (const k in obj) {
        if (typeof obj[k] === 'function') { needs = true; break; }
    }
    if (needs && !obj.saveStrat) obj.broken = true;

    // recurse into every property
    if (Array.isArray(obj)) {
        for (const item of obj) dfs(item);
    } else if (obj instanceof Map) {
        for (const [k, v] of obj) {
            dfs(k);
            dfs(v);
        }
    } else if (obj instanceof Set) {
        for (const v of obj) dfs(v);
    } else {
        for (const k in obj) dfs(obj[k]);
    }
}


    function replaceRefs(node, map) {
        if (node === null || typeof node !== 'object') return;
        let objs = [];

        let fns = false;
        for (const k in node) {
            if (typeof node[k] === "function") {
                fns = true;
            }
            let v = map.get(node[k]);
            if (v) {
                delete node[k];
                objs.push([k, v])
            }
            //replaceRefs(node[k], map);
        }
        if (objs.length > 0) node.vars = objs;
        return fns;
    }

}
}
n0saves.addStrat("hydrot", (obj) => { /* serialization strategy */ }, () => { /* hydration strategy */ } )
let a = { name: "a" }
let b = { name: "b", fn(){  } }
let c = { saveStrat: "hydrot", fn(){} }
n0saves.addItem({a, b, c})
console.log(JSON.stringify(n0saves.save()));