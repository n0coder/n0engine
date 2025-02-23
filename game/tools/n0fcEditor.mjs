import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";

let tile = null, tpos=null;
let tiles = []
worldGrid.gridSize=32
class n0fcEditor {
    constructor(){
       this.setActive = setActive, this.renderOrder = -5;
       this.setActive(true)
       this.state = "add"
    }
    draw(){
        var {x,y} = worldGrid.screenToGridPoint(p.mouseX, p.mouseY).screen(false)
        
        for (const [_, {tile, pos}] of worldGrid.tiles) {
            if(tile){
                p.image(tile.img, pos.x, pos.y)
            }
        }

        p.noFill();
        p.stroke(127,127,127)
        p.rect(x,y, worldGrid.gridSize, worldGrid.gridSize)

        if (tpos) {
            p.noFill();
            p.stroke(191, 191, 191)
            let tposs= tpos.screen()
            p.rect(tposs.x,tposs.y, worldGrid.gridSize, worldGrid.gridSize)
        }
        if (tile?.tile) {
            p.noFill();
            p.stroke(255, 255, 255)
            p.rect(tile.pos.x,tile.pos.y, worldGrid.gridSize, worldGrid.gridSize)
        }
    }
    mousePressed() {
        let {x,y} = tpos = worldGrid.screenToGridPoint(p.mouseX, p.mouseY)
        let wtile = worldGrid.getTile(x,y)
        if(wtile) setTile(wtile);
    }
    doubleClicked(){
        
        let {x,y} = tpos = worldGrid.screenToGridPoint(p.mouseX, p.mouseY)

        let wtile = worldGrid.getTile(x,y)
        if (!wtile) {
            fileInput.elt.click();
        }
    }
}

function createTile(img){
    //let input = createInput('number');
    return {
        img, sides: [
            [0, 0, 0], // top
            [0, 0, 0], // right
            [0, 0, 0], // bottom
            [0, 0, 0]  // left
          ]
    }
}
let fileInput =  p.createFileInput((file)=>{
    if (file.type.startsWith('image')) {
        let imgdom = p.createImg(file.data,'', undefined, (img) => {
            if (img.width > 0 && img.height > 0) {
                let ti =createTile(img)
                let t = {tile:ti, pos:tpos.screen()}
                worldGrid.setTile(tpos.x, tpos.y, t);
                tiles.push(ti)
                setTile(t)
                imgdom.tile = ti;
            } else {
                console.error('Failed to load image');
            }
        });
        imgdom.mousePressed(() => {
            let ti = imgdom.tile
            let t = {tile:ti, pos:tpos.screen()}
            setTile(t)
            worldGrid.setTile(tpos.x, tpos.y, t);
          });
        leftMenu.add(imgdom)
        leftMenu.show()
    }
    setTile(null);
});
fileInput.hide();

let tileUi=null;
function setTile(t) {
    if (tile == t) return;
    tile=t
    if (t) { rightMenu.show() } else { rightMenu.hide() }

    tileUi?.remove(); //destroy tileui
    tileUi = p.createDiv(); //make it again
    tileUi.id("test2");
    rightMenu.add(tileUi);
    console.log(tile)
    for (const side of tile.tile.sides) {
        let div = p.createDiv().parent(tileUi)
        for (const s of side) {
            p.createInput('number').class("sidebit").parent(div).value(s)
        }
        var danceButton = p.createDiv().addClass('buttonbit').parent(div);
        p.createDiv("dance").addClass('title').parent(danceButton);
        danceButton.mousePressed(() => {
            //save side textboxes into arrays
        })
    }
    
    
}
let editor = new n0fcEditor()