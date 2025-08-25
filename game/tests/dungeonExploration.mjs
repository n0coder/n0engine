import { createNoise2D } from "simplex-noise";
import { p } from "../../engine/core/p5engine.ts";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { NoiseGenerator } from "../world/NoiseGenerator.mjs";
import Alea from "alea";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { clamp, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import {camera} from "../../engine/core/Camera/camera.mjs"
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { WorldGenerator } from "../world/wave/worldGen/worldGenerator.mjs";
import { DebugCursor } from "../world/debugCursor.mjs";
import { Graph } from "../world/noiseGen/graph.mjs"
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";
import { } from "./graphworker.mjs"
import { Map2d } from "../../engine/n0math/map2d.mjs";
import { drawChunk } from "../world/wave/worldGen/ChunkDrawer.mjs";
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
let n0 = new Nanoai(`n0`, 1, 4)
let n1 = new Nanoai(`n1`, 7, 6)
let n2 = new Nanoai(`n2`, 6, 4)
globalThis.n0 = n0;
n0.brain.do("walk", 15, 15)
new DebugCursor()
new WorldGenerator(n0)
//worldGrid.x =0; 
//worldGrid.y= -0;
camera.follow(n0);
cosmicEntityManager.addEntity(camera);

let tile = genTile(100,100);
console.logp(tile);

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
    octaves:3, lacunarity:1.1, persistance: .4, scale:10, power: 1, 
    blendStyle: "recubic"
});
noise2.init(createNoise2D(Alea(5)))

let xx = 0, yy = 0;
let circlo = (x,y)=>{  
    var vx = xx-x;
    var vy = yy-y;
    let v = (vx * vx) + (vy * vy)
    return  clamp(0, 1, Math.sqrt(v))
}

let noise = new NoiseGenerator({ name: "noise", octaves:1, scale:6, lowClip:0, highClip:1 })
noise.init(circlo, 0, 1)
let noise32 = new NoiseGenerator({ offsetX:1, amp:.3, ocaves:1, scale:6 })
let noise31 = new NoiseGenerator({ offsetX:noise32, amp:.2, octaves:3, scale:15 })
noise31.init(createNoise2D(Alea(3)));
let noise3 = new NoiseGenerator({ abs:true, offsetY:noise31, offsetX:noise32, name: "noise3", inverted:true, blend: [1,0], add:[[noise31, .1]], blendPower:5, octaves:1, scale:6, blendStyle: "recubic" })
noise3.init(circlo, 0, 1)
/*
let visualize = function visualize(w,h, s, fn) {
    let time = 0;
    let map = []
    let workerpool = {
        workers: [
            new Worker("./game/tests/graphworker.mjs", {type:"module"}),
            new Worker("./game/tests/graphworker.mjs", {type:"module"}),
            new Worker("./game/tests/graphworker.mjs", {type:"module"}),
            new Worker("./game/tests/graphworker.mjs", {type:"module"}) 
        ], index: 0,
        postMessage(o){
            this.workers[this.index].postMessage(o);
            this.index = (this.index + 1) % this.workers.length;
        }
    }
    for (let w of workerpool.workers) w.onmessage = function(o) {
        let d = o.data;        
        for (const x of d.result) {
            for (const y of x) {
                let ox = y.ox, oy = y.oy;
                if (map[ox] === undefined) map[ox] = [];
                map[ox][oy] = y;//inverseLerp(y.minm, y.maxm, y.sum)
                
            }
        }
    }
    function create(x,y, w ,h) { 
        workerpool.postMessage({x,y,w,h})
    }
    let w2 = w/2;
    for (let i = 0; i < w; i+=w2) {
        map[i] = []
        for (let o = 0; o < h; o+=w2) {
            create(i,o, w2, w2)
        }
    }
    return { work:() => {
        //console.logp(map);
        for (let i = 0; i < w; i++) {
            for (let o = 0; o < h; o++) {
                let n = map?.[i]?.[o] 
                if (n === NaN || n===undefined) continue; else p.fill(n.biome.color)// p.fill((n)*255);
                let x = (i * worldGrid.tileSize);
                let y = (o * worldGrid.tileSize);
                p.rect(x*s,y*s, worldGrid.tileSize*s,worldGrid.tileSize*s)
            }
        }
        return true
    }
    }
}
    */
