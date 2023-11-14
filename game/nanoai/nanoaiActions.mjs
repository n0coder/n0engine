import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { clamp, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { p2 } from "../visualizers/lineVisualizer.mjs";
import { Mommyai, Puff } from "./mommyai.mjs";
import { findPath } from "./research/n0Pathfinder.mjs";

export const nanoaiActions = new Map([
    ["walk", {
        args: [],
        path: null,
        work: function (nano) {
            return walkObj(this, nano);
        },
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["hungry", {
        args: [], target: null, path: null,
        work: function(nano) { //one issue later on could be to prioritize getting out of the bitter biome over finding food (while regular nano)
            if (nano.sugar < 0) { //debt is hunger

                let food = nano.inventory.hasItem("food") //food tag
                //do we have food? (does radio friend channel have any food on offer?) //friendly hungry
                //check inventory for food, eat food if found
                //check radio for food, get food location, take food and eat it (friendly means we have the keys)
                //check radio for lover, ping lover to ask if they have enough energy for a kiss for backup energy
                //set up a ping for notifying the radio that it should be searching for food 
                //(to tell all friends who have the energy to search, to find food)
                
                //no (or bitter nano)? look for food elsewhere //unfriendly hungry
                
            }
        }, 
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["debug", {
        args: [],
        work: function (nano) {
            console.log(this);
            return false
        },
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["follow", {
        args: [],
        targetX: null, targetY: null, path: null,
        work: function(nano) { 
            return followObj(this, nano)
        },
        //clone before setting the variable
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    
    ["pickup", {
        args: [],
        before: ["follow"],
        work: function (nano) {
            return !nano.inventory.add(this.args[0], this.args[1])
        },
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["equip", {
        args: [],
        work: function (nano) {
            return !nano.inventory.equip(this.args[0])
        },
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["harvest", {
        args: [],
        before: ["follow"],
        work: function (nano) {
            if (this.args[0] && this.args[0].harvest)
                return this.args[0].harvest(nano);
            return false
        },
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["use", {
        args: [],
        work: function (nano) {
            if (this.args[0].use) {
                var action = this.args[0].use(nano);
                return action
            }
        },
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["plant", {
        args: [],
        before: ["follow"],
        work: function (nano) {
            var plant = this.args[0].plant;
            if (plant) {
                var wait = plant(nano, this.args[1]);
                return wait
            }
        },
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }],
    ["transform", {
        args: [],
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
        clone: function (...args) {
            return handleClone(this, ...args)
        }
    }]
])

export function handleClone(obj, ...args) {
    //clone the object deeply
    let clone = atomicClone(obj);
    //drop in args
    clone.args = [...args];
    //collect prerequisite actions
    let action = [];
    if (clone.before != undefined) {
        for (let i = 0; i < clone.before.length; i++) {
            var beforeAction = handleClone(nanoaiActions.get(clone.before[i]), ...args);
            action.push(...beforeAction)
        }
    };
    //push the current clone afterwards
    action.push(clone)
    //send in prerequisite actions and current action
    return action;
}

export function walkObj(obj, nano) {
    var vx = obj.args[0] - nano.x;
    var vy = obj.args[1] - nano.y;
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    if (mag <= worldGrid.gridSize * 1) {
        nano.vx = 0;
        nano.vy = 0;
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
    if (mag <= worldGrid.gridSize) {
        nano.vx = 0;
        nano.vy = 0;
        return false;
    }

    var vtx = obj.args[0].x - obj.targetX;
    var vty = obj.args[0].y - obj.targetY;
    var tmag = Math.sqrt((vtx * vtx) + (vty * vty))
    if (!obj.path) //if target moves a whole tile we retarget the new tile lol 
        findPath(nano.x, nano.y, obj.args[0].x, obj.args[0].y, 32, 4, (path) => {
            obj.targetX = obj.args[0].x
            obj.targetY = obj.args[0].y
            obj.path = path;
        });
    else {
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