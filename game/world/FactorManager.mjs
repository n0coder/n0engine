import Alea from "alea";
import { NoiseGenerator } from "./NoiseGenerator.mjs";
import { createNoise2D } from "simplex-noise";
import { Graph } from "./noiseGen/graph.mjs";
import { clamp } from "../../engine/n0math/ranges.mjs";

export const worldFactors = new Map();

export function buildFactors(tile) {
    if (tile.genCache) return tile;
    
    let genCache = new Map();
    for (const [factorKey, worldFactor] of worldFactors) {
        genCache.set(factorKey, worldFactor.getValue?.(tile.x, tile.y, false)??worldFactor.create?.(tile.x, tile.y)?.sum);   
        worldFactor.clean?.()
    }
    tile.genCache = genCache;
    return tile;
}

export var read =undefined, readRaw = true;
export var minmax = []

export var offsetX = 100, offsetY = 100
export const one = false; //to display only one pixel (helpful for debugging)

var vvscale = .75//140
var scale = vvscale * .75
var rscale = 50;
// Base mountain ridges
//var mountainRidges = new NoiseGenerator({ name: "mountainRidges", scale: scale * rscale, octaves: 1, persistance: .5, lacunarity: 1, offset: 0, offsetX: 3153, offsetY: 3222, amp: 1 })
let mountainRidges = new Graph().scaleXY(scale*rscale).offsetXY(3153, 3222).fractal([xnf])


// Mountain terrain with ridges  
/*var mountainTerrain = new NoiseGenerator({ name: "mountainTerrain", scale: scale * rscale, 
    abs: true, octaves: 3, persistance: .5, lacunarity: 1.75, offsetX: 1553, 
    add: [mountainRidges], amp: 1 })*/
let mountainTerrain = new Graph().scaleXY(scale*rscale*.3).offsetX(1553).fractal(xnf, 1, .5, 1.75)
mountainTerrain.abs().add(mountainRidges);

var xx = 1533, yy = 1263, riverScale = 275;

// River flow control
/*var riverFlow = new NoiseGenerator({ name: "riverFlow", scale: scale * riverScale * 2.8, 
    add: [mountainTerrain], octaves: 1, persistance: .5, 
    offset: 0, lacunarity: 1.75, offsetX: 353, offsetY: 3153, blend: [.1, .7] })*/
let riverFlow = new Graph().scaleXY(scale*riverScale*2.8).offsetXY(353, 3153)
riverFlow.fractal(xnf, 1, .5, 1.75).add(mountainTerrain).newBlend([.1, .7]);


// Actual rivers with carved valleys
/*var rivers = new NoiseGenerator({
    name: "rivers",
    power: riverFlow, abs: true, scale: scale * riverScale, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetX: xx, offsetY: yy,
    mapSpace: [0, 1], map: [ //take in a map, (of relative height, controls)
        { "c": 0, "y": 0, "p": 4 }, { "c": 0.2, "y": .2, "p": 2 },
        { "c": 0.4, "y": 2.5, "p": 2 }, { "c": 0.6, "y": .6, "p": 2 }, { "c": 1, "y": 1, "p": 4 },
    ], blend: [-1, 1]
})*/
let rivers = new Graph().scaleXY(scale*riverScale).offsetXY(xx,yy);
rivers.fractal(xnf, 1, .5, 1.75).abs().map( [ //take in a map, (of relative height, controls)
        { "c": 0, "y": 0, "p": 4 }, { "c": 0.2, "y": .2, "p": 2 },
        { "c": 0.4, "y": 2.5, "p": 2 }, { "c": 0.6, "y": .6, "p": 2 }, 
        { "c": 1, "y": 1, "p": 4 },
    ], 0,1)
rivers.pow(riverFlow).newBlend([-1, 1]);;


// Large scale terrain blending
var terrainBlendA = new NoiseGenerator({ name: "terrainBlendA", blendPower: 2, scale: scale * 150, octaves: 1, persistance: .5, lacunarity: 1, offset: 0, offsetX: -353, offsetY: -3222, amp: 1, blend: [1, 3] })
var terrainBlendB = new NoiseGenerator({ name: "terrainBlendB", blendPower: 2, blend: [.3, 1], scale: scale * 150, octaves: 1, persistance: .5, lacunarity: 1.3, offset: 0, offsetX: -3353, offsetY: -3212 }) //, blend:[squish1,squish2]

