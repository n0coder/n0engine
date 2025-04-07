//linking pings

import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { sortArray, splitArray } from "../../engine/core/Utilities/ArrayUtils";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { Chest } from "../farm/chest";
import { CraftingTable } from "../farm/craftingTable.mjs";
import { Seed } from "../farm/seed.mjs";
import { Soil } from "../farm/soil.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { Inventory } from "../shared/Inventory.mjs";
import { WorldGenerator } from "../world/wave/worldGen/worldGenerator.mjs";
import { createJobu, jobTasksa } from "./jobSystem.mjs";


let n0pingJobs = new Map()
let harvest = new Map()
n0pingJobs.set("harvest", harvest)
harvest.set("insert",  {
    create: (a, itema)=>{ 
        let tasks = a.map((a,i)=>{return {crop: a.a.resource, chest: a.b.resource, itema}}) 
        console.log(tasks)
        let job = createJobu(splitArray(tasks,8),  "harvest-insert", itema); 
        n0radio.postJob("nano", job); 
    },
    canLink: (harvest, insert) => {
        //nano owns crops and chest? ok job made :)
        return harvest.owner === insert.owner
    }
})
//console.log(splitArray([1,2,3,4,5],2))
jobTasksa.set("harvest-insert", function(a, itema) {
//console.log("harvest insert", a)
let {crop} = a[0]
    return {
        name: "harvest-insert", item:null, pos:[crop.x, crop.y],
        work: function(job, nano) {
            nano.brain.do(createJobu(a,  "insert", "harvest"))
        }
    }
});
jobTasksa.set("bundle", function(a, chunks, jobu, ...args){
    return {
        work(job, nano) {
            let b = a.splice(0, chunks)
            //console.log(b)
            if (b.length === 0) return
            nano.brain.do(createJobu(splitArray(b, 1), jobu, ...args ))
            
        }
    }
})
jobTasksa.set("harvest", function({crop, itema}){
    //console.log(crop, itema)
    return {
        work(job, nano) {
            nano.brain.do("harvest", crop, (item)=>{
                this.item.o = item
            });
        }
    }
})

jobTasksa.set("insert", function(sci, req, ...args){
    let {chest, itema} = sci
    //console.log("insert", {sci, req, args})
    return {
        requires: [[req, sci, ...args]],
        work(job, nano) {
            //console.log({chest, itema, insert:this, req})
            nano.brain.do("insert", chest, ()=>this.items[0].o)
        }
    }
})

let take = new Map()
n0pingJobs.set("take", take)
/*
take.set("insert",  {
    create: (take, insert, itema)=>{ 
        let job = createJobu(take, "take-insert", insert, itema); 
        n0radio.postJob("nano", job); 
    },
    canLink: (take, insert) => {
        //nano owns crops and chest? ok job made :)
        return take.owner !== insert.owner && take.resource !== insert.resource
    }
})
jobTasksa.set("take-insert", function(chest1, chest2, itema) {
    return {
        name: "take-insert", pos:[chest1.x, chest1.y], item:null,chest1, chest2, itema,
        work: function(job, nano) {
        
            nano.brain.do("take", chest1, itema, (item)=>{
                this.item = item
            });
            nano.brain.do("insert", chest2, ()=>this.item)
        }
    }
});
*/

take.set("craft",  {
    create: (a, itema)=>{ 
        let tasks = a.map((a,i)=>{return {chest: a.a.resource, table: a.b.resource, itema}}) 
        //console.log("take-craft")
        let job = createJobu(splitArray(tasks,1), "take-craft", itema); 
        n0radio.postJob("nano", job); 
    },
    canLink: (take, insert) => {
        //nano owns crops and chest? ok job made :)
        return take.owner === insert.owner
    }
})
    
jobTasksa.set("take-craft", function(a, itema) {
    let cs= a[0], {chest, table} = cs;
    //console.log(cs)
    return {
            pos:[chest.x, chest.y],
            name: "take-craft", item:null,chest1: chest, table, itema, crafts:null,
            work: function(job, nano) {
                nano.brain.do(createJobu(a, "insert", "craft", "take"))
                /*
                nano.brain.do("take", chest, itema, (item)=>{
                    this.item = item
                });
                nano.brain.do("craft", table, ()=> [this.item], (out)=>{
                    this.crafts = out
                })
                nano.brain.do("insert", chest, ()=>this.crafts)
                */
            }
        }
    });

    jobTasksa.set("craft", function(a, req){
        console.log(a)
        let {table, itema} = a
        return {
            requires: [[req, a]],
            work(job, nano) {
//console.log({ao: "crafting", a, items:this.items, req, table, itema})
                nano.brain.do("craft", table, ()=> [this.items[0].o], (out)=>{
                    this.item.o = out
                })
            }
        }
    })

    //pinga.ping("plant", this, "seeds")
    take.set("plant",  {
        create: (a, itema)=>{ 
            let tasks = a.map((a,i)=>{return {chest: a.a.resource, soil: a.b.resource, itema}}) 
            let job = createJobu(splitArray(tasks, 1), "take-plant", itema); 
            n0radio.postJob("nano", job); 
        },
        canLink: (take, soil) => {
            //nano owns crops and chest? ok job made :)
            return take.owner === soil.owner
        }
    })
    jobTasksa.set("take-plant", function(a, itema) {
        //console.log(a)
        
        let cs= a[0], {chest, soil} = cs;
        
            return {
                pos:[chest.x, chest.y],
                //requires: a.map(o=>(["plant", o])),
                name: "take-plant", item:null,chest, soil, itema, crafts:null,
                work(job, nano) {
                    nano.brain.do(createJobu(a, "plant"))
                }
            }
        });
    jobTasksa.set("take", function(sci){
        let {chest, itema} = sci
       // console.log(sci)

        return {
            work(job, nano) {
            nano.brain.do("take", chest, itema, (item)=>{
                this.item.o = item
            });
            }
        }
    })
    jobTasksa.set("plant", function(sci){
        let {soil, itema} = sci
        //console.log(soil, itema)
        return {
            requires: [["take", sci]],
            work(job, nano) {
                nano.brain.do("plant", soil, itema);
            }
        }
    })

