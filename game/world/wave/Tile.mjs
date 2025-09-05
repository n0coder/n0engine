import { loadImg } from "../../../engine/core/Utilities/ImageUtils";
import { n0jointtiles, buildn0ts } from "./n0.mjs";

export class Tile {
    constructor(path) {
        if (path !== undefined) {
            this.path = path;
            //console.log(`loading ${path}`)
            loadImg(path, (i) => {
                this.img = i 
            });
        }
        }
        modules = ["weight", "up", "right", "down", "left", "thresholds", "biases"];
        up = [0,0,0];
        right = [0,0,0];
        down = [0,0,0];
        left = [0,0,0];
        weight = .5;
        biases = [];
        thresholds = [];
        setSides(up, right, down, left) {
            this.up = up;
            this.right = right;
            this.down = down;
            this.left = left;
            
            this.modules.push("up");
            this.modules.push("right")
            this.modules.push("down");
            this.modules.push("left");
            
        }
        setWeight(weight) {
            this.weight = weight;
            this.modules.push("weight")
        }
        addThreshold(t = {factor: "blank", min: 0, max: 1}) {
            this.thresholds.push(t)            
            this.modules.push("thresholds")
        }
        addThresholds(ts) {
            this.thresholds.push(...ts);
            this.modules.push("thresholds")
        }
        addBias(b = { factor:"blank", value: 0 }) {
            this.biases.push(b)
            this.modules.push("biases")
        }
        addBiases(bs) {
            this.biases.push(...bs);
            this.modules.push("biases")
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
        //this.x = tile.wx;
        //this.y = tile.wy;
        //this.harvest = () => { p.ellipse(this.x, this.y, 30, 30);  return true; }

        loadImg("/assets/wave/missing.png", (i) => {
            this.missing = i 
        });
        loadImg("/assets/wave/missingJoint.png", (i) => {
            this.missingJoint = i 
        });
        loadImg("/assets/wave/hide.png", (i) => {
            this.unfinished = i 
        });
        loadImg("/assets/wave/filtered.png", (i) => {
            this.filtered = i 
        });
        this.checkJoints();
    }

    checkJoints() {
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
            buildn0ts(this.tile, undefined, jointTiles);
            if (this.n0ts.option !== null) {
                this.n0ts.placeholder = undefined;
                console.log("deleted placeholder")
            }
        }
    }

    neighborCollapsed(tile, direction) {
        if (this.state === "no rules") {
            return; //no reason to set direction if there's no rules to 
        }
        //console.log("neighbor collapsed around placeholder")
        
        let dx = -direction.dx, dy = -direction.dy; //invert direction offset
        let key = `${dx}, ${dy}`;
        let nei = this.n0ts.neighbors.get(key)
        if (!nei) {
            nei = { dx, dy, tile };
            this.n0ts.neighbors.set(key, nei)
        }

        let ns = 0;
        for (const [_, neighbor] of this.n0ts.neighbors) {
            if (neighbor.tile) ns++;
        }

        //one more attempt to build tile with a secondary tileset
        if (ns === 4) {
            //secondarytiles
            console.log(this.tile.biome);
            buildn0ts(this.tile, this.tile.biome.secondaryTiles);
            if (this.n0ts.option !== null) {
                console.log(this.n0ts)
                //console.log(this.n0ts.option)
                this.n0ts.placeholder = undefined;
                console.log("deleted placeholder", this, this.n0ts);
                return;
            }
            //console.log("2nd try build:", this.n0ts)
        }
        
    }
}