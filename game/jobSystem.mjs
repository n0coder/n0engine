import { Nanoai } from "./nanoai/nanoai.mjs";
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

var job = {
    name: "water crops",
    crops: [{crop:{waterLevel:15}, waterLevel:null},{crop:{waterLevel:12}, waterLevel:null}], waterSource: null,
    
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
        if (this.stage+1<this.stages.length) this.nextStage();
        else n0radio.jobDone(this);
    },
    stage: 0, stages: [
        {
            name: "check crop water level and find water source",
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
                        task.work(job, nano, (task)=>this.taskComplete(job, this,nano, task))
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
                console.log(this.tasks, this.workIndex);
                if (this.tasks.length === 0 && this.workIndex.size === 0) {
                    if (this.passCondition(job)) {
                      return job.stageComplete(this);
                    }  else {
                      return job.stageFailed(this);
                    }
                    }
            },
        tasks: [
            {
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
            },
            {
                name: "read crop water level",
                crop: null,
                working: false,
                work: function(job, nano, done) {
                    if (this.working) return true;
                    this.working = true;
         
                    if (this.crop === null) {
                        this.crop = job.crops.find(c => c.waterLevel === null);
                    }
                    nano.brain.do("read", this.crop.crop, "waterLevel", (out) => {
                        this.crop.waterLevel = out;
                        console.log(this.crop)
                        done(this);
                    });
                }
            },
            { 
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
         ]
         
    }]
}

job.work(n0);
job.work(abi);
job.work(o2);

let average = function(list, predicate) {
    var total = list.reduce((sum, x)=> sum + predicate(x), 0);
    return total == 0 ? 0 : total / list.length; 
}

let averages = cources.map((course)=>{
    let students = course.students.filter(
        (x) => x.color == "red" && x.age < 20
    )
    return average(students, (x) => sum + x.gpa)
}) 

