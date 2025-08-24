//linking pings

import { cosmicEntityManager, setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.ts";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
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


export let n0pingJobs = new Map()
let harvest = new Map()
n0pingJobs.set("harvest", harvest)
harvest.set("insert",  {
    create: (a, itema, pos)=>{ 
        let tasks = a.map((a,i)=>{return {crop: a.a.resource, chest: a.b.resource, itema}}) 
        //console.log(tasks)
        let job = createJobu(splitArray(tasks,1),  "harvest-insert", itema, pos); 
        //console.log(job)
        n0radio.postJob("nano", job); 
    },
    canLink: (harvest, insert) => {
        //nano owns crops and chest? ok job made :)
        return harvest.owner === insert.owner
    }
})
//console.log(splitArray([1,2,3,4,5],2))
jobTasksa.set("harvest-insert", function(a, itema, pos) {
//console.log("harvest insert", a)
console.log(pos)
let {crop} = a[0]
    return {
        name: "harvest-insert", item:null, pos:[crop.x, crop.y],
        interactions: [["harvesting"]],
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
            nano.brain.do(createJobu(splitArray(b, 2), jobu, ...args ))
            
        }
    }
})
jobTasksa.set("harvest", function({crop, itema}){
    //console.log(crop, itema)
    return {
        pos:[crop.x, crop.y],
        interactions: [["harvesting"]],
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
        
        console.log("take-craft", tasks)
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
  
    return {
            pos:[chest.x, chest.y],
            name: "take-craft", item:null,chest1: chest, table, itema, crafts:null,
            work: function(job, nano) {
                console.log(a)
                nano.brain.do(createJobu(a, "insert", "craft", "take"))
            }
        }
    });

    jobTasksa.set("craft", function(a, req){
        //console.log(a)
        let {table, itema} = a
        return {
            requires: [[req, a]],
            work(job, nano) {
                console.log(a)
                //console.log({ao: "crafting", a, items:this.items, req, table, itema})
                nano.brain.do("craft", table, ()=> { console.log(this);  return [this.items[0].o]}, (out)=>{
                    this.item.o = out
                })
            }
        }
    })

    //pinga.ping("plant", this, "seeds")
    take.set("plant",  {
        create: (a, itema)=>{ 
            
            let tasks = a.map((a,i)=>{return {chest: a.a.resource, soil: a.b.resource, itema}}) 
            let job = createJobu(splitArray(tasks, 2), "take-plant", itema); 
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
                pos:[soil.x, soil.y],
                interactions: [["planting"]],
                //requires: a.map(o=>(["plant", o])),
                name: "take-plant", item:null,chest, soil, itema, crafts:null,
                work(job, nano) {
                    nano.brain.do(createJobu(a, "plant"))
                }
            }
        });
    jobTasksa.set("take", function(sci){
        var {chest, itema} = sci
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
            pos:[soil.x, soil.y],
            interactions: [["planting"]],
            requires: [["take", sci]],
            work(job, nano) {
                nano.brain.do("plant", soil, itema);
            }
        }
    })

//createJobu([chunk], "checkRun", "pops")
jobTasksa.set("checkrun", function(a, itema) {
    
    return {
            pos:[a.pos[0], a.pos[1]],
            name: "checkrun", requires: [["walk", a.pos]],
            work: function(job, nano) {
                
                let b = false
                for (let [_,pop] of a[itema]) {
                    b ||= pop();
                }
                return b
            }
        }
    });

    jobTasksa.set("walk", function(a){
       console.log(a)
        return {
            pos: a,
            work(job, nano) {
                nano.brain.do("walk", a[0], a[1])
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
        
    }, 
    pingChunk(action, resource, item, promise, success) { 
        let chunks: any[] = worldGrid.circleChunks(resource.x, resource.y)
        let ping = {action, resource, item, promise, success, chunks};
        
        for (let chunk of chunks) {
            if (!chunk.pings) chunk.pings = new Map()
            let types = chunk.pings.get(action);
            if (!types) {
                types = new Map()
                chunk.pings.set(action, types)
            }
            let items: any[] = types.get(item)
            if (!items) { 
                items = []
                types.set(item, items)
            }
            if (promise) {
                items.push(ping)
            } 
        }
        if (!promise) {
        //store ping info on chunk
            
        let chunka = (c) => c.pings.get(action).get(item)
        let chuns = chunks.sort((a,b)=>chunka(a).length-chunka(b).length)
        let chunk = chuns[chuns.length-1]
        let pos = chunk.pos;
        //chunk
        //create job to tell nano to check this spot and run this function
        
        let key = `${action}-${item}`
        
        for (const chusx of chuns) {
            if (chusx.pops===undefined)   chusx.pops = new Map();
            if (!chusx.pops.get(key))  {
        chusx.pops.set(key, () => {

        let items = chunka(chusx).slice();
            console.log("pop")
            if (items.every(ping => !ping.promise || ping.promise())) { //if every promise is met, or if no pings of this type have a promise
                console.log("popped")
                for (const item of items) {
                    console.log("popping", item)
                for (let chunk of item.chunks){
                    let ps = chunk.pings.get(item.action).get(item.item)
                    let i = ps.indexOf(item);
                    ps.splice(i, 1)
                }
                //item?.success?.();
                }
                chusx.pops.delete(key)
                this.linkBundle(action, items, item, pos)
            } else return true
        })
        let check = createJobu(chuns, "checkrun", "pops")
        n0radio.postJob("nano", check)
    }
    }

    }
},
    linkBundle(action:string, as:Array<any>, item: string, pos) {
       
        for (const [key, value] of this.pings) {
            if (key === action) continue;
            let job = n0pingJobs?.get(action)?.get?.(key)
            if (job) {
                let bs:Array<any> = value.get(item)
               
                if (!(as && as.length >0)|| !(bs&&bs.length >0)) continue;
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
                ab = ab.filter(a=>a.a &&a.b)
                if (!ab) continue;
                job.create(ab, item, pos)
            }
        }
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
                    ab = ab.filter(a=>a.a &&a.b)
                    if (!ab) continue;
                    console.log()
                    job.create(ab, item)
                }
            }   
        }
    }
}


//let n0 = new Nanoai("n0", 7,7,5)
//let bfc = new WorldGenerator(n0)

class Pingy{
    setActive; renderOrder; f;
    constructor(){
        this.setActive = setActive
        this.setActive(true)
        this.renderOrder = 77;
        this.f =0;
    }
    draw() {
        if (this.f<16) {
            this.f+=1;
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


//worldGrid.x=  Math.floor(Math.random()*2562)
//32*0
//worldGrid.y= Math.floor(Math.random()*2562)

globalThis.pinga = pinga
//n0.identity.skills.set("harvesting", 2)
//let n1 = new Nanoai("n1", 5,6,5)
//let n2 = new Nanoai("n2", 10,10,5)
//let n3 = new Nanoai("n3", 10,10,5)


//globalThis.nanos = [n0,n1,n2,n3]

//let seed = new Seed(0,0)
//n0.brain.do("pickup", seed)
/*
for (let i = 0; i < 32; i++) {
    for (let o = 13; o < 15; o++) 

    new Soil(i,o, true)//.plant(n0, new Seed(2,2))
    
}


let chest = new Chest(16, 11, 8)

chest.insert(n0, new Seed(-5, -5))
chest.insert(n0, new Seed(-5, -5))

let table = new CraftingTable(4, 8)
*/
//pinga.ping("take", chest, "crop")


/*
let chest2 = new Chest(16, 2, 5)
pinga.ping("insert", chest2, "crop")
*/

