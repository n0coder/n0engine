//im going to be doing converting noise generators into graphers

import { createNoise2D } from "simplex-noise";
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine"
import { NoiseGenerator } from "../world/NoiseGenerator.mjs";
import Alea from "alea";
import { Graph } from "../world/noiseGen/graph.mjs";
import { inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
//import { genTile } from "../world/wave/worldGen/TileBuilder.mjs"


var vvscale = .05//140
var scale = vvscale * .75
var rscale = 50;
var xx = 1533, yy = 1263, riverScale = 275;
let noise = createNoise2D(Alea("n0"))

let xnf = {
    input: noise,
    min: -1, max: 1
}

var mountainRidges = new NoiseGenerator({ 
    name: "mountainRidges", scale: scale * rscale*.3, 
    octaves: 1, persistance: .5, lacunarity: 1, 
    offset: 0, offsetX: 3153, offsetY: 3222, 
    //amp: 1 
})

var mountainTerrain = new NoiseGenerator({ 
    name: "mountainTerrain", scale: scale * rscale*.3, 
    abs: true, octaves: 1, persistance: .5, lacunarity: 1.75, offsetX: 1553, 
    add: [mountainRidges],// amp: 1 
})

var riverFlow = new NoiseGenerator({ 
    name: "riverFlow", scale: scale * riverScale * 2.8, 
    add: [mountainTerrain], octaves: 1, persistance: .5, 
    offset: 0, lacunarity: 1.75, offsetX: 353, offsetY: 3153, blend: [.1, .7] })

var rivers = new NoiseGenerator({
    name: "rivers",
    power: riverFlow, abs: true, scale: scale * riverScale, 
    octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, 
    offsetX: xx, offsetY: yy,
    mapSpace: [0, 1], map: [ //take in a map, (of relative height, controls)
        { "c": 0, "y": 0, "p": 4 }, { "c": 0.2, "y": .2, "p": 2 },
        { "c": 0.4, "y": 2.5, "p": 2 }, { "c": 0.6, "y": .6, "p": 2 }, 
        { "c": 1, "y": 1, "p": 4 },
    ], blend: [-1, 1]
})

var terrainBlendA = new NoiseGenerator({ 
    name: "terrainBlendA", blendPower: 2, scale: scale * 150, 
    octaves: 1, persistance: .5, lacunarity: 1, 
    offset: 0, offsetX: -353, offsetY: -3222, 
    blend: [1, 3] 
})
var terrainBlendB = new NoiseGenerator({ 
    name: "terrainBlendB", blendPower: 2, blend: [.3, 1], 
    scale: scale * 150, octaves: 1, persistance: .5, 
    lacunarity: 1.3, offset: 0, offsetX: -3353, offsetY: -3212 
}) //, blend:[squish1,squish2]

var terrainSquash = new NoiseGenerator({
    name: "terrainSquash",
    blendPower: 2, scale: scale * 950, octaves: 1, persistance: .5, lacunarity: 1.3, 
    offset: 0, offsetX: -3353, offsetY: -3212, add: [[mountainTerrain, 3 ], rivers], 
    blend: [terrainBlendA, terrainBlendB] //blend it into some space (i know it's a great idea)
}) 

var smallHills = new NoiseGenerator({ 
    name: "smallHills", scale: scale * 50, //power: 4, 
    octaves: 3, persistance: .5, 
    lacunarity: 1.75, offsetX: -1553, offsetY: -1722,  amp: 1//, blend: [0, 1]
})

var ridgeBase = new NoiseGenerator({ 
    name: "ridgeBase", scale: scale * 50, octaves: 1, 
    persistance: .5, lacunarity: 1, offset: -1, 
    offsetX: 3253, offsetY: 3222, amp: 1 
})
var ridgeDetail = new NoiseGenerator({ 
    name: "ridgeDetail", scale: scale * 15, octaves: 2, 
    persistance: .5, lacunarity: 1.4, offsetX: 253, offsetY: 222, 
    offset: ridgeBase, amp: 1 
})

var elevation = new NoiseGenerator({
    name: "elevation",
    power: terrainSquash, scale: scale * 400, octaves: 3, persistance: .5, lacunarity: 2, 
    mapSpace: [0, 1], map: [
        { "c": 0, "y": 0.01, "p": 3 }, { "c": .15, "y": 0.01, "p": 1.2 },
        { "c": .3, "y": .2 }, { "c": .41, "y": .4 }, { "c": .47, "y": .45 },
        { "c": .55, "y": .5 }, { "c": .63, "y": .74, "p": 1.8 },
        { "c": .72, "y": .75 }, { "c": .99, "y": .99, "p": 3 }
    ]
});

var tempBase = new NoiseGenerator({ 
    power: .7, scale: scale * 550, octaves: 2, persistance: .5, lacunarity: 1, 
    offset: -1, offsetX: 3153, 
    offsetY: 3222, amp: 2 
})
var temperature = new NoiseGenerator({ scale: scale * 750, octaves: 3, persistance: .25, 
    add: [[elevation, -.3]], lacunarity: 2, blend: [-1, 1] });

// Humidity base
var humidityBase = new NoiseGenerator({ 
    scale: scale * 350, octaves: 1, persistance: .5, 
    offset: 0, lacunarity: 1.75, offsetX: 1653, amp: 1 
})

// Moisture flow
var moistureFlow = new NoiseGenerator({ 
    scale: scale * 150, abs: true, octaves: 1, persistance: .5, 
    offset: 0, lacunarity: 1.75, 
    offsetY: humidityBase, offsetX: 1553, amp: 1 })

// Final humidity map
var humidity = new NoiseGenerator({ scale: scale * 500, 
    octaves: 6, persistance: .5, lacunarity: 1.7, 
    offsetX: -353, offsetY: 6662, blend: [-1 ,1], blendStyle: "recubic", 
    add: [[rivers, .2], [humidityBase, 3.7], [moistureFlow, 1.2], [elevation, .25]] 
});



//let visuNG = masterSugar



let xnfe = new Graph().scaleXY(scale*rscale*.3).offsetXY(3153, 3222).fractal(xnf)
let xnfe2 = new Graph().scaleXY(scale*rscale*.3).offsetX(1553).fractal(xnf, 1, .5, 1.75)
xnfe2.abs().add(xnfe);
let xnfe3 = new Graph().scaleXY(scale*riverScale*2.8).offsetXY(353, 3153)
xnfe3.fractal(xnf, 1, .5, 1.75).add(xnfe2).newBlend([.1, .7]);
let xnfe4 = new Graph().scaleXY(scale*riverScale).offsetXY(xx,yy);
xnfe4.fractal(xnf, 1, .5, 1.75).abs().map( [ //take in a map, (of relative height, controls)
        { "c": 0, "y": 0, "p": 4 }, { "c": 0.2, "y": .2, "p": 2 },
        { "c": 0.4, "y": 2.5, "p": 2 }, { "c": 0.6, "y": .6, "p": 2 }, 
        { "c": 1, "y": 1, "p": 4 },
    ], 0,1)
xnfe4.pow(xnfe3).newBlend([-1, 1]);;

let tba = new Graph().scaleXY(scale*150).offsetXY(-353, -3222).fractal(xnf, 1, .5, 1).newBlend([1, 3]);
let tbb = new Graph().scaleXY(scale*150).offsetXY(-3353, -3212).fractal(xnf, 1, .5, 1.3).newBlend([.3, 1]);
let tbS = new Graph().scaleXY(scale*950).offsetXY(-3353, -3212).fractal(xnf, 1,.5, 1.3);
tbS.add(xnfe2, 3).add(xnfe4).newBlend([tba, tbb]);
let ele = new Graph().scaleXY(scale*400).fractal(xnf, 3, .5, 2).map([
    { "c": 0, "y": 0.01, "p": 3 }, { "c": .15, "y": 0.01, "p": 1.2 },
    { "c": .3, "y": .2 }, { "c": .41, "y": .4 }, { "c": .47, "y": .45 },
    { "c": .55, "y": .5 }, { "c": .63, "y": .74, "p": 1.8 },
    { "c": .72, "y": .75 }, { "c": .99, "y": .99, "p": 3 }
], 0, 1).pow(tbS);

//let tb = new Graph().scaleXY(scale * 550).offsetXY(3153, 3222).fractal(xnf, 2,.5, 1).offset(1).amp(2);
let temp = new Graph().scaleXY(scale*750).fractal(xnf, 3, .25, 2).add(ele, -.25).newBlend([-1, 1])

let hb = new Graph().scaleXY(scale*350).offsetX(1653).fractal(xnf, 1, .5, 1.75);
let mf = new Graph().scaleXY(scale*150).offsetXY(1553, hb).fractal(xnf, 1, .5, 1.75);
mf.abs()

let humi = new Graph().scaleXY(scale*500).offsetXY(-353, 6662)
humi.add(xnfe4, .2).add(hb,1).add(mf, 0.5).add(ele, .25);
let sb = new Graph().scaleXY(scale*350).offsetXY(533, 3222)
sb.fractal(xnf, 5, .5, 1.3).amp(3)

let sv = new Graph().scaleXY(scale*650).offsetXY(1653, sb).fractal(xnf, 5, .5, 1.75)
sv.abs().bicubic([-1, 1], 2)


let ss = new Graph().scaleXY(scale * 550).offsetXY(sv, -3222).fractal(xnf, 6, .5, 2);
ss.newBlend([0,2])
let bs = new Graph().scaleXY(scale * 550).offsetXY(sv, -3222).fractal(xnf, 6, .5, 2);
bs.newBlend([-2, 0])

let szm = new Graph().scaleXY(scale*850).offsetXY(0,0).fractal(xnf, 7, .45, 2);
szm.map([
    { "c": 0.0, "y": 0, "p": 2 }, { "c": 0.25, "y": 0, "p": 2 },  
    { "c": 0.5, "y": .5, "p": 3 }, { "c": .75, "y": 1, "p": 2 }, 
    { "c": 1, "y": 1, "p": 2 }
], 0, 1).add(ele, -.2).newBlend([bs, ss], 2);

let sz = new Graph().scaleXY(scale*1300).fractal(xnf)
sz.add(temp, 1).add(humi, .4).add(ele,.5).add(szm, 1);

let mss = new Graph().scaleXY(scale*250).fractal(xnf).bicubic([szm, sz]);
let visuG = mss;




let visuNG = elevation; 
visuNG.init(noise)



//sh.pow(4);
let v = visuNG.getValue(0,0,true)
        v = inverseLerp(v.minm, v.maxm, v.sum)
let v2 = visuG.create(0,0);
        v2 = inverseLerp(v2.minm, v2.maxm, v2.sum)
console.log(v,v2)
let difference = 0, differenceRaw = 0;
let oox = 0, ooy = 16
let size = 25;
let match = true;
for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
        let v = visuNG.getValue(x,y,true)
        
        let va = inverseLerp(v.minm, v.maxm, v.sum)
        let v2 = visuG.create(x,y);
        let v2a = inverseLerp(v2.minm, v2.maxm, v2.sum)
        difference += Math.abs(va-v2a)
        differenceRaw += Math.abs(v.sum-v2.sum)
        
    }        
}
if ((difference) > (size*size)*.025) {
    match = false;
}
difference/=10000
if (!match) console.error("not a match", difference, differenceRaw)
    else console.log("match", difference, differenceRaw)

cosmicEntityManager.addEntity({
    ox: 29, oy:0,
    draw(){
        p.background(match ? [100, 180, 100] : [180, 100, 100])
    }
})
cosmicEntityManager.addEntity({
    ox:1, oy:0, s: 16, w:27, h:30,
    draw(){
        let s = this.s;
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                let val = visuNG.getValue(x,y,true)
                let v = inverseLerp(val.minm, val.maxm, val.sum);
                p.fill(v*256);
                p.rect((this.ox+x)*s+oox, (this.oy+y)*s+ooy, s, s)
            
            }        
        }
}})

cosmicEntityManager.addEntity({
    ox: 29, oy:0, s: 16, w:27, h:30,
    draw(){
        let s = this.s;
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                let val = visuG.create(x,y)
                let v = inverseLerp(val.minm, val.maxm, val.sum);
                p.fill(v*256);

                p.rect((this.ox+x)*s+oox, (this.oy+y)*s+ooy, s, s)
            
            }        
        }
}})

