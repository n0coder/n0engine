import { loadImg } from "../../../engine/core/Utilities/ImageUtils";
import { waves } from "./waveImport.mjs";

export class Tile {
    constructor(img, edges, weight, thresholds, biases, tintOn = true) {
        if (Array.isArray(img)) {
            this.img = [];
            for (let ix = 0; ix < img.length; ix++) {                
                loadImg(img[ix], (i) => this.img[ix] = i );
            }
        } else if (img) {
            loadImg(img, (i) => this.img = i );
        }
        
        if (Array.isArray(edges))
            var [up, right, down, left] = edges
        else waves.get(edges)
        this.tintOn = tintOn;
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.weight = weight
        this.thresholds = thresholds || [];
        this.biases = biases || [];
    }
    init() {
        
    }
    isLeft(tile) {
        var [a,b,c] = this.left
        var [i,o,p] = tile.right;
        return (a===i&&b===o&&c===p);
    }
    isRight(tile) {
        var [a,b,c] = this.right
        var [i,o,p] = tile.left;
        return (a===i&&b===o&&c===p);
    }
    isUp(tile) {
        
        var [a,b,c] = this.up
        var [i,o,p] = tile.down;
        return (a===i&&b===o&&c===p);
    }
    isDown(tile) {
        var [a,b,c] = this.down
        var [i,o,p] = tile.up;
        return (a===i&&b===o&&c===p);
    }
}