let inf = { 
    input: (x,y) => { return x },
    min: -1, max: 1
}
let sinf = {
    input: (x,y) => { return Math.sin(x)+Math.cos(y) },
    min: -1, max: 1
}
/*
let graph = new Graph();
graph.scale(10).fractal([inf, xnf, xnf], 1, .5, 2);

graph.amp().offsetX().offsetY(1);
graph.lowClip(-1).highClip(1).abs()
graph.invert().pow(1).add(1).multiply(1)
graph.map([
    { "c": 0.05, "y": 0, "p": 2 }, { "c": 0.5, "y": 0.9, "p": 3 }, { "c": .95, "y": 1, "p": 2 }
])

graph.amp(10)

let ograph = new Graph();
ograph.offsetX().offsetY()
ograph.scale(3).fractal([sinf, xnf])//.amp(graph)
//ograph.offsetX(20).offsetY(10).cartesian()
//ograph.polar().offsetY(graph).cartesian()
//ograph.fn((output)=>{ output.x *= .5 })
//ograph.scale(graph).fractal([xnf])//.abs()//.invert()/////.add(graph).multiply(graph);
ograph.pow(.2)//.abs()
ograph.map([
    { "c": 0.05, "y": 0, "p": 2 }, { "c": 0.5, "y": 0.9, "p": 3 }, { "c": .95, "y": 1, "p": 2 }
])    
ograph.bicubic([1, 0], 1);
ograph.lowClip(0)
//ograph.newBlend([0, 1, 0], 1);

let fgraph = new Graph();
fgraph.offsetX(graph).offsetY((o)=>0).scale((o)=>15)
fgraph.fractal([inf]).newBlend([()=>0, 1, ()=>0]).map([
    { "c": 0.05, "y": ()=>0, "p": 1 }, { "c": 0.5, "y": 1, "p": 1 }, { "c": .95, "y": ()=>0, "p": 1 }
]);

//fgraph.offset((o)=>0).amp((o)=>1).add((o)=>1)
//fgraph.multiply((o)=>1).lowClip((o)=>-1).highClip((o)=>1);
//fgraph.invert().pow((o)=>1).newBlend([1, (o)=>0, 1])
//fgraph.bicubic([(o)=>0, 1])

console.logp(graph.create(0,0))
let hooki2 =n0.brain.do(visualize(fgraph))
//let hooki =n0.brain.do("hook", visualize(noise) )
//hooki.name = "visualize noise map"
//hooki2.name = "visualize noise map"
*/
/*
let roomCount = p.floor(p.random(2,5));

let ro = new Map(), roro = [];
let neibors= [[1,0],[-1,0],[0,-1],[0,1]];
let dina = 4;
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
    let x = r.x+(n[0]*dina), y = r.y+(n[1]*dina);
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
console.logp(roro)
*/

/*
function roomSDF(cx,cy,s) {
    return {
        input: (x,y)=>{
            const dx = Math.abs(x - cx) - s;
            const dy = Math.abs(y - cy) - s;
        
            const outsideDist = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2);
            const insideDist = Math.min(Math.max(dx, dy), 0);
            return outsideDist + insideDist;
        },
        min: -1, max: 1
    }
}
function lineSDF(x, y, x1, y1, x2, y2, w) {
    // Compute vectors AB (from A to B) and PA (from P to A)
    let ABx = x2 - x1;  // x-component of AB
    let ABy = y2 - y1;  // y-component of AB
    let PAx = x - x1;   // x-component of PA (P - A)
    let PAy = y - y1;   // y-component of PA

    // Compute the squared length of AB
    let lengthABSq = ABx * ABx + ABy * ABy;

    // Handle zero-length segment (treat as a circle at A)
    if (lengthABSq < 1e-6) {
        let dist = Math.sqrt(PAx * PAx + PAy * PAy);
        return dist - w / 2;
    }

    // Compute projection parameter t = (PA · AB) / (AB · AB)
    let t = (PAx * ABx + PAy * ABy) / lengthABSq;

    // Clamp t to [0, 1] to stay within the segment
    t = Math.max(0, Math.min(1, t));

    // Compute the closest point C on the segment: A + t * AB
    let Cx = x1 + t * ABx;
    let Cy = y1 + t * ABy;

    // Compute vector from P to C
    let PCx = x - Cx;
    let PCy = y - Cy;

    // Compute distance from P to C
    let dist = Math.sqrt(PCx * PCx + PCy * PCy);

    // Return SDF: distance minus half the width
    return dist - w;
}
function dungeonSDF(rooms, xx, yy,  s, s2) {
    return {
        input: (x,y) => {
            
            let x1 = -1, y1 = 0, x2 = 1, y2=0;
            
            let minDist = Infinity;
            
            for (let room of rooms) {
                const dx = Math.abs(x - (room.x+xx)) - s;
                const dy = Math.abs(y - (room.y+yy))- s;
                const outsideDist = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2);
                const insideDist = Math.min(Math.max(dx, dy), 0);
                minDist = Math.min(minDist, outsideDist + insideDist);
                
                for (const link of room.links) {
                    minDist = Math.min(minDist, lineSDF(x,y, room.x+xx, room.y+yy, link.x+xx, link.y+yy, s2));    
                }
                
                //minDist = Math.min(minDist, roomsdf);
            }
            return minDist;
        },
        min: -1, max: 1
    }
}

function roomoSDF(rooms, xx, yy, s) {
    return {
        input: (x,y) => {
            let minDist = Infinity;
            
            for (let room of rooms) {
                const dx = Math.abs(x - (room.x+xx)) - s;
                const dy = Math.abs(y - (room.y+yy))- s;
                const outsideDist = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2);
                const insideDist = Math.min(Math.max(dx, dy), 0);
                minDist = Math.min(minDist, outsideDist + insideDist);
                
                //minDist = Math.min(minDist, roomsdf);
            }
            return minDist;
        },
        min: -1, max: 1
    }
}
let shift = new Graph().scaleXY(.1).fractal([xnf]).amp(8);
let shifty = new Graph().offsetX(120).scaleXY(.1).fractal([xnf]).amp(8);
for (const ro of roro) {
    let rox = ro.x, roy = ro.y
    ro.x += shift.create(rox, roy).sum; 
    ro.y += shifty.create(rox, roy).sum;
} 

let sia = 2
let rooma = new Graph();
let sinfz =new Graph().scaleXY(2*sia).fractal([xnf]).amp(.4);
rooma.scaleXY(3*sia).offsetXY(sinfz, sinfz)
rooma.fractal(dungeonSDF(roro, 0,0, 2, .5))
rooma.pow(.2).threshold(.9).invert();
*/

