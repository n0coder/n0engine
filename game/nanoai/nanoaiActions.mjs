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
   }}],["ping", function(callback) {
    return {
        args: [callback],
        work: function(nano) {
            this.args[0]();
            return false;
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
            console.log(args);
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
        args,
        before: ["follow"],
        work: function (nano) {
            var plant = this.args[0].plant;
            if (plant) {
                var wait = plant(nano, this.args[1]);
                return wait
            }
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
                console.log(args);
                args[0](this, traphook)
            }
            return this.okok;
        }        
    }
    //since this task doesn't control itself, we have to pass the task with the hook
    traphook.trap = trap;
    return trap
}],
    ["dance", function(...args) { 
        return {
            args, work: function (nano) {
                let brain = nano.brain;
                let t = .1;


                //apparently; this tech only works using the hook...
                //now i'm extra glad i made it...

                // doAfter has a possible issue, (it posts in reverse order, stack style)
                // but one thing we should be doing is returning the task from the dos
                brain.doAfter(this, "hook", (marker, hook) => {
                    brain.doBefore(marker, "walkRelative", -2, 0) //this do syntax is very expecting is it not...
                    brain.doBefore(marker, "wait",t) //what i mean to say is it expects the first real arg to be the string task name
                    brain.doBefore(marker, "walkRelative", 4, 0) //what if i insert an object directly
                    brain.doBefore(marker, "wait",t) //we could shift the doTask code directly into the function
                    brain.doBefore(marker, "walkRelative", -2, 0) //but it is a good question of how we can do that
                    brain.doBefore(marker, "walkRelative", -2, 0)
                    brain.doBefore(marker, "wait",t)
                    brain.doBefore(marker, "walkRelative", 4, 0)
                    brain.doBefore(marker, "wait",t)
                    brain.doBefore(marker, "walkRelative", -2, 0)
                    brain.doBefore(marker, "wait",t)
                    brain.doBefore(marker, "walkRelative", 0, 1)
                    brain.doBefore(marker, "wait",t)
                    brain.doBefore(marker, "walkRelative", 0, -1)
                    brain.doBefore(marker, "wait",t)
                    brain.doBefore(marker, "walkRelative", 0, 1)
                    brain.doBefore(marker, "wait",t)
                    brain.doBefore(marker, "walkRelative", 0, -1)
                    brain.doBefore(marker, "ping", () => {hook.pull("hi");})
                }) 
                

                
            }
        }
    }],
    ["wait", function(time) { 
        return {
            time, t:0, work: function (nano) {
                this.t+=deltaTime;
                return this.t <= this.time; //
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
    var vx = obj.args[0] - nano.x;
    var vy = obj.args[1] - nano.y;
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    if (mag <= worldGrid.gridSize * 1) {
        nano.vx = obj.args[2] ?? 0;
        nano.vy = obj.args[3] ?? 0;
        return false;
    }

    if (!obj.path || obj.path.points.length ==0)
        findPath(nano.x, nano.y, obj.args[0], obj.args[1], worldGrid.gridSize * 4, 7, (path) => {
            obj.path = path;
        });
    if (obj.path && obj.path.points.length >0) {
        p.fill(255);
        //p.image(obj.path.graphics, nano.x, nano.y)
        if (!obj.path.currentPoint) console.error("the point went null?", obj.path, mag);
        //p2.variableLine(nano.x, nano.y, obj.path.currentPoint.x, obj.path.currentPoint.y, 8, 2)
        let ped = obj.path.currentPointDistance(nano.x, nano.y);
        if (ped < worldGrid.gridSize / 2) {
            if (!obj.path.isFinalPoint) {
                obj.path.next();
            }
            else obj.path = null;
        }
        let speed = nano.speed * inverseLerp(8, 0, /* the difficulty value we calculated for this spot... */ ) 
        if (obj.path)
            walk(nano, obj.path.currentPoint.x, obj.path.currentPoint.y, 2, speed)
    }
    return true;

}

export function followObj (obj, nano) {
    var vx = obj.args[0].x - nano.x;
    var vy = obj.args[0].y - nano.y;
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    if (mag <= worldGrid.gridSize*1.5) {
        nano.vx = 0;
        nano.vy = 0;
        return false;
    }

    var vtx = obj.args[0].x - obj.targetX;
    var vty = obj.args[0].y - obj.targetY;
    var tmag = Math.sqrt((vtx * vtx) + (vty * vty))
    
    if (!obj.path|| obj.path.points.length ==0) //if target moves a whole tile we retarget the new tile lol 
        findPath(nano.x, nano.y, obj.args[0].x, obj.args[0].y, 32, 4, (path) => {
            obj.targetX = obj.args[0].x
            obj.targetY = obj.args[0].y
            obj.path = path;
        });
    else if (obj.path.points.length >0) {
        p.fill(255);

        // p.image(obj.path.graphics, nano.x, nano.y)
        //p2.variableLine(nano.x, nano.y, obj.path.currentPoint.x, obj.path.currentPoint.y, 8, 2)
       
        let ped = obj.path.currentPointDistance(nano.x, nano.y);
        if (ped < worldGrid.gridSize / 2) {
            if (!obj.path.isFinalPoint) {
                obj.path.next();
            }
            else {
                obj.path = null;
            }
        }

        if (obj.path)
            walk(nano, obj.path.currentPoint.x, obj.path.currentPoint.y, 2)
    }
    return true
}
export function normalize(vx, vy) {
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    if (mag === 0) {
        vx /= mag;
        vy /= mag;
    }
    return {vx, vy, mag};

}
export function walk(nano, x, y, magn = 1) {
    var vx = x - nano.x;
    var vy = y - nano.y;
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    if (mag < magn) //if we already at point move next lol
        return false;
    vx /= mag;
    vy /= mag;
    if (mag > magn) {
        nano.vx = vx;
        nano.vy = vy;
    } else {
        nano.vx = 0;
        nano.vy = 0;
    }
    var pos = worldGrid.screenToGridPoint(nano.x, nano.y)
    let tile = worldGrid.getTile(pos.x, pos.y);
    let speed = (tile && tile.pathDifficulty) || 7
    var sod = inverseLerp(8,4, speed)
    sod = clamp(0, 1, sod);
    sod = lerp(.5, 1, sod);
    p.text(`${sod}`, nano.x, nano.y);
    nano.x += vx * deltaTime * nano.speed*sod;
    nano.y += vy * deltaTime * nano.speed*sod;

    return mag > magn;
}