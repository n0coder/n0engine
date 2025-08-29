import { p } from "../../../engine/core/p5engine";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { invdiv } from "../../tools/n0tilesystem/n0tseditorUI.mjs";
import { worldFactors } from "../FactorManager.mjs";
import { n0TileModules } from "./n0.mjs";
import { PlaceholderTile } from "./Tile.mjs";

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
            //console.log("post tile", tile)
            
            if (tile.n0ts.options.length === 0) {
                
                //console.log(tile.n0ts.options)
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
            let n0ts = currentTile;
            //console.error(currentTile)
            if (this.div === undefined)
                this.div = p.createDiv().class("side").parent(invdiv);

            for (let i = 0; i < 3; i++) {
                if (!this.inputs[i]) 
                this.inputs[i] = p.createInput().addClass("value").parent(this.div);
                
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
        biases: []
    },
    post(tile) {
        tile.n0ts.optionBiases = tile.n0ts.options.map(o => {
            var tvt = tile.n0ts.tileset.get(o);

            if (!tvt) return null;
            let multiple = tvt.weight || .5;

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
    div: undefined, inputs: [],   div: undefined,
    inputs: [],   // each { factor, value, remove }

    buildUI(n0ts) {
        if (!n0ts.biases) n0ts.biases = [];

        // Create root div once
        if (this.div === undefined)
            this.div = p.createDiv().class("biases").parent(invdiv);
        else {

            //var itemsa = Array.from(this.div.elt.children);
            for (const node of this.inputs) {
                invdiv.elt.appendChild(node.div.elt);
            }
        }

        // Add button (one per module)
        if (!this.addButton) {
            this.addButton = p.createDiv().class("buttondiv");
            p.createButton("Add Bias").parent(this.addButton);
        }
        this.addButton.parent(this.div);

        if (this.addButton.currentFN)
            this.addButton.elt.removeEventListener("click", this.addButton.currentFN);
        this.addButton.currentFN = () => {
            for (const [fk] of worldFactors) {
                if (!n0ts.biases.find(b => b.factor === fk)) {
                    n0ts.biases.push({ factor: fk, value: 0 });
                    break;
                }
            }
            this.buildUI(n0ts);
            return;
        };
        this.addButton.elt.addEventListener("click", this.addButton.currentFN);

        for (let i = 0; i < n0ts.biases.length; i++) {
            if (!this.inputs[i]) this.inputs[i] = {};

            const row = this.inputs[i];
            if (!row.div)
                row.div = p.createDiv().class("side")
            
            row.div.parent(this.div);
            // Factor select
            if (!row.factor) {
                row.factor = p.createSelect().class("factors")
                for (const [fk] of worldFactors) row.factor.option(fk);
            }
            row.factor.parent(row.div);
            row.factor.value(n0ts.biases[i].factor);

            if (row.factor.currentFN)
                row.factor.elt.removeEventListener("change", row.factor.currentFN);
            row.factor.currentFN = () => {
                n0ts.biases[i].factor = row.factor.value();
            };
            row.factor.elt.addEventListener("change", row.factor.currentFN);

            // Value input
            if (!row.value) {
                row.value = p.createInput("", "number").class("value")
            }
            row.value.parent(row.div);
            row.value.value(n0ts.biases[i].value);

            if (row.value.currentFN)
                row.value.elt.removeEventListener("input", row.value.currentFN);
            row.value.currentFN = () => {
                let o = parseFloat(row.value.value());
                if (!Number.isNaN(o)) n0ts.biases[i].value = o;
            };
            row.value.elt.addEventListener("input", row.value.currentFN);

            // Remove button
            if (!row.remove) {
                row.remove = p.createButton("X").class("x");
            }
            row.remove.parent(row.div);

            if (row.remove.currentFN)
                row.remove.elt.removeEventListener("click", row.remove.currentFN);
            row.remove.currentFN = () => {
                n0ts.biases.splice(i, 1);
                this.buildUI(n0ts); // rebuild view without nuking base div
            };
            row.remove.elt.addEventListener("click", row.remove.currentFN);
        }

        return this.div;
    }
})


n0TileModules.set("weight", {
    div: undefined, inputs: [],   div: undefined,
    inputs: [],   // each { factor, value, remove }
    buildUI(n0ts) {
        if (!n0ts.biases) n0ts.biases = [];

        // Create root div once
        if (this.div === undefined)
            this.div = p.createDiv().class("weights").parent(invdiv);

        this?.weightDiv?.parent(invdiv);
        if (!this.weightDiv) {
            this.weightDiv = p.createDiv().class("weight").parent(invdiv);
            this.weightDiv.input = p.createInput("", "number").class("value").parent(this.weightDiv);
        }
        console.log(n0ts);
        this.weightDiv.parent(this.div);
        this.weightDiv.input.value(n0ts.weight);

            if (this.weightDiv.input.currentFN)
                this.weightDiv.input.elt.removeEventListener("input", this.weightDiv.currentFN);
            this.weightDiv.input.currentFN = () => {
                let o = parseFloat(this.weightDiv.value());
                if (!Number.isNaN(o)) n0ts.weight = o;
            };
            this.weightDiv.input.elt.addEventListener("input", this.weightDiv.currentFN);
        return this.div;
    }
})

n0TileModules.set("thresholds", {
    createState: {
        thresholds: []
    },
    post(tile) {
        if (tile?.n0ts?.optionBiases)
        tile.n0ts.optionBiases = tile.n0ts.optionBiases.filter(({ option, bias }) => 
            tile.n0ts.noiseThresholdCondition(tile.genCache, option, bias)
        );
    },
    failed(tile) {
    if (tile?.n0ts?.optionBiases && tile.n0ts.optionBiases.length === 0 ) {
            if (!tile.n0ts.placeholder) tile.n0ts.placeholder = new PlaceholderTile(tile, "fully filtered out by noise")  //createPlaceholder(tile, neighborStates);
            tile.n0ts.placeholder.reason = ["fully filtered out by noise", tile.biome.genCache ]
            tile.n0ts.placeholder.image = "filtered"; 
            //pinga.ping("harvest", tile.n0ts.placeholder, "error", false);
        }
    },
    div: undefined, inputs: [], 

    buildUI(currentTile) {
        let n0ts = currentTile;
        if (!n0ts.thresholds) n0ts.thresholds = [];

        if (this.div === undefined)
            this.div = p.createDiv().class("thresholds").parent(invdiv);
        else {
            //var itemsa = Array.from(this.div.elt.children);
            for (const node of this.inputs) {
                invdiv.elt.appendChild(node.div.elt);
            }
        }
        // Add threshold button
        if (!this.addButton) {
            this.addButton = p.createButton("Add Threshold");
        }        
        this.addButton.parent(this.div);

        if (this.addButton.currentFN)
            this.addButton.elt.removeEventListener("click", this.addButton.currentFN);
        this.addButton.currentFN = () => {
            for (const [fk, wf] of worldFactors) {
                if (!n0ts.thresholds.find(t => t.factor === fk)) {
                    n0ts.thresholds.push({
                        factor: fk,
                        min: wf.mini,
                        max: wf.maxi
                    });
                    break;
                }
            }
            this.buildUI(n0ts);
        };
        this.addButton.elt.addEventListener("click", this.addButton.currentFN);

        for (let i = 0; i < n0ts.thresholds.length; i++) {
            if (!this.inputs[i]) 
                this.inputs[i] = {};
            const row = this.inputs[i];
            if (!row.div)
            row.div = p.createDiv().class("side")
            row.div.parent(this.div);
            // Factor select
            if (!row.factor) {
                row.factor = p.createSelect().class("factors")
                for (const [fk] of worldFactors) row.factor.option(fk);
            }
            row.factor.parent(row.div);
            row.factor.value(n0ts.thresholds[i].factor);

            if (row.factor.currentFN)
                row.factor.elt.removeEventListener("change", row.factor.currentFN);
            row.factor.currentFN = () => {
                const fk = row.factor.value();
                const wf = worldFactors.get(fk);
                n0ts.thresholds[i].factor = fk;
                if (wf) {
                    n0ts.thresholds[i].min = wf.mini;
                    n0ts.thresholds[i].max = wf.maxi;
                }
            };
            row.factor.elt.addEventListener("change", row.factor.currentFN);

            // Min input
            if (!row.min) {
                row.min = p.createInput("", "number").class("min")
            }
            row.min.parent(row.div);
            row.min.value(n0ts.thresholds[i].min);

            if (row.min.currentFN)
                row.min.elt.removeEventListener("input", row.min.currentFN);
            row.min.currentFN = () => {
                let o = parseFloat(row.min.value());
                if (!Number.isNaN(o)) n0ts.thresholds[i].min = o;
            };
            row.min.elt.addEventListener("input", row.min.currentFN);

            // Max input
            if (!row.max) {
                row.max = p.createInput("", "number").class("max")
            }
            row.max.parent(row.div);
            row.max.value(n0ts.thresholds[i].max);

            if (row.max.currentFN)
                row.max.elt.removeEventListener("input", row.max.currentFN);
            row.max.currentFN = () => {
                let o = parseFloat(row.max.value());
                if (!Number.isNaN(o)) n0ts.thresholds[i].max = o;
            };
            row.max.elt.addEventListener("input", row.max.currentFN);

            // Remove button
            if (!row.remove) {
                row.remove = p.createButton("X").class("x")
            }
            row.remove.parent(row.div);
            if (row.remove.currentFN)
                row.remove.elt.removeEventListener("click", row.remove.currentFN);
            row.remove.currentFN = () => {
                n0ts.thresholds.splice(i, 1);
                this.buildUI(n0ts);
            };
            row.remove.elt.addEventListener("click", row.remove.currentFN);
        }

        return this.div;
    } 
})