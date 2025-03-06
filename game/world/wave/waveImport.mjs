import { n0loader } from "../../../engine/core/ResourceManagement/loader.mjs";
import { t } from "../../../engine/core/Time/n0Time.mjs";
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
export function load(){}
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

    n0tiles.set('grass0', new Tile('assets/plains/grass.png', [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]], 4, [...grassFactors], [{ factor: "humidity", value: 1 }]))
    n0tiles.set('grass1', new Tile('assets/plains/grass2.png', [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]], 4, [...grassFactors], [{ factor: "humidity", value: 1 }]))
    n0tiles.set('grass2', new Tile('assets/plains/grass3.png', [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]], 4, [...grassFactors], [{ factor: "humidity", value: 1 }]))

    let dirtWeight = 1 / 20
    let humidityDirt = -.2//-((1/20)*50)
    n0tiles.set('dirtGrass0', new Tile('assets/plains/dirtGrass0.png', [[0, 0, 0], [0, 0, 1], [1, 1, 1], [0, 0, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass1', new Tile('assets/plains/dirtGrass1.png', [[1, 1, 1], [1, 0, 0], [0, 0, 0], [1, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass2', new Tile('assets/plains/dirtGrass2.png', [[1, 0, 0], [0, 0, 0], [1, 0, 0], [1, 1, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass3', new Tile('assets/plains/dirtGrass3.png', [[0, 0, 1], [1, 1, 1], [0, 0, 1], [0, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass4', new Tile('assets/plains/dirtGrass4.png', [[0, 0, 1], [1, 0, 0], [1, 0, 0], [0, 0, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass5', new Tile('assets/plains/dirtGrass5.png', [[1, 0, 0], [0, 0, 1], [0, 0, 1], [1, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass6', new Tile('assets/plains/dirtGrass6.png', [[1, 0, 0], [0, 0, 0], [0, 0, 0], [1, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass7', new Tile('assets/plains/dirtGrass7.png', [[0, 0, 1], [1, 0, 0], [0, 0, 0], [0, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass8', new Tile('assets/plains/dirtGrass8.png', [[0, 0, 0], [0, 0, 0], [1, 0, 0], [0, 0, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass9', new Tile('assets/plains/dirtGrass9.png', [[0, 0, 0], [0, 0, 1], [0, 0, 1], [0, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass10', new Tile('assets/plains/dirtGrass10.png', [[0, 0, 1], [1, 1, 1], [1, 1, 1], [0, 0, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass11', new Tile('assets/plains/dirtGrass11.png', [[0, 0, 0], [0, 0, 1], [1, 1, 1], [0, 0, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass12', new Tile('assets/plains/dirtGrass12.png', [[1, 0, 0], [0, 0, 1], [1, 1, 1], [1, 1, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass13', new Tile('assets/plains/dirtGrass13.png', [[0, 0, 1], [1, 1, 1], [0, 0, 1], [0, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass14', new Tile('assets/plains/dirtGrass14.png', [[1, 0, 0], [0, 0, 0], [1, 0, 0], [1, 1, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass15', new Tile('assets/plains/dirtGrass15.png', [[1, 1, 1], [1, 1, 1], [0, 0, 1], [1, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass16', new Tile('assets/plains/dirtGrass16.png', [[1, 1, 1], [1, 0, 0], [0, 0, 0], [1, 0, 0]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))
    n0tiles.set('dirtGrass17', new Tile('assets/plains/dirtGrass17.png', [[1, 1, 1], [1, 0, 0], [1, 0, 0], [1, 1, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }]))

    n0tiles.set('dirt0', new Tile('assets/plains/dirt.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], 1, [], [{ factor: "humidity", value: humidityDirt * 2 }]))
    n0tiles.set('dirt1', new Tile('assets/plains/dirt2.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], 1, [], [{ factor: "humidity", value: humidityDirt * 2 }]))
    n0tiles.set('dirt2', new Tile('assets/plains/dirt3.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], 1, [], [{ factor: "humidity", value: humidityDirt * 2 }]))


    let thresholds = {

    }
    /*
    function addTiles(purple) {
        for (let i = 0; i < purple.tiles.length; i++) {
            let tile = purple.tiles[i]
            n0tiles.set(`${purple.name}${tile.id}`, new Tile(`${purple.path}${tile.id}${purple.fileType}`, tile.sides, tile.weight, tile.thresholds, tile.biases))
        }
    }
    let purple = {
        name: "purple", path: 'assets/wave/purple/', fileType: ".png",
        tiles: [{
            id: 0, sides: [[0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 1, 0]], weight: 1,
            thresholds:  [{ factor: "elevation", min: .4, max: .945 }, { factor: "elevation", min: 0, max: .4 }],
            biases: [{ factor: "elevation", value: 0 }]
        }]
    }
    addTiles(purple)
    */
    n0tiles.set('purple0', new Tile('assets/wave/purple/0.png', [[0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 1, 0]], 1, [{ factor: "elevation", min: .0, max: .945 }, { factor: "elevation", min: 0, max: .4 }]))
    n0tiles.set('purple1', new Tile('assets/wave/purple/1.png', [[0, 1, 0], [0, 0, 0], [0, 1, 0], [0, 0, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }]))
    n0tiles.set('purple2', new Tile('assets/wave/purple/2.png', [[0, 1, 0], [0, 0, 0], [0, 0, 0], [0, 1, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple3', new Tile('assets/wave/purple/3.png', [[0, 0, 0], [0, 0, 0], [0, 1, 0], [0, 1, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple4', new Tile('assets/wave/purple/4.png', [[0, 1, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple5', new Tile('assets/wave/purple/5.png', [[0, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple6', new Tile('assets/wave/purple/6.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], 1))
    n0tiles.set('green0', new Tile('assets/wave/green/0.png', [[2, 2, 2], [2, 3, 2], [2, 2, 2], [2, 3, 2]], 1, [{ factor: "elevation", min: -1, max: -.4 }]))
    n0tiles.set('green1', new Tile('assets/wave/green/1.png', [[2, 3, 2], [2, 2, 2], [2, 3, 2], [2, 2, 2]], 1, [{ factor: "elevation", min: -1, max: -.4 }]))
    n0tiles.set('green2', new Tile('assets/wave/green/2.png', [[2, 3, 2], [2, 2, 2], [2, 2, 2], [2, 3, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green3', new Tile('assets/wave/green/3.png', [[2, 2, 2], [2, 2, 2], [2, 3, 2], [2, 3, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green4', new Tile('assets/wave/green/4.png', [[2, 3, 2], [2, 3, 2], [2, 2, 2], [2, 2, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green5', new Tile('assets/wave/green/5.png', [[2, 2, 2], [2, 3, 2], [2, 3, 2], [2, 2, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green6', new Tile('assets/wave/green/6.png', [[2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2]], 1))

    n0jointtiles.set('green+purple', ['greenpurple0', 'greenpurple1', 'greenpurple2', 'greenpurple3',
        'greenpurple4', 'greenpurple5', 'greenpurple6', 'greenpurple7', 'greenpurple8', 'greenpurple9',
        'greenpurple10', 'greenpurple11'])
    n0tiles.set('greenpurple0', new Tile('assets/wave/greenpurple/0.png', [[2, 4, 0], [2, 4, 0], [0, 0, 0], [0, 0, 0]], .25))
    n0tiles.set('greenpurple1', new Tile('assets/wave/greenpurple/1.png', [[2, 4, 0], [0, 0, 0], [0, 0, 0], [2, 4, 0]], .25))
    n0tiles.set('greenpurple2', new Tile('assets/wave/greenpurple/2.png', [[0, 0, 0], [0, 0, 0], [2, 4, 0], [2, 4, 0]], .25))
    n0tiles.set('greenpurple3', new Tile('assets/wave/greenpurple/3.png', [[0, 0, 0], [2, 4, 0], [0, 4, 2], [0, 0, 0]], .25))
    n0tiles.set('greenpurple4', new Tile('assets/wave/greenpurple/4.png', [[0, 4, 2], [2, 2, 2], [0, 4, 2], [0, 0, 0]], .25))
    n0tiles.set('greenpurple5', new Tile('assets/wave/greenpurple/5.png', [[2, 2, 2], [2, 4, 0], [0, 0, 0], [2, 4, 0]], .25))
    n0tiles.set('greenpurple6', new Tile('assets/wave/greenpurple/6.png', [[2, 4, 0], [0, 0, 0], [2, 4, 0], [2, 2, 2]], .25))
    n0tiles.set('greenpurple7', new Tile('assets/wave/greenpurple/7.png', [[0, 0, 0], [0, 4, 2], [2, 2, 2], [0, 4, 2]], .25))
    n0tiles.set('greenpurple8', new Tile('assets/wave/greenpurple/8.png', [[2, 4, 0], [0, 1, 0], [2, 4, 0], [2, 3, 2]], .25))
    n0tiles.set('greenpurple9', new Tile('assets/wave/greenpurple/9.png', [[0, 1, 0], [0, 4, 2], [2, 3, 2], [0, 4, 2]], .25))
    n0tiles.set('greenpurple10', new Tile('assets/wave/greenpurple/10.png', [[0, 4, 2], [2, 3, 2], [0, 4, 2], [0, 1, 0]], .25))
    n0tiles.set('greenpurple11', new Tile('assets/wave/greenpurple/11.png', [[2, 3, 2], [2, 4, 0], [0, 1, 0], [2, 4, 0]], .25))


    loaded()

}, ["categorization"])
