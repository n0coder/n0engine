import Alea from "alea";
import { n0tiles } from "./n0FunctionCollapse.mjs";
import { Cell } from "./Cell.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../FactorManager.mjs";
import { PlaceholderTile } from "./Tile.mjs";

export const n0alea = Alea("n0");

//generate tile
//gather tiles from biome
//

export function buildn0Collapse(tile, joints) {
    var x = tile.wx, y = tile.wy
    let map = joints ? joints : n0tiles
    let rules = tile.biome.tiles.filter(t => map.get(t))

    let n0ts = new Cell(rules);
    if (!tile.n0ts) tile.n0ts = new Cell(rules);
    n0ts = tile.n0ts;

    if (n0ts.neighborStates === undefined) 
        n0ts.neighborStates = new Map();

    if (rules.length === 0) {
        if (!n0ts.placeholder) n0ts.placeholder = new PlaceholderTile(tile)  //createPlaceholder(tile, neighborStates);
        n0ts.placeholder.state = "no rules";
        n0ts.placeholder.reason = ["no rules", tile.biome.rules ]
        n0ts.placeholder.image = "unfinished"; 
        return;
    };
    n0ts.v = 2; 
    if (n0ts.option) return;

    var options = [...n0ts.options];
    options = newCheckDir(0, 1, options, (a, b) => a.isUp(b))
    options = newCheckDir(1, 0, options, (a, b) => a.isRight(b))
    options = newCheckDir(0, -1, options, (a, b) => a.isDown(b))
    options = newCheckDir(-1, 0, options, (a, b) => a.isLeft(b))
    /*
    options = newCheckDir(x - 1, y - 1, options, (a, b) => a.isUpLeft(b));   // Up-left
    options = newCheckDir(x + 1, y - 1, options, (a, b) => a.isUpRight(b));  // Up-right
    options = newCheckDir(x - 1, y + 1, options, (a, b) => a.isDownLeft(b)); // Down-left
    options = newCheckDir(x + 1, y + 1, options, (a, b) => a.isDownRight(b)); // Down-right
    */
    if (options.length === 0) {
        if (!n0ts.placeholder) 
            n0ts.placeholder = new PlaceholderTile(tile)  //createPlaceholder(tile, neighborStates);
        if (n0ts.sets.size > 1) {
            n0ts.placeholder.state = "tileset neighbor conflict";
            n0ts.placeholder.reason = ["neighbor conflict", n0ts.neighborStates, n0ts.sets];
        } else {
            n0ts.placeholder.state =  "neighbor conflict";
            n0ts.placeholder.reason = ["neighbor conflict", n0ts.neighborStates]
        }
        n0ts.placeholder.image = "missing";
        return;
    }

    let later = []
    var myOptionvs = options.map(o => {
        var tvt = n0tiles.get(o);
        
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
    myOptionvs = myOptionvs.filter(({ option, bias }) => 
        n0ts.noiseThresholdCondition(tile.genCache, option, bias)
    );

    if (options.length === 0) {
        if (!n0ts.placeholder) n0ts.placeholder = new PlaceholderTile(tile, "fully filtered out by noise")  //createPlaceholder(tile, neighborStates);
        n0ts.placeholder.reason = ["fully filtered out by noise", tile.biome.genCache ]
        n0ts.placeholder.image = "unfinished"; 
        return;
    }
    
    let choice = weightedRandom(myOptionvs);
    n0ts.option = choice;
    n0ts.tile = n0tiles.get(choice);
    
    for (const [_, neighbor] of n0ts.neighborStates) {
        neighbor?.tile?.n0ts?.placeholder?.neighborCollapsed(tile, neighbor)
    }

    function newCheckDir(dx, dy, options, conditionFunc) {
        let neighbor = worldGrid.getTile(x+dx, y+dy);
        if (neighbor === undefined) return options;

        let b = neighbor?.n0ts;
        if (!n0ts.neighborStates.get(`${dx}, ${dy}`))
            n0ts.neighborStates.set(`${dx}, ${dy}`, {
                dx, dy, tile: neighbor
            })

        let option = b?.option;
        if (b?.placeholder !==undefined) return options; //ignore placeholders
        if (option !== undefined) {
            let tileB = b.tile;

            n0ts.sets.add(tileB.set);
            return options.filter(a => {
                const tileA = n0tiles.get(a);
                return tileA && conditionFunc(tileA, tileB);
            });
        } 
        return options;
    }
}

function weightedRandom(items) {
    items = items.filter(a => a != null && n0tiles.get(a.option) != null)

    var totalWeight = items.reduce((total, item) => total + (n0tiles.get(item.option).weight + (item.bias || 0) || 1), 0);
    var random = n0alea() * totalWeight;
    var cumulativeWeight = 0;
    for (var i = 0; i < items.length; i++) {
        cumulativeWeight += n0tiles.get(items[i].option).weight + (items[i].bias || 0) || 1;
        if (random < cumulativeWeight) {
            return items[i].option;
        }
    }
}