// Main terrain squash/stretch control  
var terrainSquash = new NoiseGenerator({
    name: "terrainSquash",
    blendPower: 2, scale: scale * 950, octaves: 1, persistance: .5, lacunarity: 1.3, offset: 0, offsetX: -3353, offsetY: -3212,
    add: [[mountainTerrain, 3 ], rivers], blend: [terrainBlendA, terrainBlendB] //blend it into some space (i know it's a great idea)
}) //, blend:[squish1,squish2]
terrainSquash.a = "squish", terrainBlendB.a = "squishv", terrainBlendA.a = "squish1"

// High altitude modifier
var altitudeModifier = new NoiseGenerator({ name: "altitudeModifier", scale: scale * 1000, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetY: 1553, amp: 2, blend: [.1, .5] })

// Plateau generator
var plateauGenerator = new NoiseGenerator({ name: "plateauGenerator", scale: scale * 450, power: altitudeModifier, abs: true, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetX: 1253, amp: 3 })

var smallHills = new NoiseGenerator({ name: "smallHills", scale: scale * 25, lowClip: 0, power: 3, highClip: 1, octaves: 3, persistance: .5, lacunarity: 1.75, offsetY: -1722, offsetX: -1553, amp: 1 })

var ridgeBase = new NoiseGenerator({ name: "ridgeBase", scale: scale * 50, octaves: 1, persistance: .5, lacunarity: 1, offset: -1, offsetX: 3253, offsetY: 3222, amp: 3 })
var ridgeDetail = new NoiseGenerator({ name: "ridgeDetail", scale: scale * 15, octaves: 2, persistance: .5, lacunarity: 1.4, offsetX: 253, offsetY: 222, offset: ridgeBase, amp: 1 })

// Final elevation map
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

let altNoiseDetail = new NoiseGenerator({ blend: [0,1], blendStyle: "recubic", scale: scale * 400, octaves: 3 , persistance: .5, lacunarity: 2})

let inf = { 
    input: (x,y) => { return x+y },
    min: 0, max: 1
}
let xnf = {
    input: createNoise2D(Alea(5)),
    min: -1, max: 1
}
let oxx = 1/15, oyy= 1/15
let circlo = {
    input: (x,y)=>{  
    var vx = x;
    var vy = y;
    let v = (vx * vx) + (vy * vy)
    return  Math.sqrt(v)
    },
    min:0, max:1
}
let xnfe = new Graph().scaleXY(1).fractal([xnf]).amp(.2)
let ele = new Graph()
ele.offsetXY(-8,8)
ele.scaleXY(15)
ele.offsetX(xnfe);
ele.fractal([circlo]).add(xnfe).abs().invert().lowClip(.01).highClip(1)

worldFactors.set("squish", terrainSquash);
worldFactors.set("elevation", elevation);
worldFactors.set("rivers", rivers);

// Base temperature variation
var tempBase = new NoiseGenerator({ power: .7, scale: scale * 550, octaves: 2, persistance: .5, lacunarity: 1, offset: -1, offsetX: 3153, offsetY: 3222, amp: 2 })

// Temperature noise
var tempNoise = new NoiseGenerator({ scale: scale * 350, abs: true, octaves: 3, persistance: .5, offset: -2, lacunarity: 1.75, offsetX: 1553, add: [tempBase], amp: 1 })

var tempDetail = new NoiseGenerator({ scale: scale * 10, octaves: 6, persistance: .25, lacunarity: 2, offset: 0 });
var tempBlend = new NoiseGenerator({ scale: scale * 1000, power: 1.25, blend: [.25, 3] });

// Final temperature map
var temperature = new NoiseGenerator({ scale: scale * 750, octaves: 3, persistance: .25, 
    add: [[elevation, -.3]], lacunarity: 2, blend: [-1, 1] });
worldFactors.set("temperature", temperature)

// Ocean proximity base
var oceanProximity = new NoiseGenerator({ scale: scale * 450, octaves: 1, persistance: .5, lacunarity: 1, offset: 0, offsetX: -3283, offsetY: 3232, amp: 2 })

// Humidity base
var humidityBase = new NoiseGenerator({ scale: scale * 350, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetX: 1653, add: [oceanProximity], amp: 1 })

