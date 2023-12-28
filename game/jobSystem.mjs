import { atomicClone, cloneAction } from "../engine/core/Utilities/ObjectUtils.mjs";
import { Circle } from "./farm/circle.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { n0radio } from "./radio/n0radio.mjs";

let n0 = new Nanoai("n0", 200,256); 
let abi = new Nanoai("abi", 256,256); 
let o2 = new Nanoai("02", 156,256); 
let circle = new Circle(64,256, 8,8);

n0.brain.do("walk", 256, 200)

var jobTasksa = new Map([

    ["smile", function(...args) {
        return {
            name: "smile",
            args, working: false, job:null,
            requires: [["hold", args[0]]],
            work: function(nano, done) {
                if (this.working) return true;
                this.working = true;
                console.log(`${nano.name} smiling`, args, this.items);
                done(this);
            }
        }
    }], ["wink", function(...args) {
        return {
            name: "wink",
            args, working: false, job:null,
            work: function(nano, done) {
                if (this.working) return true;
                this.working = true;
                this.item.winked = "winked";
                console.log(`${nano.name} winking`, args);
                done(this);
            }
        }
    }],["hold", function(...args) {
        return {
            name: "hold",
            args, working: false, job:null,
            work: function(nano, done) {
                if (this.working) return true;
                this.working = true;
                this.item.item = args[0];
                console.log(`${nano.name} picking up?`, this.item.item);

                console.log(this.item);
                nano.brain.do("pickup", this.item.item, null, (a)=>{
                    console.log("picked up", a)
                    done(this)
                })
                
                //done(this);
            }
        }
    }],
    ["read", function(args) {
        return {args, job: null,
        working: false,
        work: function(job, nano, done) {
            if (this.working) return true;
            this.working = true;
            
            if (this.crop === null) {
                this.crop = job.crops.find(c => c.waterLevel === null);
                this.crop.waterLevel = NaN
            }
            nano.brain.do("read", this.crop.crop, "waterLevel", (out) => {
                this.crop.waterLevel = out;
                console.log(this.crop)
                done(this);
            });
        }}
    }]
]);

var stageTemplate = {
    workIndex: new Map(), 
    important: true,
    work: function(job, nano) {
        let task = this.workIndex.get(nano);
        if (task) {
            task.work(job, nano, (task)=>this.taskComplete(job, this,nano,task));
            return true;
        } else {
            task = this.tasks[0];
            if (task) {
                this.tasks.splice(0,1)
                this.workIndex.set(nano, task);
                task.work(nano, (task)=>this.taskComplete(job, this,nano, task))
                return true;
            } 
        }
    },
    taskComplete: (job, stage, nano, task)=> {
        stage.workIndex.delete(nano); //this remove the worker
        stage.validateStage(job)
    },
    passCondition(job) {
        let a = job.crops.some(c=>c.waterLevel!=null && c.waterLevel<20);
          a &&= job.waterSource!=null
        return a
    },
    validateStage(job){
        if (this.tasks.length === 0 && this.workIndex.size === 0) {
            console.log("ready to pass to next stage?")
            
              return job.stageComplete(this);
            
            }
    },
tasks: [ ]
 
}

function tasksToStages(tasks) {
let depthStack =tasks.map((a)=>{return{task: a, depth: 0, base: null}})
    let stages = []
    let resourceMap = new Map(), keyMap = new Map(), resourceKeyMap = new Map();
    while(depthStack.length > 0) {
        let currentTask = depthStack.pop();
        let base = currentTask.base;
        let task = currentTask.task;
        let depth = currentTask.depth;
        if(task.requires) {
            for(let i = 0; i < task.requires.length; i++) {
                //we need to form tasks based on arguments here?
                //let isu = nanoaiActions.get(vis[0])
                let key = generateKey(task.requires[i], keyMap); 
                
                let [action, ...argsa] = task.requires[i];
                //nanoaiActions.get(task);
                let ss = jobTasksa.get(action) 
                let broken = false;
                if (ss === undefined) {
                    broken = true;
                    console.error(`there is no job task called ${action}`)
                } 
                //ok so we will need a referense towards how we form tasks to begin with.
                let tasku = [ss(...argsa)||{}]  // cloneAction(ss, null, ...argsa);
                depthStack.push({task: tasku[0], broken, key, depth: depth + 1, base: task});
            }
        }

        let key = currentTask.key;
         
        if(base) { //if it has a base, the base will need to access it's output
            let item = resourceMap.getSet(key, {}); 
            task.item = item;
            if  (base.items) base.items.push(item);
            else base.items = [item]; 
        }
        let anya = resourceKeyMap.get(key);
        
        if (!key || !anya) {
            resourceKeyMap.set(key, true);

        if(stages[depth]) {
            stages[depth].tasks.push(task);
            if (currentTask.broken)
            stages[depth].broken = true;
        } else {
            let template = atomicClone(stageTemplate);       
            template.tasks.push(task);  
            if (currentTask.broken)
                template.broken = true;   
            stages[depth] = template
        }
        }
    }
    return stages.reverse();
    function generateKey(template, objectMap) {
        return template.map(item => {
            if (typeof item === 'object') 
                return objectMap.getSet(item, objectMap.size + 1);
            else 
                return item;        
        }).join('');
    }
}
var job = {
    work: function(nano) {
        let currentStage = this.stages[this.stage];
        currentStage.work(this, nano);
    },
    stageComplete: function(stage) {
        //if the stage is complete, move onto the next stage
        this.nextStage()
    }, 
    stageFailed: function(stage) {
        if (!stage.important) this.nextStage();
        else n0radio.jobFail(this); 
    },
    nextStage: function() {
        if (this.stage+1<this.stages.length) {
            this.stage++;
            console.log("job: moved to next stage")
        } 
        else {
            //n0radio.jobDone(this);
            console.log("job: completed")
        }
    },
    stage: 0, stages: null
}

