//linking pings

import { p } from "../../engine/core/p5engine.mjs";
import { Chest } from "../farm/chest";
import { CraftingTable } from "../farm/craftingTable.mjs";
import { Seed } from "../farm/seed.mjs";
import { Soil } from "../farm/soil.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { Inventory } from "../shared/Inventory.mjs";
import { createJobu, jobTasksa } from "./jobSystem.mjs";

let n0pingJobs = new Map()
let harvest = new Map()
n0pingJobs.set("harvest", harvest)
harvest.set("insert",  {
    create: (harvest, insert, itema)=>{ 
        let job = createJobu(harvest, "harvest-insert", insert, itema); 
        n0radio.postJob("nano", job); 
    },
    canLink: (harvest, insert) => {
        //nano owns crops and chest? ok job made :)
        return harvest.owner === insert.owner
    }
})

jobTasksa.set("harvest-insert", function(crop, chest, itema) {
    return {
        name: "harvest-insert", item:null,
        work: function(job, nano) {
            nano.brain.do("harvest", crop, (item)=>{
                this.item = item
            });
            nano.brain.do("insert", chest, ()=>this.item)
        }
    }
});

let take = new Map()
n0pingJobs.set("take", take)
take.set("insert",  {
    create: (take, insert, itema)=>{ 
        console.log("take insert", {take,insert})
        let job = createJobu(take, "take-insert", insert, itema); 
        n0radio.postJob("nano", job); 
    },
    canLink: (take, insert) => {
        console.log({take, insert})
        //nano owns crops and chest? ok job made :)
        return take.owner !== insert.owner && take.resource !== insert.resource
    }
})
jobTasksa.set("take-insert", function(chest1, chest2, itema) {
console.log(chest1,chest2)
    return {
        name: "take-insert", item:null,chest1, chest2, itema,
        work: function(job, nano) {
            console.log("wha")
            nano.brain.do("take", chest1, itema, (item)=>{
                this.item = item
                console.log({chest1, chest2, t:this, i:item})
            });
            nano.brain.do("insert", chest2, ()=>this.item)
        }
    }
});

take.set("craft",  {
    create: (take, table, itema)=>{ 
        console.log("take craft", {take,table})
        let job = createJobu(take, "take-craft", table, itema); 
        n0radio.postJob("nano", job); 
    },
    canLink: (take, insert) => {
        console.log({take, insert})
        //nano owns crops and chest? ok job made :)
        return take.owner === insert.owner
    }
})
jobTasksa.set("take-craft", function(chest1, table, itema) {
        return {
            name: "take-craft", item:null,chest1, table, itema, crafts:null,
            work: function(job, nano) {
                nano.brain.do("take", chest1, itema, (item)=>{
                    this.item = item
                });
                nano.brain.do("craft", table, ()=> [this.item], (out)=>{
                    this.crafts = out
                })
                nano.brain.do("insert", chest1, ()=>this.crafts)
            }
        }
    });
    //pinga.ping("plant", this, "seeds")
    take.set("plant",  {
        create: (take, soil, itema)=>{ 
            console.log("take plant", {take,soil})
            let job = createJobu(take, "take-plant", soil, itema); 
            n0radio.postJob("nano", job); 
        },
        canLink: (take, soil) => {
            console.log({take, soil})
            //nano owns crops and chest? ok job made :)
            return take.owner === soil.owner
        }
    })
    jobTasksa.set("take-plant", function(chest1, soil, itema) {
            return {
                name: "take-plant", item:null,chest1, soil, itema, crafts:null,
                work: function(job, nano) {
                    nano.brain.do("take", chest1, itema, (item)=>{
                        this.item = item
                    });
                    nano.brain.do("plant", soil, itema);
                }
            }
        });
export let pinga = {
    pings: new Map<string, Map<string, any[]>>(),
    ping(action:string, resource:object, item:string) {
        let o = this.pings.get(action); //ping map
        if (!o) {
            o = new Map<string, any[]>(); 
            this.pings.set(action, o)
        }
        let i = o.get(item);
        if (!i) {
            i = [];
            o.set(item, i)
        }
        i.push({
            resource, item, action
        })
        this.doLinks(item)
    }, 
    doLinks(item: string) {
        for (const [key, value] of this.pings) {
            for (const [key2, value2] of this.pings) {
                let job = n0pingJobs?.get(key)?.get?.(key2)
                if (job) {
                    console.warn("implement itemless cases")
                    let as = value.get(item)
                    let bs = value2.get(item)

                    if (!as || !bs) continue;
                    for (let a = 0; a < as.length; a++) {
                        for (let b = 0; b < bs.length; b++) {
                            if (job.canLink(as[a], bs[b])) {
                                job.create(as[a].resource, bs[b].resource, item)
                                as.splice(a, 1)
                                bs.splice(b, 1)
                                return; //one link per call to doLinks (may chane later)
                            } 
                        }
                    }
                }
            }   
        }
    }
}
/*
let m = new Map();
m.set(undefined, ":)")
console.log(m.get(undefined))
*/

globalThis.pinga = pinga
let n0 = new Nanoai("n0", 5,5,5)

let n1 = new Nanoai("n1", 5,6,5)
//let seed = new Seed(0,0)
//n0.brain.do("pickup", seed)
let soil = new Soil(8,5, true)
let soil2 = new Soil(8,6, true)
//n0.brain.do("plant", soil, seed)

let chest = new Chest(16, 11, 8)
chest.insert(n0, new Seed(-5, -5))
let table = new CraftingTable(4, 8)
//pinga.ping("take", chest, "crop")


/*
let chest2 = new Chest(16, 2, 5)
pinga.ping("insert", chest2, "crop")
*/