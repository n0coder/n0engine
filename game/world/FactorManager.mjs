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
let noise = createNoise2D(Alea("n0"))

let xnf = {
    input: noise,
    min: -1, max: 1
}
export var read =undefined, readRaw = true;
export var minmax = []

export var offsetX = 100, offsetY = 100
export const one = false; //to display only one pixel (helpful for debugging)

var vvscale = .3//140
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
//var terrainBlendA = new NoiseGenerator({ name: "terrainBlendA", blendPower: 2, scale: scale * 150, octaves: 1, persistance: .5, lacunarity: 1, offset: 0, offsetX: -353, offsetY: -3222, amp: 1, blend: [1, 3] })
//var terrainBlendB = new NoiseGenerator({ name: "terrainBlendB", blendPower: 2, blend: [.3, 1], scale: scale * 150, octaves: 1, persistance: .5, lacunarity: 1.3, offset: 0, offsetX: -3353, offsetY: -3212 }) //, blend:[squish1,squish2]
let terrainBlendA = new Graph().scaleXY(scale*150).offsetXY(-353, -3222).fractal(xnf, 1, .5, 1).newBlend([1, 3]);
let terrainBlendB = new Graph().scaleXY(scale*150).offsetXY(-3353, -3212).fractal(xnf, 1, .5, 1.3).newBlend([.3, 1]);

// Main terrain squash/stretch control  
/*var terrainSquash = new NoiseGenerator({
    name: "terrainSquash",
    blendPower: 2, scale: scale * 950, octaves: 1, persistance: .5, lacunarity: 1.3, offset: 0, offsetX: -3353, offsetY: -3212,
    add: [[mountainTerrain, 3 ], rivers], blend: [terrainBlendA, terrainBlendB] //blend it into some space (i know it's a great idea)
}) //, blend:[squish1,squish2]
terrainSquash.a = "squish", terrainBlendB.a = "squishv", terrainBlendA.a = "squish1"*/
let terrainSquash = new Graph().scaleXY(scale*950).offsetXY(-3353, -3212).fractal(xnf, 1,.5, 1.3);
terrainSquash.add(mountainTerrain, 3).add(rivers).newBlend([terrainBlendA, terrainBlendB]);


//let altNoiseDetail = new NoiseGenerator({ blend: [0,1], blendStyle: "recubic", scale: scale * 400, octaves: 3 , persistance: .5, lacunarity: 2})
// High altitude modifier
//var altitudeModifier = new NoiseGenerator({ name: "altitudeModifier", scale: scale * 1000, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetY: 1553, amp: 2, blend: [.1, .5] })

// Plateau generator
//var plateauGenerator = new NoiseGenerator({ name: "plateauGenerator", scale: scale * 450, power: altitudeModifier, abs: true, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetX: 1253, amp: 3 })

//var smallHills = new NoiseGenerator({ name: "smallHills", scale: scale * 25, lowClip: 0, power: 3, highClip: 1, octaves: 3, persistance: .5, lacunarity: 1.75, offsetY: -1722, offsetX: -1553, amp: 1 })

//var ridgeBase = new NoiseGenerator({ name: "ridgeBase", scale: scale * 50, octaves: 1, persistance: .5, lacunarity: 1, offset: -1, offsetX: 3253, offsetY: 3222, amp: 3 })
//var ridgeDetail = new NoiseGenerator({ name: "ridgeDetail", scale: scale * 15, octaves: 2, persistance: .5, lacunarity: 1.4, offsetX: 253, offsetY: 222, offset: ridgeBase, amp: 1 })

/* var elevation = new NoiseGenerator({
    name: "elevation",
    power: terrainSquash, scale: scale * 400, octaves: 3, persistance: .5, lacunarity: 2,  
    mapSpace: [0, 1], map: [
        { "c": 0, "y": 0.01, "p": 3 }, { "c": .15, "y": 0.01, "p": 1.2 },
        { "c": .3, "y": .2 }, { "c": .41, "y": .4 }, { "c": .47, "y": .45 },
        { "c": .55, "y": .5 }, { "c": .63, "y": .74, "p": 1.8 },
        { "c": .72, "y": .75 }, { "c": .99, "y": .99, "p": 3 }
    ]
}); */
let elevation = new Graph().scaleXY(scale*400).fractal(xnf, 3, .5, 2).map([
    { "c": 0, "y": 0.01, "p": 3 }, { "c": .15, "y": 0.01, "p": 1.2 },
    { "c": .3, "y": .2 }, { "c": .41, "y": .4 }, { "c": .47, "y": .45 },
    { "c": .55, "y": .5 }, { "c": .63, "y": .74, "p": 1.8 },
    { "c": .72, "y": .75 }, { "c": .99, "y": .99, "p": 3 }
], 0, 1).pow(terrainSquash).add(rivers,.1);
worldFactors.set("squish", terrainSquash);
worldFactors.set("elevation", elevation);
worldFactors.set("rivers", rivers);

