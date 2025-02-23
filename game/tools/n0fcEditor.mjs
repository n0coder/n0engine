import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
worldGrid.gridSize=32
class n0fcEditor {
    constructor(){
       this.setActive = setActive, this.renderOrder = -5;
       this.setActive(true)
       this.pos = (0,0)
       this.fileInput = p.createFileInput((file)=>{
        if (file.type.startsWith('image')) {
            let imgdom = p.createImg(file.data,'', undefined, (img) => {
                if (img.width > 0 && img.height > 0) {
                    this. tile = {img, pos: this.pos.screen()}
                    worldGrid.setTile(this.pos.x, this.pos.y,this.tile);
                } else {
                    console.error('Failed to load image');
                }
            });
            imgdom.hide()
        }
        this.tile = null;
    });
    this.fileInput.hide();
    }
    draw(){
        var {x,y} = worldGrid.screenToGridPoint(p.mouseX, p.mouseY).screen(false)
        
        for (const [_, {img, pos}] of worldGrid.tiles) {

            if(img){
                p.image(img, pos.x, pos.y)
            }
        }

        p.noFill();
        p.stroke(127,127,127)
        p.rect(x,y, worldGrid.gridSize, worldGrid.gridSize)

        if (this.tile) {
            p.noFill();
            p.stroke(255, 255, 255)
            p.rect(this.tile.pos.x,this.tile.pos.y, worldGrid.gridSize, worldGrid.gridSize)
        }
    }
    mousePressed() {
        let {x,y} = this.pos = worldGrid.screenToGridPoint(p.mouseX, p.mouseY)
        let tile = worldGrid.getTile(x,y)
        if(tile) this.tile = tile;
    }
    doubleClicked(){
        
        let {x,y} = this.pos = worldGrid.screenToGridPoint(p.mouseX, p.mouseY)

        let tile = worldGrid.getTile(x,y)
        if (!tile) {
            this.fileInput.elt.click();
        }
    }
}
let editor = new n0fcEditor()