import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";

export const nanoaiActions = new Map([
    ["walk", {
        x: 0,
        y: 0,
        work: function (nano) {
           return walk(nano, this.x,this.y, 1)
        },
        clone: function(x,y) {
            let clone =  atomicClone(this)
            clone.x = x;
            clone.y = y;
            return clone;   
        }
    }],
    ["follow", {
        nano2: null,
        work: function (nano) {
            var nano2x = this.nano2;
            var walko = nano2x && walk(nano, this.nano2.x,this.nano2.y, 1)
            
            return walko
        },
        //clone before setting the variable
        clone: function(nano2) {
            let clone =  atomicClone(this)
            clone.nano2 = nano2;
            return clone; 
        }
    }],
    ["deactivate", {
        work: function (nano) {
            nano.setActive(false)
            return false
        },
        clone: function() {
            return atomicClone(this);   
        }
    }]
])



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