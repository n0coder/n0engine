
import { Circle } from "./farm/circle.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { n0radio } from "./radio/n0radio.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { createJobu, jobTasksa } from "./radio/jobSystem.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../engine/core/p5engine.mjs";
import { deltaTime } from "../engine/core/Time/n0Time.mjs";

let n0 = new Nanoai("n0", 200,256); 
let abi = new Nanoai("abi", 456,500); 



jobTasksa.set("playtogether",function(...args) { 
    let game = args[0]    
    let playerCount = game.playerCount ?? args[1];
    if (playerCount === undefined) return null; //null means disolve job (since i didn't make a null check this will cause an error)
    
    let task = {
        name: "play",
        args, working: false, job:null,
        requires: [],
        interactions: [["playing"]],
        work: function(nano, done) {
            console.log("ready to start game?", args)
        }
    } 
    for (let c = 0; c < playerCount; c++) {
        //one flaw of the job system, copies of a task need to be different from eachother to be considered different
        //(i made it this way, so that multiple tasks requiring a water source wouldn't each need their own water source)
        task.requires.push(["play", c]);
    }
    return task;
})

jobTasksa.set("play", function(...args) { //this is singleplayer play function practically
    return {
        name: "play",
        args, working: false, job:null,
        interactions: [["playing"]],
        work: function(nano, done) {
            game.play(nano);
        }
    }
})

class TicTacToe {
    constructor() {
        this.nanos = new Map(), this.timer = 0
    }
    draw() {
        if (this.nanos.size === 0) return; //end update function early
        this.timer += deltaTime;
        if (this.timer >= 10) {
            this.timer = 0;
            for (const [nanoProfile, hook] of this.nanos) {
                this.removeNano(nanoProfile)
            }
        }
    }
    addNano(nano, traphook) { 
        this.nanos.set(nano, traphook);        
    }
    removeNano(nanoProfile) {
        this.nanos.get(nanoProfile).pull("WHAT A PULL QUESTION?!");
        this.nanos.delete(nanoProfile);
    }
}

let game = new TicTacToe();
cosmicEntityManager.addEntity(game) //this allows the game to use the update loop

//this allows the nano to listen to hooks with super easy syntax

//IS THAT A SIGN I SHOULD MOVE MY ACTIONS TO CLOSURES
//(i need to initialize a traphook directly in the function, so we can guaruntee that the traphook is defined for the other object)
nanoaiActions.set("hook", { //let traphook ={pull: null};
    args: [], okok: true,
    work: function (nano) { //this is called every frame until we return false
        
        this.args[0].pull = (d) => {
            console.log("traphook was pulled", d);
            this.okok = false;
        }
        this.args[1]()
        return this.okok;
    }        
})

nanoaiActions.set("hookc", function(...args) { 
    let traphook ={pull: null};
    return {
        args: [], traphook, okok: true, 
        work: function (nano) { //this is called every frame until we return false
            if (!traphook.pull) {
                traphook.pull = (d) => {
                    console.log("traphook was pulled", d);
                    this.okok = false;
                }
                args[0](traphook)
            }
            return this.okok;
        }        
    }
})

let hook = nanoaiActions.get("hookc")
console.log(hook((traphook)=> { traphook.pull(); }).work())



n0.brain.do("walk", 356, 156);//walk to activity
n0.brain.do("hook", (traphook)=> { game.addNano(n0, traphook) });
n0.brain.do("walk", 111, 111); //walk away from activity




//n0.brain.doTask(activityTrap)
let circle4 = new Circle(7,2, 8,8);
let circle5 = new Circle(64,128, 8,8);
let circle6 = new Circle(128,128, 8,8);
//n0radio.findJob(n0); //naturally this would make them start working if a job is available, but here there's no job just yet
//n0radio.findJob(abi); 

//let job2 = createJobu([circle4, circle5, circle6], "smile", "hi"); 
//n0radio.postJob("general", job2);  //the job post will tell the ais to start working

//i'm an idiot, i posted the job to n0's personal channel
//wondering why abi wasn't joining the job lol


//ok so now the nanoais are able to search for jobs,
//i want to make it so that a nanoai doesn't constantly search jobs
//so i'll have them post a ping to the radio and it'll ping back when jobs are available

//also, i would like to put a limit on work for a nanoai, alot of work will
//make them tired, make them hungry, so we'll prioritize tasks which 
//a nano can confidently perform based on their energy level
//ab