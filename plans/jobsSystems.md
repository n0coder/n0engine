# jobs
a job is a set of tasks that a nano can do together

a job could be as simple as taking care of crops on a patch of dirt, 

depending on the closeness, a job can be bundled together,
for example: the idea of checking on, seeding, watering, and harvesting crops all together could form a job 
jobs that would not be bundled with it is searching for water, crafting, delivering or protecting the farm

the jobs system is a challenging problem we're gonna solve. 

a job's task has a specific condition which must be met to be taken
for example, we need water to be nearby to queue the watering job
for a collecting water job, we need there to not be too much water in an owned barel and there to be a known source of water 
for finding a water source, we need there to not already be a water source known

this is the general idea, 

we need cotton candy, and a place to craft to craft a cotton candy item
like, making a cotton candy form of lolipop, the nano can make the stick and pop out of cotton candy then stick them together

another job, could be as simple as keeping stalls of cotton candy stocked


let job = {
    tasks: []
}











//in the radio
activeJobs = new Map(); //a set of jobs, and it's members
activeNanos = new Map(); //a set of nanos and their jobs...
getWork(nano) {
    
}


[{action: "check", args: [crop, "has", "grown"]}, {action: "check", args: [container, "freeSpace"]}, {action: "harvest", args:[crop]}, {action: "store", args: [container]}] 
this is the chain of actions of the job, if we require both has grown and free space to be true before continuing onto harvest and store, we could phrase the job like this

{
name: "cropcare",
requirements: new Map([["grown", false], ["freeSpace", false]]),
checks: [
{ name: "grown", action: "check", state:false, args: [crop, "has", "grown", onTrue: ()=>this.requirements.set("grown", true)]},
    { name: "freespace", action: "check", state:false,  args: [container, "freespace", onTrue: ()=>this.requirements.set("grown", true)]}, 
]
actions: [ //we do actions if checks pass... etc...
    { name: "harvest", action: "harvest", args:[crop]}, 
    { name: "store", action: "store", args: [container]}
]
}

["check", {
    args: [],
    before: ["follow"] //we have to arrive at the destination to check the item 
    work: function(nano) {
        let crop = args[0];
        if (args[1]==="has"&&crop.has(args[2])) {
            args[3](); //this is the idea of how to tell the job the condition passes...
        }
    }
}]
we queue this "check" by running 
nano.brain.do("check", crop, "has", "grown")

so for the jobs cycle, when the nano is looking to do their job they can call the radio
// in nano's idle function
nano.currentJob.getwork(nano)
// in  the job
job{
  getwork: function (nano) {} //queue a check action, until checks are complete, then queue a normal action. when we queue an action, we remove it from it's list, as to prevent other ais on the same job from claiming the same action... etc...
}