function vororoi(x, y, w) {
    let rnd = createNoise2D(Alea("io"));
    let baseCellX = Math.round(x);
    let baseCellY = Math.round(y);
    let minDistToCell = Infinity;

    for (let i = -1; i <= 1; i++) {
        for (let o = -1; o <= 1; o++) {
            let cellX = baseCellX + i;
            let cellY = baseCellY + o;

            let rx = rnd(cellX+235, cellY+235);
            let ry = rnd(cellX+253, cellY+253);
            let cellPositionX = cellX + rx;
            let cellPositionY = cellY + ry;

            let toCellX = cellPositionX - x;
            let toCellY = cellPositionY - y;
            let distToCell = Math.sqrt(toCellX * toCellX + toCellY * toCellY);
            if (distToCell < minDistToCell) {
                minDistToCell = distToCell;
            }
        }
    }

    return minDistToCell;
}
function edgeVoronoiNoise(x, y, rngx, rngy) {
    let rndx = rngx;
    let rndy = rngy;
    
    let baseCellX = Math.round(x);
    let baseCellY = Math.round(y);

    let minDistToCell = Infinity;
    let closestCellX, closestCellY;
    let toClosestCellX, toClosestCellY;

    for (let i = -1; i <= 1; i++) {
        for (let o = -1; o <= 1; o++) {
            let cellX = baseCellX + i;
            let cellY = baseCellY + o;

            let rx = rndx(cellX, cellY);
            let ry = rndy(cellX, cellY); 
            let cellPositionX = cellX + rx;
            let cellPositionY = cellY + ry;

            let toCellX = cellPositionX - x;
            let toCellY = cellPositionY - y;

            let distToCell = Math.sqrt(toCellX * toCellX + toCellY * toCellY);

            if (distToCell < minDistToCell) {
                minDistToCell = distToCell;
                closestCellX = cellX;
                closestCellY = cellY;
                toClosestCellX = toCellX;
                toClosestCellY = toCellY;
            }
        }
    }

    let random = rndx(closestCellX, closestCellY);

    let minEdgeDistance = Infinity;

    for (let i = -1; i <= 1; i++) {
        for (let o = -1; o <= 1; o++) {
            let cellX = baseCellX + i;
            let cellY = baseCellY + o;

            if (cellX !== closestCellX || cellY !== closestCellY) {
                
                let rx = rndx(cellX, cellY);
                let ry = rndy(cellX, cellY);
                let cellPositionX = cellX + rx;
                let cellPositionY = cellY + ry;
                let toCellX = cellPositionX - x;
                let toCellY = cellPositionY - y;

                let toCenterX = (toClosestCellX + toCellX) * 0.5;
                let toCenterY = (toClosestCellY + toCellY) * 0.5;

                let diffX = toCellX - toClosestCellX;
                let diffY = toCellY - toClosestCellY;
                let diffLen = Math.sqrt(diffX * diffX + diffY * diffY);

                if (diffLen > 0) {
                    let cellDifferenceX = diffX / diffLen;
                    let cellDifferenceY = diffY / diffLen;
                    let edgeDistance = toCenterX * cellDifferenceX + toCenterY * cellDifferenceY;
                    minEdgeDistance = Math.min(minEdgeDistance, edgeDistance);
                }
            }
        }
    }

    return [minDistToCell, random, minEdgeDistance];
}

