
import { Circle } from "./farm/circle.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { n0radio } from "./radio/n0radio.mjs";
import { nanoaiActions, normalize } from "./nanoai/nanoaiActions.mjs";
import { createJobu, jobTasksa } from "./radio/jobSystem.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../engine/core/p5engine.mjs";
import { deltaTime } from "../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../engine/core/Utilities/ObjectUtils.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";

let n0 = new Nanoai("n0", 200,256); 
let abi = new Nanoai("abi", 456,500); 
globalThis.n0 = n0;
globalThis.abi = abi;


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

//this was an interesting test i don't like it
//will have to explore more styles of solving this problem

let ticStyle = {
    cellSize: 32,
    drawBoard(xa=128, ya=128, board) {
        p.fill(255)
        let g = worldGrid.screenToGridPoint(xa, ya) 

        for (let u = 0; u < 9; u++) {
            let i = Math.floor(u / 3), o = u % 3;
            this.drawTile(g.x+i, g.y+o, board[u]);
        }
      },
      drawTile(gx, gy, tile) {
        //if (!tile?.pick) p.fill(188); else p.fill(255);
        var {x,y,w,h} = worldGrid.gridBoundsScreenSpace(gx-1, gy-1, 1,1);
        //p.rect(x, y,w,h)
        p.push();
        if (tile?.pick) {
            if (tile.pick == "n0")
            p.fill(188, 188, 255)
            if (tile.pick == "abi") //hard coded test values
            p.fill(255, 188, 188)
            p.rect(x+2, y+2,w-4,h-4)
        }
        p.pop();
      },
      drawX(x, y, size) {
        let padding = size / 4;
        p.stroke(0);
        p.line(x + padding, y + padding, x + size - padding, y + size - padding);
        p.line(x + padding, y + size - padding, x + size - padding, y + padding);
      }, drawO(x, y, size) {
        let padding = size / 4;
        p.noFill();
        p.stroke(0);
        p.ellipse(x + size / 2, y + size / 2, size - padding);
      }
}

class TicTacToe {
    constructor() {
        this.nanos = new Map(), this.timer = 0, this.thinkTime = 1;
        this.players, this.index = 0;
        this.state = "start";
        this.x = 111, this.y = 111;
        this.pieceTemplate = {use(pick, placed){placed(); this.pick=pick;}}
        this.board= [null,null,null,null,null,null,null,null,null].map((n,i)=>{
            let x = Math.floor(i / 3), y = i % 3;
            x *= worldGrid.gridSize, y *= worldGrid.gridSize;

            return{
                x: x+this.x, y:y+this.y,
            use(nano, pick, placed) {
                placed(); 
                this.pick=pick;
            }
            }
        })
        this.openSlots= [0,1,2,3,4,5,6,7,8],
        this.stateMachine = {
            start: () => {
                this.players = Array.from(this.nanos.keys())
                this.index = 0,
                this.state = "reposition";

               
            },
            reposition: () => {
                let a = this.players[0], b = this.players[1];
                let g = worldGrid.screenToGridPoint(this.x,this.y) 
                var {vx, vy, mag} = normalize(this.x-x, this.y-y)

                let count = 0;
                let ping = ()=>{
                    count++;
                    if (count >= 2) {
                        this.state = "thinking";
                        count = 0;
                    }
                }

                var {x,y,w,h} = worldGrid.gridBoundsScreenSpace(g.x+4, g.y-1, 1,1);
                var trap = this.nanos.get(a).trap
                a.brain.doBefore(trap,"walk", x, y+5)
                a.brain.doBefore(trap,"look", "down")
                a.brain.doBefore(trap, "ping", ping)
                var {x,y,w,h} = worldGrid.gridBoundsScreenSpace(g.x+1, g.y-1, 1,1);
                var trap = this.nanos.get(b).trap
                b.brain.doBefore(trap,"walk", x, y+5)
                b.brain.doBefore(trap,"look", "down")
                b.brain.doBefore(trap, "ping", ping)
                this.state = "moving"
            },
            moving: () => {

            },
            thinking: () => {
                this.timer += deltaTime; //my 
                if (this.timer >= this.thinkTime) {
                    this.state = "place"
                    this.timer = 0;
                    this.thinkTime = Math.random() * 1
                }
            }, 
            place: () => {
                if (this.openSlots.length === 0 ) {
                    this.state = "over"
                    return;
                }

                this.placePiece(()=>{
                    //console.log("okok")
                    this.state = "reposition"
                })    
                this.state = "placing"         
            },
            over: () => {
                console.log(this.board);
                for (const [nano, hook] of this.nanos) {
                    this.removeNano(nano);
                }
            },
            doState: ()=> {
                this.stateMachine[this.state]?.();
            }
        }
    }
    draw() {

        ticStyle.drawBoard(128,128, this.board);
        if (this.nanos.size <2) return;



        this.stateMachine.doState()
    }
    placePiece(placed) {
        let ai =  this.players[this.index];
        let name = this.players[this.index].name;
        let slotIndex = Math.floor(Math.random() * this.openSlots.length);
        let slot = this.openSlots.splice(slotIndex, 1);
        ai.brain.doNow("use", this.board[slot], name, placed);
        this.index = (this.index+1)%2        
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
globalThis.game = game;
cosmicEntityManager.addEntity(game) //this allows the game to use the update loop

n0.brain.do("hook", (hook) => { game.addNano(n0, hook) }); //they get locked into the game until it pulls the hook

n0.brain.do("walk", 151, 111); //walk away from activity
//n0.brain.do("dance", 151, 111);

n0.brain.doTask({ //the character will walk, dance then say hi
    work(nano) {
        console.log("hi");
    }
})

abi.brain.do("hook", (hook) => { game.addNano(abi, hook) }); //they get locked into the game until it pulls the hook
abi.brain.do("walk", 151, 131); //walk away from activity
//abi.brain.do("dance", 151, 131);



/*
//n0.brain.doTask(activityTrap)
let circle4 = new Circle(7,2, 8,8);
let circle5 = new Circle(64,128, 8,8);
let circle6 = new Circle(128,128, 8,8);
*/
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