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
sugar.add("bitter",2).add("plain",1).add("sweet",2)
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

let sharedlut = {
    "bittersand": [79,79,76], "sand":[163, 147, 129], "sweetsand": [236, 217, 196],
    "bitterwater": [43, 53,70], "water": [68, 122, 156], "sweetwater": [11, 180, 176]
}

let sweetlut = {
    "deepwater": [38, 134, 163],
    "icydeepwater": [140, 191, 250],
    "water": sharedlut["sweetwater"],
    "icywater": [126,215,251],
    "river": sharedlut["sweetwater"],
    "beach": sharedlut["sweetsand"],
    "icybeach": [245,235,252],
    "desert": sharedlut["sweetsand"],
    "lowsand": [193,134,80],
    "deepsand": [105,75,58],
    "riverborder": sharedlut["sweetsand"] ,
    "dirt": [246, 182,190],
    "plains": [140,230,182], 
    "tundra": [239,245,255],
    "snowyplains": [194,242,251],
    "savannah": [213,173, 131], 
    "forest": [117,196,145],
    "taiga": [250, 218, 156], 
    "snowytaiga": [252, 235, 250], 
    "jungle": [48,219,120],
    "flowerforest":[128,217,191],
    "darkforest": [87,194,102], 
    "mountain": [209,209,234],
    "icymountain": [231,231,254],
    "mountaintip": [210,228,248],
    "test": [255,255,255]
    }
let neutrallut = {
    "deepwater": [48, 81, 138],
    "icydeepwater": [145, 163, 249],
    "water": sharedlut["water"],
    "icywater":[156,185,250], 
    "river": sharedlut["water"],
    "beach":sharedlut["sand"], 
    "icybeach": [206,198,248],
    "desert":sharedlut["sand"], 
    "lowsand": [133,92,52],
    "deepsand": [72,51,37],
    "riverborder":sharedlut["sand"], 
    "dirt": [147, 111, 102],
    "plains": [157, 199, 104],
    "tundra": [222,236,254],
    "snowyplains": [203,225,247],
    "savannah": [161, 126,104],
    "forest": [131, 165, 108], 
    "taiga": [192, 172, 118],
    "snowytaiga": [222, 211, 247], 
    "jungle": [81, 169, 66],
    "flowerforest": [155, 186, 141], 
    "darkforest": [64, 126, 53],
    "mountain": [160,160,170],
    "icymountain": [205,205,250],
    "mountaintip": [163,200,222],
    "test": [151,151,151]
}
let bitterlut = {
    "deepwater": [32, 43, 54], 
    "icydeepwater": [126,131,176],
    "water": sharedlut["bitterwater"],
    "icywater":[143,148,211], 
    "river": sharedlut["bitterwater"],
    "beach": sharedlut["bittersand"], 
    "icybeach": [162,162,245],
    "desert": sharedlut["bittersand"], 
    "lowsand": [65,49,30],
    "deepsand": [35,27,21],
    "riverborder": sharedlut["bittersand"], 
    "dirt":[77,65,68] ,
    "plains": [111,114,99] ,
    "tundra": [172,180,220],
    "snowyplains": [179,180,233],
    "savannah": [80,70,62],
    "forest":  [101,105,98],
    "taiga": [92,88,83],
    "snowytaiga": [169,167,246],
    "jungle": [48,51,44],
    "flowerforest": [100,113,105],
    "darkforest": [36, 44, 38],
    "mountain": [81,81,87],
    "icymountain": [163,163,246],
    "mountaintip": [82,103,115],
    "test": [80,80,80]
}
export let luts = {
    0: bitterlut, 1: neutrallut, 2:sweetlut
}
console.log(luts);
let sweet = ["sweet"];
let puresweet = [ "puresweet"];
let bitter = ["bitter"]
let purebitter = [ "purebitter"]
let lut =neutrallut;