let a2d = new Map2d();
a2d.set(0,0, { name: "hi" })

console.logp(a2d.get(0,0), a2d.has(0,0));

let size = 16, vsize= size /2
let sol = 4;
let rngx = createNoise2D(Alea("iox"));
let rngy = createNoise2D(Alea("ioy"));
let vorin = {input(x,y){ return edgeVoronoiNoise(x,y, rngx, rngy)[2] } , min:0, max:1}
let vorini = {input(x,y){ return edgeVoronoiNoise(x,y, rngx, rngy)[1] } , min:-1, max:1}

let vogr = new Graph();
let xxx = new Graph();
xxx.scaleXY(sol).fractal([vorin, vorin], 3, 1, 2).bicubic([-1, 1])
vogr.scaleXY(sol*2).offsetXY(xxx,xxx).fractal(vorini)

let xna = new Graph();
let xnf = {
    input: createNoise2D(Alea(5)),
    min: -1, max: 1
}

xna.scaleXY(35).fractal(xnf).posterize(10);
xna//.sin()//.floor()

let xnb = new Graph().copy(xna)
xnb.anglize().cos()//.sin();
/*
let gra = new Worker('./game/tests/graphworker.mjs', {type: 'module'})
gra.onmessage = function(e) {
//    console.logp(e.data);
}
gra.onerror = function(e) { console.logp (e) }
gra.postMessage({x:3, y:3});
*/


console.logp(xnb.create(3,3));
//n0.brain.do(visualize(size,size, 1, xnb ))
//n1.brain.do(visualize(size, size, 1, xxx))
console.logp("sanitycheck")
//let hooki2 =n0.brain.do(visualize(rooma))

/*
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
*/
n0.brain.do("hook", () => {})
let explorationProfiles = new Map()
explorationProfiles.set("cunny", { 
    create() { 
        return { cunny:"cute and funny", 
            work(nano) {
              console.logp("cute and funny loop")
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
            console.logp("explorer loop")
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
    console.logp(posi);
    let bestNano = { score: -Infinity, nano: null, prof:null };
    for (let i = 0; i < posi.length; i++) {
        const prosa = posi[i];
        if (prosa.score > bestNano.score) {
            bestNano.score = prosa.score;
            bestNano.nano = prosa.nano;
            bestNano.prof = prosa.prof;
        }
    }
    console.logp(bestNano.nano, bestNano.prof)
    nanos.get(bestNano.nano).profile = bestNano.prof.create(bestNano.nano);
    nanos.delete(bestNano.nano)
    profilesa.splice(0, 1)
}
}

n1.identity.skills.set("searching", 1)

let nanos = new Map([[n0, {profile:null}], [n1, {profile:null}], [n2, {profile:null}]])

assignRoles(["explorer","cunny","cunny"], nanos)
console.logp(nanos);
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
            console.logp(`${nano.name} is gonna try a dungeon`)

            /* we should choose exploration profiles based on nano skills 
               (nanos that have a high appraisal/disarming skill 
               would be good at finding and disarming traps?) */

            //explorer = /* load in a exploration style... */ { work(nano) { console.logp(`${nano.name} is exploring?`); return false; /* how should this nano explore? */ } }
            
            let hooko = nano.brain.do("hook", (hook) => {  } )
            explorer = { profile: null, hook: hooko }; //we will load in the profile later
            this.explorers.set(nano, explorer);

        } 
        if (this.explorers.size >= this.nanosNeeded) {
            console.logp("enough workers to start exploring?", this.explorers);
            this.roleCheck(nano)
        }
        //work will be used first to hire nanos, then we can use work after everyones together to do work
        //we could do a statemachine style
        return false; //explorer.work(nano);
    }
    },
    roleCheck(nano) {
        // let explorers = ;
        console.logp("gonna assign the nanos some roles", this.explorers)
        assignRoles(["explorer","cunny","cunny"], this.explorers)
        this.state = "explore"
        console.logp(this.explorers)
        for (const [explorer, XD] of this.explorers) {
            console.logp(XD.profile)
            explorer.brain.do(XD.profile);
            XD.hook.pull(); //kill the hook to allow the nano to start exploring
        }
    },
    explore(nano) {
        console.logp(nano, "gonna explore");
    }
    
}

n0.brain.do(dungeon); n1.brain.do(dungeon); n2.brain.do(dungeon);