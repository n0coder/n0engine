import Alea from "alea";
import { Cell } from "./Cell.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { worldFactors } from "../FactorManager.mjs";
import { PlaceholderTile } from "./Tile.mjs";
import { RangeMap } from "../../../engine/collections/RangeMap.mjs";

export const n0alea = Alea("n0");
n0alea.min = 0.000008401228114962578
n0alea.max = 1-n0alea.min
export var n0tiles = new Map();
export var n0secondarytiles = new Map();
export var n0jointtiles = new Map();
export var n0TileModules = new Map();

export function buildn0ts(tile, source, sets ) {
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
        n0ts.placeholder.reason = ["no rules for this tile", tile.biome.rules ]
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
    
    let rm = new RangeMap();
    if (n0ts.optionBiases) {
        for (const bias of n0ts.optionBiases) {
            rm.add(bias.option, 1+bias.bias);
        }
    }
    else
    for (const bias of n0ts.options) {
        rm.add(bias, bias.weight);
    }
    let option = rm.random(n0alea)?.out;
    
    

    if (option != undefined) {
        n0ts.option = option;
        n0ts.tile = tileset.get(option);
        for (const module of modules) {
            module?.collapsed?.(tile);
        }
    }
}