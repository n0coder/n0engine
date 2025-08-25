import { loadImg } from "../../../engine/core/Utilities/ImageUtils";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../FactorManager.mjs";
import { n0jointtiles, buildn0ts, n0TileModules } from "./n0.mjs";
import { pinga } from "../../radio/linkingPings"
import { p } from "../../../engine/core/p5engine";
import { invdiv } from "../../tools/n0tilesystem/n0tseditorUI.mjs";
//import {} from "./waveImport.mjs"

function directionFailure(tile) {
    let n0ts = tile.n0ts;
    if (!n0ts.placeholder)
        n0ts.placeholder = new PlaceholderTile(tile)  //createPlaceholder(tile, neighborStates);
    if (n0ts.sets.size > 1) {
        n0ts.placeholder.state = "tileset neighbor conflict";
        n0ts.placeholder.reason = ["neighbor conflict", n0ts.neighborStates, n0ts.sets];
        n0ts.placeholder.image = "missingJoint";
    } else {
        n0ts.placeholder.state = "neighbor conflict";
        n0ts.placeholder.reason = ["neighbor conflict", n0ts.neighborStates]
        n0ts.placeholder.image = "missing";
    }
    //pinga.ping("harvest", n0ts.placeholder, "error", false);
}

let dir = (dir, fn) => {
    n0TileModules.set(dir, {
        mod(tile, option) {
            return fn(tile, option);
        },
        post(tile) {
            //tile.n0ts.options = tile.n0ts.options2
            //tile.n0ts.options2 = undefined;
            //console.logp("post tile", tile)
            
            if (tile.n0ts.options.length === 0) {
                
                //console.logp(tile.n0ts.options)
                directionFailure(tile)
                return;
            }
            
        },
        collapsed(tile) {
            for (const [_, neighbor] of tile.n0ts.neighbors) {
                neighbor?.tile?.n0ts?.placeholder?.neighborCollapsed(tile, neighbor)
            }
        },
        failed(tile) {
            directionFailure(tile);
        },
        createState(tile) {
            return {
                values: [0, 0, 0],
                protected: false
            };
        },
        div: undefined, inputs: [], buildUI(currentTile) {
            let n0ts = currentTile.n0tsEditorTile;
            console.logp(n0ts);
            if (this.div === undefined) 
                this.div = p.createDiv().class("side").parent(invdiv);
            

            for (let i = 0; i < 3; i++) {
                if (!this.inputs[i]) 
                this.inputs[i] = p.createInput().addClass("value").parent(this.div);
                console.logp(n0ts)
                this.inputs[i].value(n0ts[dir][i])
                if (this.inputs[i].currentFN)
                this.inputs[i].elt.removeEventListener('input', this.inputs[i].currentFN);
                this.inputs[i].currentFN =() => {
                    n0ts[dir][i] = this.inputs[i].value();
                } 
                this.inputs[i].elt.addEventListener('input', this.inputs[i].currentFN);
                
            }
            return this.div;
        }
    })
}

dir("up",(tile, option)=>dirCheck(0, -1, tile, option, (a) => a.getUp()))
dir("right",(tile, option)=>dirCheck(1, 0, tile, option, (a) => a.getRight()))
dir("down",(tile, option)=>dirCheck(0, 1, tile, option, (a) => a.getDown()))
dir("left",(tile, option)=>dirCheck(-1, 0, tile, option, (a) => a.getLeft()))


function dirCheck(dx, dy, tile, option, dirFunction) {
    let n0ts = tile.n0ts;
    let n = `${dx}, ${dy}`;

    if (n0ts.neighbors===undefined ) 
        n0ts.neighbors = new Map();
    let neighbor = n0ts.neighbors.get(n);
    if (!neighbor) {
        let nn = worldGrid.getTile(tile.wx+dx, tile.wy+dy);
        neighbor = {
            dx, dy, tile: nn, 
            fn: null,
        };
        n0ts.neighbors.set(n, neighbor);
    }
    let b = neighbor.tile?.n0ts;
    if (neighbor.fn) {
        return neighbor.fn(tile, option);
    }
    
    if (neighbor.tile === null) {
        tile.n0ts.sideConnection.push(null)
        return;
    }

    let boption = b?.option;
    if (b?.placeholder !== undefined) {
        tile.n0ts.sideConnection.push(null)
        return true; //ignore placeholders
    }

    if (boption !== undefined) {
        let tileB = b.tile;
        let dir = dirFunction(tileB)
        tile.n0ts.sideConnection.push(dir.connection)
        tile.n0ts.sets.add(tileB.set);
        let neighborfn = (tile, option)=>{
            let opt = tile.n0ts.tileset.get(option)
            
            return dir.connects(opt);
        }
        neighbor.fn = neighborfn;
        return neighborfn(tile, option);
    } else {
        tile.n0ts.sideConnection.push('?')
    }
    
    return true;

    
    
    
    
    //originally we filtered out a set of tiles


}

