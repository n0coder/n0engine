import { atomicClone, cloneAction } from "../engine/core/Utilities/ObjectUtils.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { n0radio } from "./radio/n0radio.mjs";
/*
let job = {
    name: "plant care",
    crops: [{ //we will recieve a list of objects with their water levels set null
        crop: {waterLevel: 15}, //crop obj, holds the water level but we can't read it directly 
        waterLevel: null //we should set the water level when the nano reads it
    }], 
    waterSource: null, //we will set water source in the find water task
    stages: [
        {
            name: "water crops", 
            tasks: [
                {
                    name: "check water level", action: "read", property: "waterLevel",
                    work: function(nano) {
                        for (var crop in crops) { //the job's crops array
                            //have the nanoai read the water level in the crops like this
                            nano.brain.do(this.action, crop.crop, this.property, (out)=> {
                                crop.waterLevel = out
                            })
                        }
                    }

                },
                {
                    name: "find water", action: "find", target: "water", 
                    work: function(nano) {
                        nano.brain.do(this.action, this.target, (source)=> {
                            this.waterSource = source; //set the stage's water source
                        }, ()=> {
                            //return false in work function somehow?
                        });
                    }
                }, {
                    name: "water crops"
                }
            ],
           
        }
    ]
}
let jobu = {
    name: "plant care",
    crops: [{ 
        crop: {waterLevel: 15}, 
        waterLevel: null 
    }], 
    waterSource: null, 
    stageIndex: 0,
    stages: [
        {
            name: "water crops", 
            tasks: [
                {
                    name: "check water level", action: "read", property: "waterLevel",
                    work: function(nano) {
                        // Use "this" to access the job object inside the function
                        for (var i = 0; i < this.crops.length; i++) { 
                            let crop = this.crops[i];
                            nano.brain.do(this.action, crop.crop, this.property, (out)=> {
                                crop.waterLevel = out;
                            })
                        }
                    }.bind(jobu) // Bind the function to the job object

                },
                {
                    name: "find water", action: "find", target: "water", 
                    work: function(nano) {
                        nano.brain.do(this.action, this.target, (source)=> {
                            // Use "this" to access the job object inside the function
                            this.waterSource = source;
                        }, ()=> {
                            // To return false from the work function, you could throw an error
                            throw new Error("Water source not found");
                        });
                    }.bind(jobu) // Bind the function to the job object
                },
                {
                    name: "water crops"
                }
            ],
           
        }
    ]
}
*/
let n0 = new Nanoai("n0", 200,256); 
let abi = new Nanoai("abi", 256,256); 
let o2 = new Nanoai("02", 156,256); 

n0.brain.do("walk", 256, 200)
//jobu.stages[0].tasks[2].work(nano);
/*
let job = {
    name: "water crops",
    crops: [{crop:{waterLevel:15}, waterLevel:null}], waterSource: null,
    
    work: function(nano) {
        let currentStage = this.stages[this.stage];
        currentStage.work(this, nano);
    },
    stageComplete: function(stage) {
        //if the stage is complete, move onto the next stage
        console.log("stage complete")
    }, 
    stageFailed: function(stage) {
        //if the stage failed, and it is important cancel job.
        //if the stage failed but it's not important we can still continue to the next job.
        console.log("stage complete")
    },
    stage: 0, stages: [
        {
            name: "check crop water level and find water source",
            workIndex: new Map(), 
            work: function(job, nano) {
                let task = this.workIndex.get(nano);
                if (task) {
                    if (task.done) {
                        this.workIndex.delete(nano);
                        console.log(task.done)
                        return false;
                    }

                    task.work(job, nano)
                    return true;
                } else {
                    task = this.tasks.find(t=> t.nano ===null && t.done===false);
                    if (task) {
                        task.nano = nano;
                        console.log(task.done)
                        this.workIndex.set(nano, task);
                        task.work(job, nano)
                        return true;
                    } else if (this.tasks.all(t=>t.done)) {
                      if (this.passCondition(job)) {
                        return job.stageComplete(this);
                      }  else {
                        return job.stageFailed(this);
                      }
                    }
                }
            },
            passCondition(job) {
                return job.crops.any(c=>c.waterLevel!=null && c.waterLevel<20) && job.waterSource!=null
            },
            tasks: [ 
                { //later on i'll spawn tasks dynamically based on crops in the job
                    name: "read crop water level",
                    crop: null, //insert crop here
                    work: function(job, nano) {
                        
                        if (this.working) return true;
                         this.working = true;

                        if (this.crop === null) {
                            this.crop = job.crops.find(c=>c.waterLevel === null);
                        }
                        console.log(this.crop.crop["waterLevel"])
                        //have the nanoai pretend to read the variable
                        //(this makes the nanoai walk to the crop before taking info from it)
                        nano.brain.do("read", this.crop.crop, "waterLevel", (out)=> {
                            this.crop.waterLevel = out;
                            console.log(out);
                            this.done = true; //all we did was check the water level, 
                            this.nano = null;
                        })
                    },
                    nano: null, //have nano claim this task, (so a different nano won't claim this task)
                    done: false, //this will be makred 
                    working: false
                },
                { 
                    name: "find water source",
                    work: function(job, nano) {
                        nano.brain.do("find", "obj", "waterSource", (out)=> {
                            job.waterSource = out;
                        })
                    },
                    nano: null, //have nano claim this task
                    done: false,
                    working: false
                }
            ]
        }
    ]

}
*/



