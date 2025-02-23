import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";

let tile = null, tpos=null;
let tiles = [], edges = []
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
            p.strokeWeight(.5)
            p.rect(tile.pos.x,tile.pos.y, worldGrid.gridSize, worldGrid.gridSize)



        }
        if (tile?.tile && tpos?.x == tile.tpos?.x && tpos?.y == tile?.tpos.y) {
            let size = worldGrid.gridSize / 3, hsize = size / 2

            p.strokeWeight(.5)
            p.textAlign(p.CENTER, p.CENTER)
            p.text(tile.tile.sides[0].get()[0], tile.pos.x + hsize, tile.pos.y - size)
            p.text(tile.tile.sides[0].get()[1], tile.pos.x + size + hsize, tile.pos.y - size)
            p.text(tile.tile.sides[0].get()[2], tile.pos.x + size * 2 + hsize, tile.pos.y - size)

            p.text(tile.tile.sides[1].get()[0], tile.pos.x + size * 4, tile.pos.y + hsize)
            p.text(tile.tile.sides[1].get()[1], tile.pos.x + size * 4, tile.pos.y + size + hsize)
            p.text(tile.tile.sides[1].get()[2], tile.pos.x + size * 4, tile.pos.y + size * 2 + hsize)
            let reverse = false
            p.text(tile.tile.sides[2].get(reverse)[0], tile.pos.x + hsize, tile.pos.y + size * 4)
            p.text(tile.tile.sides[2].get(reverse)[1], tile.pos.x + size + hsize, tile.pos.y + size * 4)
            p.text(tile.tile.sides[2].get(reverse)[2], tile.pos.x + size * 2 + hsize, tile.pos.y + size * 4)

            p.text(tile.tile.sides[3].get(reverse)[0], tile.pos.x - size, tile.pos.y + hsize)
            p.text(tile.tile.sides[3].get(reverse)[1], tile.pos.x - size, tile.pos.y + size + hsize)
            p.text(tile.tile.sides[3].get(reverse)[2], tile.pos.x - size, tile.pos.y + size * 2 + hsize)
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
    let up = worldGrid.getTile(tpos.x, tpos.y - 1)?.tile
    let right = worldGrid.getTile(tpos.x + 1, tpos.y)?.tile
    let down = worldGrid.getTile(tpos.x, tpos.y + 1)?.tile
    let left = worldGrid.getTile(tpos.x - 1, tpos.y)?.tile

    //check if the sides are protected
    //use img.tile.sides to get the sides 
    //if they are check if tile's neighbor has the same connection
    //if not, return null

    let tile = {
        img,
        sides: []
    }

    //if never been generated, 
    //if neighbor exists import neighbor side, enabling protection
    //otherwise make a new side
    //if already generated, import the side
    //if neighbor exists, check if the side is protected
    //if not, set the side to the neighbor side
    //if it is, check if the sides matc
    //if it does not, return null


    
    if (img?.tile?.sides[0]?.protected) {
        tile.sides[0] = img.tile.sides[0]
        if (up) {
            for (let s = 0; s < tile.sides[0].get().length; s++) {
                if (tile.sides[0].get()[s] != up.sides[2].get()[s]) {
                    return null;
                }
            }
        }
    } else {
            if (up) {
                tile.sides[0] = up.sides[2];
                up.sides[2].protected = true;
                console.log('up')
            } else {
                let six = img?.tile?.sides[0]
                tile.sides[0] = six?six :  makeSide2();
            }
        }
    
        if (img?.tile?.sides[1]?.protected) {
            tile.sides[1] = img.tile.sides[1]
            if (right) {
                for (let s = 0; s < tile.sides[1].get().length; s++) {
                    if (tile.sides[1].get()[s] != right.sides[3].get()[s]) {
                        return null;
                    }
                }
            }
        } else {
            if (right) {
                tile.sides[1] = right.sides[3];
                right.sides[3].protected = true;
                console.log('right')
            } else {
                let six = img?.tile?.sides[1]
                tile.sides[1] = six?six: makeSide2();
            }
        }

    
        if (img?.tile?.sides[2]?.protected) {
            tile.sides[2] = img.tile.sides[2]
            if (down) {
                for (let s = 0; s < tile.sides[2].get().length; s++) {
                    if (tile.sides[2].get()[s] != down.sides[0].get()[s]) {
                        return null;
                    }
                }
            }
        } else {
            if (down) {
                tile.sides[2] = down.sides[0];
                down.sides[0].protected = true;
                console.log('down')
            } else {
                let six = img?.tile?.sides[2]
                tile.sides[2] = six ? six : makeSide2();
            }
        }
        if (img?.tile?.sides[3]?.protected) {
            tile.sides[3] = img.tile.sides[3]
            if (left) {
                for (let s = 0; s < tile.sides[3].get().length; s++) {
                    if (tile.sides[3].get()[s] != left.sides[1].get()[s]) {
                        return null;
                    }
                }
            }
        } else {
            let six = img?.tile?.sides[3]
            if (six) {
                tile.sides[3] = six
                console.log(six)
            }
            if (left) {
                tile.sides[3] = left.sides[1];
                tile.sides[3].protected = true;
                console.log('left')
            } else {
               
                tile.sides[3] = makeSide2();
            }
        }
        img.sides = tile.sides;
        return tile;
    
    function makeSide2() {
        return {
            values: [0, 0, 0],
            reverseValues: [0, 0, 0],
            protected: false,
            set(values) {
                this.values = values;
                this.reverseValues = [...values].reverse();
            },
            get(reverse) {
                return reverse ? this.reverseValues : this.values;
            }
        };
    }
}

let fileInput =  p.createFileInput((file)=>{
    if (file.type.startsWith('image')) {
        let imgdom = p.createImg(file.data,'', undefined, (img) => {
            if (img.width > 0 && img.height > 0) {
                let ti =createTile(img)
                if (ti == null) {
                    console.error('Tile does not fit');
                    return;
                }
                let t = { tile: ti, tpos, pos: tpos.screen() }
                worldGrid.setTile(tpos.x, tpos.y, t);
                tiles.push(ti)
                setTile(t)
                imgdom.tile = ti;
            } else {
                console.error('Failed to load image');
            }
        });
        imgdom.mousePressed(() => {
            let ti = createTile(imgdom.tile.img)
            let t = { tile: ti, tpos, pos: tpos.screen() }
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
    let i = 0
    if (tile?.tile?.sides) {
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.sides[i++], div);
    }
}
let editor = new n0fcEditor()

function sideUI(side, div, reverse = false) {
    let si = side.get(reverse);
    
    for (let i = 0; i < si.length; i++) {
        let s = si[i];
        let input = p.createInput('number').class("sidebit").parent(div).value(s);
        input.input(() => {

            let v = input.value();
            if (v.length <= 0) return;
            let a = Number.parseFloat(v);
            si[i] = a;
            side.set(si);
        });
    }
}
