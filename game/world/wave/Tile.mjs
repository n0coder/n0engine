import { loadImg } from "../../../engine/core/Utilities/ImageUtils";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../FactorManager.mjs";
import { n0jointtiles, buildn0ts, n0TileModules } from "./n0.mjs";
//import {} from "./waveImport.mjs"

n0TileModules.set("4sides", {
    mod(tile) {
        let n0ts = tile.n0ts;
        n0ts.neighborStates = new Map();
        n0ts.sideConnection = [];
        this.newCheckDir(0, -1, tile, (a) => a.getUp())
        this.newCheckDir(1, 0, tile, (a) => a.getRight())
        this.newCheckDir(0, 1, tile, (a) => a.getDown())
        this.newCheckDir(-1, 0, tile, (a) => a.getLeft())


        if (n0ts.options.length === 0) {
        if (!n0ts.placeholder) 
            n0ts.placeholder = new PlaceholderTile(tile)  //createPlaceholder(tile, neighborStates);
        if (n0ts.sets.size > 1) {
            n0ts.placeholder.state = "tileset neighbor conflict";
            n0ts.placeholder.reason = ["neighbor conflict", n0ts.neighborStates, n0ts.sets];
            n0ts.placeholder.image = "missingJoint";
        } else {
            n0ts.placeholder.state =  "neighbor conflict";
            n0ts.placeholder.reason = ["neighbor conflict", n0ts.neighborStates]
            n0ts.placeholder.image = "missing";
        }
        return;
        }
    },
    collapsed(tile){
        for (const [_, neighbor] of tile.n0ts.neighborStates) {
            neighbor?.tile?.n0ts?.placeholder?.neighborCollapsed(tile, neighbor)
        }
    },
    newCheckDir(dx, dy, tile, dirFunction) {
        
        
        let neighbor = worldGrid.getTile(tile.wx + dx, tile.wy + dy);
        if (neighbor === undefined) {
            tile.n0ts.sideConnection.push(null)
            return;
        }

        let n = `${dx}, ${dy}`;
        let b = neighbor?.n0ts;
        if (!tile.n0ts.neighborStates.get(n))
            tile.n0ts.neighborStates.set(n, {
                dx, dy, tile: neighbor
            })

        let option = b?.option;
        if (b?.placeholder !== undefined) {
            tile.n0ts.sideConnection.push(null)
            return tile.n0ts.options; //ignore placeholders
        }
        //this never should be set null, option may be null, but b is undefined and so option is missing.
        if (option !== undefined) {
            let tileB = b.tile;
            let dir = dirFunction(tileB)
            tile.n0ts.sideConnection.push(dir.connection)

            tile.n0ts.sets.add(tileB.set);
            let opts = tile.n0ts.options.filter(a => {
                const tileA = tile.n0ts.tileset.get(a);
                return tileA && dir.connects(tileA);
            });
            tile.n0ts.options = opts;
            return opts
        } else {
            tile.n0ts.sideConnection.push('?')
        }
        return tile.n0ts.options;
    }
})

n0TileModules.set("noiseBiases", {
    mod(tile) {
        let optionBiases = tile.n0ts.options.map(o => {
            var tvt = tile.n0ts.tileset.get(o);

            if (!tvt) return null;
            let multiple = 1;

            for (var t of tvt.biases) {
                var factor = tile.genCache.get(t.factor)
                let wf = worldFactors.get(t.factor)
                if (!factor) continue; //if the factor doesn't exist don't use it

                var bias = inverseLerp(wf.mini, wf.maxi, factor)
                multiple *= lerp(-t.value, t.value, bias)
            }
            return { option: o, bias: multiple }
        })
        tile.n0ts.optionBiases = optionBiases.filter(({ option, bias }) => 
            tile.n0ts.noiseThresholdCondition(tile.genCache, option, bias)
        );

        if ( tile.n0ts.optionBiases.length === 0 ) {
            if (!tile.n0ts.placeholder) tile.n0ts.placeholder = new PlaceholderTile(tile, "fully filtered out by noise")  //createPlaceholder(tile, neighborStates);
            tile.n0ts.placeholder.reason = ["fully filtered out by noise", tile.biome.genCache ]
            tile.n0ts.placeholder.image = "filtered"; 
        }
    }
})



export class Tile {
    constructor(path) {
        this.path = path;
        //console.log(`loading ${path}`)
            loadImg(path, (i) => {
                this.img = i 
            });
        }
        modules = new Set();
        weight = .5;
        biases = [];
        thresholds = [];
        setSides(sides) {
            this.up = sides[0];
            this.right = sides[1];
            this.down = sides[2];
            this.left = sides[3];
            this.modules.add("4sides");
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
            this.modules.add("noiseBiases")
        }
        addBiases(bs) {
            this.biases.push(...bs);
            this.modules.add("noiseBiases")
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
            //secondarytiles
            console.log(this.tile.biome);
            buildn0ts(this.tile, undefined, this.tile.biome.secondaryTiles);
            if (this.n0ts.option !== undefined) {
                console.log(this.n0ts)
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
            buildn0ts(this.tile, jointTiles);
            if (this.n0ts.option !== null) {
                this.n0ts.placeholder = undefined;
                console.log("deleted placeholder")
            }
        }
    }
}