/*

   I need to develop the task model
    we need to be able to communicate requirements, and set up tasks based on them
    
    the job will need to have a way to hold important pieces of data

    starting with water crops
    we insert this as a task it should produce two tasks for the same crop, 
    but the requires is placed on a stage below the task
    waterDefinition: {
        name: "water crop", args: [],
        requires: "read crop water level"  
    } 
  

    stages: [
        {
            tasks: [
                {name: "read crop water level", crop: "crop 0"},
                {name: "find water source"}
            ]
        },
        {
            tasks: [
                {name: water crop, crop: "crop 0"}
            ]
        }
    ]
    writing this out reveals we can place an item into the job's storage, and read from it
    so a task may claim items in the storage array

    so how we have a crop property in the object, we could mark a set of items in the array

    so, that's like this, where we add things to the job storage and keep track of the index at that spot when we make the tasks...

    let index = job.storage.length;
    job.storage.push("crop 0")
    task.args.push(index)
    taskRequires.args.push(index)

    this is a simplified idea of what i'm attempting

*/
let jobTasks = new Map([
    ["find", function (job, args) {
        console.log(args)
        
        //set up a slot in the job inventory and set a marker to it here
        let index = job.inventory.length
        job.inventory.push(null)
        return {
            work: function(nano, done) {
                nano.brain.do("find", kind, item, (out)=> {
                    //what to do if we find water source
                    job.inventory[index] = out; //is this right?
                    done(this); 
                })
            },
            index, 
            done: false,
            working: false
        }
    }]
]); 
let jobou = {inventory:[]}
let task = jobTasks.get("find")(jobou, "obj", "waterSource");
/*
task.work(n0, (tak)=>{
    console.log("we did the work i think")
})
*/
//this is the old version:
var findWaterTask = { 
    name: "find water source",
    work: function(job, nano, done) {
        nano.brain.do("find", "obj", "waterSource", (out)=> {
            job.waterSource = out;
            done(this); //
        })
    },
    nano: null, //have nano claim this task
    done: false,
    working: false
}
/*
let workd = findWaterTask.work(jobou, n0, (tak)=>{ //this however does not set up the job for handling the item...
    console.log("we did the work i think")
})
*/

var checkCropWaterTask = {
    name: "read crop water level",
    crop: null,
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
    }
}
//we have a current issue, initial task formation. 
//for the task needs to share info with it's requirements
//we could write a closure to set up the initial object
var jobTasksao = new Map([
    ["read", {
        args: [], job: null,
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
        }
    }]
]);

