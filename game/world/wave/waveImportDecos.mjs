 import { n0loader } from "../../../engine/core/ResourceManagement/loader.mjs";
import { loadImgArray } from "../../../engine/core/Utilities/ObjectUtils.mjs";
import { Tile } from "./Tile.mjs"
import { n0jointtiles, n0tiles } from "./n0FunctionCollapse.mjs"

let grassFactors = [{ factor: "temperature", min: -.56, max: .5 }, { factor: "humidity", min: -.8, max: 1 }]
//this can't happen under the current load model

function decomposeImage(img) {
    img.loadPixels();

    let colorMap = new Map();
    let a = []

    // Get the color of the center pixel and set its index to 0
    let centerIndex = 4 * 4 + 4; // For a 3x3 image, the center pixel is at index 4*4 + 4
    let r = img.pixels[centerIndex];
    let g = img.pixels[centerIndex + 1];
    let b = img.pixels[centerIndex + 2];
    let key = `${r}, ${g}, ${b}`;
    colorMap.set(key, 0);

    for (let y = 0; y < 3; y++) {
        a[y] = []
        for (let x = 0; x < 3; x++) {
            let index = (x + y * 3) * 4;
            let r = img.pixels[index];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];

            let key = `${r}, ${g}, ${b}`;
            if (!colorMap.has(key)) {
                colorMap.set(key, colorMap.size);
            }

            a[y][x] = colorMap.get(key);
        }
    }

    let bz = [
        [a[0][0], a[0][1], a[0][2]],
        [a[0][2], a[1][2], a[2][2]],
        [a[2][0], a[2][1], a[2][2]],
        [a[0][0], a[1][0], a[2][0]]
    ]


    return { colors33: a, colors: bz, colorMap }
}
export let waves = new Map()
n0loader.startLoading("categorization", (loaded) => {
    loadImgArray("assets/wave/categorization", 33, imgs => {
        for (let a = 0; a < imgs.length; a++) {
            const img = imgs[a];
            waves.set(a, decomposeImage(img))
        }
        loaded()
    })
})



let name = 'deco' //the tag used to gather this item to be used in the biome selector
let img = 'assets/deco.png' //where the sprite for this deco is
let edges = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] //which sides this deco can connect to (need a wider form connector and alternative edges system) 
let edgeWiderForm = [{ connections: [[0,0,0],[0,1,0]] },{ connections: [[0,0,0],[0,1,0]] },{ connections: [[0,0,0],[0,1,0]] },{ connections: [[0,0,0],[0,1,0]] },]


let weight = 1; //how likely the deco is to spawn (currently based on total distribution of choices at a sample point; sample points have specific thresholds and biases for world factors)
let thresholds = [{ factor: "temperature", min: -.56, max: .5 }] //this defines the range of the factor this deco can spawn at (opt in factors, if a factor is not defined it will spawn at the full range of the factor) 
let biases = [{ factor: "humidity", value: 1 }] //the deco is most likely to spawn at the given position in the factor 
let tint = true //whether or not the first or only image given as input will be tinted based on the biome map
let tile = new Tile(img, edges, weight, thresholds, biases, tint);
n0tiles.set(name, tile); //then we insert the tile

//phind made a good point; the idea of allowing a wildcard id; meaning that it ignores other tiles... in a sense that's how the air tech works. however, this technically isn't air

n0loader.startLoading("tiles", (loaded) => {
    //load the grasssprite
    //then insert into this
    n0tiles.set('air', new Tile(['assets/air.png'], [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 4))
    n0tiles.set('vedgamo', new Tile(['assets/gamo/ved.png'], [[0,0,0],[0,0,1],[0,0,1],[0,0,0]], 1))
    n0tiles.set('ledgamo', new Tile(['assets/gamo/led.png'], [[0, 0, 0], [0, 0, 0], [1, 0, 0], [0, 0, 1]], 1))
    n0tiles.set('nedgamo', new Tile(['assets/gamo/ned.png'], [[0, 0, 1], [1, 0, 0], [0, 0, 0], [0, 0, 0]], 1))
    n0tiles.set('redgamo', new Tile(['assets/gamo/red.png'], [[1, 0,0], [0, 0, 0], [0, 0, 0], [1, 0, 0]], 1))
    n0tiles.set('vedogamo', new Tile(['assets/gamo/vedo.png'], [[0,0,0],[1,1,1],[1,1,1],[0,0,0]], 1))
    n0tiles.set('ledogamo', new Tile(['assets/gamo/ledo.png'], [[0, 0, 0], [0, 0, 0], [1, 1, 1], [1, 1, 1]], 1))
    n0tiles.set('nedogamo', new Tile(['assets/gamo/nedo.png'], [[1, 1, 1], [1, 1, 1], [0, 0, 0], [0, 0, 0]], 1))
    n0tiles.set('redogamo', new Tile(['assets/gamo/redo.png'], [[1,1,1], [0, 0, 0], [0, 0, 0], [1, 1, 1]], 1))


        let rightdown = n0tiles.get("vedgamo");
        let leftdown = n0tiles.get("ledgamo");
        
        console.log(leftdown, leftdown?.isUp(rightdown))

    //n0tiles.set('grass0', new Tile('assets/grass0.png',  [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 2, [...grassFactors], [{ factor: "humidity", value: 1 }]))
    
    //n0tiles.set('air2', new Tile('assets/air2.png', [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 1))
    //n0tiles.set('grass0', new Tile('assets/grasssprite.png',  [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 2, [...grassFactors], [{ factor: "humidity", value: 1 }]))
    //n0tiles.set('grass1', new Tile('assets/grasssprite2.png',  [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 2, [...grassFactors], [{ factor: "humidity", value: 1 }]))
    //n0tiles.set('abi', new Tile('assets/test square.png',  [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 5, [...grassFactors], [{ factor: "humidity", value: 1 }], true ))
    //when all sprites are loaded we run this loaded function
    loaded()

}, ["categorization"])
