
import { Circle } from "./farm/circle.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { n0radio } from "./radio/n0radio.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { createJobu, jobTasksa } from "./radio/jobSystem.mjs";

let n0 = new Nanoai("n0", 200,256); 
let abi = new Nanoai("abi", 256,256); 



//i have a funny idea: nanoai tictactoe

let game = {
    players: [], playerCount: 2,
    play: function(nano) {
        console.log(`${nano.name} nano joining tictactoe`);
    }
}

/*
"smile", function(...args) {
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
    }
*/

//i overlooked the idea that some tasks may need multiple workers on the same object 
//i want the ability for a task to spawn multiple tasks based on a flag; it's a touch question though.
/*
    simple solution? a task may form a combination concept, 
    such as "play" having a "playtogether" task, 
    which will initialize multiple play tasks
    it'll need to drive through context though, 

    since we can't do this: 
    createJobu(game, "play", 2) //2 player jobu
    it's not that we can't, the 2 would be added as an arg
    i probably still should add it as an arg
    but games like tictactoe are 2 player driven, so...
*/ 

//we need another system, a way to automatically queue up nanos to continue working after job completes
//which means we need a way to prevent them from idling* in cases there they're needed to stay in the job
//*1 what i mean by idling is, choosing some other job while mid this job. 
//(i) need to check on if we're adding players to the job

//originally, i wasn't planning on forcing a keep working on current job
//we don't need it per se


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
var gamejob = createJobu(game, "playtogether")
n0radio.postJob("general", gamejob);

var gamezjob = createJobu(game, "play")
//n0radio.postJob("general", gamezjob); //we've been working on jobs with multiple tasks so much it didn't occur to me to ignore jobs with stages empty

//ok, so, jobs need another multiplier
//think scoring by job

//we have scoring based on skill, distance, relationship and opinion 
//i overlooked one idea, score the job based on the job

//that's such a blank wording. i forgot the word. 
//if a nano takes a task from one job, they should be insentivized on taking another from the same job
//a soft lock in a sense. where we're locked into a job, but not if we see a task in a different job with a higher score

//of course there is also the concept of hard locking
//this is basically, asking the nano to wait for the next task. the task will be reserved for them when they complete the current one
//but we don't want them to go off and do something else while it's moving to the next stage

//think about it like this
//a job requires two players (they will get paid to play tictactoe)

//so the first stage has the nanos walking to and sitting down at the tictactoe board
//the second stage they will then play the game until it concludes.

//or, and hear me out; we just queue them into the game activity immediately
//we can reserve the end of the job to be more of a game complete type of thing.

/*
line of thinking:
    nano creates tictactoe board
    nano creates a job to play tictactoe, (they enter it themselves)
    nano sits down, queues up the tictactoe activity, and also another action that calls the task complete when done
    other nano walks to the board sits down, also queues up the tictactoe activity, and also another action that calls the task complete when done
    
    now the tictactoe board has their interest until it releases them from the work 
    (we can use nano.brain.doNow() to make the nanos do actions mid game) (it basically takes control of the current working action etc)
    the tictactoe board does the controlling of the game; we're pretending that the nanos are doing all the work themselves
*/


let circle4 = new Circle(7,2, 8,8);
let circle5 = new Circle(64,128, 8,8);
let circle6 = new Circle(128,128, 8,8);
n0radio.findJob(n0); //naturally this would make them start working if a job is available, but here there's no job just yet
n0radio.findJob(abi); 

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