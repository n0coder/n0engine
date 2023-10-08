import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { NoiseGenerator } from "./NoiseGenerator.mjs";

export const worldFactors = new Map();

//elevation map
export const biomes = new RangeMap(-2, 2)
biomes.add([11, 1, 150], .5) //deep water
biomes.add([50, 50, 200], 1) //water
biomes.add([170, 170, 125], .2) //beach
biomes.add([50, 200, 50], 1) // land
biomes.add([150, 200, 150],1) //mountain
biomes.add([150, 150, 150],.2) //mountain tips

export function getBiome(x,y) {
    var elevation = worldFactors.get("elevation");
    var elevationValue = elevation.getValue(x,y).sum
    var biome = biomes.get(elevationValue)
    //console.log({elevation, elevationValue, biome})
    return biome
}

var scale = 15; 
var noi2 = new NoiseGenerator({ scale: scale*2.5, octaves: 1, persistance: .5, lacunarity: 1, offsetX:253, offsetY:222 })
var noi = new NoiseGenerator({ scale: scale, octaves: 3, persistance: .5, lacunarity: 2, add: [[noi2,-1]] });
worldFactors.set("elevation", noi)
