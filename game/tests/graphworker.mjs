import { createNoise2D } from "simplex-noise";
import { Graph } from "../world/noiseGen/graph.mjs";
import Alea from "alea";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";

let xna = new Graph();
let xnf = {
    input: createNoise2D(Alea(5)),
    min: -1, max: 1
}

xna.scaleXY(35).fractal(xnf).posterize(10);
xna//.sin()//.floor()

let xnb = new Graph().copy(xna)
xnb.anglize().cos()//.sin();


self.addEventListener('message', function(event) {
    const data = event.data;
    let result = []
    let ox = data.x, oy = data.y;
    for (let i = 0; i <data.w; i++) {
        result[i] = []
        for (let o = 0; o <data.h; o++) {
            let tile = genTile(ox+i, oy+o)
            tile.ox = ox+i; tile.oy= oy+o;
            result[i][o]= tile //xnb.create(ox+i, oy+o);
        }
    }
    //const result = 
    self.postMessage({ox:data.x, oy: data.y,result});
});