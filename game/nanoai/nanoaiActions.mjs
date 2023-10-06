import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { Mommyai, Puff } from "./mommyai.mjs";

export const nanoaiActions = new Map([
    ["walk", {
        args: [],
        work: function (nano) {
           return walk(nano, this.args[0],this.args[1], 1) //this kinda sucks 
        },
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }],
    ["follow", {
        args: [],
        work: function (nano) {
            var nano2x = this.args[0];
            var nanowok = !isNaN(this.args[1]) ? this.args[1] : 1
            if (nano2x) {
                return walk(nano, nano2x.x,nano2x.y, nanowok)
            }
            return walko
        },
        //clone before setting the variable
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }],
    ["pickup", { 
        args: [],
        before: ["follow"], 
        work: function (nano) {
            return !nano.inventory.add(this.args[0], this.args[1])
        },
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }],
    ["equip", { 
        args: [],
        work: function (nano) {
            return !nano.inventory.equip(this.args[0])
        },
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }],
    ["harvest", { 
        args: [],
        before: ["follow"], 
        work: function (nano) {
            if (this.args[0].harvest) 
                return this.args[0].harvest(nano);
            return false
        },
        clone: function(...args) {
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
        clone: function(...args) {
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
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }], 
    ["transform", { 
        args: [],
        work: function (nano) {

            var nano2 = nano.inventory.hasItem("Nanoai")
            console.log(nano2)
            if (nano2) {
                console.log("holding nanoai")
            var cloudium = nano.inventory.hasItems("Circle", 2)
            if (cloudium) {
                var cloudium2 = nano2.inventory.hasItems("Circle", 2)
                if (cloudium2) {
                    this.puff = new Puff(nano.x,nano.y,10,60,16, ()=> {
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
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }]
])

export function handleClone(obj,...args) {
    //clone the object deeply
    let clone = atomicClone(obj);
    //drop in args
    clone.args  = [...args];
    //collect prerequisite actions
    let action = [];
    if (clone.before != undefined) { 
        for (let i = 0; i < clone.before.length; i++) {
            var beforeAction = handleClone(nanoaiActions.get(clone.before[i]),...args);
            action.push(...beforeAction)
        }
    };
    //push the current clone afterwards
    action.push(clone) 
    //send in prerequisite actions and current action
    return action;
}


export function walk(nano, x,y, magn = 1) {
    var vx = x - nano.x;
    var vy = y - nano.y;
    var mag = Math.sqrt((vx * vx) + (vy * vy))
    vx /= mag;
    vy /= mag;
    nano.x += vx * deltaTime*nano.speed;
    nano.y += vy * deltaTime*nano.speed;

    return mag > magn;
}