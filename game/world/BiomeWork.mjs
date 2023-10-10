import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { worldFactors } from "./FactorManager.mjs";
import { Biome } from "./biome.mjs";


//you may be asking why use a rangemap?
//it's for categorization, and placement

var snowyPlains = new Biome("snowyPlains", [197, 245, 230])
var snowyTundra = new Biome("snowyTundra", [192, 219, 245])
var snowyTaiga = new Biome("snowyTaiga", [198, 239, 246])
var taiga = new Biome("taiga", [140, 196, 108])
var plains = new Biome("plains", [190, 199, 104])
var forest = new Biome("forest", [98, 171, 84])
var jungle = new Biome("jungle", [38, 173, 25])
var flowerForest = new Biome("flowerForest", [96, 189, 133])
var darkForest = new Biome("darkForest", [28, 130, 18])
var savannah = new Biome("savannah", [161, 110, 34])
var desert = new Biome("desert", [237, 226, 123])

var river = new Biome("river", [0, 0, 255], [{ factor: "rivers", min: 0, max: 1 }, { factor: "elevation", min: 0, max: 1 }])
var water = new Biome("water", [60, 147, 171])
export var heightMap = new RangeMap(-5, 5);

var deepBiomes = new RangeMap(-1, 1)
deepBiomes.add(new Biome("deepwater", [46, 81, 170]), 1)
heightMap.add(deepBiomes, .15)

var lowBiomes = new RangeMap(-1, 1)

lowBiomes.add(water, 1)
heightMap.add(lowBiomes, 1.3)

var borderBiome = new RangeMap(-1, 1)
borderBiome.add(new Biome("beach", [237, 226, 123]), 1)
heightMap.add(borderBiome, .015);

//var surfaceBiomes = new RangeMap(-1,1) 

var surfaceBiomes = new RangeMap(-1, 1)
var surfaceFrozenHumidityBiomes = new RangeMap(-1, 1)
surfaceFrozenHumidityBiomes.add(snowyPlains, 2)
surfaceFrozenHumidityBiomes.add(snowyTundra, 1)
surfaceFrozenHumidityBiomes.add(snowyTaiga, 1)
surfaceFrozenHumidityBiomes.add(taiga, 1)
surfaceBiomes.add(surfaceFrozenHumidityBiomes)
var surfaceColdHumidityBiomes = new RangeMap(-1, 1)
surfaceColdHumidityBiomes.add(plains, 4)
surfaceColdHumidityBiomes.add(forest, 1)
surfaceColdHumidityBiomes.add(taiga, 3)
surfaceBiomes.add(surfaceColdHumidityBiomes)
var surfaceNeutralHumidityBiomes = new RangeMap(-1, 1)
surfaceNeutralHumidityBiomes.add(flowerForest, 2)
surfaceNeutralHumidityBiomes.add(plains, 3)
surfaceNeutralHumidityBiomes.add(forest, 2)
surfaceNeutralHumidityBiomes.add(darkForest, 2)
surfaceBiomes.add(surfaceNeutralHumidityBiomes)
var surfaceWarmHumidityBiomes = new RangeMap(-1, 1)
surfaceWarmHumidityBiomes.add(savannah, 3)
surfaceWarmHumidityBiomes.add(forest, 1)
surfaceWarmHumidityBiomes.add(jungle, 3)
surfaceBiomes.add(surfaceWarmHumidityBiomes)
var surfaceHotHumidityBiomes = new RangeMap(-1, 1)
surfaceHotHumidityBiomes.add(desert, 5)
surfaceBiomes.add(surfaceHotHumidityBiomes)
heightMap.add(surfaceBiomes, 3)

var highBiomes = new RangeMap(-1, 1)
highBiomes.add(new Biome("mountain", [200, 200, 210]), 1)
heightMap.add(highBiomes, 1)

var cloudBiomes = new RangeMap(-1, 1)
cloudBiomes.add(new Biome("mountaintip", [200, 200, 210]), 1)
heightMap.add(cloudBiomes, .2);

//save ranges in -1,1 space
//have biome convert itself to world space

//i don't know what i did but it's not easy to add new factors to the world


