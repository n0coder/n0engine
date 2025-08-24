

import { event } from "../../engine/core/Utilities/events.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { nanoaiActions } from "../nanoai/nanoaiActions.mjs";

export var jobTasksa = new Map([

    ["smile", function(item) {
        return {
            name: "smile",
            requires: [["hold", item]],
            interactions: [["smiling"]], 
            work: function(job, nano, done) {
                console.log(`${nano.name} smiling`, args, this.items);
            }
        }
    }], ["wink", function() {
        return {
            name: "wink",
            interactions: [["winking"]], 
            work: function(job, nano, done) {
                this.item.winked = "winked";
                console.log(`${nano.name} winking`, args);
                done(this);
            }
        }
    }],["hold", function(...args) {
        return {
            name: "hold",
            args, pos: [args[0].x, args[0].y], //?
            interactions: [["walking"],["pickup", "item", args[0]]], 
            work: function(job, nano, done) {
                this.item.item = this.args[1];
                nano.brain.do("pickup", this.item.item, null, (a)=>{
                    console.log("picked up", a);
                    this.args[0](this);
                })
                done(this);
            }
        }
    }],
    ["read", function(args) {
        return { args,
        work: function(job, nano, done) {
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

var microStageTemplate = {
    tasks:[],
    work(job, nano){
        if (this.tasks.length>0) {
            let task = this.tasks[0]
            let o = task.work(job, nano)
            if (!o) this.tasks.splice(0, 1)
            return true
        } 
        return false
    }
}
var microJobTemplate = {
    stages:[],
    work(job, nano) {
        
    }
}
var stageTemplate = {
    workIndex: new Map(), 
    important: true,
    work: function(job, nano) {
        let task = this.workIndex.get(nano);
        
        if (task) {
            let a = task.work(job, nano)
            if (!a) this.taskComplete(job,nano,task)
            return a;
        }   else {
            job.hireNano(nano, true)
            return false
        }
    },
    findBestTask(nano) {
        let best = bestSearch([nano], this.tasks, (n,t)=> this.scoreTask(t,n,this))
        return best?.get?.(nano)?.b;
    },
    rateStage(nano){
        let score = 0;
        for (const task of this.tasks) 
            score += this.scoreTask(task,nano)
        return score;
    },
    scoreTask(task, nano) {
        let relationshipModifier = getRelationshipModifer(this, nano)
        let score = scoreTask(task,nano, relationshipModifier)
        return score
    },
    assignTask(job, task, nano) {
        let i = this.tasks.indexOf(task);
        if (i != -1) {
            this.tasks.splice(i,1) //remove from tasks
            this.workIndex.set(nano, task);
            nano.brain.do(job);
            job.nanoAssigned(job, nano)
            return task;
        } 
    },
    taskComplete(job, nano, task) {
        this.workIndex.delete(nano); //this remove the worker
        this.validateStage(job)
    },
    validateStage(job){
        if (this.tasks.length === 0 && this.workIndex.size === 0) {
            //console.log("ready to pass to next stage?")
            
              return job.stageComplete(this);
            
            }
    },
tasks: [ ]
 
}

var job = {
    name: "job", nanos: [], keys: [],
    volunteerIndex: new Map(),
    hireNano(nano, volunteer) {
        let stage = this.stages[this.stage]
        if (!stage) return null;
        let task = stage.findBestTask(nano)
        if (volunteer) this.volunteerIndex.set(nano, 1)
        this.nanos.push(nano)
        return stage.assignTask(this, task, nano);
    },
    rateJob(nano) { //to differentiate this job on the radio
        let score = 0
        for (const stage of this.stages) {
            if (stage.tasks.length === 0) continue; 
            score += stage.rateStage(nano)
        }
        //console.log(score)
        return score
    },
    work: function(nano) {
        if (!this.nano) this.nano = nano
        //if (this.volunteerIndex.get(nano))
        //if nano is a volunteer and there is more work to do
        //(more stages, not failed)
        let vol = this.volunteerIndex.get(nano)
        let stage = this.stages[this.stage] 
        let a = stage?.work?.(this, nano);

        //console.log({stage,a, vol})
        return (a || vol) && this.stages.length > this.stage
    },
    stageComplete: function(stage) {
        //if the stage is complete, move onto the next stage
        this.nextStage();
    }, 
    stageFailed: function(stage) {
        if (!stage.important) this.nextStage();
        else this.failed(this); 
    },
    nextStage: function() {
        if (this.stage+1<this.stages.length) 
            this.stage++;
        else { this.stage++; this.done(this); }
    },
    done: event((function(job) { //custom c# action style event
        //console.log("job done")
        job.volunteerIndex.clear()
    })),
    failed: event((function(job) {
       // console.log("job failed")
        job.volunteerIndex.clear()
    })),
    nanoAssigned: event(),
    stage: 0, stages: null
}

function tasksToStages(tasks, microJob) {
let depthStack =tasks.map((a)=>{return{task: a, depth: 0, base: null}})
    let stages = []
    let resourceMap = new Map(), keyMap = new Map(), resourceKeyMap = new Map();
    while(depthStack.length > 0) {
        let currentTask = depthStack.pop();
        let base = currentTask.base;
        let task = currentTask.task;
        let depth = currentTask.depth;

        let microstage;
        if(task.requires) {
            for(let i = 0; i < task.requires.length; i++) {
                if (task.requires[i][2]) {
                    if (!microstage) {
                        //microstage = atomicClone(microStageTemplate)
                        //microstage.tasks.push(task)
                    }
                }

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
                let tasku = ss(...argsa)||{} // cloneAction(ss, null, ...argsa);
                if (microstage) { 
                    microstage.tasks.splice(0,0, tasku);
                    let item = resourceMap.getSet(key, {}); 
                    tasku.item = item;
                    if  (task.items) task.items.push(item);
                    else task.items = [item]; 
                }
                else depthStack.push({task: tasku, broken, key, depth: depth + 1, base: task});
            }
        }
        let key = currentTask.key;
        
        if(base) { //if it has a base, the base will need to access it's output
            let item = resourceMap.get(key)
            
            if (item === undefined) {
                item = {}
                resourceMap.set(key, item);
            }
            task.item = item;
            if  (base.items) base.items.push(item);
            else base.items = [item]; 
        }

        let anya = resourceKeyMap.get(key);
        
        if (!key || !anya) {
            resourceKeyMap.set(key, true);

            if (microstage)
                task = microstage
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
            if (typeof item === 'object') {
                let o = objectMap.get(item);

                if (o === undefined) {
                    o = objectMap.size+1
                    objectMap.set(item, o);
                } 

                return o
            } else 
                return item;        
        }).join('');
    }
}

export function createJobu(objs,task, ...argsa) {
    if (!Array.isArray(objs)) objs = [objs]; 
    let action = jobTasksa.get(task);
    if (action === undefined) {
        console.error(`"${task}" is not a job task, can't create job. returning null.`);
        return null;
    }
    let tasks = objs.map(o=>action(o, ...argsa))
    let stages = tasksToStages(tasks);
    //console.log(stages)
    let jobu = atomicClone(job); //atomically clone the job template
    jobu.name = task
    jobu.stages = stages; //insert the job details
return jobu;

}


function scoreTask(task, nano, relationshipModifier = 1) {
    let score = 1;
    score *= relationshipModifier;
    if (task.interactions)
        for (const [skill, type, thing] of task.interactions) {
            let skillb = nano.identity.skills?.get(skill) || 1;
            let skillo = nano.identity.opinions?.get("skills")?.get(skill) || 1;
            score *= skillo * skillb; //high skill but low interest in the skill means lower score for skill
            let typo = nano.identity.opinions?.get(type)?.get(thing.name) || 1;
            score *= typo;
        }

        /*
        if (task.items) {
        let a = task.items.some(i=>i.nano === nano)
        if (!a) return 0
        }
        */
        
    if (task.pos === undefined || !(task.pos[0] && task.pos[1])) {
        return score; //no distance related calculation needed
    } else {
        var vx = nano.x - task.pos[0];
        var vy = nano.y - task.pos[1];
        let {x,y} =worldGrid.screenToTileRaw(vx,vy);
        let vis = Math.abs((x * x) + (y * y));
        var mag = Math.sqrt(vis < .1 ? .1 : vis) * .1;
        let fin = Math.pow(score, 2.4) / (Math.pow(mag, 1.2));
        return fin;
    }
}

//this is how we can get the nanos relationship info
function getRelationshipModifer(stage, nano) {
    let relationshipModifier = 1;
    
    // TODO: console.warn("we need to set up relationships in nano identities here")
    let relationships = nano.identity.relationships;

    for (const [worker, work] of stage.workIndex) {
        let relationshipList = relationships.get(nano);
        if (relationshipList === undefined) break;
        let relationship = relationshipList.get(worker);

        //think about it like this, if the relationship key itself isn't set there isn't an object defining the relationship
        if (relationship) relationshipModifier *= relationship.value;
        //stage
    }
    return relationshipModifier;
}

export function bestSearch(as, bs, scoring, clean = false, fit) {
    let matches = new Map(); 
    //i think for us to implement the feature where we give a best rating to multiple nanos, we'd have to run our loop as many times as we have nanos
    for (let a of as) {
        //we are choosing "the best nano for the job" or "the best task for the job"
        //but we are still giving each nano a job, but not caring about which job, 
        //we are assigning multiple nanos to the same job

        //would it be better to run the uniqueification here? 
        //i'm starting to think we could just implement it in the radio, since we do a similar tech in the nano rates jobs thing
        
        let scores = bs.map(b => ({b, score:scoring(a, b)}));
        for (let {b, score} of scores) {
            if (!matches.has(a) || (fit?.(score, matches.get(a).score) ?? (score > matches.get(a).score)) ) {
                matches.set(a, { b, score });
            }
        }
    }
    if (clean)
    for (let [key, value] of matches) {
        matches.set(key, value.b)
    }
    return matches;
 }
