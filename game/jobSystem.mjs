
import { Circle } from "./farm/circle.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { n0radio } from "./radio/n0radio.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { createJobu } from "./radio/jobSystem.mjs";

let n0 = new Nanoai("n0", 200,-256); 
let abi = new Nanoai("abi", 256,-256); 
let o2 = new Nanoai("02", 156,-256); 

n0.brain.do("walk", 256, 200)


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


let circle = new Circle(11,2, 8,8);
let circle2 = new Circle(64,128, 8,8);
let circle3 = new Circle(128,128, 8,8);

//use this to create the job
let jobz = createJobu([circle3, circle, circle2], "smile", "hi"); 
//drop the job directly into the radio system, globally (no key)
n0radio.postJob("jobs", jobz) 


let circle4 = new Circle(7,2, 8,8);
let circle5 = new Circle(64,128, 8,8);
let circle6 = new Circle(128,128, 8,8);

//use this to create the job
let job2 = createJobu([circle4, circle5, circle6], "smile", "hi"); 
//drop the job directly into the radio system, globally (no key)
n0radio.postJob("jobs", job2) 
//this is a scary part of development
//really testing if the job system works all together

//this will search the list of jobs this nano can see in the radio
n0radio.findJob(anano); 