function sort(a, a0) {
    let distance = (a, b) => {
        let dx = (b.x-a.x), dy= (b.y-a.y)
        return Math.sqrt(dx*dx+dy*dy)
    }
    let npa = a.filter(item=>!item.persistant)
    let pa = a.filter(item=>item.persistant)

    npa.sort((i,o)=>distance(i, a0)- distance(o, a0))
    pa.sort((i,o)=>distance(i, a0)- distance(o, a0))

    return [...npa, ...pa]
}
export let pinga = {
    pings: new Map<string, Map<string, any[]>>(),
    items: new Set<string>(),
    ping(action:string, resource:object, item:string, persistant:boolean=false) {
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
        //console.log({action, resource, item, persistant})
        i.push({
            resource, item, action, persistant
        })
        this.items.add(item)
        //this.doLinks(item)
    }, 
    doLinks(item: string) {
        for (const [key, value] of this.pings) {
            for (const [key2, value2] of this.pings) {
                let job = n0pingJobs?.get(key)?.get?.(key2)
                if (job) {
                    console.warn("implement itemless cases")
                    let as:Array<any> = value.get(item)
                    let bs:Array<any> = value2.get(item)
                    if (!(as && as.length >0)|| !(bs&&bs.length >0)) continue;
                    let a0 = as[0]
                    //as = sort(as, a0)
                    //bs = sort(bs, a0)

/*
                    let ab: any[] = []
                    for (let i = 0; i < Math.min(as.length, bs.length); i++) {
                       if (as.length >0 && bs.length>0) {
                        
                            if (!job.canLink(as[0], bs[0])) {
                                console.warn("joblink break may cause issues")
                                continue;
                            }
                            ab.push({ a:as[0], b:bs[0], item })
                            if (!as[0].persistant) as.shift()
                            if (!bs[0].persistant) bs.shift()
                       } else break;
                    }
                    */
                    //bundle as by distance
                    //sort bs to have closest

                    //console.log(as, bs)
                    let ab = as.slice().map((_,i)=>{ 
                        let a = as[0]
                        let b = bs[0]
                        let pop = () => {
                        if (as[0] && !as[0].persistant)
                            as.splice(0, 1)
                        
                        if (bs[0] && !bs[0].persistant)
                            bs.splice(0, 1);
                    }
                    pop()
                        return { a, b, item, pop } 
                    })

                    //for (let a = 0; a < as.length; a++) 
                    //bs.sort(b=>{return b.resource.x})

                        
                    if (!ab) continue;
                    //ab.pop(); //remove only if a job is made
                            // {
                                job.create(ab, item)
                                /*
                                
                                */
                                //one link per call to doLinks (may chane later)
                            //} 
                        
                            //console.log(as)
                }

                        
            }   
        }
    }
}

class Pingy{
    setActive; renderOrder; f;
    constructor(){
        this.setActive = setActive
        this.setActive(true)
        this.renderOrder = 77;
        this.f =0;
    }
    draw() {
        if (this.f<3) {
            this.f++;
        } else {
        for (let item of pinga.items.values()) {
            pinga.doLinks(item)
            pinga.items.delete(item)
        }
        this.f=0;
    }
    }
}
new Pingy()
/*
let m = new Map();
m.set(undefined, ":)")
console.log(m.get(undefined))
*/
worldGrid.x=  Math.floor(Math.random()*2562)
//32*0
worldGrid.y= Math.floor(Math.random()*2562)

globalThis.pinga = pinga
let n0 = new Nanoai("n0", 5,5,5)
let n1 = new Nanoai("n1", 5,6,5)
let n2 = new Nanoai("n2", 5,7,5)
let n3 = new Nanoai("n3", 4,8,5)
let n4 = new Nanoai("n0", 4,5,5)
let n5 = new Nanoai("n1", 4,6,5)
let n6 = new Nanoai("n2", 4,7,5)
let n7 = new Nanoai("n3", 4,8,5)
let bfc = new WorldGenerator(n0)


globalThis.nanos = [n0,n1,n2,n3]

//let seed = new Seed(0,0)
//n0.brain.do("pickup", seed)
for (let i = 0; i < 32; i++) {
    for (let o = 3; o < 5; o++) 

    new Soil(i,o, true).plant(n0, new Seed(2,2))
    
}
//n0.brain.do("plant", soil, seed)

let chest = new Chest(16, 11, 8)

//chest.insert(n0, new Seed(-5, -5))
//chest.insert(n0, new Seed(-5, -5))

let table = new CraftingTable(4, 8)
//pinga.ping("take", chest, "crop")


/*
let chest2 = new Chest(16, 2, 5)
pinga.ping("insert", chest2, "crop")
*/