import { RangeMap } from "../../engine/collections/RangeMap.mjs";
import { inverseLerp, lerp } from "../../engine/n0math/ranges.mjs";
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

var sugar = new RangeMap(0,1)
sugar.add("pureBitter").add("bitter").add("plain")
sugar.add("sweet").add("pureSweet");
addBiomeFactors(sugar, "sugar");


var vv =["surface", ["frozen","wet"], ["cold", "wet", "moist"]]
//var mp =mapDeep(vv, f=> biomeFactorMap.get(f))
//console.log({vv, mp});


//doing this i found that we intersect biomes based on multiple profiles
//i mean i did see that we had intersecting biomes...
//what i found, is that the original code allowed for frozen moist taiga 
//(obviously this shouldn't happen, and so it exposes a bigger issue)
//biomes that deserve a spot are not given it, 
//because one biome is greedily taking slots it doesn't have ownership of
//i need to rewrite my getBiome function to add require sets

//river specific biome placement... gonna figure it out...
//var rivera = new Biome("river", [0, 0, 255], [{ factor: "rivers", min: 0, max: 1 }, { factor: "elevation", min: 0, max: 1 }])

var deepwatera = new Biome("deepwater", [46, 81, 170], ["deep"])
var icydeepwater = new Biome("icydeepwater", [88, 134, 219],["deep", "frozen"])

//deepWaterSugar.add(new Biome("bitterdeepwater", [30, 54, 84]),1)
//deepWaterSugar.add(new Biome("sweetdeepwater", [48, 170, 179]),1)
//deepWaterSugar.add(new Biome("verysweetdeepwater", [137, 159, 209]),1)

var deepsand = new Biome("deepsand", [185, 166, 135],["deep", "hot"])

var watera =new Biome("water", [60, 147, 171],["low"])
var icywater = new Biome("icywater", [117, 191, 222],["low", "frozen"])

//lowWaterSugar.add(new Biome("bitterwater", [30, 54, 84]), 1)
//lowWaterSugar.add(new Biome("sweetwater",[60, 191, 171]), 1)
//lowWaterSugar.add(new Biome("verysweetwater",[169, 235, 210]), 1)

let lowsand = new Biome("lowsand", [204, 193, 143],["deep", "hot"])

var beacha = new Biome("beach", [233, 217, 163],["border"])
var icyBeacha = new Biome("icybeach", [211, 226, 209],["border", "frozen"])

//var dirt = new Biome("dirt", [156, 109, 78],["surface"])
var snowyPlainsa = new Biome("snowyPlains", [197, 245, 230],["surface", "frozen", "dry", "arid"])
var snowyTundraa = new Biome("snowyTundra", [192, 219, 245],["surface", "frozen", "moderate"])
var snowyTaigaa = new Biome("snowyTaiga", [198, 239, 246],["surface", "frozen", "moist"])
var taigaa = new Biome("taiga", [140, 196, 108],["surface", ["frozen","wet"], ["cold", "wet", "moist"]])
var plainsa = new Biome("plains", [190, 199, 104], ["surface", ["cold", "dry", "arid", "moderate"], ["neutral", "dry","moderate"]])
var foresta = new Biome("forest", [98, 171, 84],["surface", ["cold", "moderate"], ["neutral", "moist"], ["warm", "moderate"]])
var junglea = new Biome("jungle", [38, 173, 25],["surface", "warm", "wet", "moist"])
var flowerForesta = new Biome("flowerForest", [96, 189, 133],["surface", "neutral", "arid"])
var darkForesta = new Biome("darkForest", [28, 130, 18],["surface", "neutral", "wet"])
var savannaha = new Biome("savannah", [161, 110, 34],["surface", "warm", "arid", "dry"])
var deserta = new Biome("desert", [233, 217, 163],["surface", "hot"])

var mountaina = new Biome("mountain", [200, 200, 210],["high"])
var icymountaina =new Biome("icymountain", [163, 200, 222], ["high", "cold", "frozen"])

var mountainTipa = new Biome("mountaintip", [200, 200, 210],["cloud"])

var biomesz = [
    deepwatera, icydeepwater, deepsand,
    watera, icywater, lowsand,
    beacha, icyBeacha,
    snowyPlainsa, snowyTaigaa, snowyTundraa,
    taigaa, plainsa, foresta, junglea,
    flowerForesta, darkForesta,savannaha, 
    deserta, 
    mountaina, icymountaina, mountainTipa
]

var biomes = [];
for (const v of biomesz) {
    biomes.push(v)
}
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
            var factor = genCache.get(s.factor)
                if (!factor) {
                    factor = worldFactors.get(s.factor).getValue(vx, vy)
                    genCache.set(s.factor, factor);
                }
            var sum = inverseLerp(factor.minm, factor.maxm, factor.sum)
            return sum > s.min && sum < s.max;
        } );
        if (pop(mappedBiome)) biomex.push(b);
    }
    if (biomex.length<=0) {
        let worldGeno = []
        for (const [k,vi] of worldFactors) {
            var factor = genCache.get(k)
                if (!factor) {
                    factor = vi.getValue(vx, vy)
                    genCache.set(k, factor);
                }
                var sum = factor.sum
                for (const [b,f] of biomeFactorMap) {
                    if (sum > f.min && sum < f.max) {
                        if (worldGeno.indexOf(b))
                            worldGeno.push(b);
                    }
                    //f.min, f.max
                    //console.log(b,f);
                }

            
        }
        console.log(worldGeno)
    }
    return biomex.length>0? biomex[0]:null;
}
