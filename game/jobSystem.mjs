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

function createJobu(task, objs, ...argsa) {
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
let jobz = createJobu("smile", [":)", circle, "XD"], "hi");
console.log(jobz)
jobz.work(n0); //wink
jobz.work(abi); //wink
jobz.work(o2); //wink
jobz.work(o2); //smile
jobz.work(abi); //smile
jobz.work(n0); //smile