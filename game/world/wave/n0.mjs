import Alea from "alea";
import { Cell } from "./Cell.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../FactorManager.mjs";
import { PlaceholderTile } from "./Tile.mjs";

export const n0alea = Alea("n0");
export var n0tiles = new Map();
export var n0secondarytiles = new Map();
export var n0jointtiles = new Map();
export var n0TileModules = new Map();

export function buildn0ts(tile, sets, source) {
    let tileset = sets ? sets : n0tiles
    let tiles = source ? source : tile.biome.tiles;
    // keep only tiles that have exists 
    let modules = new Set();
    let rules = tiles.filter(t => tileset.get(t))

    let n0ts = new Cell();
    if (!tile.n0ts) tile.n0ts = new Cell(rules, tileset);
    n0ts = tile.n0ts;
    tile.n0ts = n0ts;

    if (rules.length === 0) {
        if (!n0ts.placeholder) n0ts.placeholder = new PlaceholderTile(tile)  //createPlaceholder(tile, neighborStates);
        n0ts.placeholder.state = "no rules";
        n0ts.placeholder.reason = ["no rules", tile.biome.rules ]
        n0ts.placeholder.image = "unfinished"; 
        return;
    };

    n0ts.options = n0ts.options.filter(optionKey => {
        let option = tileset.get(optionKey); 
        if (!option) return false;
        
        for (const moduleKey of option.modules) { 
            let module = n0TileModules.get(moduleKey);
            if (module) modules.add(module);
            
            //undefined does NOT mean false.
            if (module?.mod !== undefined && !module.mod?.(tile, optionKey)) { 

                return false;  
            } 
                
        }
        return true;
    });

    for (const module of modules) {
        module?.post?.(tile);
    }

    let option = weightedRandom( n0ts.optionBiases ?? n0ts.options.map(o=>{ return { option: o, bias: 1 } }  ) );
    n0ts.option = option;
    n0ts.tile = n0tiles.get(option);

    if (option != undefined)
    for (const module of modules) {
        module?.collapsed?.(tile);
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