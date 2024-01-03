import { setActive } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { atomicClone, cloneAction } from "../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../engine/core/p5engine.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Circle } from "./farm/circle.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { n0radio } from "./radio/n0radio.mjs";

let n0 = new Nanoai("n0", 200,-256); 
let abi = new Nanoai("abi", 256,-256); 
let o2 = new Nanoai("02", 156,-256); 
let circle = new Circle(64,256, 8,8);

n0.brain.do("walk", 256, 200)

var jobTasksa = new Map([

    ["smile", function(...args) {
        return {
            name: "smile",
            args, working: false, job:null,
            requires: [["hold", args[0]]],
            interactions: [["smiling"]], 
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
            interactions: [["winking"]], 
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
            args, working: false, job:null, pos: [args[0].x, args[0].y], //?
            interactions: [["walking"],["pickup", "item", args[0]]], 
            work: function(nano, done) {
                if (this.working) return true;
                this.working = true;
                this.item.item = args[0];
                nano.brain.do("pickup", this.item.item, null, (a)=>{
                    console.log("picked up", a)
                    done(this)
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
console.log(jobz)
/*
jobz.work(n0); //wink
jobz.work(abi); //wink
jobz.work(o2); //wink
jobz.work(o2); //smile
jobz.work(abi); //smile
jobz.work(n0); //smile
*/

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

/*
function calculateNanoScore(nanoai, job) {
   let score = 0;

   // Calculate the product of the nanoai's skill level and opinion for each required skill and item.
   for (let skill of job.skills) {
       score += nanoai.mind.getSkill(skill) * nanoai.mind.getOpinion("items", skill);
   }

   // Calculate the distance to the job.
   let distance = calculateDistance(nanoai.pos, job.pos); // You would need to implement this function.

   // Divide the score by the distance, weighted by a distance factor.
   score /= Math.pow(distance, DISTANCE_FACTOR);

   return score;
}
*/

//nanos working on the same group of tasks will gain more skill faster when working with nanos that have a higher skill level
//finalScore = ((score)^2.4) / distance ^ 1.2

// forming the specifics (dec 29 2023)
let anano = {
    name: "a", 
    identity: {
    skills: new Map([
        ["harvesting", 1],
        ["reading", 1]
    ]),
    opinions: new Map([
        ["skills", new Map([
            ["harvesting", 1], //neutral opinion is .5 (a multiplier, used as a way for a high skilled nano to still avoid jobs with specific likes and dislikes) (0 is a score of 0, 1 is a full score)
        ]) ]
    ]),
},
    pos: [5, 2]
}
let bnano = {
    name: "b",
    identity: {
    skills: new Map([
        ["harvesting", 1],
        ["reading", 1]
    ]),
    opinions: new Map([
        ["skills", new Map([
            ["harvesting", 2], //neutral opinion is .5 (a multiplier, used as a way for a high skilled nano to still avoid jobs with specific likes and dislikes) (0 is a score of 0, 1 is a full score)
        ]) ]
    ]),
},
    pos: [8, 32]
}

let cnano = {
    name: "c",
    identity: {
        skills: new Map([
            ["harvesting", 1],
            ["reading", 1]
        ]),
        opinions: new Map([
            ["skills", new Map([
                ["harvesting", 2], //neutral opinion is .5 (a multiplier, used as a way for a high skilled nano to still avoid jobs with specific likes and dislikes) (0 is a score of 0, 1 is a full score)
            ]) ],
            ["items", new Map([
                ["circle", 2], //neutral opinion is .5 (a multiplier, used as a way for a high skilled nano to still avoid jobs with specific likes and dislikes) (0 is a score of 0, 1 is a full score)
            ]) ]
        ]),
    },    
    pos: [16, 16]
}

let abnano = {value: 2} //tie the relationships to the same object so they can share info and changes in relationship are read easier 
let relationships = new Map([
    [anano, new Map([[bnano, abnano]])], 
    [bnano, new Map([[anano, abnano]])]
])

let astage = {
    workers: [anano, bnano],
    tasks: [{
        interactions: [["harvesting", "items", circle]], pos: [0, 0]
    },{
        interactions: [["reading", "items", circle]], pos: [8, 0]
    }]
}

function createScore (nano, stage) { //scoring based on the tasks in a stage
    let taskmaps = new Map();
    let relationshipModifier = 1;
    
    for (const [worker, work] of stage.workIndex) {
        let relationshipList = relationships.get(nano);
        if (relationshipList === undefined) break;
        let relationship = relationshipList.get(worker);

        //think about it like this, if the relationship key itself isn't set there isn't an object defining the relationship
        if (relationship) relationshipModifier *= relationship.value;
        //stage
    }

    for (let task of stage.tasks) {
        let score = 1;
        score *= relationshipModifier;
        if (task.interactions)
        for (const [skill, type, thing] of task.interactions) {
            let skillb = nano.identity.skills?.get(skill) || 1;
            let skillo = nano.identity.opinions?.get("skills")?.get(skill) || 1;
            score *= skillo*skillb; //high skill but low interest in the skill means lower score for skill
            let typo = nano.identity.opinions?.get(type)?.get(thing.name) || 1;
            score *= typo;
        }

        if (!(task.pos[0] && task.pos[1])) {
            taskmaps.set(task, score); //no distance related calculation needed
        } else {
        var vx = nano.pos[0] - task.pos[0];
        var vy =  nano.pos[1] - task.pos[1];
        let vis =((vx * vx) + (vy * vy));
        var mag = Math.sqrt(vis < .1 ? .1 : vis)*.1;
        let fin =  Math.pow(score, 2.4) / (Math.pow(mag, 1.2) );
        taskmaps.set(task, fin);
        }
    }
return taskmaps ;
}

let stag = jobz.stages[jobz.stage];

console.log( Math.pow(1, 2.4) / (Math.pow(10, 1.2) ))
let a =createScore (anano, stag);
let b =createScore (bnano, stag);
let c = createScore (cnano, stag);
console.log ({a,b,c})

// we need a dual rating system
// have a list of nanos, have a map of tasks rated based on the nanos

// if multiple nanos are queuing for the same task we want to rate which nanos can take the task
// if one nano is queuing for multiple tasks, we want to rate the task
// basically we want to pick a nano and task, choosing what tasks to give out based on the score...
// confusing concept to me

/*
    nano a: 
        task 1: 1
        task 2: 1,
        task 3: .17...
    nano b:
        task 1: 2
        task 2: 1.5
        task 3: 53
    nano c: 
        task 1: .2
        task 2: .3
        task 3: 6  
*/

function selectTask(nano, stag) {
   let scoredTasks =createScore (nano, stag);
   let selectedTask = null, highestScore = -1;
   for (let [task, score] of scoredTasks) {
    if (score > highestScore) {
        selectedTask = task; highestScore = score;
    }
   }
   return selectedTask
}
console.log (selectTask(anano, stag));
// take the list of nanos, along with their task ratings and assign the nano a task
// a nano can not share a task with another*

//we should make a visualizer for this tech
class ScoreVisualizer {
    constructor() {
        this.nanos = [
            {
                name: "a",
                skills: new Map([
                    ["harvesting", 5]
                ]),
                pos: [4, 6]
            }, {
                name: "b",
                skills: new Map([
                    ["harvesting", 22]
                ]),
                pos: [8, 32]
            },
            {
                name: "c",
                skills: new Map([
                    ["harvesting", 129]
                ]),
                pos: [24, 16]
            }
        ]
        this.task = {
            skill: "harvesting", pos: [8, 8]
        }
        this.setActive = setActive;
        this.setActive(true)
    }
    draw() {
        for (let nano of this.nanos) {
            let nanoScore = createScore(nano, this.task);
            p.fill(nanoScore *10);
            p.ellipse(nano.pos[0]*worldGrid.gridSize, nano.pos[1]*worldGrid.gridSize, nano.skills.get("harvesting"));
            p.fill(255);
            p.text(`${nano.name}, ${nanoScore}`, (nano.pos[0]*worldGrid.gridSize)+10, (nano.pos[1]*worldGrid.gridSize)-16);
        }
    }
}
//et scoreVisualizer = new ScoreVisualizer();