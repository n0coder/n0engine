 import { n0loader } from "../../../engine/core/ResourceManagement/loader.mjs";
import { loadImgArray } from "../../../engine/core/Utilities/ObjectUtils.mjs";
import { Tile } from "./Tile.mjs"
import { n0jointtiles, n0tiles } from "./n0FunctionCollapse.mjs"

let grassFactors = [{ factor: "temperature", min: -.5, max: .5 }, { factor: "humidity", min: -.18, max: 1 }]
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

n0loader.startLoading("tiles", (loaded) => {
    //load the grasssprite
    //then insert into this
    n0tiles.set('air', new Tile(null, [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 2))
    n0tiles.set('grass0', new Tile('assets/grasssprite.png',  [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], 1, [...grassFactors], [{ factor: "humidity", value: 1 }]))
    //when all sprites are loaded we run this loaded function
    loaded()

}, ["categorization"])