n0TileModules.set("*4sides*", {
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
        //pinga.ping("harvest", tile.n0ts.placeholder, "error", false);

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

n0TileModules.set("biases", {
    createState: {
        biases: [], weight: .5
    },
    post(tile) {
        tile.n0ts.optionBiases = tile.n0ts.options.map(o => {
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
    },
    div: undefined, inputs: [], buildUI(tile) {
            //todo: bias div
            return this.div;
        }
})

n0TileModules.set("thresholds", {
    createState: {
        thresholds: []
    },
    post(tile) {
        tile.n0ts.optionBiases = optionBiases.filter(({ option, bias }) => 
            tile.n0ts.noiseThresholdCondition(tile.genCache, option, bias)
        );
    },
    failed(tile) {
    if ( tile.n0ts.optionBiases.length === 0 ) {
            if (!tile.n0ts.placeholder) tile.n0ts.placeholder = new PlaceholderTile(tile, "fully filtered out by noise")  //createPlaceholder(tile, neighborStates);
            tile.n0ts.placeholder.reason = ["fully filtered out by noise", tile.biome.genCache ]
            tile.n0ts.placeholder.image = "filtered"; 
            //pinga.ping("harvest", tile.n0ts.placeholder, "error", false);
        }
    },
    div: undefined, inputs: [], buildUI(tile) {
            //todo: bias div
            return this.div;
        }
})


export class Tile {
    constructor(path) {
        if (path !== undefined) {
            this.path = path;
            //console.logp(`loading ${path}`)
            loadImg(path, (i) => {
                this.img = i 
            });
        }
        }
        modules = new Set();
        weight = .5;
        biases = [];
        thresholds = [];
        setSides(sides) {
            this.up = sides[0];
            this.right = sides[1];
            this.down =  sides[2]
            this.left  = sides[3]
            
            this.modules.add("up");
            this.modules.add("right")
            this.modules.add("down");
            this.modules.add("left");
            
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
        //this.x = tile.wx;
        //this.y = tile.wy;
        //this.harvest = () => { p.ellipse(this.x, this.y, 30, 30);  return true; }

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
        //console.logp("neighbor collapsed around placeholder")
        
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
            console.logp(this.tile.biome);
            buildn0ts(this.tile, this.tile.biome.secondaryTiles);
            if (this.n0ts.option !== undefined) {
                console.logp(this.n0ts)
                //console.logp(this.n0ts.option)
                this.n0ts.placeholder = undefined;
                console.logp("deleted placeholder", this, this.n0ts);
                return;
            }
            //console.logp("2nd try build:", this.n0ts)
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
            buildn0ts(this.tile, undefined, jointTiles);
            if (this.n0ts.option !== null) {
                this.n0ts.placeholder = undefined;
                console.logp("deleted placeholder")
            }
        }
    }
}

/*

    createSidesUI(shared) {
        if (!shared.sides) return;
        
        const sideNames = ["Top", "Right", "Bottom", "Left"];
        
        for (let i = 0; i < shared.sides.length; i++) {
            let sideDiv = p.createDiv().class('textdiv').parent(this.currentDiv);
            let title = p.createDiv().class("sidebit").parent(sideDiv);
            p.createDiv(sideNames[i]).parent(title);
            this.createSideInputs(shared.sides[i], sideDiv);
        }
    },

    createSideInputs(side, parent) {
        let sideValues = side.get();
        
        for (let i = 0; i < sideValues.length; i++) {
            let input = p.createInput('number')
                .class("sidebit")
                .parent(parent)
                .value(sideValues[i]);
                
            input.input(() => {
                let value = input.value();
                if (value.length <= 0) return;
                
                let numValue = Number.parseFloat(value);
                sideValues[i] = numValue;
                side.set(sideValues);
            });
        }

        let protectedCheckbox = p.createCheckbox('', side.protected)
            .class("sidebit")
            .parent(parent);
            
        protectedCheckbox.changed(() => {
            side.protected = protectedCheckbox.checked();
        });
    },

    createWeightUI(shared) {
        let weightDiv = p.createDiv().parent(this.currentDiv);
        let title = p.createDiv().class("title").parent(weightDiv);
        p.createSpan("Weight").parent(title);
        
        let input = p.createInput('number')
            .class("sidebit")
            .parent(weightDiv)
            .value(shared.weight);
            
        input.input(() => {
            let value = input.value();
            if (value.length <= 0) return;
            shared.weight = Number.parseFloat(value);
        });
    },

    createBiasesUI(shared) {
        let biasesDiv = p.createDiv().parent(this.currentDiv);
        let title = p.createDiv().class("title").parent(biasesDiv);
        p.createSpan("Biases").parent(title);
        
        // Create bias entries
        for (let i = 0; i < shared.biases.length; i++) {
            this.createBiasEntry(shared.biases[i], biasesDiv, i, shared);
        }
        
        // Add bias button
        let addButton = p.createButton("Add Bias")
            .class("buttonbit")
            .parent(biasesDiv);
            
        addButton.mousePressed(() => {
            // Find unused factor
            for (const [factorKey, worldFactor] of worldFactors) {
                if (shared.biases.find(b => b.factor === factorKey)) continue;
                shared.biases.push({ factor: factorKey, value: 0 });
                this.drawUI(editingTile); // Refresh UI
                break;
            }
        });
    },

    createBiasEntry(bias, parent, index, shared) {
        let biasDiv = p.createDiv().parent(parent);
        
        // Factor selector
        let select = p.createSelect().class("buttonbit").parent(biasDiv);
        for (const [factorKey] of worldFactors) {
            select.option(factorKey);
        }
        select.selected(bias.factor);
        select.changed(() => {
            bias.factor = select.value();
            this.drawUI(editingTile);
        });
        
        // Value input
        let valueInput = p.createInput('number')
            .class("sidebit")
            .parent(biasDiv)
            .value(bias.value);
            
        valueInput.input(() => {
            let value = valueInput.value();
            if (value.length <= 0) return;
            bias.value = Number.parseFloat(value);
        });
        
        // Remove button
        let removeButton = p.createButton("X")
            .class("buttonbit")
            .parent(biasDiv);
            
        removeButton.mousePressed(() => {
            shared.biases.splice(index, 1);
            this.drawUI(editingTile);
        });
    },

    createThresholdsUI(shared) {
        let thresholdsDiv = p.createDiv().parent(this.currentDiv);
        let title = p.createDiv().class("title").parent(thresholdsDiv);
        p.createSpan("Thresholds").parent(title);
        
        // Create threshold entries
        for (let i = 0; i < shared.thresholds.length; i++) {
            this.createThresholdEntry(shared.thresholds[i], thresholdsDiv, i, shared);
        }
        
        // Add threshold button
        let addButton = p.createButton("Add Threshold")
            .class("buttonbit")
            .parent(thresholdsDiv);
            
        addButton.mousePressed(() => {
            // Find unused factor
            for (const [factorKey, worldFactor] of worldFactors) {
                if (shared.thresholds.find(t => t.factor === factorKey)) continue;
                shared.thresholds.push({ 
                    factor: factorKey, 
                    min: worldFactor.mini, 
                    max: worldFactor.maxi 
                });
                this.drawUI(editingTile);
                break;
            }
        });
    },

    createThresholdEntry(threshold, parent, index, shared) {
        let threshDiv = p.createDiv().parent(parent);
        
        // Factor selector
        let select = p.createSelect().class("buttonbit").parent(threshDiv);
        for (const [factorKey] of worldFactors) {
            select.option(factorKey);
        }
        select.selected(threshold.factor);
        select.changed(() => {
            let factor = worldFactors.get(select.value());
            threshold.factor = select.value();
            threshold.min = factor.mini;
            threshold.max = factor.maxi;
            this.drawUI(editingTile);
        });
        
        // Min input
        let minInput = p.createInput('number')
            .class("sidebit")
            .parent(threshDiv)
            .value(threshold.min);
            
        minInput.input(() => {
            let value = minInput.value();
            if (value.length <= 0) return;
            threshold.min = Number.parseFloat(value);
        });
        
        // Max input  
        let maxInput = p.createInput('number')
            .class("sidebit")
            .parent(threshDiv)
            .value(threshold.max);
            
        maxInput.input(() => {
            let value = maxInput.value();
            if (value.length <= 0) return;
            threshold.max = Number.parseFloat(value);
        });
        
        // Remove button
        let removeButton = p.createButton("X")
            .class("buttonbit")
            .parent(threshDiv);
            
        removeButton.mousePressed(() => {
            shared.thresholds.splice(index, 1);
            this.drawUI(editingTile);
        });
    }
*/