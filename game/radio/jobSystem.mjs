

import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
var jobTasksa = new Map([

    ["smile", function(...args) {
        return {
            name: "smile",
            args, working: false, job:null,
            requires: [["hold", args[0]]],
            interactions: [["smiling"]], 
            work: function(nano, done) {
                console.log(done)
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
            interactions: [["winking"]], 
            work: function(nano, done) {
                console.log(done)
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
            args, working: false, job:null, pos: [args[0].x, args[0].y], //?
            interactions: [["walking"],["pickup", "item", args[0]]], 
            work: function(nano, done) {
                console.log(this.args)
                if (this.working) return true;
                this.working = true;
                this.item.item = this.args[1];
                nano.brain.do("pickup", this.item.item, null, (a)=>{
                    console.log("picked up", a);
                    this.args[0](this);
                })
                
                //done(this);
            }
        }
    }],
    ["read", function(args) {
        return { args, job: null,
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
            /*
            // this part of the functionality is depreciated, obsolete
            // it handles the selection of tasks in this stage
            // the nanos can't access it by normal means
            // since we will have a whole selection of jobs in the radio, 
            // we can't--- i mean it's not like we can fire off a work function on all jobs
            // so, we have to write this functionality into the radio
            task = this.tasks[0];
            if (task) {
                this.tasks.splice(0,1)
                this.workIndex.set(nano, task);
                task.work(nano, (task)=>this.taskComplete(job, this,nano, task))
                return true;
            } 
            */
        }
    },
    taskComplete: (job, stage, nano, task)=> {
        stage.workIndex.delete(nano); //this remove the worker
        stage.validateStage(job)
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

export function createJobu(objs,task, ...argsa) {
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
    if (!(task.pos[0] && task.pos[1])) {
        return score; //no distance related calculation needed
    } else {
        var vx = nano.x - task.pos[0];
        var vy = nano.y - task.pos[1];
        let {x,y} =worldGrid.screenToGridPointRaw(vx,vy);
        let vis = Math.abs((x * x) + (y * y));
        var mag = Math.sqrt(vis < .1 ? .1 : vis) * .1;
        let fin = Math.pow(score, 2.4) / (Math.pow(mag, 1.2));
        return fin;
    }
}

//this is how we can get the nanos relationship info
function getRelationshipModifer(stage, nano) {
    let relationshipModifier = 1;
    console.warn("we need to set up relationships in nano identities here")
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

function scoreStageTask(task, nano, stage) {
    let relationshipModifier = getRelationshipModifer(stage, nano)
    let score = scoreTask(task,nano, relationshipModifier)
    return score
}
//this code takes in a nano, and a stage
//it scores the nano based on the tasks in the stage. 
export function nanoStageSearch(nano, stage) {
    let nanos = Array.isArray(nano) ? nano : [nano];
    console.warn("we need to add tech to the bestsearch, to allow it to only give out one of the many tasks")
    // in fact, this is a great example of when data structure duplication, can be a good thing
    if (stage.tasks.length > nanos.length) {
        return bestSearch(nanos, stage.tasks, (n,t)=> scoreStageTask(t,n,stage))
    } else {
        return bestSearch(stage.tasks, nanos, (t,n)=> scoreStageTask(t, n,stage))
    }
}