var jobTasksa = new Map([

    ["smile", function(...args) {
        return {
            name: "smile",
            args, working: false, job:null,
            requires: [["wink", args[0]]],
            work: function(nano, done) {
                if (this.working) return true;
                this.working = true;
                console.log("smiling", args, this.items);
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
                console.log("winking", args);
                done(this);
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



//small experiements

//some key generator for unique dependancies...
/*

let objectMap = new Map();
let objectCounter = 0;



let crop1 = { type: 'crop', id: 1 };
let crop2 = { type: 'crop', id: 2 };

let template1 = ["find", "object", "waterSource"];
let template2 = ["check", "waterLevel", crop1];
let template3 = ["check", "waterLevel", crop2];

console.log(generateKey(template1)); // "findobjectwaterSource"
console.log(generateKey(template2)); // "checkwaterLevel1"
console.log(generateKey(template3)); // "checkwaterLevel2"


*/




//expirement 1: task stage creation
//what that means: water crops requires water source and a crop with a specific water level condition to be watered



let joboj = {
    stages: []
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

        // since we form the basis of the job tasks below this point, 
        // we'll use this part to help describe the output
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
let crop = {waterLevel:.5}
let crop2 = {waterLevel:.5}
let twask = {
    name: "water crop", crop,
    requires: [
        ["read", crop, "waterLevel"],
        ["find", "obj", "waterSource"],
    ]
} 
let twask2 = {
    name: "water crop", crop2,
    requires: [
        ["read", crop2, "waterLevel"],
        ["find", "obj", "waterSource"],
    ]
} 
/*
let vtx = tasksToStages([twask, twask2])
console.log(vtx);
*/
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
/*
job.work(n0);
job.work(abi);
job.work(o2);
*/









//console.log(vtx);

//otem[0][0].item.name = "hi"

//console.log(otem[0][0])
//console.log(otem);

/*

there is a specific kind of problem that i have, object creation
in the pursuit of creating a job system that builds itself based on the tasks at hand, 
there is a basic issue that i do understand how to solve

turning something as simple as 

["check", "waterLevel", crop], 
into an object, which does the work
{ args: [ crop, "waterLevel", outFunction ], work: function(nano) {
    //nano will walk to the crop then:    
    this.args[2](this.args[0][this.args[1])
    return true; //mark the task completed
}}

it's easy to do this, i just did it. but, we need to form a key

*/

//we will do a sort of recursion to read requirements into a set of stages
let objv = {
    name:0
}
let obj3 = {requires: [objv],name:1}
let ogbj = {name:2}
let obj2 = {
    requires: [obj3, ogbj],name:3
}

let anobj = {
    requires: [obj2], name:4
}


let getwaterlevela = {
    name: "get water level"
}
let getwatersourcea = {
    name: "get water source"
}

let watercropa = {
    name: "water crop", args:[],
    requires: [getwaterlevela, getwatersourcea]
}
//when we spawn the requires, we should place a pointer for the water level in the args, and then a pointer for the water source too

//this should result in a copy of the original tasks, but with additional arguments

let getwaterlevelaa = {
    name: "get water level", arg: 3 //we chose slot 3 for water level
}
let getwatersourceaa = {
    name: "get water source", arg: 4 //we chose slot 4 for water source
}

let watercropaa = {
    name: "water crop", args:[3, 4], //when we spawned the requirements, we also set the args into the current object, allowing them to be used as parameters
    requires: [getwaterlevela, getwatersourcea],
    work: function(job) {
        let waterLevel = job.inventory[args[0]] //this call to args makes sure to pick out the correct index for the task
        let waterSource = job.inventory[args[1]] 

        //do the work
    }
}


//the output i want is
//stage 0: [objv]
//stage 1: [obj3, ogbj]
//stage 2: [obj2]
//stage 3: [anobj]

//in  a sense we're reading the depth of the nesting and storing the items into the approperiate slot in the array?





// what i want to do is break it down... 

// job: {stages: [{tasks:[]}]}
// stages: [{tasks:[]}]
// tasks: []

// a task has prerequisites
// task: {name:"water crop", obj: crop, requires: [ ["find", "waterSource"], ["check", "waterlevel", crop]}

// it gets split into it's stages
// in the stage they are tasks that get spawned
// the idea is prerequisites are placed on the stage before the task, as a way to queue up the requirements
// stage 0: [{name: "find waterSource"}, {name: "check crop waterlevel"}] 
// stage 1: [{name: "water crop"}]

// when this happens it will form connections, so the prerequisite stage's work can be carried into the later stages
// args: [{item: null}, {item: null}]
// stage 0: [{name: "find waterSource", index: 0}, {name: "check crop waterlevel", index: 1}]
// stage 1: [{name: "water crop", indexes: [0, 1]}]
// this will make it so that the crop has access to it's args in the expected order, so it knows what index to choose

// recap: create a job using a task as the formula to create the job, split the tasks into it's set of stages and tie them together

// initially you may think the args are not usable for more complex techs, 
// but you must remember we don't have to return a single value, 
// we can return a whole object of values

// another thing we can note
// the args hold a list of objects, so we don't need the tasks to hold indexes at all, we could just drop in the objects
// args: [{item: null}, {item: null}]
// stage 0: [{name: "find waterSource", output: args[0]}, {name: "check crop waterlevel", output: args[1]}]
// stage 1: [{name: "water crop", outputs: [args[0], args[1]]}]
// this way the outputs are directly linked to the objects in the job inventory, so the tasks don't need to know about the job itself...


// 2 days later, tasks are actions. 
// so, we don't need to specifically design the tasks to call actions, 
// we can just use them as actions, and still call others when needed


//the current issue is storage and stage creation right?


/*
ok so this is the requires syntax for my tech

requires: [["task", "arg1", "arg2"]]
this tells the task stage generator that we need to run the task before moving onto the item that requires it

so, say we want to form a syntax for creating jobs, it would be somewhat different

say we want to water multiple crops

job.create("water", [crop1, crop2, crop3])
we would need to map those crops into water tasks...

function create(task, objs, ...argsa)
let tasks = objs.map(c=> {
    let ss = jobTasksa.get(task);
    return cloneAction(ss, null, c, ...argsa);    
}
*/



let ajobou = {
    inventory: []
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
let jobz = createJobu("smile", [":)", ":o", "XD"], "hi");
console.log(jobz)
jobz.work(n0); //wink
jobz.work(n0); //wink
jobz.work(n0); //wink
jobz.work(n0); //smile
jobz.work(n0); //smile
jobz.work(n0); //smile