var grassy = [
    "grass0", "grass1", "grass2", "dirt0", "dirt1", "dirt2",
    "dirtGrass0", "dirtGrass1", "dirtGrass2", "dirtGrass3", "dirtGrass4",
    "dirtGrass5", "dirtGrass6", "dirtGrass7", "dirtGrass8", "dirtGrass9",
    "dirtGrass10", "dirtGrass11", "dirtGrass12", "dirtGrass13", "dirtGrass14",
    "dirtGrass15", "dirtGrass16", "dirtGrass17"
]

function formBiome(o) { //this is baking sugar into the generation... not ideal but it's ok.
    let plain = new Biome(o.name, o.name, 1, o.plaintags, o.tiles);
    plain.difficulty = o.difficulty;
    biomes.unshift(plain)
    let sweet = new Biome("sweet"+o.name, o.name, 2, o.sweettags, o.tiles);
    sweet.difficulty = o.difficulty;
    biomes.unshift(sweet)
    let bitter = new Biome("bitter"+o.name, o.name, 0, o.bittertags, o.tiles);
    bitter.difficulty = o.difficulty;
    biomes.unshift(bitter)
}

formBiome({
    name: "deepwater",
    plaintags: ["deep"], tiles: [],
    sweettags: ["deep", "sweet"],
    bittertags: ["deep", "bitter"],
    difficulty: 5
})
formBiome({
    name: "icydeepwater",
    plaintags: ["deep", "frozen"], tiles: [],
    sweettags: ["deep", "frozen", "sweet"],
    bittertags: ["deep", "frozen", "bitter"],
    difficulty: 6 
})

formBiome({
    name: "water",
    plaintags: ["low"], tiles: [],
    sweettags: ["low", "sweet"],
    bittertags: ["low", "bitter"],
    difficulty: 4
})
formBiome({
    name: "icywater",
    plaintags: ["low", "frozen"], tiles: [],
    sweettags: ["low", "frozen", "sweet"],
    bittertags: ["low", "frozen", "bitter"],
    difficulty: 5 
})
formBiome({
    name: "beach",
    plaintags: ["border"], tiles: ["dirt0", "dirt1", "dirt2"],
    sweettags: ["border", "sweet"],
    bittertags: ["border", "bitter"],
    difficulty: 1
})
formBiome({
    name: "icybeach",
    plaintags: ["border", "frozen"], tiles: ["dirt0", "dirt1", "dirt2"],
    sweettags: ["border", "frozen", "sweet"],
    bittertags: ["border", "frozen", "bitter"],
    difficulty: 2
})
formBiome({
    name: "dirt",
    plaintags: [surface], tiles: ["dirt0", "dirt1", "dirt2"],
    sweettags: [surface, "sweet"],
    bittertags: [surface, "bitter"],
    difficulty: 1
})


let plains = [surface, ["dry"]];
formBiome({
    name: "plains",
    plaintags: [...plains,["arid"],["moderate"]], tiles: [...grassy],
    sweettags: [...plains, ["arid"],["moderate"], "sweet"],
    bittertags: [...plains,["arid"],["moderate"], "bitter"],
    difficulty: 1
})
let snowplains = [...plains, ["moderate"], "frozen"];
formBiome({
    name: "snowyplains",
    plaintags: [...snowplains], tiles: [...grassy],
    sweettags: [...snowplains, "sweet"],
    bittertags: [...snowplains, "bitter"],
    difficulty: 1
})
let tundra = [surface, "frozen", "moderate"]
formBiome({
    name: "tundra",
    plaintags: [...tundra], tiles: [],
    sweettags: [...tundra, "sweet"],
    bittertags: [...tundra, "bitter"],
    difficulty: 1
})

let taiga = [surface, ["frozen", "wet"], ["cold", ["wet"], ["moist"]]]
formBiome({
    name: "taiga",
    plaintags: [...taiga], tiles: [...grassy],
    sweettags: [...taiga, "sweet"],
    bittertags: [...taiga, "bitter"],
    difficulty: 1
})

