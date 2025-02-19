import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { clamp, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { n0radio } from "../radio/n0radio.mjs";
import { p2 } from "../visualizers/lineVisualizer.mjs";
import { Mommyai, Puff } from "./mommyai.mjs";
import { findPath } from "./research/n0Pathfinder.mjs";

export const nanoaiActions = new Map([
    ["walk", function(...args) { return {
        args,
        path: null,
        work: function (nano) {
            return walkObj(this, nano);
        },
        
    }}],
    ["walkRelative", function(...args) { 
        
        return {
        args,
        work: function (nano) {
            if (this.x === undefined || this.y === undefined) {
                this.x = nano.x+args[0],
                this.y = nano.y+args[1]
            }

            return walk(nano,this.x,this.y, 0.5 );
            //nano.brain.doAfter(this, "walk", nano.x+args.)
        },
        
    }}],
    ["look", function(...args) { return {
        args, directions: {"down": [0, 1], "up": [0, -1], "left": [-1,0], "right": [1, 0]},
        path: null,
        work: function (nano) {
            if (typeof this.args[0] === 'number') { 
                nano.vx = this.args[0];
                nano.vy = this.args[1];
             } else if (typeof this.args[0] === 'string') { 
               [nano.vx, nano.vy] = this.directions[this.args];
             }
            return false;
        },
        
    }}],
    ["eat",function(...args) { return  {
        args,
        work: function(nano) { 
            if (nano.inventory.has(this.args[0])) {
                if (this.args[0].eaten) console.log("eatened alreaddy")
                this.args[0]?.onEat?.(nano)
                nano.sugar += this.args[0].sugar      
                nano.inventory.remove(this.args[0]);  
            }
            
            return false;
        },
        
   }}],
    ["read",function(...args) { return  {
        args,
        work: function(nano) { 
            console.log(this.args)
            let a = this.args[0][this.args[1]];
            this.args[2](a);
            return false;
        },
        
   }}],
    ["hungry",function(...args) { return  {
        args, target: null, path: null,
        work: function(nano) { //one issue later on could be to prioritize getting out of the bitter biome over finding food (while regular nano)
            if (nano.sugar <= 0) { //debt is hunger
                
                //let food = nano.inventory.hasItem("food", "kind") //food tag, 
                let food = nano.inventory.hasItem("food", "kind");
                if (food) {
                    nano.brain.doNow("eat", food)
                    return true; //exit here, but don't remove this action
                }
                
                //we need to model the radio system
                
                food = n0radio.findClaimItem("food", "kind",nano) //n0radio.channel.items.hasItem("food", "kind")
                if (food) {
                    nano.brain.doNow("pickup", food) //interrupt the current cycle to walk to and pick up food
                    return true; //exit here, but don't remove this action
                }
                //do we have food? (does radio friend channel have any food on offer?) //friendly hungry
                //check inventory for food, eat food if found
                //check radio for food, get food location, take food and eat it (friendly means we have the keys)
                //check radio for lover, ping lover to ask if they have enough energy for a kiss for backup energy
                //set up a ping for notifying the radio that it should be searching for food 
                //(to tell all friends who have the energy to search, to find food)
                
                //no (or bitter nano)? look for food elsewhere //unfriendly hungry
                
            } else {
                console.log("no longer hungry?!", nano)
                return false; //no longer hungry
            }

            return true;
        }, 
        
   }}],
    ["debug",function(...args) { return  {
        args,
        work: function (nano) {
            console.log(this);
            return false
        },      
          
   }}],
   ["debugLine",function(x,y, time= 1, thickness= 2, color=[255,255,255]) { return  {
    x,y, time, t:0,
    work: function (nano) {
        this.t+=deltaTime;
        p.push();
        p.strokeWeight(thickness);
        if (color) p.stroke(color);
        p.line(nano.visualX, nano.visualY, x,y);
        p.pop();
        return this.t <= this.time
    },        
    }}],
   ["ping", function(callback) {
    return {
        work: function(nano) {
            return callback?.(nano, this);
        }
    };
 }],
    ["follow",function(...args) { return  {
        args, name: "follow",
        targetX: null, targetY: null, path: null,
        work: function(nano) { 
            if (this.args[0].x !== undefined && this.args[0].y !== undefined) 
            return followObj(this, nano)
        },
        //clone before setting the variable
        
   }}],
    
    ["pickup", function(...args) { return {
        args, name: "pickup",
        before: ["follow"],
        work: function (nano) {
            this.args[2]?.(this.args[0])
            return !nano.inventory.add(this.args[0], this.args[1])
        },
        
   }}],
    ["equip", function(...args) { return {
        args,
        work: function (nano) {
            return !nano.inventory.equip(this.args[0])
        },
        
   }}],
    ["harvest",function(...args) { return  {
        args,
        before: ["follow"],
        work: function (nano) {
            if (this.args[0] && this.args[0].harvest)
                return this.args[0].harvest(nano);
            return false
        },
        
   }}],
    ["use",function(obj, ...args) { return  {
        args,
        before: ["follow"],
        work: function (nano) {
            if (obj.use) {
                var action = obj.use(nano, ...args);
                return action
            }
        },
        
   }}],
    ["plant",function(...args) { return  {
        args, hooked: false,
        work: function (nano) {
            if (!this.hooked) {
                nano.brain.doNow("follow", args[0])
                this.hooked=true;
                return true;
            }
            var plant = this.args[0].plant;
            if (plant) {
                var wait = this.args[0].plant(nano, this.args[1]);
                return wait
            }
            return true
        },
        
   }}],
   ["hook", function(...args) { 
    let traphook = {pull: null};
    let trap = {
        args, okok: true, 
        work: function (nano) { //this is called every frame until we return false
            
            if (!traphook.pull) {
                traphook.pull = (d) => {
                    this.okok = false;
                    args[1]?.(d)
                }
                args[0](traphook, this);
            }
            return this.okok;
        }        
    }
    //since this task doesn't control itself, we have to pass the task with the hook
    traphook.trap = trap;
    return trap
}],["pull", function(hook) { 
    return {
        work: function (nano) {
            hook.pull("hi");
        }        
    }
}],
    ["dance", function(...args) { 
        return {
            args, work: function (nano) {
                let brain = nano.brain;
                let t = .1;

                brain.doAfter(this, "hook", (hook) => { hook.pull("XD") }, () => console.log("hook pulled XD"))

                brain.doAfter(this, "hook", (hook, marker) => {
                    brain.doBefore(marker, "walkRelative", -1, 0) 
                    brain.doBefore(marker, "waitTime",t) 
                    brain.doBefore(marker, "walkRelative", 2, 0) 
                    brain.doBefore(marker, "waitTime",t) 
                    brain.doBefore(marker, "walkRelative", -1, 0) 
                    brain.doBefore(marker, "walkRelative", -1, 0)
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "walkRelative", 2, 0)
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "walkRelative", -1, 0)
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "walkRelative", 0, .51)
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "walkRelative", 0, - .51)
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "walkRelative", 0,  .51)
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "walkRelative", 0, - .51)
                    brain.doBefore(marker, "pull", hook)
                }) 
                

                
            }
        }
    }], 
    ["dance2", function(...args) { 
        return {
            args, work: function (nano) {
                let brain = nano.brain;
                let t = .1;

                brain.doAfter(this, "hook", (hook) => { hook.pull("XD") }, () => console.log("hook pulled XD"))

                brain.doAfter(this, "hook", (hook, marker) => {
                    brain.doBefore(marker, "ping", (nano)=> { nano.vy = 0; nano.vx = -1 });                    
                    brain.doBefore(marker, "waitTime",t*2) 
                    brain.doBefore(marker, "ping", (nano)=> { nano.vx = 1 });
                    brain.doBefore(marker, "waitTime",t) 
                    brain.doBefore(marker, "ping", (nano)=> { nano.vx = -1 }); 
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", (nano)=> { nano.vx = 1 });
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", (nano)=> { nano.vx = -1 }); 
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", (nano)=> { nano.vx = 0; nano.vy = 1 });
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", (nano)=> { nano.vy = -1 });
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", (nano)=> { nano.vy = 1 });
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", (nano)=> { nano.vy = -1 });
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", (nano)=> { nano.vy = 1 });
                    brain.doBefore(marker, "waitTime",t)
                    brain.doBefore(marker, "ping", () => {hook.pull("hi");})
                }) 
                

                
            }
        }
    }],["spin", function(times=1, speed =4, walkspeed= 0) { 
        return {
            time: (3.1415926*2)*times, t:0, work: function (nano) {
                this.t+=deltaTime*speed;
                nano.vx = Math.sin(this.t)
                nano.vy = Math.cos(this.t)
                nano.x+=nano.vx*walkspeed;
                nano.y+=nano.vy*walkspeed;
                return this.t <= this.time; //
            }
        }
    }],
    ["waitTime", function(time) { 
        return {
            time, t:0, work: function (nano) {
                this.t+=deltaTime;
                return this.t <= this.time; //
            }
        }
    }],
    ["wait", function(when) { 
        return {
            work: function (nano) {
                return when?.(nano, this);
            }
        }
    }],
    ["transform",function(...args) { return  {
        args,
        work: function (nano) {

            var nano2 = nano.inventory.hasItem("Nanoai")
            if (nano2) {
                var cloudium = nano.inventory.hasItems("Circle", 2)
                if (cloudium) {
                    var cloudium2 = nano2.inventory.hasItems("Circle", 2)
                    if (cloudium2) {
                        this.puff = new Puff(nano.x, nano.y, 10, 60, 16, () => {
                            nano.mommy = new Mommyai(nano.name, nano.x, nano.y);
                            nano.mommy.nano = nano;
                            nano.mommy.nano2 = nano2;
                            nano.inventory.transfer(nano.mommy.inventory)
                            nano2.inventory.transfer(nano.mommy.inventory)
                            nano.mommy.inventory.remove(nano)
                            nano.mommy.inventory.remove(nano2)
                            nano.setActive(false)
                            nano2.setActive(false)
                            nano.mommy.inventory.refresh();
                        })
                    }
                    else console.log("held nanoai is not holding cloudium")
                } else console.log("not holding cloudium")
            } else console.log("not holding nanoai")
            return false
        },
        
    }}]
])


