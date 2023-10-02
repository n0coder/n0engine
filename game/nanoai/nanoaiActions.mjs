import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";

export const nanoaiActions = new Map([
    ["walk", {
        x: 0,
        y: 0,
        work: function (nano) {
           return walk(nano, this.x,this.y, .25)
        },
        clone: function(x,y) {
            this.x = x;
            this.y = y;
            return atomicClone(this);   
        }
    }],
    ["follow", {
        nano2: null,
        work: function (nano) {
            return this.nano2&&walk(nano, this.nano2.x,this.nano2.y, .25)
        },
        clone: function(nano2) {
            this.nano2 = nano2;
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