// Moisture flow
var moistureFlow = new NoiseGenerator({ scale: scale * 150, abs: true, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetY: humidityBase, offsetX: 1553, add: [oceanProximity], amp: 1 })

// Final humidity map
var humidity = new NoiseGenerator({ scale: scale * 500, octaves: 6, persistance: .5, lacunarity: 1.7, 
    offsetX: -353, offsetY: 6662, blend: [-1 ,1], blendStyle: "recubic", 
    add: [[rivers, .2], [humidityBase, 3.7], [moistureFlow, 1.2], [elevation, .25]] 
});
worldFactors.set("humidity", humidity)

// Fantasy magic zones
var fantasyZones = new NoiseGenerator({
    scale: scale * 1200, octaves: 4, persistance: .5, lacunarity: 1.5, offsetY: 6472, offsetX: -4343,
    mapSpace: [0, 1], map: [
        { "c": 0.05, "y": 0, "p": 2 }, { "c": 0.5, "y": 0.9, "p": 3 }, { "c": .95, "y": 1, "p": 2 }], blend: [-1,1] //bitter zone, original mix, sugar zone
    });
worldFactors.set("fantasy", fantasyZones);

// Sugar deposit base
var sugarBase = new NoiseGenerator({ scale: scale * 350, octaves: 5, persistance: .5, lacunarity: 1.3, offset: 0, offsetX: 533, offsetY: 3222, amp: 2 })

// Sugar vein generator
var sugarVeins = new NoiseGenerator({ scale: scale * 350, abs: true, octaves: 5, persistance: .5, offset: 0, lacunarity: 1.75, offsetY: sugarBase, offsetX: 1653, amp: 1 })

// Sweet spots (positive sugar)
var sweetSpots = new NoiseGenerator({ scale: scale * 550, octaves: 6, persistance: .5, lacunarity: 2, offsetX: sugarVeins, offsetY: -3222, blend: [0, 2] });
var sugarOre = new NoiseGenerator({scale: scale * 250, octaves: 6, persistance: .5, lacunarity: 2, offsetX: sugarVeins, offsetY: -3222  });

// Bitter spots (negative sugar)
var bitterSpots = new NoiseGenerator({ scale: scale * 550, octaves: 6, persistance: .5, lacunarity: 2, offsetX: sugarVeins, offsetY: -3222, blend: [-2, 0] });

// Sugar zone mapping
var sugarZoneMap = new NoiseGenerator({ 
    scale: scale * 850, octaves: 7, 
    persistance: .45, lacunarity: 2, offsetY: -3756 , 
    add: [[elevation, -.2]], mapSpace: [0, 1], name: "sugarzonea",
    offsetX, offsetY, blendStyle: "recubic", map: [
        { "c": 0.0, "y": 0, "p": 2 }, { "c": 0.25, "y": 0, "p": 2 },  
        { "c": 0.5, "y": .5, "p": 3 }, { "c": .75, "y": 1, "p": 2 }, 
        { "c": 1, "y": 1, "p": 2 }]//, blend: [sweetSpots, bitterSpots] 
        //bitter zone, original mix, sugar zone
    }
);

// Final sugar distribution
var sugarZones = new NoiseGenerator({ name: "sugarzone",
    scale: scale * 1300, blendStyle: "recubic",
    offsetX, offsetY, blend: [bitterSpots, sweetSpots], add: [[temperature, 7.5], [humidity, 2], [elevation, -.2], [sugarZoneMap, 3]]
});

// Master sugar system
var masterSugar = new NoiseGenerator({ name: "sugao",
    scale: scale*2000, blend: [sugarZoneMap, sugarZones], blendStyle: "recubic"
})

worldFactors.set("sugar", masterSugar)
worldFactors.set("sugarzone", sugarZones)

let alea = Alea("n0");
for (const [k, v] of worldFactors)
	v.init?.(createNoise2D(alea), -1, 1);  

let e = worldFactors.get("sugar")
console.log(e.getValue(0,0));
export function getBiome(x, y) {
    var biomae = getreABiome(x + offsetX, y + offsetY)
    biomae.x = x + offsetX;
    biomae.y = y + offsetY;
    var factor = biomae.genCache.get(read);
    if (factor) 
        biomae.read = factor 
    
    return biomae
}