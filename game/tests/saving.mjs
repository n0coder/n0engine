import { p } from "../../engine/core/p5engine";
import { a0Clone, atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { worldFactors } from "../world/FactorManager.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder";

// gonna prototype saving systems

//TODO: XD ideas depending on save systems:
//TODO: world generator, for deleting unmodified chunks
//TODO: nanoais, for storing skills, opinions and relationships
//TODO: items/objects/tiles, to allow saving them

let morph = null;

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

    let visits = new Set();
        morph = (obj) => {
            if (obj === undefined || obj === null) return obj;
            if (!morph.map) morph.map = new Map();
            let modo = morph.map.get(obj)
            if (modo) return modo;

            //console.log(obj)
            let mod = obj;
            if (!obj.saveStrat) {
                if (obj instanceof Map) {
                    mod = { 'map': Array.from(obj.entries()) }
                } else if (obj instanceof Set) {
                    mod = { 'set': Array.from(obj) }
                } else if (Array.isArray(obj)) {
                    mod = { 'array': [...obj] }; 
                }
                else if (typeof obj === 'object') {
                    mod = { ...obj }
                    mod.saveStrat = `${obj.constructor.name}`;
                    const strat = this.strats.get(mod.saveStrat);
                    Object.assign(mod, strat?.serialize?.(mod) ?? { broken:true })
                }
            } 
            if (typeof mod === 'object')
                visits.add(mod);
            morph.map.set(obj, mod);
            return mod;
        }
    const idMap  = new Map();   // obj -> id
    let   nextId = 0;

    /* ---------- 1.  crawl the entire graph ---------- */
    const queue = [...this.items];          // seed set
    const atoms = [];
    for (const obj of queue) {
        let mod = morph(obj);
        dfs(mod, morph);
    }
  /* ---------- 2.  build cleaned atoms ---------- */
    for (const v of visits) {
        let fns = replaceRefs(v, idMap);   // v is the morphed object
        if (fns)
        v.broken = true;
        atoms.push(v);
        }

    p.loop();
    morph = undefined;
    return atoms;

  /* ---------- local helpers ---------- */
    function dfs(obj /* this is already a morphed clone */,
              morph,
              original /* optional, only used for the root call */) {
    if (obj === null || typeof obj !== 'object') return;
    if (idMap.has(obj)) return;          // already processed

    /* 1.  give this clone an atom number */
    idMap.set(obj, nextId++);

    /* 3.  recurse into the clone’s children */
    if (obj.array) {
        for (let i = 0; i < obj.array.length; i++) {
            const item = obj.array[i];
            const mod  = morph(item);
            dfs(mod, morph);
            obj.array[i] = mod;          // safe: we’re mutating the clone only
        }
    } else if (obj.map) {
        for (let i = 0; i < obj.map.length; i++) {
            let [k, v] = obj.map[i];
            const modk = morph(k);
            const modv = morph(v);
            dfs(modk, morph);
            dfs(modv, morph);
            obj.map[i] = [modk, modv];
        }
    } else if (obj.set) {
        for (let i = 0; i < obj.set.length; i++) {
            const v   = obj.set[i];
            const mod = morph(v);
            dfs(mod, morph);
            obj.set[i] = mod;
        }
    } else {
        for (const k in obj) {
            const mod = morph(obj[k]);
            dfs(mod, morph);
            obj[k] = mod;                // safe: we’re mutating the clone only
        }
    }
}


    function replaceRefs(node, map) {
        if (node === null || typeof node !== 'object') return false;

        let fns = false;

        if (node.array) {
            for (let i = 0; i < node.array.length; i++) {
                const it = node.array[i];
                if (typeof it === 'function') 
                    fns = true;
                node.array[i] = stub(it);
            }
            return fns;
        }
        if (node.map) {
            for (let i = 0; i < node.map.length; ++i) {
                const [k, v] = node.map[i];
                if (typeof k === 'function' || typeof v === 'function') fns = true;
                    node.map[i] = [ stub(k), stub(v) ];
            }
            return fns;
        }

        if (node.set) {
            for (let i = 0; i < node.set.length; ++i) {
                const v = node.set[i];
                if (typeof v === 'function') fns = true;
                node.set[i] = stub(v);
            }
            return fns;
        }
        for (const k in node) {
            const val = node[k];
            if (typeof val === 'function') fns = true;
            node[k] = stub(val);
        }
        return fns;
        function stub(val) {
                const id = idMap.get(val);
                return id !== undefined ? { atom: id } : val;
        }
    }

}
}

n0saves.addStrat('map', undefined, (load)=> {  });
n0saves.addStrat('set',  undefined, (load)=> {  });
n0saves.addStrat('array',  undefined, (load)=> {  });
n0saves.addStrat('class:Nanoai', (obj) => {
    return obj;
});
n0saves.addStrat('class:NanoaiBrain', (obj) => obj)
n0saves.addStrat("hydrot", (obj) => { /* serialization strategy */ }, () => { /* hydration strategy */ } )
let a = { name: "a" }
let b = { name: "b", fn(){  } }
let c = { saveStrat: "hydrot", fn(){} }
//let d = {a, b, c}
let e = {name: "arraymap", aos: [a,b,c], mapi: new Map([["candy", a]])}

let ab = class { constructor() { this.name = "potato" } }
let aa = [1,2, [3]]  // new Map([["chicken", 123]]) //new ab();
let z = new Map([[3,3]]) 
let zv = new Map([[3,z]]) 
let y = {zv}
let x = {zv}
//n0saves.addItem(x);
//n0saves.addItem(y);

let n0 = new Nanoai("n0");
n0saves.addItem(n0);
let objgraph = n0saves.save();
console.log(n0)
//console.log(objgraph)

const out = '[\n' + objgraph.map(o => '  '+JSON.stringify(o)).join(',\n') + '\n]';
console.log(out)
/*
n0.brain.do("walk", 1, 1)
n0.brain.do("ping", (nano) => {
})*/