export function walkObj(obj, nano) {

    
    let stopped = (nano) => {
        nano.vx = obj.args[2] ?? 0;
        nano.vy = obj.args[3] ?? 0;
    }
    let foundPath = (nano, obj) => {
        findPath(nano.x, nano.y, obj.args[0], obj.args[1], 32, 7, (path) => {
        obj.path = path;
        });
    }
    return processWalk(nano, obj, obj.args[0], obj.args[1], stopped,  foundPath, .75);
}
p.noLoopLoud = function() {
    p.noLoop(); console.error("the loop was paused");
}

function processWalk(nano, obj, ox, oy, stopDirection, findaPath, magn = .5) {
    p.ellipse(ox*worldGrid.gridSize, oy*worldGrid.gridSize, 8)

    var vx = ox - nano.x;
    var vy = oy - nano.y;    
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    
    if (mag <= 1.25) {
        stopDirection (nano);
        return false;
    }
    
    if (!obj.path|| obj.path.points.length ==0) { 
        findaPath(nano, obj)
    } 
    else if (obj.path.points.length >0) {
        var ped = obj.path.currentPointDistance(nano.x, nano.y);
        if (ped < magn) {
            if (!obj.path.isFinalPoint) 
                obj.path.next();            
            else 
                obj.path = null;
        } else {    
            
            return walk(nano, obj.path.currentPoint.x, obj.path.currentPoint.y, .1)  
        }      
    }
    return true;
}

