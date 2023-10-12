import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { createCubicInterpolator, createInterpolator, inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
import { worldFactors } from "./FactorManager.mjs";
import { Biome, addBiomeFactors, biomeFactorMap, mapDeep } from "./biome.mjs";

//you may be asking why use a rangemap?
//it's for categorization, and placement

//this work is hard, i need a simpler way to insert things into multiple dimensions of techs
var height = new RangeMap(0,1)
height.add("deep", .15).add("low", 1.3).add("border",.015)
height.add("surface", 3).add("high", 1).add("cloud", .2)
addBiomeFactors(height, "elevation");

var temp = new RangeMap(0,1)
temp.add("frozen").add("cold").add("neutral")
temp.add("warm").add("hot")
addBiomeFactors(temp, "temperature");

var humidity = new RangeMap(0,1)
humidity.add("arid").add("dry").add("moderate")
humidity.add("moist").add("wet");
addBiomeFactors(humidity, "humidity");

var river = new RangeMap(0,1)
river.add("river",.01) //lowest part of the map i thought
river.add("riverborder", 1) //the split i thought
river.add("otheriver",2.50) //bigest part i thought
addBiomeFactors(river, "rivers");

var sugar = new RangeMap(0,1)
sugar.add("purebitter").add("bitter").add("plain")
sugar.add("sweet").add("puresweet");
addBiomeFactors(sugar, "sugar");
/*
const points = createCubicInterpolator([
    {"c": 0, "y": 0, "p":1.4},
    {"c": .4, "y": 10, "p":3},
    {"c": .6, "y": 10, "p":3},
    {"c": 1, "y": 20, "p":1.4}
]);
var inputs = [0,.1, .4,.6,.9,1].map(i=>points(i))
console.log(inputs);
*/
var biomes = []

var deepwatera = new Biome("deepwater", [46, 81, 170], ["deep"])
biomes.push(deepwatera)
biomes.unshift(deepwatera.copy("bitterdeepwater", [30, 54, 84]).addFactor("bitter"))
biomes.unshift(deepwatera.copy("sweetdeepwater", [48, 170, 179]).addFactor("sweet"))
biomes.unshift(deepwatera.copy("puresweetdeepwater", [137, 159, 209]).addFactor("puresweet"))

var icydeepwater = new Biome("icydeepwater", [88, 134, 219],["deep", "frozen"]) //make sweet and bitter ice
biomes.unshift(icydeepwater)

var watera =new Biome("water", [60, 147, 171],[["low"],["deep"]])
biomes.unshift(watera)
biomes.unshift(watera.copy("bitterwater", [30, 54, 84]).addFactor("bitter"))
biomes.unshift(watera.copy("sweetwater", [60, 191, 171]).addFactor("sweet"))
biomes.unshift(watera.copy("puresweetwater", [169, 235, 210]).addFactor("puresweet"))
var icywater = new Biome("icywater", [117, 191, 222],["low", "frozen"]) //make sweet and bitter ice/
biomes.unshift(icywater)

var deepsand = new Biome("deepsand", [185, 166, 135],["deep", "hot"])
let lowsand = new Biome("lowsand", [204, 193, 143],["deep", "hot"])
var deserta = new Biome("desert", [233, 217, 163],["surface", "hot"])
var beacha = new Biome("beach", [233, 217, 163],["border"])
var icyBeacha = new Biome("icybeach", [211, 226, 209],["border", "frozen"])
biomes.unshift(deepsand, lowsand, deserta, beacha)
biomes.unshift(icyBeacha);

//var dirt = new Biome("dirt", [156, 109, 78],["surface"])
var snowyPlainsa = new Biome("snowyPlains", [197, 245, 230],["surface", "frozen", ["dry"], ["arid"]])
var snowyTundraa = new Biome("snowyTundra", [192, 219, 245],["surface", "frozen", "moderate"])
var snowyTaigaa = new Biome("snowyTaiga", [198, 239, 246],["surface", "frozen", "moist"])
biomes.unshift(snowyPlainsa,snowyTundraa,snowyTaigaa );

var plainsa = new Biome("plains", [190, 199, 104], ["surface", ["cold", ["dry"], ["arid"], ["moderate"]], ["neutral", ["dry"],["moderate"]]])
var savannaha = new Biome("savannah", [161, 110, 34],["surface", "warm", ["arid"], ["dry"]])
biomes.unshift(plainsa,savannaha);

var taigaa = new Biome("taiga", [140, 196, 108],["surface", ["frozen","wet"], ["cold", ["wet"], ["moist"]]])
var foresta = new Biome("forest", [98, 171, 84],["surface", ["cold", "moderate"], ["neutral", "moist"], ["warm", "moderate"]])
var junglea = new Biome("jungle", [38, 173, 25],["surface", "warm", ["wet"], ["moist"]])
var flowerForesta = new Biome("flowerForest", [96, 189, 133],["surface", "neutral", "arid"])
var darkForesta = new Biome("darkForest", [28, 130, 18],["surface", "neutral", "wet"])
biomes.unshift(taigaa,foresta,junglea,flowerForesta,darkForesta);

var not =new Biome("river", [233, 217, 163],["river",["surface"],["border"]])
var riverborder = new Biome("riverborder", [60, 147, 171],["riverborder",[["humid"],["wet"]], ["surface"],["border"]])
//biomes.unshift(not)
//var widerivera =new Biome("wideriver", [0,0 ,0],["wideriver"])
//biomes.unshift(widerivera)
//var rivera =new Biome("river", [0, 0,255],["river"])
biomes.unshift(riverborder)
biomes.unshift(not)
var mountaina = new Biome("mountain", [200, 200, 210],["high"])
var icymountaina =new Biome("icymountain", [163, 200, 222], ["high", ["cold"], ["frozen"]])
var mountainTipa = new Biome("mountaintip", [200, 200, 210],["cloud"])
biomes.unshift(icymountaina,mountaina,mountainTipa);


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
        if (typeof a === 'boolean' ) {
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
        const mappedBiome = mapBiome(b.factors, s=>{
            if (s == null) return false;
            var factor = genCache.get(s.factor)
                if (!factor) {
                    factor = worldFactors.get(s.factor).getValue(vx, vy)
                    genCache.set(s.factor, factor);
                }
            var sum = inverseLerp(factor.minm, factor.maxm, factor.sum)
            return sum > s.min && sum < s.max;
        });
        if (pop(mappedBiome)) biomex.push(b);
    }
    return {genCache, biome:biomex.length>0? biomex[0]:null};
}