// Base temperature variation
//var tempBase = new NoiseGenerator({ power: .7, scale: scale * 550, octaves: 2, persistance: .5, lacunarity: 1, offset: -1, offsetX: 3153, offsetY: 3222, amp: 2 })

// Temperature noise
//var tempNoise = new NoiseGenerator({ scale: scale * 350, abs: true, octaves: 3, persistance: .5, offset: -2, lacunarity: 1.75, offsetX: 1553, add: [tempBase], amp: 1 })

//var tempDetail = new NoiseGenerator({ scale: scale * 10, octaves: 6, persistance: .25, lacunarity: 2, offset: 0 });
//var tempBlend = new NoiseGenerator({ scale: scale * 1000, power: 1.25, blend: [.25, 3] });

/* var temperature = new NoiseGenerator({ scale: scale * 750, octaves: 3, persistance: .25, 
    add: [[elevation, -.3]], lacunarity: 2, blend: [-1, 1] }); 
*/
let temperature = new Graph().scaleXY(scale*750).fractal(xnf, 3, .25, 2).add(elevation, -.25).newBlend([-1, 1])
worldFactors.set("temperature", temperature)

/*var oceanProximity = new NoiseGenerator({ scale: scale * 450, octaves: 1, persistance: .5, lacunarity: 1, offset: 0, offsetX: -3283, offsetY: 3232, amp: 2 })
var humidityBase = new NoiseGenerator({ scale: scale * 350, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetX: 1653, add: [oceanProximity], amp: 1 })
var moistureFlow = new NoiseGenerator({ scale: scale * 150, abs: true, octaves: 1, persistance: .5, offset: 0, lacunarity: 1.75, offsetY: humidityBase, offsetX: 1553, add: [oceanProximity], amp: 1 })
var humidity = new NoiseGenerator({ scale: scale * 500, octaves: 6, persistance: .5, lacunarity: 1.7, 
    offsetX: -353, offsetY: 6662, blend: [-1 ,1], blendStyle: "recubic", 
    add: [[rivers, .2], [humidityBase, 3.7], [moistureFlow, 1.2], [elevation, .25]] 
});*/

let humidityBase = new Graph().scaleXY(scale*350).offsetX(1653).fractal(xnf, 1, .5, 1.75);
let moistureFlow =  new Graph().scaleXY(scale*150).offsetXY(1553, humidityBase).fractal(xnf, 1, .5, 1.75);
moistureFlow.abs()
let humidity = new Graph().scaleXY(scale*500).offsetXY(-353, 6662)
humidity.add(rivers, .2).add(humidityBase,1).add(moistureFlow, 0.5).add(elevation, .25);
worldFactors.set("humidity", humidity)

/*
// Fantasy magic zones
var fantasyZones = new NoiseGenerator({
    scale: scale * 1200, octaves: 4, persistance: .5, lacunarity: 1.5, offsetY: 6472, offsetX: -4343,
    mapSpace: [0, 1], map: [
        { "c": 0.05, "y": 0, "p": 2 }, { "c": 0.5, "y": 0.9, "p": 3 }, { "c": .95, "y": 1, "p": 2 }], blend: [-1,1] //bitter zone, original mix, sugar zone
    });
worldFactors.set("fantasy", fantasyZones);
*/

