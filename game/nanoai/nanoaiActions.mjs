import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";

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
            var walko = nano2x && walk(nano, nano2x.x,nano2x.y, 1)
            //p.ellipse(nano.x, nano.y, 10);
            return walko
        },
        //clone before setting the variable
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }],
    ["pickup", { 
        args: [],
        before: [["follow"]], 
        work: function (nano) {
            p.ellipse(nano.x, nano.y, 15); //really nice that we can run p5 draw functions here lol
            return true
        },
        clone: function(...args) {
            return handleClone(this, ...args)
        }
    }]
])

export function handleClone(obj,...args) {
    obj.args  =[...args];
    let action = [];
    if (obj.before)
        obj.before.forEach(action => {
        action.push(nanoaiActions.get(action[0]).clone(...args))
    });
    action.push(atomicClone(obj)) 
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