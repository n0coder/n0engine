import { createNoise2D } from "simplex-noise";
import { p } from "../../engine/core/p5engine.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { NoiseGenerator } from "../world/NoiseGenerator.mjs";
import Alea from "alea";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { clamp, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import {camera} from "../../engine/core/Camera/camera.mjs"
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";


let n0 = new Nanoai(`n0`, 2, 4)
let n1 = new Nanoai(`n1`, 4, 4)
let n2 = new Nanoai(`n2`, 6, 4)
globalThis.n0 = n0;
camera.follow(n0);
cosmicEntityManager.addEntity(camera);

n1.brain.do("walk", -4, -4)
n2.brain.do("walk", -6,-6)
n0.brain.do("walk", 6, 8)


/*

we could simulate potd

pick a number for room count,
pick a point, build a room, 
choose a random neighbor direction and build a room, if a room already exists just make a door to it,
repeat until there are enough rooms

pick rooms for starting an exit points

*/
let circle = { x: 0, y: 0, distance: 3, thickness: 4, getValue(x ,y) { 
    var vx = x - this.x;
    var vy = y - this.y;
    let min = this.distance, max = this.distance+this.thickness
    let v = (vx * vx) + (vy * vy)
    var mag = Math.sqrt(v)
    mag = inverseLerp(max, min, mag);
    mag = clamp(0, 1, mag)
    return v === 0 ? 1 : mag
    }
}
globalThis.circle = circle

let noise2 = new NoiseGenerator({ 
    octaves:3, lacunarity:1.1, persistance: .4, scale:10, power: 1
});
noise2.init(createNoise2D(Alea(5)))

let xx = 0, yy = 0;
let circlo = (x,y)=>{  
    var vx = xx-x;
    var vy = yy-y;
    let v = (vx * vx) + (vy * vy)
    return  Math.sqrt(v)
}

let noise = new NoiseGenerator({ octaves:1, scale:6, lowClip:0, highClip:1 })
noise.init(circlo, 0, 1)
let noise3 = new NoiseGenerator({ blend: [0,1], octaves:1, scale:6 })
noise3.init(circlo, 0, 1)
let visualize = function visualize(noise) {
    return () => {
        for (let i = -5; i < 5; i++) {
            for (let o = -5; o < 5; o++) {
    
    
                let on = circlo(i,o)
                let n = noise.getValue(i,o).sum;
                //console.log({on, n, non: on-n, noise})
                //n = on-n;
                if (n === NaN) p.fill(255, 111,111); else p.fill((n)*255);
                p.ellipse(6*worldGrid.gridSize+(i *6), 6*worldGrid.gridSize +60 + (o*6), 6,6)
            }
        }
    }
}

let hooki2 =n0.brain.do("hook", visualize(noise3) )
let hooki =n0.brain.do("hook", visualize(noise) )
hooki.name = "visualize noise map"
hooki2.name = "visualize noise map"
let roomCount = p.floor(p.random(3,12));

let ro = new Map(), roro = [];
let neibors= [[1,0],[-1,0],[0,-1],[0,1]];

let oo = (x,y)=> { 
    let pop ={x, y, links: new Set()}; 
    ro.set(`${x}, ${y}`, pop); 
    roro.push(pop);
    return pop 
}
let opo = oo(0, 0);
while (roro.length<=roomCount) {
    let r = p.random(roro);
    let n = p.random(neibors);
    console.log(r, n)
    
    let x = r.x+n[0], y = r.y+n[1];
    let oio = ro.get(`${x}, ${y}`);
    if (oio) {
        oio.links.add(r);
        r.links.add(oio);
    } else {
        oio = oo(x,y);
        oio.links.add(r);
        r.links.add(oio);
    }

}
console.log(roro)
let hooko = n0.brain.do("hook", ()=>{ 
    
    for (const r of roro) {
        for (const o of r.links) {
            p.stroke(255)
            p.strokeWeight(5);
            p.line(n0.x*worldGrid.gridSize+ (r.x*16), n0.x*worldGrid.gridSize+20+(r.y*16), n0.x*worldGrid.gridSize+(o.x*16), n0.x*worldGrid.gridSize+20+(o.y*16));
            p.noStroke();
        }

        p.rect(n0.x*worldGrid.gridSize+(r.x*16)-5, n0.x*worldGrid.gridSize+20+(r.y*16)-5, 10,10)
        //p.ellipse(42+8*r.x, 42+8*r.y, 3,3)    
    }
})
hooko.name = "read map"

let explorationProfiles = new Map()
explorationProfiles.set("cunny", { 
    create() { 
        return { cunny:"cute and funny", 
            work(nano) {
              console.log("cute and funny loop")
              return true;
            }
        }
    }
})
explorationProfiles.set("explorer", {
    skills: ["searching"],
    create() {
        return { 
            work(nano) { 
            /* 
            search the map to uncover loot and traps, 
            make up activities for other exploration profiles
            like sending a ping for "loot" or "lock" or "trap" and then the character that can appraise sees the work and starts it 
            */ 
            //nano.brain.doBefore(this, "search")
            //nano.brain.doBefore(this, "walk", 8, 8)
            console.log("explorer loop")
            return true;
            } 
        }
    }
})


function assignRoles(profilesa, nanos) {
    var nanos = new Map(nanos);

    while (profilesa.length > 0) {
        let posi = [];
    var pro = profilesa[0];
    
    for (var [nano, proxiz] of nanos) {
        let prof = explorationProfiles.get(pro);
        let score = 0;
        if (prof.skills) {
            for (const skill of prof.skills) {
                let ski = nano.identity.skills.get(skill) ?? 0;
                let opi = nano.identity.opinions.get(skill) ?? 0;
                score += ski + opi; 
            }
        }
        posi.push({score, nano, prof})
    }
    console.log(posi);
    let bestNano = { score: -Infinity, nano: null, prof:null };
    for (let i = 0; i < posi.length; i++) {
        const prosa = posi[i];
        if (prosa.score > bestNano.score) {
            bestNano.score = prosa.score;
            bestNano.nano = prosa.nano;
            bestNano.prof = prosa.prof;
        }
    }
    console.log(bestNano.nano, bestNano.prof)
    nanos.get(bestNano.nano).profile = bestNano.prof.create(bestNano.nano);
    nanos.delete(bestNano.nano)
    profilesa.splice(0, 1)
}
}

n1.identity.skills.set("searching", 1)

let nanos = new Map([[n0, {profile:null}], [n1, {profile:null}], [n2, {profile:null}]])

assignRoles(["explorer","cunny","cunny"], nanos)
console.log(nanos);
//we can use the map directly to create and run the profiles now

/*
  realistically we should get all explorers together before running the role check, 
  so we can give everyone the best pick of each
*/
let dungeon = {
    explorers: new Map(), nanosNeeded: 3, state: "hire",
    work(nano) {
       this[this.state]?.(nano);
    },
    hire(nano) {
        if (this.explorers.size < this.nanosNeeded) {
        let explorer = this.explorers.get(nano)
        if (explorer === undefined) {
            console.log(`${nano.name} is gonna try a dungeon`)

            /* we should choose exploration profiles based on nano skills 
               (nanos that have a high appraisal/disarming skill 
               would be good at finding and disarming traps?) */

            //explorer = /* load in a exploration style... */ { work(nano) { console.log(`${nano.name} is exploring?`); return false; /* how should this nano explore? */ } }
            
            let hooko = nano.brain.do("hook", (hook) => {  } )
            explorer = { profile: null, hook: hooko }; //we will load in the profile later
            this.explorers.set(nano, explorer);

        } 
        if (this.explorers.size >= this.nanosNeeded) {
            console.log("enough workers to start exploring?", this.explorers);
            this.roleCheck(nano)
        }
        //work will be used first to hire nanos, then we can use work after everyones together to do work
        //we could do a statemachine style
        return false; //explorer.work(nano);
    }
    },
    roleCheck(nano) {
        // let explorers = ;
        console.log("gonna assign the nanos some roles", this.explorers)
        assignRoles(["explorer","cunny","cunny"], this.explorers)
        this.state = "explore"
        console.log(this.explorers)
        for (const [explorer, XD] of this.explorers) {
            console.log(XD.profile)
            explorer.brain.do(XD.profile);
            XD.hook.pull(); //kill the hook to allow the nano to start exploring
        }
    },
    explore(nano) {
        console.log(nano, "gonna explore");
    }
    
}

n0.brain.do(dungeon); n1.brain.do(dungeon); n2.brain.do(dungeon);