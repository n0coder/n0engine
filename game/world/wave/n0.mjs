import Alea from "alea";
import { n0tiles } from "./n0FunctionCollapse.mjs";

export const n0alea = Alea("n0");

//generate tile
//gather tiles from biome
//

export function buildn0Collapse(tile) {
    console.log("n0")
    var x = tile.wx, y = tile.wy
    let rules = tile.biome.tiles.filter(t => n0tiles.get(t))
    if (rules.length === 0) return;
    
    if (!tile.n0fc) 
        tile.n0fc = new Cell(rules)  
    console.log(tile)      
    let n0fc = tile.n0fc;
    if (n0fc.option) return; 
    var options = [...n0fc.options];
    options = newCheckDir(x, y - 1, options, (a, b) => a.isUp(b))
    options = newCheckDir(x + 1, y, options, (a, b) => a.isRight(b))
    options = newCheckDir(x, y + 1, options, (a, b) => a.isDown(b))
    options = newCheckDir(x - 1, y, options, (a, b) => a.isLeft(b))
    
    let later = []
    var myOptionvs = options.map(o => {
        var tvt = n0tiles.get(o);
        if (!tvt) return null;
        let multiple = 1;
        for (var t of tvt.biases) {
            var factor = tile.genCache.get(t.factor)
            if (!factor) continue; //if the factor doesn't exist don't use it
            var bias = inverseLerp(factor.minm, factor.maxm, factor.sum)
            multiple *= lerp(-t.value, t.value, bias)
        }
        return { option: o, tile:tvt,  bias: multiple }
    })

    myOptionvs = myOptionvs.filter(({ option, tile, bias }) => 
        n0fc.noiseThresholdCondition(tile.genCache, option, bias)
    );

    let choice = weightedRandom(myOptionvs);
    n0fc.option = choice?.option;
    n0fc.tile = choice?.tile;
    function newCheckDir(x, y, options, conditionFunc) {
        var b = worldGrid.getTile(x, y)?.n0fc            
        let option = b?.option;
        if (option !== undefined) {
            let tileB = b.tile;
            return options.filter(a => {
                let tileA = n0tiles.get(a);
                if (tileA !== undefined) {
                    return conditionFunc(tileA, tileB)
                }
            })
        } else return options;
    }
    function checkDir(x, y, conditionFunc) {
        var b = worldGrid.getTile(x, y)
        if (b == null) return; //early return is jumping the gun a bit huh

        if (b.option != null) {
            var bt = n0tiles.get(b.option);
            options = options.filter(a => {
                if (a == null) return false;
                var at = n0tiles.get(a);
                if (at != null && bt != null)
                    return conditionFunc(at, bt)
            });
            return bt
        }
        else later.push([x, y]);
        return n0tiles.get(b.option);
    }
    
}

function weightedRandom(items) {
    items = items.filter(a => a != null && n0tiles.get(a.option) != null)

    var totalWeight = items.reduce((total, item) => total + (n0tiles.get(item.option).weight + (item.bias || 0) || 1), 0);
    var random = this.alea() * totalWeight;
    var cumulativeWeight = 0;
    for (var i = 0; i < items.length; i++) {
        cumulativeWeight += n0tiles.get(items[i].option).weight + (items[i].bias || 0) || 1;
        if (random < cumulativeWeight) {
            return items[i].option;
        }
    }
}