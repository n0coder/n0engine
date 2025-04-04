//linking pings

import { Chest } from "../farm/chest";
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


let n0 = new Nanoai("n0", 5,5,5)
let seed = new Seed(0,0)
n0.brain.do("pickup", seed)
let soil = new Soil(8,5, true)
n0.brain.do("plant", soil, seed)

let chest = new Chest(16, 6, 5)
pinga.ping("insert", chest, "crop")
