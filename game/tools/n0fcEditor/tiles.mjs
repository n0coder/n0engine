import { leftMenu, rightMenu } from "../../../engine/core/Menu/menu.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { genTile } from "../../world/wave/worldGen/TileBuilder.mjs";
import { tpos, tiles, tile, sideUI } from "../n0fcEditor.mjs";

function initTile(tile, img) {
    
    tile.wfc = {
        img,
        shared: {
        name: img.name,
        sides: [],
        weight: img.weight||1, 
        biases: img.biases||[], 
        thresholds: img.thresholds||[],
        }
    };
}

function makeSide2() {
    return {
        values: [0, 0, 0],
        protected: false,
        set(values) {
            this.values = values;
        },
        get() {
            return this.values;
        }
    };
}
export function createTile(img, gen){
    let up = worldGrid.getTile(tpos.x, tpos.y - 1)?.wfc
    let right = worldGrid.getTile(tpos.x + 1, tpos.y)?.wfc
    let down = worldGrid.getTile(tpos.x, tpos.y + 1)?.wfc
    let left = worldGrid.getTile(tpos.x - 1, tpos.y)?.wfc
    let tile = gen ? genTile(tpos.x, tpos.y) : {}
    //tile.pos = tpos;
     initTile(tile, img)
    function createSide(dir, sdir, cdir) {
        if (!img?.shared) {  // Check if img exists and has sides
            if (dir?.shared.sides?.[sdir]) {  // Check if dir and its sides exist
                protectNeighbor(dir, sdir, cdir);
                return true;
            } else {
                tile.wfc.shared.sides[cdir] = makeSide2();
                return true;
            }
        } else {
            tile.wfc.shared = img.shared;
            if (dir?.shared.sides?.[sdir]) {
                if (dir.shared.sides[sdir].protected) {
                    const currentSide = tile.wfc.shared.sides[cdir].get();
                    const neighborSide = dir.shared.sides[sdir].get();

                    let noMatch = false;
                    for (let s = 0; s < currentSide.length; s++) {
                        if (currentSide[s] !== neighborSide[s]) {
                            noMatch = true;
                            break
                        }
                    }
                    if (noMatch) return null;
                   return true
                } else {
                    protectNeighbor(dir, sdir, cdir);
                    return true;
                }
            }
            return true;  // Add return for case when there's no neighbor
        }
    }
    
    function protectNeighbor(dir, sdir, cdir) {
        const six = dir.shared.sides[sdir];
        tile.wfc.shared.sides[cdir] = six;
        six.protected = true;
    }

    if(!createSide(up, 2, 0)) return null;
    if(!createSide(right, 3, 1)) return null;
    if(!createSide(down, 0, 2)) return null;
    if(!createSide(left, 1, 3)) return null;
    img.shared = tile.wfc.shared;
    return tile;
}