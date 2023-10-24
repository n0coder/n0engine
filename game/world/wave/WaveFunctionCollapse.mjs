import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import {n0FunctionCollapse} from "./n0FunctionCollapse.mjs";
import Alea from "alea";
import { createNoise2D } from "simplex-noise";

export class WaveFunctionCollapse {
    constructor(nano) {
        this.nano = nano;
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;
        this.w = 28*2;
        this.h = 16*2;
        this.nfc = new n0FunctionCollapse(Alea("n0"))

        this.blocks = null
    }
    init() {
        var noise = createNoise2D(Alea("n0"))
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
                //this section tests the idea of thresholding specific rules based on a noise value
                //we also need a way to add in weights at this phase to compound on the weights defined in the tile itself
                
                //we need to control weights where we make the rules, since we will need to place weights based on factors
                var n = noise(i*.05,o*.05)
                let rules = ['purple6'];
                if (n>.75) rules = ['purple6']
                else if (n>.65) rules = ['purple2','purple3','purple4','purple5']
                else if (n>.4) rules = ['purple0','purple1','purple2','purple3','purple4','purple5','purple6']
                else if (n > 0) rules = ['purple6']
                else if (n < -.4) rules = ['green2','green3','green4','green5','green6']
                else if (n <= 0)rules = ['green6']
                this.nfc.collapseTile(i,o,rules);
            }
        }

        //context based generation is what i want to build towards
        //desert tiles loaded in in the desert
        

        //glue layer, this allows the algorithm to create border tiles
        //this part does the work in trying to pull the styles together
        
        //context based border tile detection, desert to beach transition tiles loaded in
        this.nfc.blocks(5,this.w, this.h,['purple0','purple1','purple2','purple3','purple4','purple5','purple6',
        'green0','green1','green2','green3','green4','green5','green6',
        'greenpurple0','greenpurple1','greenpurple2','greenpurple3','greenpurple4',
        'greenpurple5','greenpurple6','greenpurple7','greenpurple8','greenpurple9',
        'greenpurple10','greenpurple11'] ) 
    }

    //recap, 
    /*
        when starting out with the terrain gen
        we will import info about our current tiles
    */

    draw() {
        
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
               var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
               this.nfc.drawTile(i,o, (img)=>p.image(img, v.x, v.y, v.w, v.h)); 
                
            }
        }
        
       
    }
}
