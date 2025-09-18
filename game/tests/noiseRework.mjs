//im going to be doing converting noise generators into graphers

import { createNoise2D } from "simplex-noise";
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine"
import { NoiseGenerator } from "../world/NoiseGenerator.mjs";
import Alea from "alea";
import { Graph } from "../world/noiseGen/graph.mjs";
import { inverseLerp } from "../../engine/n0math/ranges.mjs";

var vvscale = .75//140
var scale = vvscale * .75
var rscale = 50;
var xx = 1533, yy = 1263, riverScale = 275;


let noise = createNoise2D(Alea("n0"))

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



let visuNG = riverFlow
visuNG.init(noise)

let xnf = {
    input: noise,
    min: -1, max: 1
}

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

let visuG = xnfe4
let difference = 0;
let oox = 0, ooy = 16
let match = true;
for (let x = 0; x < 25; x++) {
    for (let y = 0; y < 25; y++) {
        let v = visuNG.getValue(x,y,true)
        let v2 = visuG.create(x,y);
        let a = Math.round(v.sum*1000);
        let b = Math.round(v2.sum*1000);
        difference += Math.abs(a-b)
        if (a !== b) {
            console.log({difference, ng:a, g:b})
            match = false;
        }
    }        
}
if (!match) console.error("not a match", difference)
    else console.log("match")

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