//convert the biomes to already be biome objects lol
function exportBiomes(map, args, biomes, index = 0, collectedFactors = []) {
    biomes ||= new Map()
    var ranges = map.exportRanges(args[index], 0, 1);
    index++;

    for (let r = 0; r < ranges.length; r++) {
        let factors = [...collectedFactors];



        if (!factors.some(o => o.factor == ranges[r][1] && o.min == ranges[r][2] && o.max == ranges[r][3])) {
            factors.push({ factor: ranges[r][1], min: ranges[r][2], max: ranges[r][3] });
        }

        if (ranges[r][0] instanceof RangeMap) {
            exportBiomes(ranges[r][0], args, biomes, index, factors)
        } else {
            var biome = biomes.get(ranges[r][0].name)
            if (!biome) {
                biome = ranges[r][0] || new Biome(ranges[r][0].name, ranges[r][0].color, ranges[r][0].factors)
                biomes.set(ranges[r][0].name, biome)
            }
            factors.forEach(o => {
                if (!(biome.factors.some(bf => bf.factors == o.factors && o.min == bf.min && o.max == bf.max))) {
                    biome.factors.push(o);
                }
            });
        }
    }
    return biomes;
}

var biomesz = exportBiomes(heightMap, ["elevation", "humidity", "temperature"])

var biomes = [];
for (const [k, v] of biomesz) {
    biomes.push(new Biome(v.name, v.color, v.factors))
}
biomes.push(river);

export const joints = new Map();
joints.set("plains, forest", new Biome("plainforest", [145,184,79]))
joints.set("forest, jungle", new Biome("fungle", [103,161,61]))
joints.set("taiga, forest", new Biome("taigest", [114,186,118]))
joints.set("snowyTaiga, taiga", new Biome("coldTaiga", [178,217,293]))
joints.set("plains, flowerForest", new Biome("flowerfungle", [186,185,138]))

export const jointPossibilities = new Map()
export function getABiome(vx, vy) {
    let genCache = new Map() 
    let biome = [];
    for (const i of biomes) {
        var occurCache = new Map();
        for (const o of i.factors) {
            var wFactor = worldFactors.get(o.factor)
            if (wFactor) {
                var factor = genCache.get(o.factor)
                if (!factor) {
                    factor = worldFactors.get(o.factor).getValue(vx, vy)
                    genCache.set(o.factor, factor);
                }

                var mini = lerp(factor.minm, factor.maxm, o.min)
                var maxi = lerp(factor.minm, factor.maxm, o.max)
                var val = (factor.sum > mini && factor.sum < maxi) 

                var ofactor = occurCache.get(o.factor)
                if (!ofactor) {                    
                    occurCache.set(o.factor, ofactor||val);
                }
            } else continue;
        }
        let go = true;
        for (const [o,c] of occurCache) {
            if (!c) go = false;    
        }
        if (go) biome.push(i);
    }

    if (biome.length > 1) {
        var joint = joints.get(`${biome[0].name}, ${biome[1].name}`)
        if (joint) return joint        
        jointPossibilities.set(`${biome[0].name}, ${biome[1].name}`,[biome[0], biome[1]]  )
    
    }
        return biome[biome.length-1];
}

export function getOBiome(vx, vy) {
    //elevation = elevation.getValue ?  : 0;
    let cacha = new Map();
    let biome = null;
    for (const i of biomes) {
        let go = true;

        var b = new Map(); //if world factor found a match store it
        for (const [k, v] of worldFactors) { //elevation 
            var wins = i.factors.filter(o => o.factor == k) //factor has elevation


            if (wins.length > 0) {
                var factor = cacha.get(k)
                if (factor == null) {
                    factor = v.getValue(vx, vy);
                    cacha.set(k, factor);
                }

                let coto = false;
                for (const o of wins) { //if elevation is available then
                    var mini = lerp(factor.minm, factor.maxm, o.min)
                    var maxi = lerp(factor.minm, factor.maxm, o.max)
                    if ((factor.sum > mini && factor.sum < maxi)) {
                        coto = true;

                        break;
                    }
                }
                if (coto == false) {
                    go = false;
                }
            }
        }

        if (go) biome = i

    }

    return biome;
}
//getABiome()


//console.log(plns)