import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine";
import { t } from "../../engine/core/Time/n0Time.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";

let tile = null,tpos = null
worldGrid.gridSize=32
class NN {
    constructor(){
        this.setActive = setActive, this.renderOrder = -5;
        this.setActive(true)
        this.state = "add"
        this.scale = 1;

        this.tiles = new Map()
    }
    draw(){
        var { x, y } = worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale).screen()
        p.scale(this.scale)
        p.fill(255,255,255)
        for (const [_, {v, pos}] of this.tiles) {
            p.fill(v*128)
            p.rect(pos.x, pos.y, worldGrid.gridSize, worldGrid.gridSize)
            
        }

        p.noFill();
        p.stroke(127,127,127)
        p.strokeWeight(.5)
        p.rect(x,y, worldGrid.gridSize, worldGrid.gridSize)


        if (tpos) {
            p.noFill();
            p.stroke(191, 191, 191)
            let tposs= tpos.screen()
            p.rect(tposs.x,tposs.y, worldGrid.gridSize, worldGrid.gridSize)
        }
        p.stroke(255, 255, 255)
            p.strokeWeight(.5)
        if (tile?.wfc) {
            p.noFill();
            p.rect(tile.pos.x, tile.pos.y, worldGrid.gridSize, worldGrid.gridSize)
        }
    }
    mousePressed() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            let { x, y } = tpos = worldGrid. screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale)

        let wtile = worldGrid.getTile(x,y)
        if (!wtile) {
            makeTile(x, y, tpos)
        } else {

        }
        }
    }
}
function makeTileArcValidation(x,y, tpos) {
    let tile = {
        v:2, 
        tpos, 
        pos: tpos.screen(),
        pop: (from, count) => {
            if(count <0) return
            let up = worldGrid.getTile(tpos.x, tpos.y - 1)
            let right = worldGrid.getTile(tpos.x + 1, tpos.y)
            let down = worldGrid.getTile(tpos.x, tpos.y + 1)
            let left = worldGrid.getTile(tpos.x - 1, tpos.y)

            let ready = true;
            let rup = up && up.v <= tile.v
            let rright = right && right.v <= tile.v
            let rdown = down&&down.v <= tile.v
            let rleft =left&& left.v <= tile.v

            if (rup&&rright&&rdown&&rleft){
                tile.v -= 1;
                console.log(tile)
            }
            if (rup||rright||rdown||rleft) {
            console.log({tile,n: {up, down, left, right},  ready})
            up?.pop(tile, count-1)
            right?.pop(tile, count-1)
            down?.pop(tile, count-1)
            left?.pop(tile,count-1)
            }
            
    
        }
    }

    worldGrid.setTile(x,y, tile)
    tile.pop(null,3);
    console.log(tile)
    

    


}
let nn =new NN()