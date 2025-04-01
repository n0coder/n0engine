import { DebugCursor } from "./world/debugCursor.mjs";
import { WorldGenerator } from "./world/wave/worldGen/worldGenerator.mjs";
import {Nanoai} from "./nanoai/nanoai.mjs"
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Soil } from "./farm/soil.mjs";
import { CraftingTable } from "./farm/craftingTable.mjs";
import { createJobu, jobTasksa } from "./radio/jobSystem.mjs";
import { n0radio } from "./radio/n0radio.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { Seed } from "./farm/seed.mjs";
worldGrid.x=  Math.floor(Math.random()*2562)
//32*0
worldGrid.y= Math.floor(Math.random()*2562)

let n0 = new Nanoai("n0",10,10, 20)

globalThis.n0 = n0;

let n2 = new Nanoai("n0",10,11, 20)
let n1 = new Nanoai("n0",13,11, 20)
new Nanoai("n0",10,8, 20)
new Nanoai("n0",4,11, 20)

let o = {o:"o"}


new DebugCursor()
let bfc = new WorldGenerator(n0)
/*
//wait until the world loads
n0.brain.do("wait", ()=>{
    return worldGrid.getTile(6,6)===undefined
})
*/

var craftingTable = new CraftingTable(11,16)
//var seed = new Seed(6,6)
//n0.brain.do("pickup", seed)
//n0.brain.do("dance")
/*
   core game loop:
   a nano wants to do something, so we give them a project, as they form ideas they form jobs and start working.
   a job like fill the soils with seeds springs nanos into action, 
   crafting will require items so a nano will have to start the collection process.
   the core game loop from the players view is creating jobs for the nano
   the nanos handle all the tedius work.
   its alot like a factory building game?
*/


/*
function plant(slot) {
    n0.brain.do("plant", soils[slot])
}

plant(0)

n0.brain.do("wait", (n, t) => {
    return soils.some(s=>s.crop&&s.crop.growth < 1)
})


n0.brain.do("harvest", soils[0])
let pop = n0.brain.do("ping", (nano)=>{
    for(let item of nano.inventory) {
        n0.brain.doAfter(pop, "craft", craftingTable, item) //convert all crops to seeds
    }
})

plant(0); 
*/
jobTasksa.set("getSeeds", function() {
    return {
        name: "getSeeds",  
        work: function (job, nano) {
            this.item.item = new Seed(2,2)
            this.item.nano = nano
            nano.brain.do("pickup", this.item.item)
            console.log(`${nano.name} gathering seeds`);
        }
    }
});

// Define the plant seeds task
jobTasksa.set("plantSeeds", function(crop) {
    return {
        name: "plantSeeds", crop,
        requires: [["getSeeds", {}]],
        work: function(job, nano) {
            console.log(this)
            nano.brain.do("plant", crop, this.items[0].item)
            console.log(`${nano.name} planting seeds`, this);
        }
    }
});


var soils = [];
for (let o = 10; o < 11; o++)
for (let i = 10; i < 15; i++) {
    soils.push(new Soil(i, o))
}
var plantJob = createJobu(soils, "plantSeeds");
n0radio.postJob("nano", plantJob)

var soils2 = [];
for (let o = 11; o < 12; o++)
for (let i = 10; i < 15; i++) {
    soils2.push(new Soil(i, o))
}
var plantJob2 = createJobu(soils2, "plantSeeds");
n0radio.postJob("nano", plantJob2)

var soils3 = [];
for (let o = 12; o < 13; o++)
for (let i = 10; i < 15; i++) {
    soils3.push(new Soil(i, o))
}
var plantJob3 = createJobu(soils3, "plantSeeds");
n0radio.postJob("nano", plantJob3)
/*
n0.brain.do(plantJob)
n1.brain.do(plantJob2)
n2.brain.do(plantJob3)
*/
let nanos = n0radio.nanosInChannel("nano", n0)
console.log(nanos)
//plantJob.hireNano(n0)
/*
plant(1);
n0.brain.do("wait", (n, t) => {
    return soils.some(s=>s.crop&&s.crop.growth < 1)
})
n0.brain.do("harvest", soils[0])
n0.brain.do("harvest", soils[1])
let pop2 = n0.brain.do("ping", (nano)=>{
    for(let item of nano.inventory) {
        n0.brain.doAfter(pop2, "craft", craftingTable, item) //convert all crops to seeds
    }
})

plant(0); plant(1);
plant(2); plant(4);
n0.brain.do("wait", (n, t) => {
    return soils.some(s=>s.crop&&s.crop.growth < 1)
})
console.log(new Set([[234,456]]))
n0.brain.do("ping", ()=>console.log(JSON.stringify(cosmicEntityManager)))
let zzz = [0,1,2,4]
zzz.map((a)=>n0.brain.do("harvest", soils[a]))
let pop3 = n0.brain.do("ping", (nano)=>{
    for(let item of nano.inventory) {
        n0.brain.doAfter(pop3, "craft", craftingTable, item) //convert all crops to seeds
    }
})

zzz= [8,1,2,3,4,5,6,7];
zzz.map((i)=>plant(i))
*/
//i wanna make a loop where the nano plants all the seeds in its inventory
//waits for all the currently growing crops to grow
//harvest up to half the nanos inventory's max capacity
//craft seeds with the crops using the crafting table
//at the current rate we get 2 seeds per crop from crafting.

//form a frame by frame loop (loops until hook is pulled)

/*
n0.brain.do("hook", (hook, marker)=>{
let croplessSoils = null, seeds = null;
let harvests = [];
let maxHarvest = n0.inventory.slots/2;
n0.brain.doBefore(marker, "ping", (nano)=>{
    croplessSoils = soils.filter(s=>(s.crop === null))
    seeds = n0.inventory.hasItems("seed", "kind", 0)
    let count = Math.min(seeds.length,croplessSoils.length )

    for (let i = 0; i < count; i++) 
        n0.brain.doBefore(marker, "plant", croplessSoils[i], seeds[i])

    n0.brain.doBefore(marker, "wait", (n, t) => {
        return soils.some(s=>s.crop&&s.crop.growth < 1)
    })
    
    n0.brain.doBefore(marker, "ping", (n) =>{
        harvests = soils.filter(s=>(s.crop))
        console.log(harvests)
        for (let h = 0; h <Math.max(harvests.length, maxHarvest); h++) {
            n0.brain.doBefore(marker, "harvest", harvests[h])
        }
    })
    n0.brain.doBefore(marker, "walk", n0.x+6, n0.y+7)
})

})
*/
/*
//while we have soils to plant we do the gameplay loop
let soilsa = soils.filter(s=>(s.crop === null))
while (soilsa)
{
     
    let seeds = n0.inventory.hasItems("seed", "kind", 9)
    while (seeds) {
        n0.brain.do("plant", soilsa[0], seeds[0])
        seeds = n0.inventory.hasItems("seed", "kind", 9)
    }
    n0.brain.do("wait", (n, t) => {
        for (let soil of soils)
            if (soil.crop && soil.crop.growth < 1) return true;
    });
    
}
*/
