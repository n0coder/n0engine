//here we go again, but i'm gonna prototype connections here

import { camera } from "../../engine/core/Camera/camera.mjs";
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.ts";
import { loadImg } from "../../engine/core/Utilities/ImageUtils.ts";
import { atomicClone } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { Nanoai } from "../nanoai/nanoai.mjs";
import { DebugCursor } from "../world/debugCursor.mjs";
import { buildn0ts } from "../world/wave/n0.mjs";
import { n0jointtiles, n0tiles } from "../world/wave/n0.mjs";
import { Tile } from "../world/wave/Tile.mjs";
import { drawChunks, drawTile } from "../world/wave/worldGen/ChunkDrawer.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";

let n0 = new Nanoai(`n0`, 30, 15)
camera.follow(n0);
cosmicEntityManager.addEntity(camera);
new DebugCursor()

//n0.brain.do("walk", -0, -100)
//worldGrid.x -= 10000000
//n0.setActive(false); 
// spawn the character but it's just the raw state, the loop and rendering is disabled
/*
//style 2:
let n0tile = new Tile("../../assets/wave/purple/5.png");
n0tile.setSides([0,0,0],[0,0,0],[0,0,0],[0,0,0])
n0tile.setWeight(.5);
n0tile.addThreshold({factor: "elevation", min: -1, max: 1});
n0tile.addBias({factor: "humidity", value: .2});
//n0ts.addTile(n0tile)
//new Tile('assets/plains/dirtGrass0.png', [[0, 0, 0], [0, 0, 1], [1, 1, 1], [0, 0, 1]], dirtWeight, [...grassFactors], [{ factor: "humidity", value: humidityDirt }])
n0tiles.set("dirt0", n0tile)

*/

/*
    n0tiles.set('purple0', new Tile('assets/wave/purple/0.png', [[0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 1, 0]], 1, [{ factor: "elevation", min: .0, max: .945 }, { factor: "elevation", min: 0, max: .4 }]))
    n0tiles.set('purple1', new Tile('assets/wave/purple/1.png', [[0, 1, 0], [0, 0, 0], [0, 1, 0], [0, 0, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }]))
    n0tiles.set('purple2', new Tile('assets/wave/purple/2.png', [[0, 1, 0], [0, 0, 0], [0, 0, 0], [0, 1, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple3', new Tile('assets/wave/purple/3.png', [[0, 0, 0], [0, 0, 0], [0, 1, 0], [0, 1, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple4', new Tile('assets/wave/purple/4.png', [[0, 1, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple5', new Tile('assets/wave/purple/5.png', [[0, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 0]], 1, [{ factor: "elevation", min: .0, max: .875 }], [{ factor: "elevation", value: .35 }]))
    n0tiles.set('purple6', new Tile('assets/wave/purple/6.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], 1))
*/

/*
        isLeft(tile) {
            var [a,b,c] = this.left
            var [i,o,p] = tile.right;
            return (a===i&&b===o&&c===p);
        }
        */
/*
let tile = new Tile("../../assets/wave/purple/2.png")
tile.setSides([[0,1,0],[0,0,0],[0,1,0],[0,0,0]]);
let tile2 =new Tile("../../assets/wave/purple/2.png")
tile2.setSides([[0,1,0],[0,0,0],[0,0,0],[0,1,0]]);
console.log({tile, tile2, up: tile.isUp(tile2), right: tile.isRight(tile2), down: tile.isDown(tile2), left: tile.isLeft(tile2) })
n0tiles.set("purple0", tile);
n0tiles.set("purple1", tile2);
*/
function addTiles(def) {
    for (let i = 0; i < def.imgRules.length; i++) {
        let [index, file, sides] = def.imgRules[i];
        let n0tile = new Tile(`${def.path}/${file}`, def.name);
        n0tile.setSides(sides)
        n0tile.setWeight(def.weight);
        n0tile.addThresholds(def.thresholds);
        n0tile.addBiases(def.biases);
        if (def.map)
            def.map.set(`${def.name}${index}`, n0tile)
        else
            n0tiles.set(`${def.name}${index}`, n0tile)
        
    }
}


addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [2, "2.png", [[0,1,0],[0,0,0],[0,0,0],[0,1,0]]],
        [3, "3.png", [[0,0,0],[0,0,0],[0,1,0],[0,1,0]]],
        [4, "4.png", [[0,1,0],[0,1,0],[0,0,0],[0,0,0]]],
        [5, "5.png", [[0,0,0],[0,1,0],[0,1,0],[0,0,0]]],
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}], 
    biases: [{factor: "temperature", value: -1}]
})

addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [0, "0.png", [[0,0,0],[0,1,0],[0,0,0],[0,1,0]]],
        [1, "1.png", [[0,1,0],[0,0,0],[0,1,0],[0,0,0]]],
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}], 
    biases: [{factor: "temperature", value: -1}]
})

addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [6, "6.png", [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]],
    ],
    weight: .5,
    thresholds: [], 
    biases: [{factor: "temperature", value: -1}]
})

