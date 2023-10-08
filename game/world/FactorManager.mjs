import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { inverseLerp } from "../../engine/n0math/ranges.mjs";
import { NoiseGenerator } from "./NoiseGenerator.mjs";

export const worldFactors = new Map();

//elevation map
export const biomes = new RangeMap(-4.77, 4.4)
biomes.add([11, 1, 150], 1.5) //deep water
biomes.add([50, 50, 200], 3) //water
biomes.add([170, 170, 125], .025) //beach
biomes.add([50, 200, 50], 3) // land
biomes.add([150, 200, 150],1) //mountain
biomes.add([150, 150, 150],.2) //mountain tips
export let ooo = false,oom=-1,moo=1;
export let minmax = [Infinity, -Infinity]
export function getBiome(x,y) {
    var elevation = worldFactors.get("elevation");
    var elevationValue = elevation.getValue(x+245,y+285).sum
    if (minmax[0]>elevationValue) minmax[0]=elevationValue
    if (minmax[1]<elevationValue) minmax[1]=elevationValue
    
    var biome = ooo? inverseLerp(oom,moo,elevationValue)*255 : biomes.get(elevationValue)
    //console.log({elevation, elevationValue, biome})
    return biome
}

var scale = 1
var noi3 = new NoiseGenerator({ scale: scale*20, octaves: 1, persistance: .5, lacunarity: 1, offset:0, offsetX:3253, offsetY:3222, amp:3})
var noi2 = new NoiseGenerator({ scale: scale*8, octaves: 2, persistance: .5, lacunarity: 1.4, offsetX:253, offsetY:222, offset:noi3, amp:1})
var noi = new NoiseGenerator({ scale: scale*3, octaves: 3, persistance: .5, lacunarity: 2, add: [[noi2,-1]] });
noi.a="noi",noi2.a="noi2",noi3.a="noi3"
worldFactors.set("elevation", noi)
