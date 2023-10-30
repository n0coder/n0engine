import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { blend, clamp, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { getABiome } from "./BiomeWork.mjs";
import { NoiseGenerator } from "./NoiseGenerator.mjs";

export const worldFactors = new Map();

export const elevationBiomes = new RangeMap(-6.25, 6.25)
//elevationBiomes.add([r,g,b], weight)
elevationBiomes.add([11, 1, 150], .15) //deep water
elevationBiomes.add([50, 50, 200], 1.7) //water
elevationBiomes.add([170, 170, 125], .015) //beach
elevationBiomes.add([50, 200, 50], 3) // land
elevationBiomes.add([150, 200, 150],1) //mountain
elevationBiomes.add([150, 150, 150],.2) //mountain tips

// Temperature Colors
const temperatureColors = new RangeMap(-30, 50); // Assuming temperature range in Celsius
temperatureColors.add([0, 0, 255], .15); // Very Cold (-30C to -20C)
temperatureColors.add([0, 255, 255], .15); // Cold (-20C to -10C)
temperatureColors.add([0, 255, 0], .2); // Cool (-10C to 0C)
temperatureColors.add([255, 255, 0], .25); // Warm (0C to 20C)
temperatureColors.add([255, 165, 0], .15); // Hot (20C to 30C)
temperatureColors.add([255, 0, 0], .1); // Very Hot (30C to 50C)

// Humidity Colors
const humidityColors = new RangeMap(0, 100); // Assuming humidity percentage
humidityColors.add([255, 255, 0], .2); // Very Dry (0% to 20%)
humidityColors.add([205, 133, 63], .2); // Dry (20% to 40%)
humidityColors.add([34, 139, 34], .2); // Moderate (40% to 60%)
humidityColors.add([0, 255, 0], .2); // Humid (60% to 80%)
humidityColors.add([0, 255, 255], .2); // Very Humid (80% to 100%)

var ranges = elevationBiomes.exportRanges()
const sugarColors = new RangeMap(-1,1)
sugarColors.add([20,17,21],.2)
sugarColors.add([92,81,103],.2)
sugarColors.add([89,165,177],.2)
sugarColors.add([117,250,177],.2)
sugarColors.add([248,247,249],.2)


export var read = "fantasy", readRaw = false;
export var minmax = []
export function getBiome(x,y) {
    var biomae = getABiome(x+offsetX,y+offsetY)
    biomae.x = x+offsetX;
    biomae.y=y+offsetY;
    var factor = biomae.genCache.get(read);
    if (factor) {
        //biomae.read = factor 
        minmax= [factor.minm, factor.maxm]
    }
    //console.log(factor);
    return biomae
}
export var offsetX=111,offsetY = 0
export const one = false; //to display only one pixel (helpful for debugging)
worldGrid.gridSize = 16
worldGrid.chunkSize= 8
var vvscale =1



var scale = vvscale*.75

var rscale = 50;
var riverWorks2 = new NoiseGenerator({ scale: scale*rscale, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:3153, offsetY:3222, amp:1})
var riverWorks = new NoiseGenerator({ scale: scale*rscale, abs:true, octaves: 3, persistance: .5, lacunarity: 1.75, offsetX:1553, add:[riverWorks2], amp:1})

var xx = 1533, yy = 1263, riverScale = 275;
var riverWorksR2 = new NoiseGenerator({ scale: scale*riverScale*2.8, add:[riverWorks], octaves:1, persistance: .5, offset:0, lacunarity: 1.75, offsetX:353, offsetY:3153, blend:[.1,.7] })
var riverWorksR = new NoiseGenerator({ power:riverWorksR2, abs:true, scale: scale*riverScale, octaves:1, persistance: .5, offset:0, lacunarity: 1.75, offsetX: xx, offsetY:yy,
    mapSpace: [0,1],map:[ //take in a map, (of relative height, controls)
    {"c": 0, "y": 0, "p":4},{"c": 0.2, "y": .2, "p":2},
    {"c": 0.4, "y": 2.5 , "p":2},{"c": 0.6, "y": .6, "p":2},{"c": 1, "y": 1, "p":4},
],   blend:[-1,1]
})

var squish1 = new NoiseGenerator({ blendPower:2,scale: scale*150, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:-353, offsetY:-3222, amp:1, blend:[2,3]})
var squishv = new NoiseGenerator({ blendPower:2, blend:[.3,1], scale: scale*150, octaves: 1, persistance: .5, lacunarity: 1.3, offset:0,  offsetX:-3353, offsetY:-3212}) //, blend:[squish1,squish2]
var squish = new NoiseGenerator({blendPower:2, scale: scale*950, octaves: 1, persistance: .5, lacunarity: 1.3, offset:0,  offsetX:-3353, offsetY:-3212,
    mapSpace: [-1,1],map:[ //take in a map, (of relative height, controls)
        {"c": -.1, "y": 0, "p":2},{"c": 0.05, "y": .4, "p":3}, {"c": .2, "y": 0.099, "p":2},
        {"c": .222, "y": 0, "p":3},  {"c": .314, "y": -0.8, "p":2},{"c": .5, "y": -0.83, "p":1},
        {"c": .6, "y": -.83, "p":1},{"c": .62, "y":-.43, "p":2.3},{"c": .76, "y": 0.43, "p":2},
        {"c": .8, "y": -0.985, "p":2},{"c": 1, "y": -1, "p":3},
    ], add:[[riverWorks,3],riverWorksR], blend:[squish1,squishv] //blend it into some space (i know it's a great idea)
}) //, blend:[squish1,squish2]
squish.a = "squish", squishv.a = "squishv", squish1.a = "squish1"


var riverR2 = new NoiseGenerator({ scale: scale*1000, octaves:1, persistance: .5, offset:0, lacunarity: 1.75, offsetY:1553, amp:2, blend:[.1,.5] })
var riverR = new NoiseGenerator({ scale: scale*450, power:riverR2, abs:true, octaves:1, persistance: .5, offset:0, lacunarity: 1.75,offsetX:1253, amp:3 })

var justTips = new NoiseGenerator({ scale: scale*25, lowClip:0, power: 3, highClip:1, octaves: 3, persistance: .5, lacunarity: 1.75,offsetY:-1722, offsetX:-1553, amp:1})

var elevation3 = new NoiseGenerator({ scale: scale*50, octaves: 1, persistance: .5, lacunarity: 1, offset:-1, offsetX:3253, offsetY:3222, amp:3})
var elevation2 = new NoiseGenerator({ scale: scale*15, octaves: 2, persistance: .5, lacunarity: 1.4, offsetX:253, offsetY:222, offset:elevation3, amp:1})
var elevation = new NoiseGenerator({ power:squish,  blend:[-1,1], scale: scale*400, octaves: 3, persistance: .5, lacunarity: 2,
    mapSpace: [0,1.1], map:[
        {"c": 0, "y": 0.01, "p":3}, {"c": .25, "y": 0.01, "p":1.2},
        {"c": .3, "y": .4}, {"c": .41, "y": .4},{"c": .45, "y": .7},
        {"c": .5, "y": .7},{"c": .53, "y": .72, "p":1.8},
        {"c": .72, "y": .85},{"c": .99, "y": .99, "p":3} 
    ],
});

worldFactors.set("squish", squish);
worldFactors.set("elevation", elevation);
worldFactors.set("rivers", riverWorksR);
//worldFactors.set("rivex", riverWorks);

var triverWorks2 = new NoiseGenerator({ power:.7,  scale: scale*550, octaves: 2, persistance: .5, lacunarity: 1, offset:-1, offsetX:3153, offsetY:3222, amp:2})
var triverWorks = new NoiseGenerator({ scale: scale*350, abs:true, octaves: 3, persistance: .5, offset:-2, lacunarity: 1.75, offsetX:1553, add:[triverWorks2], amp:1})
var sprinkle = new NoiseGenerator({ scale: scale*10, octaves: 6, persistance: .25, lacunarity: 2, offset:0});
var negative =new NoiseGenerator({ scale: scale*1000, power: 1.25, blend:[.25,3] });
var temp = new NoiseGenerator({ scale: scale*1000,octaves: 3, persistance: .25, add:[[elevation,-.1]], lacunarity: 2, blend:[-1,1]});
worldFactors.set("temperature", temp)

var triverWforks2 = new NoiseGenerator({ scale: scale*450, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:-3283, offsetY:3232, amp:2})
var triverWforks = new NoiseGenerator({ scale: scale*450,  octaves: 1, persistance: .5, offset:0, lacunarity: 1.75, offsetX:1653, add:[triverWforks2], amp:1})

var sprinkle = new NoiseGenerator({ scale: scale*150, abs:true, octaves: 1, persistance: .5, offset:0, lacunarity: 1.75, offsetY:triverWforks,  offsetX:1553, add:[triverWforks2], amp:1})
var humidity = new NoiseGenerator({scale: scale*150, octaves: 6, persistance: .5, lacunarity: 2, offsetX:-353, offsetY:6662, add:[[riverWorksR,-.2],[triverWforks,7],[sprinkle,1.2],[elevation,.25]] });
worldFactors.set("humidity", humidity)

var fantasy = new NoiseGenerator({scale: scale*500, octaves:4, persistance: .5, lacunarity: 1.5,  offsetY:6472, offsetX:-4343,
    mapSpace: [0,1], map:[
        {"c": 0, "y": 0, "p":2},{"c": 0.6, "y": .1, "p":2},{"c": 0.7, "y": 0.9, "p":2}, {"c": 1, "y": 1, "p":2}], blend:[-1,1]
});
worldFactors.set("fantasy", fantasy);

var triverWsforks2 = new NoiseGenerator({  scale: scale*250, octaves: 5, persistance: .5, lacunarity: 1.3, offset:0, offsetX:53, offsetY:3222, amp:2})
var triverWsforks = new NoiseGenerator({ scale: scale*250, abs:true, octaves: 5, persistance: .5, offset:0, lacunarity: 1.75, offsetY:triverWsforks2, offsetX:1553, amp:1})
var sugar = new NoiseGenerator({scale: scale*250, octaves: 6, persistance: .5, lacunarity: 2, offsetX:triverWsforks, offsetY:-3222});
worldFactors.set("sugar", sugar)