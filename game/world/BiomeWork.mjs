import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { createCubicInterpolator, createInterpolator, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { worldFactors } from "./FactorManager.mjs";
import { Biome, addBiomeFactors, biomeFactorMap, mapDeep } from "./biome.mjs";

//you may be asking why use a rangemap?
//it's for categorization, and placement

//this work is hard, i need a simpler way to insert things into multiple dimensions of techs

//lets split world height into 2 ideas
//erosion, and 
var height = new RangeMap(0, 1)
height.add("deep", .15).add("low", 3).add("border", .015)
height.add("surface", 2).add("high", 1).add("cloud", .2)
addBiomeFactors(height, "elevation");

var squish = new RangeMap(0, 1);
squish.add("peaks", .22).add("mountainous", .405).add("hilly", .1525)
squish.add("rolling", 0.2725).add("folds", .4).add("shattered", .1).add("flat", .55)
addBiomeFactors(squish, "squish");

//forcing the mid biome gen is, not going to work well.

var inland = ["surface", [["hilly"], ["mountainous"], ["folds"], ["rolling"], ["flat"]]]
var midland = ["high", "rolling"]
var allland = [[["high"], ["cloud"]], [["flat"], ["folds"]]]
var surface = "surface";// [[inland], [midland], [allland]];

console.log(pop([true, false]))

var temp = new RangeMap(0, 1)
temp.add("frozen", 1).add("cold", 1).add("neutral", 1)
temp.add("warm", 1).add("hot", 1)
addBiomeFactors(temp, "temperature");

var humidity = new RangeMap(0, 1)
humidity.add("arid").add("dry").add("moderate")
humidity.add("moist").add("wet");
addBiomeFactors(humidity, "humidity");

var river = new RangeMap(0, 1)
river.add("river", 1) //the split i thought
river.add("riverborder", .1) //lowest part of the map i thought
river.add("otheriver", 3.5) //bigest part i thought
addBiomeFactors(river, "rivers");

var sugar = new RangeMap(0, 1)
sugar.add("purebitter").add("bitter").add("plain",4).add("sweet").add("puresweet");
addBiomeFactors(sugar, "sugar");

var fantasy = new RangeMap(0, 1);
fantasy.add("ordinary").add("fantasy");
addBiomeFactors(fantasy, "fantasy");


export var biomes = []




let originallut = {
    "deepwater": [46, 81, 170], "bitterdeepwater": [20, 44, 64], "sweetdeepwater": [48, 170, 179],
    "water":[60, 147, 171], "bitterwater": [30, 54, 84], "sweetwater":[60, 191, 171], 
    "beach": [233, 217, 163], 
    "plains": [190, 199, 104], 
    "savannah": [161, 110, 34],
    "taiga": [140, 196, 108],
    "forest": [98, 171, 84],
    "jungle": [38, 173, 25],
    "flowerforest": [96, 189, 133],
    "darkforest": [28, 130, 18]
}
//I, am confused by all this
//
let newlut = {
    "deepwater": [48, 81, 138], "bitterdeepwater": [32, 43, 54], "sweetdeepwater": [38,134, 163],
    "water": [68, 122, 156], "bitterwater": [43, 53,70], "sugarwater": [60, 191, 171],
    "beach": [198, 176, 143], "bitterbeach": [79,79,76], "sweetbeach": [255,225, 202],
    "dirt": [147, 111, 102], "bitterdirt": [77,65,68], "sweetdirt": [246, 182,190],
    "plains": [157, 199, 104], "bitterplains": [111,114,99], "sweetplains": [161,252,172],
    "savannah": [161, 126,104], "bittersavannah": [80,70,62], "sweetsavannah": [213,173, 131],
    "forest": [131, 165, 108], "bitterforest": [101,105,98], "sweetforest": [117,196,145],
    "taiga": [192, 172, 118], "bittertaiga": [92,88,83], "sweettaiga": [250, 218, 156],
    "jungle": [81, 169, 66], "bitterjungle": [48,51,44], "sweetjungle": [48,219,120],
    "flowerforest": [155, 186, 141], "bitterflowerforest": [100,113,105], "sweetflowerforest":[128,217,191],
    "darkforest": [64, 126, 53], "bitterdarkforest": [36, 44, 38], "sweetdarkforest": [87,194,102]
}

let sweetlut = {
    "deepwater": [38, 134, 163],
    "water": [11, 180, 176],
    "beach": [236, 217, 196],
    "dirt": [246, 182,190],
    "plains": [140,230,182], 
    "savannah": [213,173, 131], 
    "forest": [117,196,145],
    "taiga": [250, 218, 156], 
    "jungle": [48,219,120],
    "flowerforest":[128,217,191],
    "darkforest": [87,194,102], 
    }
let bitterlut = {
    "deepwater": [32, 43, 54], 
    "water": [43, 53,70],
    "beach": [79,79,76],
    "dirt":[77,65,68] ,
    "plains": [111,114,99] ,
    "savannah": [80,70,62],
    "forest":  [101,105,98],
    "taiga": [92,88,83],
    "jungle": [48,51,44],
    "flowerforest": [100,113,105],
    "darkforest": [36, 44, 38],
}
let newlutalt = {
    "deepwater": [48, 81, 138],
    "water": [68, 122, 156],
    "beach": [163, 147, 129], 
    "dirt": [147, 111, 102],
    "plains": [157, 199, 104],
    "savannah": [161, 126,104],
    "forest": [131, 165, 108], 
    "taiga": [192, 172, 118],
    "jungle": [81, 169, 66],
    "flowerforest": [155, 186, 141], 
    "darkforest": [64, 126, 53],
}
export let luts = {
    0: bitterlut, 1: newlutalt, 2:sweetlut
}
let sweet = [ "sweet"];
let puresweet = [ "puresweet"];
let bitter = ["bitter"]
let purebitter = [ "purebitter"]
let lut =newlutalt;
var deepwatera = new Biome("deepwater", 1,  ["deep"])
deepwatera.difficulty = 5;
biomes.unshift(deepwatera)
biomes.unshift(deepwatera.copy("bitterdeepwater", 0).addFactors ([bitter]))
biomes.unshift(deepwatera.copy("sweetdeepwater", 2).addFactors ([sweet]))


var icydeepwater = new Biome("icydeepwater", 0, ["deep", "frozen"]) //make sweet and bitter ice
//biomes.unshift(icydeepwater)

var watera = new Biome("water", 0, ["low"])
watera.difficulty = 4;
biomes.unshift(watera)
var icywater = new Biome("icywater", 0, ["low", "frozen"]) //make sweet and bitter ice/
biomes.unshift(icywater)

var beacha = new Biome("beach", 0, ["border"])
var icyBeacha = new Biome("icybeach", 0, ["border", "frozen"])
biomes.unshift(beacha)
biomes.unshift(icyBeacha);

var dirt = new Biome("dirt", 0, [surface])
biomes.push(dirt);
var snowyPlainsa = new Biome("snowyPlains", 0, [surface, "frozen", ["dry"], ["arid"]])
var snowyTundraa = new Biome("snowyTundra", 0, [surface, "frozen", "moderate"])
var snowyTaigaa = new Biome("snowyTaiga", 0, [surface, "frozen", "moist"])
biomes.unshift(snowyPlainsa, snowyTundraa, snowyTaigaa);



var grassy = [
    "grass0", "grass1", "grass2", "dirt0", "dirt1", "dirt2",
    "dirtGrass0", "dirtGrass1", "dirtGrass2", "dirtGrass3", "dirtGrass4",
    "dirtGrass5", "dirtGrass6", "dirtGrass7", "dirtGrass8", "dirtGrass9",
    "dirtGrass10", "dirtGrass11", "dirtGrass12", "dirtGrass13", "dirtGrass14",
    "dirtGrass15", "dirtGrass16", "dirtGrass17"
]
//["c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14","c15","c16","c17","c18","c19","c20","c21","c22","c23","c24","c25","c26","c27","c28","c29","c30","c31","c32","c33"]
var plainsa = new Biome("plains", 0, [surface, ["cold", ["dry"], ["arid"], ["moderate"]], ["neutral", ["dry"], ["moderate"]]], [...grassy])
var savannaha = new Biome("savannah", 0, [surface, "warm", ["arid"], ["dry"]], [...grassy])
biomes.unshift(plainsa, savannaha);

var taigaa = new Biome("taiga", 0, [surface, ["frozen", "wet"], ["cold", ["wet"], ["moist"]]], [...grassy])
var foresta = new Biome("forest", 0, [surface, ["cold", "moderate"], ["neutral", "moist"], ["warm", "moderate"]], [...grassy])
var junglea = new Biome("jungle", 0, [surface, "warm", ["wet"], ["moist"]], [...grassy])
var flowerforesta = new Biome("flowerforest", 0, [surface, "neutral", "arid"], [...grassy])
var darkforesta = new Biome("darkforest", 0, [surface, "neutral", "wet"], [...grassy])
biomes.unshift(taigaa, foresta, junglea, flowerforesta, darkforesta);


var deepsand = new Biome("deepsand", 0, ["deep", "hot"])
let lowsand = new Biome("lowsand", 0, ["low", "hot"])
var deserta = new Biome("desert", 0, [surface, "hot"])
biomes.unshift(deepsand, lowsand, deserta);

var riverborder = new Biome("riverborder", 0, ["riverborder", [["humid"], ["wet"]], [surface], ["border"]])
biomes.unshift(riverborder)

var not = new Biome("river", 0, ["river", [surface], ["border"]])
biomes.unshift(not)


//biomes.unshift(not)
//var widerivera =new Biome("wideriver", [0,0 ,0],["wideriver"])
//biomes.unshift(widerivera)
//var rivera =new Biome("river", [0, 0,255],["river"])
var mountaina = new Biome("mountain", 0, ["high"])
var icymountaina = new Biome("icymountain", 0, ["high", ["cold"], ["frozen"]])
var mountainTipa = new Biome("mountaintip", 0, ["cloud"])
biomes.unshift(icymountaina, mountaina, mountainTipa);
/*
biomes.unshift(
    //new Biome("bitedge", [255,0,111], ["bitter", "fantasy"]),
    //new Biome("swtedge", [0,0,255], ["sweet", "fantasy"]),
    new Biome("puswtedge", [176,172,255], ["puresweet", "fantasy"]),
    new Biome("pubtedge", [0,0,0], ["purebitter", "fantasy"])
)
*/
// function to map the objects in the biome array to a true or false value based on the ruleset
function mapBiome(biome, soku) {
    return biome.map(item => {
        if (Array.isArray(item)) {
            return mapBiome(item, soku);
        } else {
            return soku(item)
        }
    });
}

function pop(array) {
    var member = true
    var list = false, u = true;
    for (const a of array) {
        if (typeof a === 'boolean') {
            if (a === false) {
                member = false;
            }
        } else if (Array.isArray(a)) {
            list ||= pop(a)
            u = false; //array exists? so use list bool
        }
    }
    return member && (list || u)
}

export function getreABiome(vx, vy) {
    let genCache = new Map();
    let biomex = [];

    // Loop over all world factors and store their values in genCache
    for (const [factorKey, worldFactor] of worldFactors) {
        let factorValue = worldFactor.getValue(vx, vy);
        genCache.set(factorKey, factorValue);
    }

    for (const b of biomes) {
        const mappedBiome = mapBiome(b.factors, s => {
            if (s == null) return false;
            var factor = genCache.get(s.factor)
            if (!factor) {
                return false;
            }
            var sum = inverseLerp(factor.minm, factor.maxm, factor.sum)
            return sum > s.min && sum < s.max;
        });
        if (pop(mappedBiome)) biomex.push(b);
    }

    return { genCache, biome: biomex.length > 0 ? biomex[0] : null };
}
export function getABiome(vx, vy) {
    let genCache = new Map();
    let biomex = [];
    for (const b of biomes) {
        const mappedBiome = mapBiome(b.factors, s => {
            if (s == null) return false;
            var factor = genCache.get(s.factor)
            if (!factor) {
                var vfactor = worldFactors.get(s.factor)
                if (vfactor) factor = vfactor.getValue(vx, vy)
                else return false;
                genCache.set(s.factor, factor);
            }
            var sum = inverseLerp(factor.minm, factor.maxm, factor.sum)
            return sum > s.min && sum < s.max;
        });
        if (pop(mappedBiome)) biomex.push(b);
    }

    return { genCache, biome: biomex.length > 0 ? biomex[0] : null };
}