export function followObj (obj, nano) {
    
    let stopped = (nano) => {
        nano.vx = 0;
        nano.vy = 0;
    }
    let foundPath = (nano, obj) => {
        findPath(nano.x, nano.y, obj.args[0].x, obj.args[0].y, 32, 4, (path) => {
            obj.targetX = obj.args[0].x
            obj.targetY = obj.args[0].y
            obj.path = path;
        })        
    }
    return processWalk(nano, obj,obj.args[0].x, obj.args[0].y, stopped,  foundPath);

}
//console.log(Math.sqrt((1 * 1) + (1 * 1)))
export function walk(nano, x, y, magn = 1) {
    var vx = x - nano.x;
    var vy = y - nano.y;
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    //p.noLoopLoud();
    if (mag < magn) //if we already at point move next lol
        return false;
    vx /= mag;
    vy /= mag;
    if (mag >= magn) {
        nano.vx = vx;
        nano.vy = vy;
    } else {
        nano.vx = 0;
        nano.vy = 0;
    }

    let tile = worldGrid.getTile(nano.x, nano.y);
    let speed = (tile && tile.pathDifficulty) || 7
    var sod = inverseLerp(8,4, speed)
    sod = clamp(0, 1, sod);
    sod = lerp(.5, 1, sod);
    
    p.text(`${sod}`, nano.visualX, nano.visualY);
    nano.x += vx * deltaTime * nano.speed*sod;
    nano.y += vy * deltaTime * nano.speed*sod;

    return mag >= magn;
}

export function normalize(vx, vy) {
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    if (mag === 0) {
        vx /= mag;
        vy /= mag;
    }
    return {vx, vy, mag};

}