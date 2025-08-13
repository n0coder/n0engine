import { loadImg } from "../../../engine/core/Utilities/ImageUtils";
import { buildn0Collapse } from "./n0.mjs";
import { n0jointtiles } from "./n0FunctionCollapse.mjs";
//import {} from "./waveImport.mjs"

export class Tile {
    constructor(path, set) {
        this.path = path;
        //console.log(`loading ${path}`)
            loadImg(path, (i) => {
                this.img = i 
            });
            this.set = set;
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
        let x = this.left;
        let y = tile.right;
        let yes = x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2];
        return yes
    }
    isRight(tile) {
        let x = this.right;
        let y = tile.left;
        let yes = x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2];
        return yes
    }
    isUp(tile) {
        let x = tile.up;
        let y = this.down;
        let yes = x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2];
        return yes
    }
    isDown(tile) {
        let x = tile.down;
        let y = this.up;
        let yes = x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2];
        return yes
    }
}

export class PlaceholderTile {
    constructor(tile, state) {
        this.tile = tile;
        this.n0ts = tile.n0ts;
        this.state = state;
        this.reason = [];

        loadImg("/assets/wave/missing.png", (i) => {
            this.missing = i 
        });
        loadImg("/assets/wave/missingJoint.png", (i) => {
            this.missingJoint = i 
        });
        loadImg("/assets/wave/unfinished.png", (i) => {
            this.unfinished = i 
        });
    }
    neighborCollapsed(tile, direction) {
        if (this.state === "no rules") {
            return; //no reason to set direction if there's no rules to 
        }
        //console.log("neighbor collapsed around placeholder")
        
        let dx = -direction.dx, dy = -direction.dy; //invert direction offset
        this.n0ts.neighborStates.set(`${dx}, ${dy}`, { dx, dy, tile })

        let ns = 0;
        for (const [_, neighbor] of this.n0ts.neighborStates) {
            if (neighbor.tile) ns++;
        }

        //one more attempt to build tile with normal tileset
        if (ns === 4) {
            buildn0Collapse(this.tile);
            if (this.n0ts.option !== undefined) {
                this.placeholder = undefined;
                console.log("deleted placeholder")
                return;
            }
            //console.log("2nd try build:", this.n0ts)
        }
         //get joint tiles and then 
        if (this.n0ts.sets.size > 1) {
            //sort the sets names so any order will give the same name;
            let setNames = Array.from(this.n0ts.sets).sort();
            let jointKey = setNames.join(''); 
            let jointTiles = n0jointtiles.get(jointKey);
            if (jointTiles === undefined || jointTiles.length === 0 ) {
                console.error(`no joint tiles in ${jointKey}`)
                this.state = `missing ${jointKey} tiles`;
                this.reason = [this.state, jointKey, n0jointtiles]
                return;
            }
            buildn0Collapse(this.tile, jointTiles);
            if (this.n0ts.option !== undefined) {
                this.placeholder = undefined;
                console.log("deleted placeholder")
            }
        }
    }
}