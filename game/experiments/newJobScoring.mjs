import { Soil } from "../farm/soil.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { createJobu, jobTasksa } from "../radio/jobSystem.mjs"

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
            console.log({nano, nano2: this.items[0].nano})
            nano.brain.do("plant", crop, this.items[0].item)
            console.log(`${nano.name} planting seeds`, this);
        }
    }
});


export function nanoTaskScore(nano, task) {
    
    let score = 1;
    
    function ownsJobItem(params) {
        if (task.items) {
            let a = task.items.filter(i=>i.nano === nano)
            if (a.length === 0) return 0
            }
    }
    
    identityScoring();
    distanceModifier();
    function identityScoring() {
        if (task.interactions)
            for (const [skill, type, thing] of task.interactions) {
                let skillb = nano.identity.skills?.get(skill) || 1;
                let skillo = nano.identity.opinions?.get("skills")?.get(skill) || 1;
                score *= skillo * skillb;
                let typo = nano.identity.opinions?.get(type)?.get(thing.name) || 1;
                score *= typo;
            }
    }

    function distanceModifier() {
        if (task.x !== undefined && task.y !== undefined) {
            let nx = nano.x, ny = nano.y;
            let tx = task.x, ty = task.y;
            let x = nx - tx, y = ny - ty;
            let vis = Math.abs((x * x) + (y * y));
            let mag = Math.sqrt(vis < .1 ? .1 : vis) * .1;
            score = Math.pow(score, 2.4) / (Math.pow(mag, 1.2));
        }
    }
    
    
}

let soil = new Soil(5,7)
let nano = new Nanoai("n0",5,5,5)
let job = createJobu([soil], "plantSeeds")
let task = job.stages[job.stage].tasks[0]

console.log({nano, job, task})