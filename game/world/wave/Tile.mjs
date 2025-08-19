import { loadImg } from "../../../engine/core/Utilities/ImageUtils";
import { n0jointtiles, buildn0Collapse } from "./n0.mjs";
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

        // used to describe newly generating tiles connection requirements
        getRight() { 
            let x = this.left;
            return { 
                connection: x,
                connects(tile) {
                    let y = tile.right;
                    return x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2];
                }
            };
        }
        getLeft() {
            let x = this.right;
            return { 
                connection: x,
                connects(tile) {
                    let y = tile.left;
                    return x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2]
                }
            };
        }
        getUp() {
            let x = this.down;
            return { 
                connection: x,
                connects(tile) {
                    let y = tile.up;
                    return x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2];
                }
            };
        }
        getDown() {
            let x = this.up;
            return {
                connection: x,
                connects(tile) {
                    let y = tile.down;
                    return x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2];
                }
            };
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
        loadImg("/assets/wave/filtered.png", (i) => {
            this.filtered = i 
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

        //one more attempt to build tile with a secondary tileset
        if (ns === 4) {
            buildn0Collapse(this.tile, secondaryTiles);
            if (this.n0ts.option !== null) {
                //console.log(this.n0ts.option)
                this.n0ts.placeholder = undefined;
                console.log("deleted placeholder", this, this.n0ts);
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
                //console.error(`no joint tiles in ${jointKey}`, this.n0ts)
                this.state = `missing ${jointKey} tiles`;
                this.reason = [this.state, jointKey, n0jointtiles]
                return;
            }
            buildn0Collapse(this.tile, jointTiles);
            if (this.n0ts.option !== null) {
                this.n0ts.placeholder = undefined;
                console.log("deleted placeholder")
            }
        }
    }
}