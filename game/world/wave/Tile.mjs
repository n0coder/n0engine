import { loadImg } from "../../../engine/core/Utilities/ImageUtils";
//import {} from "./waveImport.mjs"

export class Tile {
    constructor(path) {
        this.path = path;
        console.log(`loading ${path}`)
        loadImg(path, (i) => {
            this.img = i 
        });
        
    }
        weight = .5;
        biases = [];
        thresholds = [];
        setSides(sides) {
            this.up = sides[0];
            this.right = sides[1];
            this.down = sides[2];
            this.left = sides[3];
        }
        setWeight(weight) {
            this.weight = weight;
        }
        addThreshold(t = {factor: "blank", min: 0, max: 1}) {
            this.thresholds.push(t)
        }
        addThresholds(ts) {
            this.thresholds.push(...ts);
        }
        addBias(b = { factor:"blank", value: 0 }) {
            this.biases.push(b)
        }
        addBiases(bs) {
            this.biases.push(...bs);
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
        var [a,b,c] = this.up;
        var [i,o,p] = tile.down;
        return (a===i&&b===o&&c===p);
    }
    isDown(tile) {
        var [a,b,c] = this.down
        var [i,o,p] = tile.up;
        return (a===i&&b===o&&c===p);
    }
}