import { RangeMap } from "../../engine/collections/RangeMap.mjs";


//you may be asking why use a rangemap?
//it's for categorization, and placement

var snowyPlains = "snowyPlains"
var iceSpikes = "iceSpikes"
var snowyTundra = "snowyTundra"
var snowyTaiga = "snowyTaiga"
var taiga = "taiga"
var plains = "plains"
var forest = "forest"
var jungle = "jungle"
var flowerForest = "flowerForest"
var darkForest = "darkForest"
var savannah = "savannah"
var desert = "desert"
var river = "river"


//height -> temperature -> humidity




export var heightMap = new RangeMap(-5,5);

var deepBiomes = new RangeMap(-1,1)
deepBiomes.add("deep water", 1)
deepBiomes.add("deep lava", 1)
heightMap.add(deepBiomes,.15)

var lowBiomes = new RangeMap(-1,1) 

lowBiomes.add("water", 1)
heightMap.add(lowBiomes,1.7)

var borderBiome = new RangeMap(-1,1) 
borderBiome.add("beach", 1)
heightMap.add(borderBiome, .015);

//var surfaceBiomes = new RangeMap(-1,1) 

var surfaceBiomes = new RangeMap(-1,1)
var surfaceFrozenHumidityBiomes = new RangeMap(-1, 1)
surfaceFrozenHumidityBiomes.add(snowyPlains,2)
surfaceFrozenHumidityBiomes.add(snowyTundra,1)
surfaceFrozenHumidityBiomes.add(snowyTaiga,1)
surfaceFrozenHumidityBiomes.add(taiga,1)
surfaceBiomes.add(surfaceFrozenHumidityBiomes)
var surfaceColdHumidityBiomes = new RangeMap(-1, 1)
surfaceColdHumidityBiomes.add(plains,2)
surfaceColdHumidityBiomes.add(forest,1)
surfaceColdHumidityBiomes.add(taiga,2)
surfaceBiomes.add(surfaceColdHumidityBiomes)
var surfaceNeutralHumidityBiomes = new RangeMap(-1, 1)
surfaceNeutralHumidityBiomes.add(flowerForest,1)
surfaceNeutralHumidityBiomes.add(plains,1)
surfaceNeutralHumidityBiomes.add(forest,2)
surfaceNeutralHumidityBiomes.add(darkForest,1)
surfaceBiomes.add(surfaceNeutralHumidityBiomes)
var surfaceWarmHumidityBiomes = new RangeMap(-1, 1)
surfaceWarmHumidityBiomes.add(savannah,2)
surfaceWarmHumidityBiomes.add(forest,1)
surfaceWarmHumidityBiomes.add(jungle,2)
surfaceBiomes.add(surfaceWarmHumidityBiomes)
var surfaceHotHumidityBiomes = new RangeMap(-1, 1)
surfaceHotHumidityBiomes.add(desert,5)
surfaceBiomes.add(surfaceHotHumidityBiomes)
heightMap.add(surfaceBiomes, 3)

var highBiomes = new RangeMap(-1,1) 
highBiomes.add("mountain", 1)
heightMap.add(highBiomes, 1)

var cloudBiomes = new RangeMap(-1,1) 
cloudBiomes.add("mountain tip", 1)
heightMap.add(cloudBiomes, .2);

heightMap.add("anything else")
heightMap.add("anything of else")
//save ranges in -1,1 space
//have biome convert itself to world space

    function exportBiomes(map, args, biomes, index=0, collectedFactors=[]) {
    biomes ||= new Map()
    var ranges = map.exportRanges(args[index], -1, 1);
    index++;

    for (let r = 0; r < ranges.length; r++) {
        let factors = [...collectedFactors];
        
        if (!factors.some(o=>o.factor == ranges[r][1]&&o.min== ranges[r][2]&&o.max== ranges[r][3])) {
            factors.push({factor: ranges[r][1], min: ranges[r][2], max: ranges[r][3]});
        }

        if (ranges[r][0] instanceof RangeMap) {
            exportBiomes(ranges[r][0], args, biomes, index, factors)
        } else {
            var biome = biomes.get(ranges[r][0])
            if (!biome) {
                biome = {factors:[]}
                biomes.set(ranges[r][0], biome)
            }
            factors.forEach(o => {
                if (!(biome.factors.some(bf => bf.factors == o.factors&&o.min== bf.min&&o.max==bf.max))) {
                    biome.factors.push(o);
                }
            });           
        }
    }
    return biomes;
}

/*
  
function ExportBiomes(heightMap, ...args) {
var biomes = new Map();
var heights = heightMap.exportRanges(args[0],-1,1)
for (let hs = 0; hs < heights.length; hs++) {
    if (heights[hs][0] instanceof RangeMap) {
        const temps = heights[hs][0].exportRanges(args[1],-1,1);
        for (let ts = 0; ts < temps.length; ts++) { 
            
            if (temps[ts][0] instanceof RangeMap) {
                const humids = temps[ts][0].exportRanges(args[2],-1,1);
                for (let ys = 0; ys < humids.length; ys++) { 
                    if (humids[ys][0] instanceof RangeMap) {
                        // same procedure this needs to call be a recursive 
                    } else {
                        var biome = biomes.get(humids[ys][0])
                        if (!biome) {
                            biome = {factors:[]}
                            biomes.set(humids[ys][0], biome)
                        }
                        biome.factors.push({factor: humids[ys][1], min: humids[ys][2], max: humids[ys][3]});
                        biome.factors.push({factor: temps[ts][1], min: temps[ts][2], max: temps[ts][3]});
                        biome.factors.push({factor: heights[hs][1], min: heights[hs][2], max: heights[hs][3]});
                    }
        
                }
            } else {
                var biome = biomes.get(temps[ts][0])
                if (!biome) {
                    biome = {factors:[]}
                    biomes.set(temps[ts][0], biome)
                }
                biome.factors.push({factor: temps[ts][1], min: temps[ts][2], max: temps[ts][3]});
                biome.factors.push({factor: heights[hs][1], min: heights[hs][2], max: heights[hs][3]});
            }

        }
    } else {
        var biome = biomes.get(heights[hs][0])
        if (!biome) {
            biome = {factors:[]}
            biomes.set(heights[hs][0], biome)
        }
        biome.factors.push({factor: heights[hs][1], min: heights[hs][2], max: heights[hs][3]});
        
    }
    //for
} 
return biomes;
}
*/
console.log(exportBiomes(heightMap, ["elevation", "temperature", "humidity"] ))
//console.log(heightMap.array.map(o=>o.biome.array.map(b=>{return{biome:b.biome}})))