function createJobu(objs,task, ...argsa) {
    let smile = jobTasksa.get(task);
    if (smile === undefined) {
        console.error(`"${task}" is not a job task, can't create job. returning null.`);
        return null;
    }
    let tasks = objs.map(o=>smile(o, ...argsa))
    let stages = tasksToStages(tasks);
    let jobu = atomicClone(job); //atomically clone the job template
    jobu.stages = stages; //insert the job details
return jobu;

}
let jobz = createJobu([":)", circle, "XD"], "smile", "hi");

jobz.work(n0); //wink
jobz.work(abi); //wink
jobz.work(o2); //wink
jobz.work(o2); //smile
jobz.work(abi); //smile
jobz.work(n0); //smile


//work on job search system

// for job system to form definitions that the nanos can use 
// we will need to come up with a way for tasks to describe themselves
// pretty simple given tasks are driven by keywords 

// "water", plant
// "find", "obj", "waterSource"
// "check", plant, "waterlevel" 

// we could have a lookup table for attributes for the nanos to cross referense with
// we need a way to hold personality traits, skills, opinions and relationships for our nanos
// nano.personality.skills, nano.skills, nano.brain.skills...
// nano.opinions, nano.personality.opinions, nano.brain.opinions...

// we could define skills and opinions directly on the nano themselves, or as a profile in the nano radio...
// most realistically however, it wouldn't make sense to say: n0radio.getNanoPersonality(nano), or n0radio.nanoPersonalities.get(nano)
// holding specific info about how a nano will percieve the world seems best left on the nano itself
// idea though, we don't directly define the skills and personalities?
// nano.personality.get("opinion", "object") //returns info about how the nano feels about an object...

// the more i work on this idea, it reminds me of the system i was gonna make for the rpg game. 
// a system in which skills are improved based on the underlying traits
// by throwing a rock we level up throwing, also velocity, strength, and accuracy
// https://github.com/n0coder/goblins-haven/blob/main/src/Core/Game/Combat/Ability.mjs

// we will form another implementation idea of what may be a very similar system

//pseudonano
let nanoz =  {
    mind: {
        opinion: new Map([
            ["items", new Map([["sugar", 0]])]
        ]),
        relationship: new Map([
            ["test", 0]
        ]),
        skills: new Map([
            ["harvesting", 0]
        ])
    }
}
//this code here does not quite match
//we need to get the opinion of types
// get the opinion of item sugar, get opinion of activity talking, get opinion of ... etc

// relationship does keep it's normal map style of work
// skills may stay as a normal map as well 
// normal as in regular, or plain**

/*
function calculateNanoScore(nanoai, job) {
    let score = 0;

    // For each required skill for the job, add the weighted nanoai's skill level to the score.
    for (let skill of job.skills) {
        score += nanoai.mind.getSkill(skill) * SKILL_WEIGHT;
    }

    // For each required item for the job, add the weighted nanoai's opinion of the item to the score.
    for (let item of job.items) {
        score += nanoai.mind.getOpinion("items", item) * OPINION_WEIGHT;
    }

    // Subtract the distance to the job from the score, weighted by a distance factor.
    let distance = calculateDistance(nanoai.pos, job.pos); // You would need to implement this function.
    score -= distance * DISTANCE_WEIGHT;

    // For each nano involved in the job, add the weighted nanoai's relationship with that nano to the score.
    for (let nano of job.nanos) {
        score += nanoai.mind.relationships.get(nano) * RELATIONSHIP_WEIGHT;
    }

    return score;
}
*/