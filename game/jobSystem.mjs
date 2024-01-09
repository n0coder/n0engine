
import { Circle } from "./farm/circle.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { n0radio } from "./radio/n0radio.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { createJobu } from "./radio/jobSystem.mjs";

let n0 = new Nanoai("n0", 200,-256); 
let abi = new Nanoai("abi", 256,-256); 
let circle4 = new Circle(7,2, 8,8);
let circle5 = new Circle(64,128, 8,8);
let circle6 = new Circle(128,128, 8,8);
n0radio.findJob(n0); //naturally this would make them start working if a job is available, but here there's no job just yet
n0radio.findJob(abi); 

let job2 = createJobu([circle4, circle5, circle6], "smile", "hi"); 
n0radio.postJob("personal", job2, n0);  //the job post will tell the ais to start working 
//ok so now the nanoais are able to search for jobs,
//i want to make it so that a nanoai doesn't constantly search jobs
//so i'll have them post a ping to the radio and it'll ping back when jobs are available

//also, i would like to put a limit on work for a nanoai, alot of work will
//make them tired, make them hungry, so we'll prioritize tasks which 
//a nano can confidently perform based on their energy level
//a