addTiles({
    map: n0jointtiles,
    name: "greenpurple", weight: .25, thresholds: [], 
    path: "/assets/wave/greenpurple",
    biases: [{factor: "temperature", value: 0}],
    imgRules: [
        [ 11, "11.png", [[2, 3, 2], [2, 4, 0], [0, 1, 0], [2, 4, 0]]],
        [ 10, "10.png", [[0, 4, 2], [2, 3, 2], [0, 4, 2], [0, 1, 0]]],
        [ 9, "9.png", [[0, 1, 0], [0, 4, 2], [2, 3, 2], [0, 4, 2]]],
        [ 8, "8.png", [[2, 4, 0], [0, 1, 0], [2, 4, 0], [2, 3, 2]]],
        [ 7, "7.png", [[0, 0, 0], [0, 4, 2], [2, 2, 2], [0, 4, 2]]],
        [ 6, "6.png", [[2, 4, 0], [0, 0, 0], [2, 4, 0], [2, 2, 2]]],
        [ 5, "5.png", [[2, 2, 2], [2, 4, 0], [0, 0, 0], [2, 4, 0]]],
        [ 4, "4.png", [[0, 4, 2], [2, 2, 2], [0, 4, 2], [0, 0, 0]]],
        [ 3, "3.png", [[0, 0, 0], [2, 4, 0], [0, 4, 2], [0, 0, 0]]],
        [ 2, "2.png", [[0, 0, 0], [0, 0, 0], [2, 4, 0], [2, 4, 0]]],
        [ 1, "1.png", [[2, 4, 0], [0, 0, 0], [0, 0, 0], [2, 4, 0]]],
        [ 0, "0.png", [[2, 4, 0], [2, 4, 0], [0, 0, 0], [0, 0, 0]]]
    ]
})

    /*
    n0tiles.set('green0', new Tile('assets/wave/green/0.png', [[2, 2, 2], [2, 3, 2], [2, 2, 2], [2, 3, 2]], 1, [{ factor: "elevation", min: -1, max: -.4 }]))
    n0tiles.set('green1', new Tile('assets/wave/green/1.png', [[2, 3, 2], [2, 2, 2], [2, 3, 2], [2, 2, 2]], 1, [{ factor: "elevation", min: -1, max: -.4 }]))
    n0tiles.set('green2', new Tile('assets/wave/green/2.png', [[2, 3, 2], [2, 2, 2], [2, 2, 2], [2, 3, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green3', new Tile('assets/wave/green/3.png', [[2, 2, 2], [2, 2, 2], [2, 3, 2], [2, 3, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green4', new Tile('assets/wave/green/4.png', [[2, 3, 2], [2, 3, 2], [2, 2, 2], [2, 2, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green5', new Tile('assets/wave/green/5.png', [[2, 2, 2], [2, 3, 2], [2, 3, 2], [2, 2, 2]], 1, [{ factor: "elevation", min: -.95, max: -.5 }], [{ factor: "elevation", value: -.1 }]))
    n0tiles.set('green6', new Tile('assets/wave/green/6.png', [[2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2]], 1))
    */

addTiles({
    name: "green",
    path: "/assets/wave/green", 
    imgRules: [
        [2, "2.png", [[2, 3, 2], [2, 2, 2], [2, 2, 2], [2, 3, 2]]],
        [3, "3.png", [[2, 2, 2], [2, 2, 2], [2, 3, 2], [2, 3, 2]]],
        [4, "4.png", [[2, 3, 2], [2, 3, 2], [2, 2, 2], [2, 2, 2]]],
        [5, "5.png", [[2, 2, 2], [2, 3, 2], [2, 3, 2], [2, 2, 2]]],
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}], 
    biases: [{factor: "temperature", value: 1}]
})

addTiles({
    name: "green",
    path: "/assets/wave/green", 
    imgRules: [
        [0, "0.png",  [[2, 2, 2], [2, 3, 2], [2, 2, 2], [2, 3, 2]]],
        [1, "1.png", [[2, 3, 2], [2, 2, 2], [2, 3, 2], [2, 2, 2]]],
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}], 
    biases: [{factor: "temperature", value: 1}]
})

addTiles({
    name: "green",
    path: "/assets/wave/green", 
    imgRules: [
        [6, "6.png",  [[2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2]]],
    ],
    weight: .5,
    thresholds: [], 
    biases: [{factor: "temperature", value: 1}]
})

function buildTiles(definition) {
    definition.overlayDef = function (def2) {
        let tiledef = atomicClone(definition);
        for (const key in def2) {
            if (typeof def2[key] === "function")
                def2[key](tiledef, key)
            else
                tiledef[key] = def2[key]; 
        }
        return tiledef;
    }
    return definition;
}
/*
let tileo = buildTiles({
    name: "green",
    path: "/assets/wave/green", 
    imgRules: [
        [6, "6.png", [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]],
    ],
    weight: .5,
    thresholds: [], 
    biases: [{factor: "temperature", value: 1}]
})

let tileo2 = tileo.overlayDef({
    imgRules: [
        [2, "2.png", [[0,1,0],[0,0,0],[0,0,0],[0,1,0]]]
    ],
    biases(def, key) { //modify using function
        def[key].push({factor: "temperature", value: 3})
    },
    weight:.6
})
*/
//console.log (tileo, tileo2);

let tilevis = {
    draw(){
        drawChunks(n0, true)
    }
}

cosmicEntityManager.addEntity( tilevis )
