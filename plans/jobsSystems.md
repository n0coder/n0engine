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

I was working on fortnite, got 145 levels in 9 days when i figured out that i can use my nanoais actions style to simplify job creation
i wanted the simplicity of marking a system and having it come up with possible jobs

click crop, click water
nanoai checks for crop water level, and searches for a water source then the nano can water the crop

n0radio.createJob(crop, "water") //creates a job to water this crop
n0radio.createJob([crop1, crop2], "water") //creates a job to water both crops

simple work; to create a job object

we can then work from there to build on that system; daily jobs, reoccuring jobs... etc

this would be a simple way to work would it not?


in reality i will need to implement a custom requirements system
to say, if a task requires another task, that task will have to be a secondary stage

what that means is

water crops requires check water level
so water crops will need the check water level stage before it

stage 1: check water level
stage 2: water crops

select 5 crops to water, we think in this order
i need to water crops, which means we need to check water level
stage 1: [check crop 1 water, check crop 2 water, check crop 3 water, check crop 4 water, check crop 5 water, find water source], 
stage 2: [water crop 1,water crop 2,water crop 3,water crop 4,water crop 5]

it should be able to evaluate the requirements and form the whole job based on context












i am planning a system for creating tasks, something simple that can help form jobs easily

say the task is "water", it needs to spawn a prerequisite stage and insert itself into the 2nd stage
the 1st stage will hold tasks such as find obj waterSource - to find the water source
and also to check crop water level.

we can imagine a createJob function has simple parameters, 
n0radio.createJob("water", crops)
which is responsible for forming each stage, we will work in a while loop until all stages of the job are found

so we would need to be able to create a stage, for the prerequisites, then we check those prerequisites prerequisits.
as we work, we will need to mark each task with it's inventory indexes
if a job needs to hold a referense in two stages, we hold it in the job's inventory and a marker in the task and it's prerequisite that it needs...


let me explain what i mean
```javascript
job: {
    inventory: ["waterSource", "crop1 water level", "crop2 water level"],
    stages: [
        { name: "check and find"
            tasks:  [
                {    name: "find", kind: "obj", item:"waterSource", index: 0, work(nano,done) }
                    //find water source and set it's variable in the inventory}     } //the find job marks inventory index 0 for it is how we will get the water source reference
                {    name: "check", obj:"crop1", property: "waterlevel", index: 1, work(nano, done) } 
                    // check crop 1's water level, set it's inventory spot to the value of the crops water level }     }
                    ]
        }, 
        {
            name: "water",
            tasks:  [
                { name: "water", obj: "crop1" }
                    ]
        }
    ]
}
```
i think by this point you will understand what i'm attempting




i'm trying to build a system for jobs in my game. as i work to build on the system, more things important keep showing up.

initially i thought maybe i would just build a job system to model the jobs; and i did
i found that i would need a system which forms jobs based on tasks, and their requirements

say i want to water crops, we need to spawn a stage before the water crops stage to handle the requirements

so
let task = {
    name: "water crop", requires: [["find", "waterSource"], ["check", "waterLevel"]]
}
this isnt the idea yet... when we spawn the find water source requirement task, we have to mark the water source's spot in the job's inventory in the current task, so we can use the water source in the task... 

the goal is to ultimately figure out if we can water the crops in the first stage, then in the second we water it...

so, maybe the requires should be set up to communicate with the task and it's requirements (the required values?)

so say we want to check water level to see if it's above a threshold, maybe the requirement's 3rd parameter is the threshold?

["check", "waterLevel", 0]... this requires some work on figuring out what i want to do for this
maybe a condition check as the parameter for the task's requirement, that would make sense would it not




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

the job system wouldn't be complete without the concept of job discovery
say we have a job that works with cotton candy, we need to relay that information to the job system 
we need to be able to tell a nano what tasks it can perform 
since the job does not handle the life cycle of it's stages, 
the stages need to be able to describe what kinds of actions it needs performed

this is so we can cross referense an ai to be able to form a score based on what job/task the nano performs
what we're doing is trying to advertise the tasks of the job


things to keep in mind when selecting a job:
1. nano's preferenses
2. nano's skills
3. the distance from the task site
4. nano's relationship to others working on the same stage

preferences:
a nano may like an activity, or they may like a certain item, or work alone

skills:
a nano may work with farming jobs alot, and so their skills increase as they work
they are more likely to pick the job that fits their skills best

distance:
the nano with the lowest distance is scored higher

relationship:
a nano may want to work with friends, a nano may hate another nano
a nano will not want to pick a job that has a nano they have a hateful relationship with