let snowytaiga = [surface, "frozen", "moist"]
formBiome({
    name: "snowytaiga",
    plaintags: [...snowytaiga], tiles: [...grassy],
    sweettags: [...snowytaiga, "sweet"],
    bittertags: [...snowytaiga, "bitter"],
    difficulty: 2
})
let savannah =[surface, "warm", ["arid"], ["dry"]]
formBiome({
    name: "savannah",
    plaintags: [...savannah], tiles: [...grassy],
    sweettags: [...savannah, "sweet"],
    bittertags: [...savannah, "bitter"],
    difficulty: 1
})
let forest = [surface, ["cold", "moderate"], ["neutral", "moist"], ["warm", "moderate"]];
formBiome({
    name: "forest",
    plaintags: [...forest], tiles: [...grassy],
    sweettags: [...forest, "sweet"],
    bittertags: [...forest, "bitter"],
    difficulty: 1
})
let jungle = [surface, "warm", ["wet"], ["moist"]];
formBiome({
    name: "jungle",
    plaintags: [...jungle], tiles: [...grassy],
    sweettags: [...jungle, "sweet"],
    bittertags: [...jungle, "bitter"],
    difficulty: 1
})
let flowerforest = [surface, "neutral", "arid"];
formBiome({
    name: "flowerforest",
    plaintags: [...flowerforest], tiles: [...grassy],
    sweettags: [...flowerforest, "sweet"],
    bittertags: [...flowerforest, "bitter"],
    difficulty: 1
})
let darkforest = [surface, "neutral", "wet"];
formBiome({
    name: "darkforest",
    plaintags: [...darkforest], tiles: [...grassy],
    sweettags: [...darkforest, "sweet"],
    bittertags: [...darkforest, "bitter"],
    difficulty: 1
})

let desert = [surface, "hot"];
formBiome({
    name: "desert",
    plaintags: [...desert], tiles: ["dirt0", "dirt1", "dirt2"],
    sweettags: [...desert, "sweet"],
    bittertags: [...desert, "bitter"],
    difficulty: 1
})
let lowsand = ["low", "hot"];
formBiome({
    name: "lowsand",
    plaintags: [...lowsand], tiles: ["dirt0", "dirt1", "dirt2"],
    sweettags: [...lowsand, "sweet"],
    bittertags: [...lowsand, "bitter"],
    difficulty: 2
})
let deepsand = ["deep", "hot"];
formBiome({
    name: "deepsand",
    plaintags: [...deepsand], tiles: ["dirt0", "dirt1", "dirt2"],
    sweettags: [...deepsand, "sweet"],
    bittertags: [...deepsand, "bitter"],
    difficulty: 3
})

let riverborder = ["riverborder", [["humid"], ["wet"]], [surface], ["border"]];
formBiome({
    name: "riverborder",
    plaintags: [...riverborder], tiles: [],
    sweettags: [...riverborder, "sweet"],
    bittertags: [...riverborder, "bitter"],
    difficulty: 3
})
let rivera = ["river", [surface], ["border"]]
formBiome({
    name: "river",
    plaintags: [...rivera], tiles: [],
    sweettags: [...rivera, "sweet"],
    bittertags: [...rivera, "bitter"],
    difficulty: 3
})

let mountain = ["high"];
formBiome({
    name: "mountain",
    plaintags: [...mountain], tiles: [],
    sweettags: [...mountain, "sweet"],
    bittertags: [...mountain, "bitter"],
    difficulty: 3
})
let icymountain = ["high", ["cold"], ["frozen"]]
formBiome({
    name: "icymountain",
    plaintags: [...icymountain], tiles: [],
    sweettags: [...icymountain, "sweet"],
    bittertags: [...icymountain, "bitter"],
    difficulty: 3
})
let mountaintip = ["cloud"]
formBiome({
    name: "mountaintip",
    plaintags: [...mountaintip], tiles: [],
    sweettags: [...mountaintip, "sweet"],
    bittertags: [...mountaintip, "bitter"],
    difficulty: 3
})

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
