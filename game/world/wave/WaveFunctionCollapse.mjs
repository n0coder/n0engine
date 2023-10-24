import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { collapseTile, drawTile} from "./n0FunctionCollapse.mjs";

export class WaveFunctionCollapse {
    constructor(nano) {
        this.nano = nano;
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;
        this.w = 28;
        this.h = 16;
    }
    init() {
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
                collapseTile(i,o,['green2','green3','green4','green5','green6',
                'purple0','purple1','purple2','purple3','purple4','purple5','purple6',
                'greenpurple0','greenpurple1','greenpurple2','greenpurple3','greenpurple4',
                'greenpurple5','greenpurple6','greenpurple7','greenpurple8','greenpurple9',
                'greenpurple10','greenpurple11']);
            }
        }
    }
    draw() {
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
               var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
               drawTile(i,o, (img)=>p.image(img, v.x, v.y, v.w, v.h)); 
            }
        }
    }
}
