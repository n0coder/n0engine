import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { blend, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { getABiome } from "./BiomeWork.mjs";
import { NoiseGenerator } from "./NoiseGenerator.mjs";

export const worldFactors = new Map();

//elevation map

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
//i used to have a function where... 
//i could take nested rangemaps and have them output a list of their ranges
//much like this exportRanges feature
//the rangemaps inside the rangemaps would share the same range as well as... 

//var elevationMap = new RangeMap(-10, 10)
//var deepWater = new RangeMap(-3,3);
//elevationMap.add(deepWater) //deep water biomes
//deepWater.add("specific deep water biome")
//elevationMap.get(.3).get(-2)

//we are a handful of techs away from proper biome placement. 


//so the elevationMap controls height, the deepwater map controls which deep water biome is placed at that height.

//more properly, we would have a list of biomes at a specific height
//then we would spill that height factor ranges directly into the biome definition
//then we would branch out, make a rangemap for specific other types, like temperature and/or humidity
var octaves = 3;
var persistance = .5;
var offset = 0

function sis(octaves, persistance,offset=0) {
var sum =0
var amp = 1;
for (let o = 0; o < octaves; o++) {
    sum+=1*amp
    amp *= persistance;    
}
return sum+offset;
}

var sum = sis(3,.5)
sum *= sis(3,.5)
sum += sis(3, .5)
console.log(sum);

















//this is a clusterf* 
//the reason is because i'm doing visualization along side work
console.log(ranges);

export let ooo = "temperature",oom=-1,moo=1;
export let minmax = [Infinity, -Infinity,Infinity, -Infinity]
export function getBiome(x,y) {
    
    var vx = -285+x+245;
    var vy = y+2535

    var biomae = getABiome(vx,vy)
    //console.log(biomae)
    var biome = biomae? biomae.color : temp
    //console.log({elevation, elevationValue, biome})
    return biome
}
export const one = false; //to display only one pixel (helpful for debugging)
worldGrid.gridSize = 8
worldGrid.chunkSize= 8
var scl = 8;
var scale =.1525


//this is all hell on earth. try to implement rivers? game says what the fuck are those MORE ISLANDS?!
//var ansquish = new NoiseGenerator({ scale: scale*1000, lowClip: 0, octaves: 1, persistance: .5, lacunarity: 1.3, offset:0, offsetX:-3883, offsetY:3222})
var squish2 = new NoiseGenerator({ scale: scale*300, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:323, offsetY:-322, blend:[.1,.01]})
var squish1 = new NoiseGenerator({ scale: scale*300, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:-353, offsetY:-3222, amp:1, blend:[1,3.5]})
var squish = new NoiseGenerator({ scale: scale*100, octaves: 1, persistance: .5, lacunarity: 1.3, offset:0, blend:[squish1,squish2], offsetX:-3353, offsetY:-3212}) //, blend:[squish1,squish2]

var riverWorks2 = new NoiseGenerator({ scale: scale*50, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:3153, offsetY:3222, amp:1})
var riverWorks = new NoiseGenerator({ scale: scale*50, abs:true, octaves: 3, persistance: .5, lacunarity: 1.75, offsetX:1553, add:[riverWorks2], amp:1})

var riverWorksR2 = new NoiseGenerator({ scale: scale*450, octaves:1, persistance: .5, offset:0, lacunarity: 1.75, offsetY:1553, amp:2, blend:[-1,-.2] })
var riverWorksR = new NoiseGenerator({ scale: scale*150, abs:true, octaves:1, persistance: .5, offset:0, lacunarity: 1.75, offsetX:1253, amp:3, blend:[riverWorksR2,0] })

var justTips = new NoiseGenerator({ scale: scale*25, lowClip:0, power: 3, highClip:1, octaves: 3, persistance: .5, lacunarity: 1.75,offsetY:-1722, offsetX:-1553, amp:1})

var elevation3 = new NoiseGenerator({ scale: scale*50, octaves: 1, persistance: .5, lacunarity: 1, offset:-1, offsetX:3253, offsetY:3222, amp:3})
var elevation2 = new NoiseGenerator({ scale: scale*15, octaves: 2, persistance: .5, lacunarity: 1.4, offsetX:253, offsetY:222, offset:elevation3, amp:1})
var elevation = new NoiseGenerator({  power:squish, scale: scale*10, octaves: 3, persistance: .5, lacunarity: 2, add: [[elevation2,-1],[riverWorks,10],[riverWorksR,-4]] });


worldFactors.set("elevation", elevation);
worldFactors.set("rivers", riverWorksR);

var triverWorks2 = new NoiseGenerator({ power:.7,  scale: scale*550, octaves: 2, persistance: .5, lacunarity: 1, offset:-1, offsetX:3153, offsetY:3222, amp:2})
var triverWorks = new NoiseGenerator({ scale: scale*350, abs:true, octaves: 3, persistance: .5, offset:-3, lacunarity: 1.75, offsetX:1553, add:[triverWorks2], amp:1})
var sprinkle = new NoiseGenerator({ scale: scale*10, octaves: 6, persistance: .25, lacunarity: 2, offset:0});
var negative =new NoiseGenerator({ scale: scale*600, power: 1.5, blend:[.1,3.5] });
var temp = new NoiseGenerator({power:negative, scale: scale*750, add:[triverWorks], octaves: 3, persistance: .5, lacunarity: 2, offsetY:triverWorks  });
worldFactors.set("temperature", temp)

var triverWforks2 = new NoiseGenerator({ scale: scale*250, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:-3283, offsetY:3232, amp:2})
var triverWforks = new NoiseGenerator({ scale: scale*250, abs:true, octaves: 1, persistance: .5, offset:0, lacunarity: 1.75, offsetX:1653, add:[triverWforks2], amp:1})

var sprinkle = new NoiseGenerator({ scale: scale*250, abs:true, octaves: 1, persistance: .5, offset:0, lacunarity: 1.75, offsetY:triverWforks,  offsetX:1553, add:[triverWforks2], amp:1})
var humidity = new NoiseGenerator({scale: scale*150, octaves: 6, persistance: .5, lacunarity: 2, offsetX:-353, offsetY:6662, add:[[triverWforks,7],[sprinkle,1.2],[elevation,.25]] });
worldFactors.set("humidity", humidity)

var triverWsforks2 = new NoiseGenerator({ scale: scale*250, octaves: 5, persistance: .5, lacunarity: 1.3, offset:0, offsetX:53, offsetY:3222, amp:2})
var triverWsforks = new NoiseGenerator({ scale: scale*250, abs:true, octaves: 5, persistance: .5, offset:0, lacunarity: 1.75, offsetY:triverWsforks2, offsetX:1553, add:[triverWsforks2], amp:1})
var sugar = new NoiseGenerator({scale: scale*100, octaves: 6, persistance: .5, lacunarity: 2, offsetY:elevation, offsetX:triverWsforks, offsetY:-3222});
worldFactors.set("sugar", sugar)