/*
    var sugarBase = new NoiseGenerator({ scale: scale * 350, octaves: 5, persistance: .5, lacunarity: 1.3, offset: 0, offsetX: 533, offsetY: 3222, amp: 2 })
    var sugarVeins = new NoiseGenerator({ scale: scale * 350, abs: true, octaves: 5, persistance: .5, offset: 0, lacunarity: 1.75, offsetY: sugarBase, offsetX: 1653, amp: 1 })
    var sweetSpots = new NoiseGenerator({ scale: scale * 550, octaves: 6, persistance: .5, lacunarity: 2, offsetX: sugarVeins, offsetY: -3222, blend: [0, 2] });
    var bitterSpots = new NoiseGenerator({ scale: scale * 550, octaves: 6, persistance: .5, lacunarity: 2, offsetX: sugarVeins, offsetY: -3222, blend: [-2, 0] });
*/
/*
    let sugarBase = new Graph().scaleXY(scale*350).offsetXY(533, 3222).fractal(xnf, 5, .5, 1.3)
    sugarBase.amp(3)
    let sugarVeins = new Graph().scaleXY(scale*350).offsetXY(1653, sugarBase).fractal(xnf, 5, .5, 1.75)
    sugarVeins.abs()    
    let sweetSpots = new Graph().scaleXY(scale * 550).offsetXY(sugarVeins, -3222).fractal(xnf, 6, .5, 2);
    sweetSpots.newBlend([0,2])
    let bitterSpots = new Graph().scaleXY(scale * 550).offsetXY(sugarVeins, -3222).fractal(xnf, 6, .5, 2);
    bitterSpots.newBlend([2, 0])
    
let svv =sugarVeins.create(143,5);
console.log(svv);
*/
/*var sugarZoneMap = new NoiseGenerator({ 
    scale: scale * 850, octaves: 7, 
    persistance: .45, lacunarity: 2, offsetY: -3756 , 
    add: [[elevation, -.2]], mapSpace: [0, 1], name: "sugarzonea",
    offsetX, offsetY, blendStyle: "recubic", map: [
        { "c": 0.0, "y": 0, "p": 2 }, { "c": 0.25, "y": 0, "p": 2 },  
        { "c": 0.5, "y": .5, "p": 3 }, { "c": .75, "y": 1, "p": 2 }, 
        { "c": 1, "y": 1, "p": 2 }]//, blend: [sweetSpots, bitterSpots] 
        //bitter zone, original mix, sugar zone
    }
); */
/*
let sugarZoneMap = new Graph().scaleXY(scale*850).offsetXY(0,0).fractal(xnf, 7, .45, 2);
sugarZoneMap.map([
    { "c": 0.0, "y": 0, "p": 2 }, { "c": 0.25, "y": 0, "p": 2 },  
    { "c": 0.5, "y": .5, "p": 3 }, { "c": .75, "y": 1, "p": 2 }, 
    { "c": 1, "y": 1, "p": 2 }
], 0, 1).add(elevation, -.3).newBlend([bitterSpots,sugarVeins,0, sugarVeins, bitterSpots],.3);
let sugarZones = new Graph().scaleXY(scale*1300).fractal(xnf)
sz.add(temp, 1).add(humi, .4).add(ele,.5).add(szm, 1);
*/

/*
// Final sugar distribution
var sugarZones = new NoiseGenerator({ name: "sugarzone",
    scale: scale * 1300, blendStyle: "recubic",
    offsetX, offsetY, blend: [bitterSpots, sweetSpots], add: [[temperature, 7.5], [humidity, 2], [elevation, -.2], [sugarZoneMap, 3]]
});

// Master sugar system
var masterSugar = new NoiseGenerator({ name: "sugao",
    scale: scale*2000, blend: [sugarZoneMap, sugarZones], blendStyle: "recubic"
})*/


var sugarBase = new NoiseGenerator({ 
    scale: scale * 350, octaves: 5, persistance: .5, lacunarity: 1.3, 
    offset: 0, offsetX: 533, offsetY: 3222, amp: 2 
})
var sugarVeins = new NoiseGenerator({ 
    scale: scale * 350, abs: true, octaves: 5, persistance: .5, offset: 0, 
    lacunarity: 1.75, offsetY: sugarBase, offsetX: 1653, amp: 1 })

var sweetSpots = new NoiseGenerator({ 
    scale: scale * 550, octaves: 6, persistance: .5, lacunarity: 2, 
    offsetX: sugarVeins, offsetY: -3222, blend: [0, 2] 
});

var bitterSpots = new NoiseGenerator({ 
    scale: scale * 550, octaves: 6, persistance: .5, lacunarity: 2, 
    offsetX: sugarVeins, offsetY: -3222, blend: [0, -2] 
});

var sugarZoneMap = new NoiseGenerator({ 
    scale: scale * 850, octaves: 7, 
    persistance: .45, lacunarity: 2, 
    add: [[elevation, -.2]], mapSpace: [0, 1], name: "sugarzonea",
    offsetX:0, offsetY:0, blendStyle: "recubic", map: [
        { "c": 0.0, "y": 0, "p": 2 }, { "c": 0.25, "y": 0, "p": 2 },  
        { "c": 0.5, "y": .5, "p": 3 }, { "c": .75, "y": 1, "p": 2 }, 
        { "c": 1, "y": 1, "p": 2 }],
        blend:[bitterSpots, sweetSpots],
    },
);

// Final sugar distribution
var sugarZones = new NoiseGenerator({ name: "sugarzone",
    scale: scale * 1300, blendStyle: "recubic",
    offsetX:0, offsetY:0, blend: [bitterSpots, sweetSpots], 
    add: [[temperature, 7.5], [humidity, 2], [elevation, -.2], [sugarZoneMap, 3]]
});

// Master sugar system
var masterSugar = new NoiseGenerator({ name: "sugao",
    scale: scale*2000, blend: [sugarZoneMap, sugarZones], blendStyle: "recubic"
})


masterSugar.init(noise)
worldFactors.set("sugar", masterSugar)

export function getBiome(x, y) {
    console.error("i could delete this")
    var biomae = getreABiome(x + offsetX, y + offsetY)
    biomae.x = x + offsetX;
    biomae.y = y + offsetY;
    var factor = biomae.genCache.get(read);
    if (factor) 
        biomae.read = factor 
    
    return biomae
}