import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { inverseLerp } from "../../engine/n0math/ranges.mjs";
import { NoiseGenerator } from "./NoiseGenerator.mjs";

export const worldFactors = new Map();

//elevation map

export const biomes = new RangeMap(-6.25, 6.25)
biomes.add([11, 1, 150], 1.5) //deep water
biomes.add([50, 50, 200], 3) //water
biomes.add([170, 170, 125], .025) //beach
biomes.add([50, 200, 50], 3) // land
biomes.add([150, 200, 150],1) //mountain
biomes.add([150, 150, 150],.2) //mountain tips

//i used to have a function where... 
//i could take nested rangemaps and have them output a list of their ranges
//much like this exportRanges feature
var ranges = biomes.exportRanges()
//the rangemaps inside the rangemaps would share the same range as well as... 

//var elevationMap = new RangeMap(-10, 10)
//var deepWater = new RangeMap(-3,3);
//elevationMap.add(deepWater) //deep water biomes
//deepWater.add("specific deep water biome")
//elevationMap.get(.3).get(-2)

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


















console.log(ranges);

export let ooo = false,oom=-1,moo=1;
export let minmax = [Infinity, -Infinity, 0,0]
export function getBiome(x,y) {
    var elevation = worldFactors.get("elevation");
    var val = elevation.getValue(x+245,y+285);
    var elevationValue = val.sum
    //console.log(val)


    if (minmax[0]>elevationValue) minmax[0]=elevationValue
    if (minmax[1]<elevationValue) minmax[1]=elevationValue
    

    minmax[2]=val.minm
    minmax[3]=val.maxm
    var biome = ooo? inverseLerp(oom,moo,elevationValue)*255 : biomes.get(elevationValue, val.minm, val.maxm)
    //console.log({elevation, elevationValue, biome})
    return biome
}
worldGrid.gridSize = 8
worldGrid.chunkSize= 8 
var scl = 8;
var scale = 1
var squish = new NoiseGenerator({ scale: scale*100, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:-3253, offsetY:-3222, blend:[0.01,2]})

var noi3 = new NoiseGenerator({ scale: scale*20, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:3253, offsetY:3222, amp:3})
var noi2 = new NoiseGenerator({ scale: scale*8, octaves: 2, persistance: .5, lacunarity: 1.4, offsetX:253, offsetY:222, offset:noi3, amp:1})
var noi = new NoiseGenerator({ power:squish, scale: scale*3, octaves: 3, persistance: .5, lacunarity: 2, add: [[noi2,-1]] });
noi.a="noi",noi2.a="noi2",noi3.a="noi3"
worldFactors.set("elevation", noi)
