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
sugar.add("purebitter").add("bitter").add("bitteredge", .1).add("plain", .8)
sugar.add("sweetedge", .1).add("sweet").add("puresweet");
addBiomeFactors(sugar, "sugar");

var fantasy = new RangeMap(0, 1);
fantasy.add("plain").add("fantasy");
addBiomeFactors(fantasy, "fantasy");


export var biomes = []

var deepwatera = new Biome("deepwater", [46, 81, 170], ["deep"])
biomes.push(deepwatera)
biomes.unshift(deepwatera.copy("bitterdeepwater", [30, 54, 84]).addFactors([["bitteredge"], ["bitter", "fantasy"]]))
biomes.unshift(deepwatera.copy("sweetdeepwater", [48, 170, 179]).addFactors([["sweetedge"], ["sweet", "fantasy"]]))
biomes.unshift(deepwatera.copy("puresweetdeepwater", [137, 159, 209]).addFactor("puresweet").addFactor("fantasy"))

var icydeepwater = new Biome("icydeepwater", [88, 134, 219], ["deep", "frozen"]) //make sweet and bitter ice
biomes.unshift(icydeepwater)

var watera = new Biome("water", [60, 147, 171], [["low"]])
watera.difficulty = 4;
biomes.unshift(watera)
biomes.unshift(watera.copy("bitterwater", [30, 54, 84]).addFactors([["bitteredge"], ["bitter", "fantasy"]]))
biomes.unshift(watera.copy("sweetwater", [60, 191, 171]).addFactors([["sweetedge"], ["sweet", "fantasy"]]))
biomes.unshift(watera.copy("puresweetwater", [169, 235, 210]).addFactor("puresweet").addFactor("fantasy"))
var icywater = new Biome("icywater", [117, 191, 222], ["low", "frozen"]) //make sweet and bitter ice/
biomes.unshift(icywater)

var beacha = new Biome("beach", [233, 217, 163], ["border"])
var icyBeacha = new Biome("icybeach", [211, 226, 209], ["border", "frozen"])
biomes.unshift(beacha)
biomes.unshift(icyBeacha);

var dirt = new Biome("dirt", [156, 109, 78], [surface])
biomes.push(dirt);
var snowyPlainsa = new Biome("snowyPlains", [197, 245, 230], [surface, "frozen", ["dry"], ["arid"]])
var snowyTundraa = new Biome("snowyTundra", [192, 219, 245], [surface, "frozen", "moderate"])
var snowyTaigaa = new Biome("snowyTaiga", [198, 239, 246], [surface, "frozen", "moist"])
biomes.unshift(snowyPlainsa, snowyTundraa, snowyTaigaa);



var grassy = [
    "grass0", "grass1", "grass2", "dirt0", "dirt1", "dirt2",
    "dirtGrass0", "dirtGrass1", "dirtGrass2", "dirtGrass3", "dirtGrass4",
    "dirtGrass5", "dirtGrass6", "dirtGrass7", "dirtGrass8", "dirtGrass9",
    "dirtGrass10", "dirtGrass11", "dirtGrass12", "dirtGrass13", "dirtGrass14",
    "dirtGrass15", "dirtGrass16", "dirtGrass17"
]
//["c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14","c15","c16","c17","c18","c19","c20","c21","c22","c23","c24","c25","c26","c27","c28","c29","c30","c31","c32","c33"]
var plainsa = new Biome("plains", [190, 199, 104], [surface, ["cold", ["dry"], ["arid"], ["moderate"]], ["neutral", ["dry"], ["moderate"]]], [...grassy])
var savannaha = new Biome("savannah", [161, 110, 34], [surface, "warm", ["arid"], ["dry"]], [...grassy])
biomes.unshift(plainsa, savannaha);

var taigaa = new Biome("taiga", [140, 196, 108], [surface, ["frozen", "wet"], ["cold", ["wet"], ["moist"]]], [...grassy])
var foresta = new Biome("forest", [98, 171, 84], [surface, ["cold", "moderate"], ["neutral", "moist"], ["warm", "moderate"]], [...grassy])
var junglea = new Biome("jungle", [38, 173, 25], [surface, "warm", ["wet"], ["moist"]], [...grassy])
var flowerForesta = new Biome("flowerForest", [96, 189, 133], [surface, "neutral", "arid"], [...grassy])
var darkForesta = new Biome("darkForest", [28, 130, 18], [surface, "neutral", "wet"], [...grassy])
biomes.unshift(taigaa, foresta, junglea, flowerForesta, darkForesta);


var deepsand = new Biome("deepsand", [185, 166, 135], ["deep", "hot"])
let lowsand = new Biome("lowsand", [204, 193, 143], ["low", "hot"])
var deserta = new Biome("desert", [233, 217, 163], [surface, "hot"])
biomes.unshift(deepsand, lowsand, deserta);

var riverborder = new Biome("riverborder", [233, 217, 163], ["riverborder", [["humid"], ["wet"]], [surface], ["border"]])
biomes.unshift(riverborder)

var not = new Biome("river", [60, 147, 171], ["river", [surface], ["border"]])
biomes.unshift(not)
biomes.unshift(not.copy("bitterriverwater", [30, 54, 84]).addFactors([["bitteredge"], ["bitter", "fantasy"]]))
biomes.unshift(not.copy("sweetriverwater", [60, 191, 171]).addFactors([["sweetedge"], ["sweet", "fantasy"]]))
biomes.unshift(not.copy("puresweetriverwater", [169, 235, 210]).addFactor("puresweet").addFactor("fantasy"))



//biomes.unshift(not)
//var widerivera =new Biome("wideriver", [0,0 ,0],["wideriver"])
//biomes.unshift(widerivera)
//var rivera =new Biome("river", [0, 0,255],["river"])
var mountaina = new Biome("mountain", [160, 160, 170], ["high"])
var icymountaina = new Biome("icymountain", [163, 200, 222], ["high", ["cold"], ["frozen"]])
var mountainTipa = new Biome("mountaintip", [200, 200, 210], ["cloud"])
biomes.unshift(icymountaina, mountaina, mountainTipa);

var fan = new Biome("fantasy", [255, 255, 255], ["fantasy"])
//biomes.unshift(fan)
var fabn = new Biome("fabntasy", [0, 0, 0], ["plain"])
//biomes.unshift(fabn)
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
